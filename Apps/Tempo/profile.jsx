// Tempo — profile, anonymous auth (PIN), milestones
// Privacy by design: no name, no email, no DOB.
// Identity = chosen alias + chosen movement glyph + a 4-digit code.

const { useState: useStateP, useEffect: useEffectP, useRef: useRefP, useMemo: useMemoP } = React;

// ─── alias pool (movement-themed, intentionally anonymous) ────────
const ADJ = ["Steady","Quiet","Swift","Patient","Bold","Light","Calm","Deep","Bright","Easy",
             "Iron","Open","Clear","True","Fierce","Warm","Lean","Smooth","Sharp","Wild",
             "Slow","Quick","Long","Even","Loose"];
const NOUN = ["Hawk","Drum","River","Pulse","Stone","Wave","Breath","Wing","Tide","Spark",
              "Heart","Pine","Step","Echo","Cedar","Trail","Crow","Star","Heron","Path",
              "Hush","Loop","Hill","Coast","Lark"];

function randomAlias() {
  return `${ADJ[Math.floor(Math.random()*ADJ.length)]} ${NOUN[Math.floor(Math.random()*NOUN.length)]}`;
}

const GLYPH_OPTIONS = ["squat","hinge","push","pull","lunge","core","carry","full"];

// ─── tiny "hash" for PIN — opaqueness, not security ───────────────
function hashPin(pin) {
  let h = 5381;
  for (let i = 0; i < pin.length; i++) h = ((h * 33) + pin.charCodeAt(i)) >>> 0;
  return h.toString(36);
}

// ─── storage ──────────────────────────────────────────────────────
const PROFILE = {
  key:        "tempo.profile.v1",
  sessionKey: "tempo.session.v1",
  unlockedKey:"tempo.unlocked.v1",

  get()      { try { return JSON.parse(localStorage.getItem(this.key) || "null"); } catch { return null; } },
  set(p)     { localStorage.setItem(this.key, JSON.stringify(p)); },
  patch(d)   { const p = this.get() || {}; this.set({ ...p, ...d }); },
  clear()    { [this.key, this.sessionKey, this.unlockedKey].forEach(k => localStorage.removeItem(k)); },

  isLoggedIn() { return localStorage.getItem(this.sessionKey) === "1"; },
  login()      { localStorage.setItem(this.sessionKey, "1"); },
  logout()     { localStorage.removeItem(this.sessionKey); },

  getUnlocked() { try { return JSON.parse(localStorage.getItem(this.unlockedKey) || "{}"); } catch { return {}; } },
  setUnlocked(u){ localStorage.setItem(this.unlockedKey, JSON.stringify(u)); },
};

// ─── milestones definition ────────────────────────────────────────
// Each: id, name (rhythm-themed), desc, check(stats) → boolean
const MILESTONES = [
  { id:"first-beat",      tier:"sets",    name:"First Beat",        desc:"Complete your first set.",
    check: s => s.totalSets >= 1 },
  { id:"even-cadence",    tier:"sets",    name:"Even Cadence",      desc:"Ten sets logged.",
    check: s => s.totalSets >= 10 },
  { id:"lasting-tempo",   tier:"sets",    name:"Lasting Tempo",     desc:"Twenty-five sets logged.",
    check: s => s.totalSets >= 25 },
  { id:"long-player",     tier:"sets",    name:"Long Player",       desc:"One hundred sets logged.",
    check: s => s.totalSets >= 100 },
  { id:"two-day-beat",    tier:"streak",  name:"Two-Day Beat",      desc:"Two days in a row.",
    check: s => s.maxStreak >= 2 },
  { id:"week-in-motion",  tier:"streak",  name:"Week in Motion",    desc:"Seven days in a row.",
    check: s => s.maxStreak >= 7 },
  { id:"fortnight-beat",  tier:"streak",  name:"Fortnight Beat",    desc:"Fourteen days in a row.",
    check: s => s.maxStreak >= 14 },
  { id:"all-eight",       tier:"range",   name:"All Eight",         desc:"Touch every movement pattern.",
    check: s => s.patternsTouched >= 8 },
  { id:"range-finder",    tier:"range",   name:"Range Finder",      desc:"Try Strength and Cardio.",
    check: s => s.stylesTried >= 2 },
  { id:"generalist",      tier:"range",   name:"Generalist",        desc:"Train with and without equipment.",
    check: s => s.gearsTried >= 2 },
  { id:"loaded",          tier:"load",    name:"Loaded",            desc:"Log your first weight.",
    check: s => s.weightsLogged >= 1 },
  { id:"heavy-hand",      tier:"load",    name:"Heavy Hand",        desc:"A single load of 100 lb / 45 kg.",
    check: s => s.maxLoadLb >= 100 },
  { id:"mountain-mover",  tier:"load",    name:"Mountain Mover",    desc:"Move 5,000 lb total.",
    check: s => s.totalVolumeLb >= 5000 },
];

// Build an exId → { pattern, gear, kind, level } lookup once
const EX_LOOKUP = (() => {
  const map = {};
  for (const [bucket, exs] of Object.entries(EXERCISES)) {
    const [gear, kind, level] = bucket.split("-");
    for (const e of exs) map[e.id] = { pattern: e.pattern, gear, kind, level };
  }
  return map;
})();

function computeStats(log) {
  let totalSets = 0, weightsLogged = 0, maxLoadLb = 0, totalVolumeLb = 0;
  const patterns = new Set(), days = new Set();
  const styles = new Set(), gears = new Set();
  for (const [exId, sessions] of Object.entries(log)) {
    const meta = EX_LOOKUP[exId];
    for (const s of sessions) {
      totalSets++;
      days.add(new Date(s.ts).toISOString().slice(0, 10));
      if (s.weight != null) {
        weightsLogged++;
        const lb = (s.unit === "kg") ? s.weight * 2.20462 : s.weight;
        if (lb > maxLoadLb) maxLoadLb = lb;
        totalVolumeLb += lb * 30; // 3 sets × 10 reps assumption
      }
    }
    if (meta) {
      patterns.add(meta.pattern);
      styles.add(meta.kind);
      gears.add(meta.gear);
    }
  }
  const sorted = [...days].sort();
  let maxStreak = 0, cur = 0, prev = null;
  for (const d of sorted) {
    if (prev) {
      const diff = (new Date(d) - new Date(prev)) / 86400000;
      cur = (diff === 1) ? cur + 1 : 1;
    } else cur = 1;
    if (cur > maxStreak) maxStreak = cur;
    prev = d;
  }
  return {
    totalSets, weightsLogged, maxLoadLb, totalVolumeLb,
    patternsTouched: patterns.size,
    maxStreak,
    stylesTried: styles.size, gearsTried: gears.size,
  };
}

function checkMilestones(log) {
  const stats = computeStats(log);
  const unlocked = PROFILE.getUnlocked();
  const newly = [];
  for (const m of MILESTONES) {
    if (!unlocked[m.id] && m.check(stats)) {
      unlocked[m.id] = Date.now();
      newly.push(m);
    }
  }
  if (newly.length) PROFILE.setUnlocked(unlocked);
  return { stats, unlocked, newly };
}

// ─── unit helpers ─────────────────────────────────────────────────
const LB_PER_KG = 2.20462;
const fmtNum = (n) => {
  if (n >= 100) return Math.round(n).toString();
  if (n >= 10)  return n.toFixed(1).replace(/\.0$/, "");
  return n.toFixed(1).replace(/\.0$/, "");
};
const toLb = (v, unit) => unit === "kg" ? v * LB_PER_KG : v;
const toKg = (v, unit) => unit === "lb" ? v / LB_PER_KG : v;
const fmtWeight = (v, unit, pref) => {
  if (v == null) return "—";
  if (!pref || pref === unit) {
    const other = unit === "lb" ? "kg" : "lb";
    const o = unit === "lb" ? toKg(v, "lb") : toLb(v, "kg");
    return `${fmtNum(v)} ${unit} · ${fmtNum(o)} ${other}`;
  }
  const converted = pref === "lb" ? toLb(v, unit) : toKg(v, unit);
  return `${fmtNum(converted)} ${pref}`;
};

// ─── glyph swatch (uses Glyph from icons.jsx) ─────────────────────
function Avatar({ glyph, size = 56, accent = "#d35a3a", bg = "#f7e4d8" }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: size / 2,
      background: bg, display: "grid", placeItems: "center",
      color: accent, flexShrink: 0,
    }}>
      <Glyph pattern={glyph || "full"} size={size * 0.6} color={accent} animate={false} />
    </div>
  );
}

// ─── PIN keypad ───────────────────────────────────────────────────
function PinPad({ value, onChange, onSubmit, label, max = 4 }) {
  const press = (k) => {
    if (k === "del") onChange(value.slice(0, -1));
    else if (value.length < max) {
      const next = value + k;
      onChange(next);
      if (next.length === max && onSubmit) setTimeout(() => onSubmit(next), 120);
    }
  };
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 18 }}>
      <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11,
                    letterSpacing: "0.18em", color: "#79736a", textTransform: "uppercase" }}>
        {label || "Movement code"}
      </div>
      {/* dots */}
      <div style={{ display: "flex", gap: 16 }}>
        {Array.from({ length: max }).map((_, i) => (
          <div key={i} style={{
            width: 14, height: 14, borderRadius: 7,
            background: i < value.length ? "#1a1815" : "transparent",
            border: `1.5px solid ${i < value.length ? "#1a1815" : "rgba(26,24,21,0.25)"}`,
            transition: "all 0.1s ease",
          }} />
        ))}
      </div>
      {/* keypad */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 64px)", gap: 12 }}>
        {[1,2,3,4,5,6,7,8,9].map(n => (
          <KeyBtn key={n} onClick={() => press(String(n))}>{n}</KeyBtn>
        ))}
        <div />
        <KeyBtn onClick={() => press("0")}>0</KeyBtn>
        <KeyBtn onClick={() => press("del")} subtle>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M6 4L2 10L6 16H16C17 16 18 15 18 14V6C18 5 17 4 16 4H6Z"
              stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
            <path d="M9 7L13 13M13 7L9 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </KeyBtn>
      </div>
    </div>
  );
}

function KeyBtn({ children, onClick, subtle }) {
  return (
    <button onClick={onClick} style={{
      width: 64, height: 64, borderRadius: 32,
      background: subtle ? "transparent" : "rgba(26,24,21,0.05)",
      border: "none", cursor: "pointer",
      fontFamily: "'Instrument Serif', serif",
      fontSize: 26, color: "#1a1815",
      display: "grid", placeItems: "center",
      transition: "transform 0.1s ease",
    }}
    onMouseDown={e => e.currentTarget.style.transform = "scale(0.92)"}
    onMouseUp={e => e.currentTarget.style.transform = "scale(1)"}
    onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}>
      {children}
    </button>
  );
}

// ─── Create profile screen ────────────────────────────────────────
function CreateProfileScreen({ onDone }) {
  const [step, setStep] = useStateP(0); // 0 alias, 1 glyph, 2 pin, 3 confirm
  const [alias, setAlias] = useStateP(randomAlias());
  const [glyph, setGlyph] = useStateP("pulse-1"); // placeholder; will set from option
  const [pin, setPin] = useStateP("");
  const [pin2, setPin2] = useStateP("");
  const [err, setErr] = useStateP("");

  useEffectP(() => { setGlyph(GLYPH_OPTIONS[Math.floor(Math.random()*GLYPH_OPTIONS.length)]); }, []);

  const finish = (confirmPin) => {
    if (confirmPin !== pin) { setErr("Codes don't match. Try again."); setPin2(""); return; }
    PROFILE.set({
      alias, glyph,
      pinHash: hashPin(pin),
      createdAt: Date.now(),
      unit: "lb",
    });
    PROFILE.login();
    onDone();
  };

  return (
    <div style={{ width: "100%", height: "100%", background: "#f5f1ea",
                  display: "flex", flexDirection: "column",
                  padding: "56px 24px 40px", overflow: "auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11,
                      letterSpacing: "0.22em", color: "#79736a", textTransform: "uppercase" }}>
          New profile · step {step + 1} / 3
        </div>
        <Pulse />
      </div>

      {step === 0 && (
        <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
          <div style={{ fontFamily: "'Instrument Serif', serif", fontSize: 44, lineHeight: 1.05, marginTop: 12 }}>
            Pick a name<br/>
            <span style={{ fontStyle: "italic", color: "#d35a3a" }}>that isn't yours.</span>
          </div>
          <p style={{ fontSize: 14, color: "#3d3934", lineHeight: 1.5, marginTop: 12 }}>
            Tempo never asks for your real name, email, or anything personal. Pick a movement alias — keep this one or shuffle.
          </p>

          <div style={{
            marginTop: 32, padding: "28px 20px",
            background: "#fff", border: "1px solid rgba(26,24,21,0.08)",
            borderRadius: 18, textAlign: "center",
          }}>
            <div style={{ fontFamily: "'Instrument Serif', serif", fontSize: 38, color: "#1a1815" }}>
              {alias}
            </div>
            <button onClick={() => setAlias(randomAlias())} style={{
              marginTop: 14, background: "transparent",
              border: "1px solid rgba(26,24,21,0.16)", borderRadius: 8,
              padding: "8px 14px", fontFamily: "inherit", fontSize: 12,
              color: "#3d3934", cursor: "pointer",
              display: "inline-flex", alignItems: "center", gap: 6,
            }}>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M2 6C2 3.8 3.8 2 6 2C7.5 2 8.8 2.8 9.5 4M10 6C10 8.2 8.2 10 6 10C4.5 10 3.2 9.2 2.5 8"
                  stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                <path d="M8 1L10 4L7 4M4 11L2 8L5 8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Shuffle
            </button>
          </div>

          <div style={{ flex: 1 }} />
          <PrimaryProfileBtn onClick={() => setStep(1)}>Keep "{alias}" →</PrimaryProfileBtn>
        </div>
      )}

      {step === 1 && (
        <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
          <div style={{ fontFamily: "'Instrument Serif', serif", fontSize: 44, lineHeight: 1.05, marginTop: 12 }}>
            Pick a <span style={{ fontStyle: "italic", color: "#d35a3a" }}>mark.</span>
          </div>
          <p style={{ fontSize: 14, color: "#3d3934", lineHeight: 1.5, marginTop: 12 }}>
            One of the eight movement patterns. This is your symbol — no photo, no avatar of you.
          </p>

          <div style={{
            marginTop: 22,
            display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10,
          }}>
            {GLYPH_OPTIONS.map(g => (
              <button key={g} onClick={() => setGlyph(g)} style={{
                aspectRatio: "1 / 1",
                background: g === glyph ? "#1a1815" : "#fff",
                color: g === glyph ? "#f5f1ea" : "#1a1815",
                border: `1px solid ${g === glyph ? "#1a1815" : "rgba(26,24,21,0.08)"}`,
                borderRadius: 14, cursor: "pointer", padding: 0,
                display: "flex", flexDirection: "column",
                alignItems: "center", justifyContent: "center", gap: 4,
                transition: "all 0.15s ease",
              }}>
                <Glyph pattern={g} size={32} color="currentColor" animate={g === glyph} />
                <span style={{
                  fontFamily: "'JetBrains Mono', monospace", fontSize: 9,
                  letterSpacing: "0.1em", textTransform: "uppercase", opacity: 0.8,
                }}>{PATTERNS[g].label.split(" ")[0]}</span>
              </button>
            ))}
          </div>

          <div style={{ flex: 1 }} />
          <div style={{ display: "flex", gap: 10 }}>
            <button onClick={() => setStep(0)} style={ghostBtnStyle}>Back</button>
            <div style={{ flex: 2 }}>
              <PrimaryProfileBtn onClick={() => { setStep(2); setPin(""); setErr(""); }}>Next →</PrimaryProfileBtn>
            </div>
          </div>
        </div>
      )}

      {step === 2 && (
        <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
          <div style={{ fontFamily: "'Instrument Serif', serif", fontSize: 38, lineHeight: 1.1, marginTop: 12 }}>
            {pin2 === "" && !err ? <>Set a <span style={{ fontStyle: "italic", color: "#d35a3a" }}>movement code.</span></>
              : <>Once <span style={{ fontStyle: "italic", color: "#d35a3a" }}>more.</span></>}
          </div>
          <p style={{ fontSize: 13, color: "#3d3934", lineHeight: 1.5, marginTop: 10, marginBottom: 6 }}>
            Four digits. You'll tap this in to unlock Tempo.
          </p>
          {err && (
            <div style={{ marginTop: 4, marginBottom: 4, padding: "8px 12px",
                          background: "rgba(211,90,58,0.1)", color: "#7a2a14",
                          borderRadius: 8, fontSize: 12 }}>{err}</div>
          )}

          <div style={{ flex: 1, display: "grid", placeItems: "center" }}>
            {pin.length < 4 ? (
              <PinPad
                value={pin}
                onChange={setPin}
                onSubmit={(p) => { setPin(p); setErr(""); }}
                label="Choose a code"
              />
            ) : (
              <PinPad
                value={pin2}
                onChange={setPin2}
                onSubmit={(p) => finish(p)}
                label="Type it again"
              />
            )}
          </div>

          {pin.length === 4 && (
            <button onClick={() => { setPin(""); setPin2(""); setErr(""); }} style={{
              background: "transparent", border: "none", color: "#79736a",
              fontFamily: "inherit", fontSize: 12, padding: "8px 0", cursor: "pointer",
              textDecoration: "underline", textUnderlineOffset: 3,
            }}>Start the code over</button>
          )}
        </div>
      )}
    </div>
  );
}

const ghostBtnStyle = {
  flex: 1, background: "transparent", border: "1px solid rgba(26,24,21,0.16)",
  borderRadius: 14, padding: "16px", color: "#3d3934",
  fontFamily: "inherit", fontSize: 15, fontWeight: 500, cursor: "pointer",
};

function PrimaryProfileBtn({ children, onClick, disabled }) {
  return (
    <button onClick={onClick} disabled={disabled} style={{
      width: "100%", border: "none", cursor: disabled ? "default" : "pointer",
      background: disabled ? "#c8c2b6" : "#1a1815", color: "#f5f1ea",
      padding: "16px 20px", borderRadius: 14,
      fontFamily: "inherit", fontSize: 16, fontWeight: 600,
    }}>{children}</button>
  );
}

// ─── Login screen (PIN unlock) ────────────────────────────────────
function LoginScreen({ profile, onUnlock, onForget }) {
  const [pin, setPin] = useStateP("");
  const [err, setErr] = useStateP("");
  const [attempts, setAttempts] = useStateP(0);

  const submit = (p) => {
    if (hashPin(p) === profile.pinHash) {
      PROFILE.login();
      onUnlock();
    } else {
      setErr("Wrong code.");
      setAttempts(a => a + 1);
      setTimeout(() => setPin(""), 250);
    }
  };

  return (
    <div style={{ width: "100%", height: "100%", background: "#f5f1ea",
                  display: "flex", flexDirection: "column",
                  padding: "56px 24px 40px" }}>
      <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11,
                    letterSpacing: "0.22em", color: "#79736a", textTransform: "uppercase" }}>
        Welcome back
      </div>

      <div style={{ marginTop: 36, display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
        <Avatar glyph={profile.glyph} size={72} />
        <div style={{ fontFamily: "'Instrument Serif', serif", fontSize: 34, color: "#1a1815" }}>
          {profile.alias}
        </div>
      </div>

      <div style={{ flex: 1, display: "grid", placeItems: "center" }}>
        <PinPad value={pin} onChange={setPin} onSubmit={submit}
          label={err ? "Wrong code · try again" : "Movement code"} />
      </div>

      {attempts >= 3 && (
        <button onClick={onForget} style={{
          background: "transparent", border: "none", color: "#79736a",
          fontFamily: "inherit", fontSize: 12, cursor: "pointer",
          textDecoration: "underline", textUnderlineOffset: 3, padding: 8,
        }}>Forgot your code? Start a new profile.</button>
      )}
    </div>
  );
}

// ─── Profile screen (dashboard) ───────────────────────────────────
function ProfileScreen({ profile, log, onBack, onLogout, onReset, onUnitChange }) {
  const { stats, unlocked } = useMemoP(() => {
    const stats = computeStats(log);
    const unlocked = PROFILE.getUnlocked();
    return { stats, unlocked };
  }, [log]);

  const pref = profile.unit || "lb";
  const totalVolDisplay = pref === "lb"
    ? Math.round(stats.totalVolumeLb)
    : Math.round(stats.totalVolumeLb / LB_PER_KG);
  const daysSinceJoin = Math.max(1, Math.floor((Date.now() - profile.createdAt) / 86400000));
  const unlockedCount = Object.keys(unlocked).length;

  return (
    <div style={{ width: "100%", height: "100%", background: "#f5f1ea",
                  display: "flex", flexDirection: "column" }}>
      {/* top bar */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between",
                    padding: "50px 20px 6px", gap: 12 }}>
        <button onClick={onBack} aria-label="Back" style={{
          width: 36, height: 36, borderRadius: 18,
          background: "rgba(26,24,21,0.06)", border: "none", cursor: "pointer",
          display: "grid", placeItems: "center", color: "#1a1815",
        }}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M10 3L5 8L10 13" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11,
                      letterSpacing: "0.16em", color: "#79736a", textTransform: "uppercase" }}>
          Profile
        </div>
        <div style={{ width: 36 }} />
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: "16px 24px 32px" }}>
        {/* header card */}
        <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
          <Avatar glyph={profile.glyph} size={72} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontFamily: "'Instrument Serif', serif", fontSize: 30,
                          color: "#1a1815", lineHeight: 1.1 }}>
              {profile.alias}
            </div>
            <div style={{ fontSize: 12, color: "#79736a", marginTop: 4,
                          fontFamily: "'JetBrains Mono', monospace",
                          letterSpacing: "0.08em" }}>
              {daysSinceJoin === 1 ? "Joined today" : `${daysSinceJoin} days in motion`}
            </div>
          </div>
        </div>

        {/* stats grid */}
        <div style={{ marginTop: 24, display: "grid",
                      gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          <StatCard label="Total sets" value={stats.totalSets} />
          <StatCard label="Best streak" value={stats.maxStreak}
                    suffix={stats.maxStreak === 1 ? "day" : "days"} />
          <StatCard label="Patterns hit" value={`${stats.patternsTouched}/8`} />
          <StatCard label="Volume moved"
                    value={totalVolDisplay.toLocaleString()}
                    suffix={pref}
                    accent={stats.totalVolumeLb > 0} />
        </div>

        {/* unit toggle */}
        <SettingRow label="Weight unit">
          <UnitToggle value={pref} onChange={onUnitChange} />
        </SettingRow>

        {/* milestones */}
        <div style={{ marginTop: 26, marginBottom: 12,
                      display: "flex", alignItems: "baseline", justifyContent: "space-between" }}>
          <div style={{ fontFamily: "'Instrument Serif', serif", fontSize: 26 }}>
            Milestones
          </div>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11,
                        color: "#79736a", letterSpacing: "0.08em" }}>
            {unlockedCount} / {MILESTONES.length}
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          {MILESTONES.map(m => (
            <MilestoneCard key={m.id} m={m} unlockedAt={unlocked[m.id]} />
          ))}
        </div>

        {/* danger row */}
        <div style={{ marginTop: 32, padding: "14px 16px", borderRadius: 12,
                      background: "rgba(26,24,21,0.04)", border: "1px solid rgba(26,24,21,0.06)" }}>
          <div style={{ display: "flex", gap: 10 }}>
            <button onClick={onLogout} style={{
              flex: 1, background: "transparent", border: "1px solid rgba(26,24,21,0.16)",
              borderRadius: 10, padding: "12px", fontFamily: "inherit",
              fontSize: 13, color: "#3d3934", cursor: "pointer",
            }}>Sign out</button>
            <button onClick={onReset} style={{
              flex: 1, background: "transparent", border: "1px solid rgba(211,90,58,0.4)",
              borderRadius: 10, padding: "12px", fontFamily: "inherit",
              fontSize: 13, color: "#7a2a14", cursor: "pointer",
            }}>Delete profile</button>
          </div>
          <p style={{ marginTop: 10, marginBottom: 0, fontSize: 11, color: "#79736a", lineHeight: 1.5 }}>
            Everything is stored on this device only. Deleting removes all sessions and milestones.
          </p>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, suffix, accent }) {
  return (
    <div style={{
      padding: "14px 14px", borderRadius: 14,
      background: accent ? "#f7e4d8" : "#fff",
      border: `1px solid ${accent ? "transparent" : "rgba(26,24,21,0.08)"}`,
    }}>
      <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9,
                    letterSpacing: "0.14em", textTransform: "uppercase",
                    color: accent ? "#7a2a14" : "#79736a" }}>{label}</div>
      <div style={{ marginTop: 6, display: "flex", alignItems: "baseline", gap: 6 }}>
        <span style={{ fontFamily: "'Instrument Serif', serif", fontSize: 30,
                       color: accent ? "#7a2a14" : "#1a1815", lineHeight: 1 }}>
          {value}
        </span>
        {suffix && (
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11,
                          color: accent ? "#7a2a14" : "#79736a" }}>{suffix}</span>
        )}
      </div>
    </div>
  );
}

function SettingRow({ label, children }) {
  return (
    <div style={{
      marginTop: 16, padding: "12px 14px",
      background: "#fff", border: "1px solid rgba(26,24,21,0.08)",
      borderRadius: 12,
      display: "flex", alignItems: "center", justifyContent: "space-between",
    }}>
      <span style={{ fontSize: 14, color: "#1a1815", fontWeight: 500 }}>{label}</span>
      {children}
    </div>
  );
}

function UnitToggle({ value, onChange }) {
  return (
    <div style={{ display: "inline-flex", background: "rgba(26,24,21,0.06)",
                  borderRadius: 8, padding: 3 }}>
      {["lb","kg"].map(u => (
        <button key={u} onClick={() => onChange(u)} style={{
          padding: "6px 14px", border: "none", cursor: "pointer",
          background: u === value ? "#1a1815" : "transparent",
          color: u === value ? "#f5f1ea" : "#3d3934",
          fontFamily: "'JetBrains Mono', monospace", fontSize: 12,
          letterSpacing: "0.08em", textTransform: "uppercase",
          borderRadius: 6,
        }}>{u}</button>
      ))}
    </div>
  );
}

function MilestoneCard({ m, unlockedAt }) {
  const locked = !unlockedAt;
  return (
    <div style={{
      padding: "12px 12px", borderRadius: 12,
      background: locked ? "rgba(26,24,21,0.03)" : "#1a1815",
      border: locked ? "1px solid rgba(26,24,21,0.08)" : "1px solid #1a1815",
      color: locked ? "#79736a" : "#f5f1ea",
      display: "flex", flexDirection: "column", gap: 6,
      minHeight: 88,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <MilestoneGlyph tier={m.tier} locked={locked} />
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9,
                       letterSpacing: "0.14em", textTransform: "uppercase",
                       color: locked ? "#79736a" : "#d35a3a" }}>{m.tier}</span>
      </div>
      <div style={{ fontFamily: "'Instrument Serif', serif", fontSize: 17,
                    lineHeight: 1.1, color: locked ? "#3d3934" : "#f5f1ea" }}>
        {m.name}
      </div>
      <div style={{ fontSize: 11, lineHeight: 1.4,
                    color: locked ? "#79736a" : "rgba(245,241,234,0.7)" }}>
        {m.desc}
      </div>
      {!locked && (
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9,
                       color: "#d35a3a", marginTop: 2, letterSpacing: "0.06em" }}>
          UNLOCKED {new Date(unlockedAt).toLocaleDateString(undefined, { month:"short", day:"numeric" }).toUpperCase()}
        </div>
      )}
    </div>
  );
}

function MilestoneGlyph({ tier, locked }) {
  const color = locked ? "#79736a" : "#d35a3a";
  const s = 18;
  switch (tier) {
    case "sets":
      return (
        <svg width={s} height={s} viewBox="0 0 18 18">
          <rect x="2" y="11" width="3" height="5" fill={color} />
          <rect x="7.5" y="8" width="3" height="8" fill={color} />
          <rect x="13" y="4" width="3" height="12" fill={color} />
        </svg>
      );
    case "streak":
      return (
        <svg width={s} height={s} viewBox="0 0 18 18" fill="none">
          <polyline points="2,11 5,11 7,5 10,15 12,9 16,9" stroke={color} strokeWidth="1.4"
                    strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "range":
      return (
        <svg width={s} height={s} viewBox="0 0 18 18" fill="none">
          <circle cx="9" cy="9" r="6" stroke={color} strokeWidth="1.4" />
          <line x1="3" y1="9" x2="15" y2="9" stroke={color} strokeWidth="1.4" />
          <line x1="9" y1="3" x2="9" y2="15" stroke={color} strokeWidth="1.4" />
        </svg>
      );
    case "load":
      return (
        <svg width={s} height={s} viewBox="0 0 18 18" fill="none">
          <line x1="3" y1="9" x2="15" y2="9" stroke={color} strokeWidth="2" strokeLinecap="round" />
          <rect x="1" y="5" width="3" height="8" rx="0.5" fill={color} />
          <rect x="14" y="5" width="3" height="8" rx="0.5" fill={color} />
        </svg>
      );
    default:
      return null;
  }
}

// ─── Milestone toast ──────────────────────────────────────────────
function MilestoneToast({ milestone, onDone }) {
  useEffectP(() => {
    if (!milestone) return;
    const t = setTimeout(onDone, 3200);
    return () => clearTimeout(t);
  }, [milestone, onDone]);
  if (!milestone) return null;
  return (
    <div style={{
      position: "absolute", top: 60, left: "50%",
      transform: "translateX(-50%)",
      background: "#1a1815", color: "#f5f1ea",
      padding: "12px 16px", borderRadius: 14,
      display: "flex", alignItems: "center", gap: 12,
      boxShadow: "0 10px 30px rgba(0,0,0,0.25)",
      zIndex: 200, maxWidth: 320,
      animation: "tempo-toast-in 0.4s ease-out",
    }}>
      <MilestoneGlyph tier={milestone.tier} />
      <div style={{ flex: 1 }}>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9,
                      letterSpacing: "0.14em", color: "#d35a3a",
                      textTransform: "uppercase" }}>
          Milestone reached
        </div>
        <div style={{ fontFamily: "'Instrument Serif', serif", fontSize: 22,
                      color: "#f5f1ea", lineHeight: 1.1 }}>
          {milestone.name}
        </div>
      </div>
    </div>
  );
}

Object.assign(window, {
  PROFILE, MILESTONES, computeStats, checkMilestones,
  hashPin, randomAlias,
  Avatar, PinPad, UnitToggle, MilestoneToast,
  CreateProfileScreen, LoginScreen, ProfileScreen,
  LB_PER_KG, toLb, toKg, fmtWeight, fmtNum,
});
