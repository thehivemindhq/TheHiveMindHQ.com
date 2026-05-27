// Tempo — main app
// Single source of truth: React state machine + localStorage.
// All screens live inline; keep this file under the 1000-line guideline.

const { useState, useEffect, useMemo, useRef } = React;

// ─── design tokens ────────────────────────────────────────────────
const tk = {
  bg:        "#f5f1ea",
  bgDeep:    "#efe9df",
  surface:   "#ffffff",
  ink:       "#1a1815",
  inkSoft:   "#3d3934",
  mute:      "#79736a",
  line:      "rgba(26,24,21,0.08)",
  lineSolid: "rgba(26,24,21,0.16)",
  accent:    "#d35a3a",
  accentSoft:"#f7e4d8",
  accentInk: "#7a2a14",
  ok:        "#3a7d44",
};

const styles = {
  page: {
    width: "100%", height: "100%",
    background: tk.bg, color: tk.ink,
    fontFamily: "'Manrope', system-ui, sans-serif",
    display: "flex", flexDirection: "column",
    overflow: "hidden",
  },
  scroll: {
    flex: 1, overflowY: "auto", WebkitOverflowScrolling: "touch",
  },
  display: {
    fontFamily: "'Instrument Serif', 'Georgia', serif",
    fontWeight: 400, lineHeight: 1.02, letterSpacing: "-0.01em",
  },
  mono: {
    fontFamily: "'JetBrains Mono', ui-monospace, monospace",
    fontFeatureSettings: '"tnum"',
  },
};

// ─── storage ──────────────────────────────────────────────────────
const STORE = {
  pathKey: "tempo.path.v1",
  logKey:  "tempo.log.v1",

  getPath() { try { return JSON.parse(localStorage.getItem(this.pathKey) || "null"); } catch { return null; } },
  setPath(p) { localStorage.setItem(this.pathKey, JSON.stringify(p)); },

  getLog() { try { return JSON.parse(localStorage.getItem(this.logKey) || "{}"); } catch { return {}; } },
  setLog(l) { localStorage.setItem(this.logKey, JSON.stringify(l)); },

  recordSession(exId, weight, unit) {
    const log = this.getLog();
    const list = log[exId] || [];
    list.unshift({ ts: Date.now(), weight: weight ?? null, unit: weight != null ? unit : null });
    log[exId] = list.slice(0, 50);
    this.setLog(log);
    return log;
  },

  reset() {
    localStorage.removeItem(this.pathKey);
    localStorage.removeItem(this.logKey);
  },
};

// ─── tiny atoms ───────────────────────────────────────────────────
const Tag = ({ children, soft, accent }) => (
  <span style={{
    ...styles.mono,
    fontSize: 11, letterSpacing: "0.06em", textTransform: "uppercase",
    padding: "4px 8px", borderRadius: 6,
    border: `1px solid ${soft ? "transparent" : tk.lineSolid}`,
    background: accent ? tk.accentSoft : soft ? "rgba(26,24,21,0.04)" : "transparent",
    color: accent ? tk.accentInk : tk.inkSoft,
    whiteSpace: "nowrap",
  }}>{children}</span>
);

const PrimaryBtn = ({ children, onClick, disabled }) => (
  <button onClick={onClick} disabled={disabled} style={{
    width: "100%", border: "none", cursor: disabled ? "default" : "pointer",
    background: disabled ? "#c8c2b6" : tk.ink, color: tk.bg,
    padding: "16px 20px", borderRadius: 14,
    fontFamily: "inherit", fontSize: 16, fontWeight: 600, letterSpacing: "0.01em",
    transition: "transform 0.15s ease",
  }} onMouseDown={e => !disabled && (e.currentTarget.style.transform = "scale(0.98)")}
     onMouseUp={e => (e.currentTarget.style.transform = "scale(1)")}
     onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}>
    {children}
  </button>
);

const GhostBtn = ({ children, onClick }) => (
  <button onClick={onClick} style={{
    border: `1px solid ${tk.lineSolid}`, background: "transparent",
    color: tk.ink, padding: "12px 16px", borderRadius: 12,
    fontFamily: "inherit", fontSize: 14, fontWeight: 500, cursor: "pointer",
  }}>{children}</button>
);

// Tempo pulse — a quiet "heartbeat" mark used throughout the app
const Pulse = ({ size = 14, color = tk.accent }) => (
  <span style={{ display: "inline-flex", alignItems: "center" }}>
    <svg width={size * 3} height={size} viewBox="0 0 42 14">
      <polyline points="0,7 8,7 12,2 18,12 22,7 42,7"
        fill="none" stroke={color} strokeWidth="1.6"
        strokeLinecap="round" strokeLinejoin="round">
        <animate attributeName="stroke-dasharray" values="0 100;100 0" dur="1.6s" repeatCount="indefinite" />
      </polyline>
    </svg>
  </span>
);

const TopBar = ({ title, onBack, right }) => (
  <div style={{
    display: "flex", alignItems: "center", justifyContent: "space-between",
    padding: "50px 20px 6px", gap: 12,
  }}>
    <button onClick={onBack} aria-label="Back" style={{
      width: 36, height: 36, borderRadius: 18,
      background: "rgba(26,24,21,0.06)", border: "none", cursor: "pointer",
      display: "grid", placeItems: "center", color: tk.ink,
    }}>
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M10 3L5 8L10 13" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
    <div style={{ ...styles.mono, fontSize: 11, letterSpacing: "0.16em", textTransform: "uppercase", color: tk.mute }}>
      {title}
    </div>
    <div style={{ width: 36, display: "flex", justifyContent: "flex-end" }}>{right || null}</div>
  </div>
);

// ─── Screen: Splash / Home ────────────────────────────────────────
const SplashScreen = ({ savedPath, profile, onStart, onResume, onReset, onProfile }) => (
  <div style={{ ...styles.page, padding: "56px 24px 44px" }}>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 8 }}>
      <div style={{ ...styles.mono, fontSize: 11, letterSpacing: "0.22em", color: tk.mute, textTransform: "uppercase" }}>
        Tempo
      </div>
      <button onClick={onProfile} aria-label="Profile" style={{
        background: "transparent", border: "none", cursor: "pointer",
        padding: 0, display: "flex", alignItems: "center", gap: 8,
      }}>
        <span style={{ ...styles.mono, fontSize: 11, color: tk.inkSoft }}>{profile?.alias}</span>
        <Avatar glyph={profile?.glyph} size={32} />
      </button>
    </div>

    <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", marginTop: -20 }}>
      <div style={{ ...styles.display, fontSize: 68, lineHeight: 1.05, color: tk.ink }}>
        Find your<br/>
        <span style={{ fontStyle: "italic", color: tk.accent }}>tempo.</span>
      </div>
      <p style={{ marginTop: 18, fontSize: 16, lineHeight: 1.45, color: tk.inkSoft, maxWidth: 320 }}>
        A pocket coach built around how you move — not the muscles you have. Pick a beat, hit a set, keep the rhythm.
      </p>

      <div style={{ marginTop: 28, display: "flex", gap: 10, flexWrap: "wrap" }}>
        {Object.values(PATTERNS).map(p => (
          <Tag key={p.label} soft>{p.label.toLowerCase()}</Tag>
        ))}
      </div>
    </div>

    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {savedPath ? (
        <>
          <div style={{ fontSize: 13, color: tk.mute, marginBottom: 4 }}>
            Last beat — <span style={{ color: tk.ink, fontWeight: 600 }}>
              {[savedPath.gear, savedPath.kind, savedPath.level].map(k => KEY_LABELS[k]).join(" · ")}
            </span>
          </div>
          <PrimaryBtn onClick={onResume}>Pick up the rhythm →</PrimaryBtn>
          <button onClick={onStart} style={{
            background: "transparent", border: "none", color: tk.inkSoft,
            fontFamily: "inherit", fontSize: 14, padding: "10px 0", cursor: "pointer",
            textDecoration: "underline", textUnderlineOffset: 3,
          }}>Set a different beat</button>
        </>
      ) : (
        <PrimaryBtn onClick={onStart}>Set your beat →</PrimaryBtn>
      )}
      {savedPath && (
        <button onClick={onReset} style={{
          background: "transparent", border: "none", color: tk.mute,
          fontFamily: "inherit", fontSize: 12, padding: "4px 0", cursor: "pointer",
        }}>Reset all progress</button>
      )}
    </div>
  </div>
);

// ─── Screen: Onboarding grid ──────────────────────────────────────
const Tile = ({ label, sub, selected, onClick }) => (
  <button onClick={onClick} style={{
    flex: 1, minWidth: 0,
    background: selected ? tk.ink : tk.surface,
    color: selected ? tk.bg : tk.ink,
    border: `1px solid ${selected ? tk.ink : tk.line}`,
    borderRadius: 14, padding: "16px 14px",
    fontFamily: "inherit", cursor: "pointer",
    display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 4,
    transition: "all 0.15s ease",
    boxShadow: selected ? "0 6px 18px rgba(26,24,21,0.12)" : "none",
  }}>
    <span style={{ fontSize: 17, fontWeight: 600 }}>{label}</span>
    <span style={{ ...styles.mono, fontSize: 10, letterSpacing: "0.08em",
                   textTransform: "uppercase", opacity: 0.7 }}>{sub}</span>
  </button>
);

const OnboardScreen = ({ onBack, onDone, initial }) => {
  const [gear, setGear]   = useState(initial?.gear || null);
  const [kind, setKind]   = useState(initial?.kind || null);
  const [level, setLevel] = useState(initial?.level || null);

  const ready = gear && kind && level;
  const matchCount = ready ? (EXERCISES[bucketKey({ gear, kind, level })] || []).length : 0;

  return (
    <div style={styles.page}>
      <TopBar title="Set your beat" onBack={onBack} />
      <div style={styles.scroll}>
        <div style={{ padding: "10px 24px 24px" }}>
          <div style={{ ...styles.display, fontSize: 36, lineHeight: 1.15, marginBottom: 14 }}>
            Three taps. <span style={{ fontStyle: "italic", color: tk.accent }}>One rhythm.</span>
          </div>
          <p style={{ fontSize: 14, lineHeight: 1.5, color: tk.inkSoft, marginBottom: 22 }}>
            Tap one in each row. We'll cue up ten moves balanced across squat, hinge, push, pull, lunge, core, carry, and full-body.
          </p>

          <Row label="01 — Tools" hint="What's around you?">
            <Tile label="Bodyweight"     sub="no gear"          selected={gear === "bodyweight"} onClick={() => setGear("bodyweight")} />
            <Tile label="Equipment"      sub="dumbbells &c."    selected={gear === "equipment"}  onClick={() => setGear("equipment")} />
          </Row>

          <Row label="02 — Style" hint="What kind of beat?">
            <Tile label="Strength"       sub="slow · heavy"     selected={kind === "strength"}   onClick={() => setKind("strength")} />
            <Tile label="Cardio"         sub="quick · light"    selected={kind === "cardio"}     onClick={() => setKind("cardio")} />
          </Row>

          <Row label="03 — Pace" hint="Where are you starting?">
            <Tile label="Beginner"       sub="just starting"    selected={level === "beginner"}     onClick={() => setLevel("beginner")} />
            <Tile label="Intermediate"   sub="steady habit"     selected={level === "intermediate"} onClick={() => setLevel("intermediate")} />
            <Tile label="Advanced"       sub="long-time mover"  selected={level === "advanced"}     onClick={() => setLevel("advanced")} />
          </Row>

          {ready && (
            <div style={{
              marginTop: 8, padding: 16, borderRadius: 14,
              background: tk.accentSoft, color: tk.accentInk,
              display: "flex", alignItems: "center", gap: 12,
            }}>
              <Pulse color={tk.accentInk} size={12} />
              <div style={{ fontSize: 13, lineHeight: 1.4 }}>
                <b>{matchCount} moves</b> queued — {KEY_LABELS[gear]} · {KEY_LABELS[kind]} · {KEY_LABELS[level]}
              </div>
            </div>
          )}
        </div>
      </div>
      <div style={{ padding: "12px 24px 40px" }}>
        <PrimaryBtn disabled={!ready} onClick={() => onDone({ gear, kind, level })}>
          {ready ? "Cue the set →" : "Pick one in each row"}
        </PrimaryBtn>
      </div>
    </div>
  );
};

const Row = ({ label, hint, children }) => (
  <div style={{ marginBottom: 20 }}>
    <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 10 }}>
      <span style={{ ...styles.mono, fontSize: 11, letterSpacing: "0.14em",
                     textTransform: "uppercase", color: tk.mute }}>{label}</span>
      <span style={{ fontSize: 12, color: tk.mute }}>{hint}</span>
    </div>
    <div style={{ display: "flex", gap: 10 }}>{children}</div>
  </div>
);

// ─── Screen: Exercise list ────────────────────────────────────────
const ListScreen = ({ path, log, onBack, onPick }) => {
  const list = EXERCISES[bucketKey(path)] || [];
  const counts = useMemo(() => {
    const c = {};
    list.forEach(e => { c[e.pattern] = (c[e.pattern] || 0) + 1; });
    return c;
  }, [list]);

  return (
    <div style={styles.page}>
      <TopBar title="Today's set" onBack={onBack}
        right={<Tag soft>{list.length}</Tag>} />
      <div style={styles.scroll}>
        <div style={{ padding: "10px 24px 24px" }}>
          <div style={{ ...styles.display, fontSize: 38, lineHeight: 1.1, marginBottom: 12 }}>
            Ten moves,<br/>
            <span style={{ fontStyle: "italic", color: tk.accent }}>one steady beat.</span>
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 4 }}>
            <Tag>{KEY_LABELS[path.gear]}</Tag>
            <Tag>{KEY_LABELS[path.kind]}</Tag>
            <Tag>{KEY_LABELS[path.level]}</Tag>
          </div>

          {/* movement balance strip */}
          <div style={{ marginTop: 22, marginBottom: 18,
                        padding: "14px 14px", borderRadius: 12,
                        background: tk.surface, border: `1px solid ${tk.line}` }}>
            <div style={{ ...styles.mono, fontSize: 10, letterSpacing: "0.14em",
                          textTransform: "uppercase", color: tk.mute, marginBottom: 10 }}>
              Movement balance
            </div>
            <div style={{ display: "flex", gap: 4, alignItems: "flex-end", height: 32 }}>
              {Object.keys(PATTERNS).map(p => {
                const n = counts[p] || 0;
                return (
                  <div key={p} title={`${PATTERNS[p].label} · ${n}`}
                       style={{ flex: 1, display: "flex", flexDirection: "column",
                                alignItems: "center", gap: 4, opacity: n ? 1 : 0.3 }}>
                    <div style={{ width: "100%", background: n ? tk.ink : tk.lineSolid,
                                  height: 4 + n * 6, borderRadius: 2 }} />
                  </div>
                );
              })}
            </div>
            <div style={{ display: "flex", gap: 4, marginTop: 6 }}>
              {Object.keys(PATTERNS).map(p => (
                <div key={p} style={{ flex: 1, textAlign: "center", ...styles.mono,
                                      fontSize: 8.5, letterSpacing: "0.04em", color: tk.mute,
                                      textTransform: "uppercase" }}>
                  {PATTERNS[p].label.split(" ")[0].slice(0, 5)}
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {list.map((ex, i) => (
              <ListRow key={ex.id} ex={ex} idx={i + 1} log={log[ex.id]} onClick={() => onPick(ex)} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const ListRow = ({ ex, idx, log, onClick }) => {
  const sessions = log || [];
  const lastW = sessions.find(s => s.weight != null)?.weight;
  return (
    <button onClick={onClick} style={{
      width: "100%", textAlign: "left", cursor: "pointer",
      background: tk.surface, border: `1px solid ${tk.line}`,
      borderRadius: 14, padding: "14px 14px",
      display: "flex", alignItems: "center", gap: 14,
      fontFamily: "inherit",
    }}>
      <div style={{
        width: 48, height: 48, borderRadius: 12,
        background: tk.bg, display: "grid", placeItems: "center",
        color: tk.ink, flexShrink: 0,
      }}>
        <Glyph pattern={ex.pattern} size={32} animate={false} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ ...styles.mono, fontSize: 10, color: tk.mute }}>
            {String(idx).padStart(2, "0")}
          </span>
          <span style={{ fontSize: 16, fontWeight: 600, color: tk.ink,
                         overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {ex.name}
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 4 }}>
          <span style={{ ...styles.mono, fontSize: 11, color: tk.inkSoft }}>3 × 10</span>
          <span style={{ ...styles.mono, fontSize: 11, color: tk.mute }}>·</span>
          <span style={{ fontSize: 12, color: tk.mute }}>{PATTERNS[ex.pattern].label}</span>
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4 }}>
        {sessions.length > 0 && (
          <span style={{ ...styles.mono, fontSize: 10, letterSpacing: "0.06em",
                          textTransform: "uppercase", color: tk.accentInk,
                          background: tk.accentSoft, padding: "3px 7px", borderRadius: 5 }}>
            ×{sessions.length}
          </span>
        )}
        {lastW != null && (
          <span style={{ ...styles.mono, fontSize: 10, color: tk.mute }}>
            {lastW} lb
          </span>
        )}
      </div>
      <svg width="14" height="14" viewBox="0 0 16 16" fill="none" style={{ color: tk.mute }}>
        <path d="M6 3L11 8L6 13" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  );
};

// ─── Screen: Exercise detail ──────────────────────────────────────
const DetailScreen = ({ ex, path, log, profile, onBack, onComplete }) => {
  const [stage, setStage] = useState("ready"); // ready | logging | done
  const [weight, setWeight] = useState("");
  const [unit, setUnit] = useState(profile?.unit || "lb");
  const sessions = log[ex.id] || [];
  const lastWithWeight = sessions.find(s => s.weight != null);
  const lastW = lastWithWeight?.weight;
  const lastUnit = lastWithWeight?.unit || "lb";
  const needsWeight = path.gear === "equipment";

  const equipLine = ex.steps.find(s => s.startsWith("Equipment:"));
  const cleanSteps = ex.steps.filter(s => !s.startsWith("Equipment:"));

  const handleComplete = () => {
    if (needsWeight) setStage("logging");
    else {
      onComplete(ex.id, null, null);
      setStage("done");
    }
  };

  const saveWeight = () => {
    const w = parseFloat(weight);
    const valid = isFinite(w) && w > 0;
    onComplete(ex.id, valid ? w : null, valid ? unit : null);
    setStage("done");
  };

  return (
    <div style={styles.page}>
      <TopBar title={PATTERNS[ex.pattern].label} onBack={onBack}
        right={<Tag soft>{ex.pattern}</Tag>} />
      <div style={styles.scroll}>
        <div style={{ padding: "8px 24px 28px" }}>
          <div style={{ ...styles.display, fontSize: 38, lineHeight: 1.1, marginBottom: 10 }}>{ex.name}</div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
            <span style={{ ...styles.mono, fontSize: 13, color: tk.ink, fontWeight: 600 }}>3 × 10</span>
            <span style={{ color: tk.mute }}>·</span>
            <span style={{ fontSize: 13, color: tk.inkSoft }}>{PATTERNS[ex.pattern].hint}</span>
          </div>

          <a
            href={`https://www.google.com/search?q=${encodeURIComponent(`how to do ${ex.name} proper form video tutorial`)}&tbm=vid`}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "flex", alignItems: "center", gap: 14,
              padding: "16px 16px",
              background: tk.surface,
              border: `1px solid ${tk.line}`,
              borderRadius: 14,
              textDecoration: "none",
              color: tk.ink,
              cursor: "pointer",
            }}
          >
            <div style={{
              width: 44, height: 44, borderRadius: 22,
              background: tk.accentSoft,
              display: "grid", placeItems: "center",
              flexShrink: 0,
            }}>
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <polygon points="6,3 6,15 15,9" fill={tk.accent} />
              </svg>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 15, fontWeight: 600, color: tk.ink }}>
                Watch a how-to video
              </div>
              <div style={{ fontSize: 12, color: tk.mute, marginTop: 3, lineHeight: 1.4 }}>
                Opens a Google video search for <i>{ex.name}</i>
              </div>
            </div>
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" style={{ color: tk.mute, flexShrink: 0 }}>
              <path d="M3 13L13 3M13 3H5M13 3V11" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>

          {equipLine && (
            <div style={{
              marginTop: 16, padding: "10px 14px", borderRadius: 10,
              background: tk.surface, border: `1px solid ${tk.line}`,
              display: "flex", alignItems: "center", gap: 10,
            }}>
              <span style={{ ...styles.mono, fontSize: 10, letterSpacing: "0.12em",
                             textTransform: "uppercase", color: tk.mute }}>Gear</span>
              <span style={{ fontSize: 13, color: tk.ink }}>{equipLine.replace("Equipment:", "").trim()}</span>
            </div>
          )}

          <div style={{ marginTop: 24 }}>
            <div style={{ ...styles.mono, fontSize: 10, letterSpacing: "0.14em",
                          textTransform: "uppercase", color: tk.mute, marginBottom: 12 }}>
              The move
            </div>
            <ol style={{ margin: 0, padding: 0, listStyle: "none",
                         display: "flex", flexDirection: "column", gap: 12 }}>
              {cleanSteps.map((s, i) => (
                <li key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                  <span style={{ ...styles.mono, fontSize: 11, color: tk.accent,
                                  marginTop: 3, minWidth: 18 }}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span style={{ fontSize: 15, lineHeight: 1.45, color: tk.ink, flex: 1 }}>{s}</span>
                </li>
              ))}
            </ol>
          </div>

          {sessions.length > 0 && (
            <HistoryStrip ex={ex} sessions={sessions} needsWeight={needsWeight} pref={profile?.unit || "lb"} />
          )}
        </div>
      </div>

      <div style={{ padding: "12px 24px 40px", borderTop: `1px solid ${tk.line}`, background: tk.bgDeep }}>
        {stage === "ready" && (
          <PrimaryBtn onClick={handleComplete}>Mark complete</PrimaryBtn>
        )}
        {stage === "logging" && (
          <LogWeightInline
            lastW={lastW}
            lastUnit={lastUnit}
            unit={unit}
            setUnit={setUnit}
            weight={weight}
            setWeight={setWeight}
            onSkip={() => { onComplete(ex.id, null, null); setStage("done"); }}
            onSave={saveWeight}
          />
        )}
        {stage === "done" && (
          <DoneState onBack={onBack} />
        )}
      </div>
    </div>
  );
};

const HistoryStrip = ({ ex, sessions, needsWeight, pref }) => {
  const fmt = (ts) => {
    const d = new Date(ts);
    const diff = Date.now() - ts;
    const days = Math.floor(diff / 86400000);
    if (days === 0) return "Today";
    if (days === 1) return "Yesterday";
    if (days < 7) return `${days}d ago`;
    return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
  };
  return (
    <div style={{ marginTop: 28 }}>
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 12 }}>
        <span style={{ ...styles.mono, fontSize: 10, letterSpacing: "0.14em",
                        textTransform: "uppercase", color: tk.mute }}>
          Your rhythm
        </span>
        <span style={{ ...styles.mono, fontSize: 11, color: tk.ink, fontWeight: 600 }}>
          ×{sessions.length} {sessions.length === 1 ? "session" : "sessions"}
        </span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {sessions.slice(0, 5).map((s, i) => {
          const wDisp = (s.weight != null)
            ? (pref === s.unit
                ? `${fmtNum(s.weight)} ${s.unit}`
                : `${fmtNum(pref === "lb" ? toLb(s.weight, s.unit) : toKg(s.weight, s.unit))} ${pref}`)
            : "—";
          return (
            <div key={i} style={{
              display: "flex", alignItems: "center", gap: 12,
              padding: "10px 12px", borderRadius: 10,
              background: i === 0 ? tk.accentSoft : tk.surface,
              border: `1px solid ${i === 0 ? "transparent" : tk.line}`,
            }}>
              <span style={{ ...styles.mono, fontSize: 11, color: tk.mute, minWidth: 60 }}>
                {fmt(s.ts)}
              </span>
              <span style={{ flex: 1, fontSize: 13, color: tk.ink }}>3 × 10</span>
              {needsWeight && (
                <span style={{ ...styles.mono, fontSize: 13, color: tk.ink, fontWeight: 600 }}>
                  {wDisp}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

const LogWeightInline = ({ lastW, lastUnit, unit, setUnit, weight, setWeight, onSkip, onSave }) => {
  const inputRef = useRef(null);
  useEffect(() => { inputRef.current?.focus(); }, []);
  const numeric = parseFloat(weight);
  const showConv = isFinite(numeric) && numeric > 0;
  const other = unit === "lb" ? "kg" : "lb";
  const otherVal = showConv
    ? (unit === "lb" ? (numeric / LB_PER_KG) : (numeric * LB_PER_KG))
    : null;
  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
        <div style={{ ...styles.mono, fontSize: 10, letterSpacing: "0.14em",
                      textTransform: "uppercase", color: tk.mute }}>
          Log the load
        </div>
        <UnitToggle value={unit} onChange={setUnit} />
      </div>
      <div style={{ display: "flex", gap: 8, alignItems: "stretch", marginBottom: 10 }}>
        <div style={{
          flex: 1, background: tk.surface, border: `1px solid ${tk.lineSolid}`,
          borderRadius: 12, padding: "10px 14px",
          display: "flex", flexDirection: "column", gap: 2,
        }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
            <input ref={inputRef} type="number" inputMode="decimal"
              placeholder={lastW != null ? String(lastW) : "0"}
              value={weight} onChange={e => setWeight(e.target.value)}
              style={{
                flex: 1, border: "none", outline: "none", background: "transparent",
                fontFamily: "'JetBrains Mono', monospace", fontSize: 26, color: tk.ink,
                minWidth: 0, padding: 0,
              }} />
            <span style={{ ...styles.mono, fontSize: 13, color: tk.mute }}>{unit}</span>
          </div>
          <div style={{ ...styles.mono, fontSize: 10, color: tk.mute, letterSpacing: "0.06em" }}>
            {showConv ? `≈ ${fmtNum(otherVal)} ${other}` : `also shown in ${other}`}
          </div>
        </div>
        {lastW != null && (
          <button onClick={() => setWeight(String(lastW))} style={{
            background: tk.surface, border: `1px solid ${tk.lineSolid}`,
            borderRadius: 12, padding: "0 12px", color: tk.inkSoft,
            fontFamily: "inherit", fontSize: 12, cursor: "pointer",
            display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", gap: 1,
          }}>
            <span style={{ ...styles.mono, fontSize: 9, letterSpacing: "0.1em" }}>LAST</span>
            <span style={{ ...styles.mono, fontSize: 13, color: tk.ink, fontWeight: 600 }}>{lastW}</span>
            <span style={{ ...styles.mono, fontSize: 8, color: tk.mute }}>{lastUnit}</span>
          </button>
        )}
      </div>
      <div style={{ display: "flex", gap: 10 }}>
        <button onClick={onSkip} style={{
          flex: 1, background: "transparent", border: `1px solid ${tk.lineSolid}`,
          borderRadius: 12, padding: "14px", color: tk.inkSoft,
          fontFamily: "inherit", fontSize: 14, fontWeight: 500, cursor: "pointer",
        }}>Skip</button>
        <div style={{ flex: 2 }}>
          <PrimaryBtn onClick={onSave}>Save & continue</PrimaryBtn>
        </div>
      </div>
    </div>
  );
};

const DoneState = ({ onBack }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
    <div style={{
      padding: "16px 18px", borderRadius: 12,
      background: tk.ink, color: tk.bg,
      display: "flex", alignItems: "center", gap: 12,
    }}>
      <Pulse color={tk.accent} />
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 15, fontWeight: 600 }}>Logged. Beat held.</div>
        <div style={{ fontSize: 12, color: "rgba(245,241,234,0.65)" }}>Pick the next move.</div>
      </div>
    </div>
    <PrimaryBtn onClick={onBack}>Back to the set</PrimaryBtn>
  </div>
);

// ─── App shell ────────────────────────────────────────────────────
const App = () => {
  // profile-aware boot state
  const [profile, setProfile] = useState(() => PROFILE.get());
  const [authed, setAuthed]   = useState(() => PROFILE.isLoggedIn());
  const [view, setView] = useState("splash");
  const [path, setPath] = useState(() => STORE.getPath());
  const [log, setLog]   = useState(() => STORE.getLog());
  const [active, setActive] = useState(null);
  const [toast, setToast]   = useState(null);

  const goStart  = () => setView("onboard");
  const goSplash = () => setView("splash");
  const goList   = () => setView("list");
  const goProfile = () => setView("profile");

  const finishOnboard = (p) => {
    STORE.setPath(p);
    setPath(p);
    setView("list");
  };

  const pickExercise = (ex) => {
    setActive(ex);
    setView("detail");
  };

  const complete = (exId, weight, unit) => {
    const next = STORE.recordSession(exId, weight, unit);
    setLog(next);
    // milestone check
    const { newly } = checkMilestones(next);
    if (newly.length) setToast(newly[0]);
  };

  const resetAll = () => {
    if (!confirm("Clear all progress and your saved beat?")) return;
    STORE.reset();
    setPath(null);
    setLog({});
    setView("splash");
  };

  const setUnit = (u) => {
    PROFILE.patch({ unit: u });
    setProfile(PROFILE.get());
  };

  const signOut = () => {
    PROFILE.logout();
    setAuthed(false);
  };

  const deleteProfile = () => {
    if (!confirm("Delete this profile and all sessions on this device?")) return;
    PROFILE.clear();
    STORE.reset();
    setProfile(null);
    setAuthed(false);
    setPath(null);
    setLog({});
  };

  const onProfileCreated = () => {
    setProfile(PROFILE.get());
    setAuthed(true);
    setView("splash");
  };

  // 1. No profile → create
  if (!profile) return <CreateProfileScreen onDone={onProfileCreated} />;
  // 2. Profile exists but not unlocked → login
  if (!authed) return (
    <LoginScreen
      profile={profile}
      onUnlock={() => setAuthed(true)}
      onForget={deleteProfile}
    />
  );

  return (
    <>
      {view === "splash" && (
        <SplashScreen
          savedPath={path}
          profile={profile}
          onStart={goStart}
          onResume={goList}
          onReset={resetAll}
          onProfile={goProfile}
        />
      )}
      {view === "profile" && (
        <ProfileScreen
          profile={profile} log={log}
          onBack={goSplash}
          onLogout={signOut}
          onReset={deleteProfile}
          onUnitChange={setUnit}
        />
      )}
      {view === "onboard" && (
        <OnboardScreen initial={path} onBack={goSplash} onDone={finishOnboard} />
      )}
      {view === "list" && path && (
        <ListScreen path={path} log={log} onBack={goSplash} onPick={pickExercise} />
      )}
      {view === "detail" && active && path && (
        <DetailScreen
          ex={active} path={path} log={log} profile={profile}
          onBack={goList}
          onComplete={complete}
        />
      )}
      <MilestoneToast milestone={toast} onDone={() => setToast(null)} />
    </>
  );
};

Object.assign(window, { App });
