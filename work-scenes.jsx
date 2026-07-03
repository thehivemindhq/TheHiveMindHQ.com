/* Work, rebuilt around AI — 30s, 1080x1080 abstract animation */
(function () {
  const { Stage, Sprite, useTime, useSprite, Easing, interpolate, clamp } = window;
  const React = window.React;
  const W = 1080, H = 1080, CX = 540, CY = 540;

  const THEMES = {
    warm: {
      bg: '#F5F1E7', ink: '#332C23', panel: '#FBF8F1',
      muted: 'rgba(51,44,35,0.5)', inkFaint: 'rgba(51,44,35,0.16)', line: 'rgba(51,44,35,0.28)',
      accent: '#8E332C', bad: '#6E1F1B',
      headline: '"Cormorant Garamond", Georgia, serif',
      mono: '"IBM Plex Mono", Menlo, Consolas, monospace',
    },
    minimal: {
      bg: '#F3F4F6', ink: '#191C20', panel: '#FFFFFF',
      muted: 'rgba(25,28,32,0.5)', inkFaint: 'rgba(25,28,32,0.14)', line: 'rgba(25,28,32,0.26)',
      accent: '#4C7EDB', bad: '#D24C4C',
      headline: 'Helvetica, Arial, sans-serif',
      mono: '"SF Mono", "Cascadia Mono", Menlo, Consolas, monospace',
    },
    dark: {
      bg: '#0D1015', ink: '#E9ECF1', panel: '#161B22',
      muted: 'rgba(233,236,241,0.5)', inkFaint: 'rgba(233,236,241,0.14)', line: 'rgba(233,236,241,0.28)',
      accent: '#63E6C2', bad: '#F06A5C',
      headline: 'Helvetica, Arial, sans-serif',
      mono: '"SF Mono", "Cascadia Mono", Menlo, Consolas, monospace',
    },
  };

  const eIO = Easing.easeInOutCubic;
  const fade = (t, a, b, c, d) => clamp((t - a) / (b - a), 0, 1) * (1 - clamp((t - c) / (d - c), 0, 1));
  const polar = (deg, r) => {
    const a = deg * Math.PI / 180;
    return [CX + Math.cos(a) * r, CY + Math.sin(a) * r];
  };

  function Camera({ fx, fy, s, children }) {
    return (
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
        <div style={{
          position: 'absolute', left: 0, top: 0, width: W, height: H,
          transformOrigin: '0 0',
          transform: `translate(${W / 2 - fx * s}px, ${H / 2 - fy * s}px) scale(${s})`,
        }}>{children}</div>
      </div>
    );
  }

  function Cap({ text, t, a, b, c, d, P }) {
    const o = fade(t, a, b, c, d);
    if (o <= 0) return null;
    return (
      <div style={{
        position: 'absolute', left: 72, top: 76, fontFamily: P.mono, fontSize: 23,
        letterSpacing: 5, textTransform: 'uppercase', color: P.muted,
        opacity: o, transform: `translateY(${(1 - o) * 10}px)`,
      }}>{text}</div>
    );
  }

  /* ---------------- Scene 1: the old way (0–7s) ---------------- */
  const LABELS = ['spec', 'code', 'review', 'test', 'ship'];
  const bx = (i) => 180 + i * 180;

  function Scene1({ P, captions }) {
    const { localTime: t } = useSprite();
    const fx = interpolate([0, 1.4, 3.4, 4.2, 7], [300, 340, 700, 540, 540], eIO)(t);
    const fy = interpolate([0, 4.2, 7], [560, 545, 545], eIO)(t);
    const s = interpolate([0, 1.4, 3.8, 4.3, 7], [1.5, 1.12, 1.05, 1.85, 1.95], eIO)(t);
    const tx = interpolate(
      [0.2, 0.8, 1.6, 2.2, 3.0, 3.6, 4.35, 4.95],
      [30, 180, 180, 360, 360, 540, 540, 360], eIO)(t);
    const flashing = t > 4.2 && t < 5.9;
    const flashOn = flashing && Math.sin((t - 4.2) * 22) > 0;

    const queue = [];
    for (let k = 0; k < 4; k++) {
      const at = 1.1 + 0.85 * k;
      const p = clamp((t - at) / 0.4, 0, 1);
      if (p <= 0) continue;
      const e = Easing.easeOutCubic(p);
      queue.push(
        <div key={k} style={{
          position: 'absolute', left: (88 - k * 40) - 13 - (1 - e) * 60, top: 527,
          width: 26, height: 26, background: P.accent, opacity: e, borderRadius: 3,
        }} />
      );
    }

    return (
      <div style={{ position: 'absolute', inset: 0 }}>
        <Camera fx={fx} fy={fy} s={s}>
          <div style={{ position: 'absolute', left: 120, top: 539, width: 840, height: 2, background: P.line }} />
          {LABELS.map((lb, i) => (
            <div key={lb} style={{
              position: 'absolute', left: bx(i) - 60, top: 502, width: 120, height: 76,
              background: P.panel, borderRadius: 4, boxSizing: 'border-box',
              border: `2px solid ${i === 2 && flashOn ? P.bad : P.ink}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <span style={{
                fontFamily: P.mono, fontSize: 15, letterSpacing: 3, textTransform: 'uppercase',
                color: i === 2 && flashOn ? P.bad : P.muted,
              }}>{lb}</span>
            </div>
          ))}
          {flashing && (
            <div style={{
              position: 'absolute', left: 524, top: 428, fontFamily: P.mono, fontSize: 38,
              color: P.bad, opacity: flashOn ? 1 : 0.25,
            }}>✕</div>
          )}
          {queue}
          <div style={{
            position: 'absolute', left: tx - 13, top: 527, width: 26, height: 26,
            background: P.accent, borderRadius: 3, zIndex: 2,
            opacity: fade(t, 0.15, 0.4, 99, 100),
          }} />
        </Camera>
        {captions && <Cap text="the old way" t={t} a={0.4} b={1.0} c={6.0} d={6.6} P={P} />}
      </div>
    );
  }

  /* ---------------- Scene 2: everything waits (7–10s) ---------------- */
  function Scene2({ P, captions }) {
    const { localTime: t } = useSprite();
    const shakeAmp = t > 1.6 ? Math.min((t - 1.6) * 3.5, 5) : 0;
    const dx = Math.sin(t * 43) * shakeAmp, dy = Math.cos(t * 37) * shakeAmp;
    const zoom = interpolate([0, 3], [1, 1.16], Easing.easeInQuad)(t);
    const cells = [];
    for (let i = 0; i < 81; i++) {
      const r = Math.floor(i / 9), c = i % 9;
      const ord = (i * 29) % 81;
      const at = 0.1 + ord * 0.021;
      const p = clamp((t - at) / 0.18, 0, 1);
      if (p <= 0) continue;
      const sc = Easing.easeOutBack(p);
      cells.push(
        <div key={i} style={{
          position: 'absolute', left: 200 + c * 80, top: 200 + r * 80, width: 34, height: 34,
          background: (i * 13) % 19 === 0 ? P.accent : P.inkFaint,
          transform: `scale(${sc})`, borderRadius: 3,
        }} />
      );
    }
    return (
      <div style={{ position: 'absolute', inset: 0 }}>
        <div style={{
          position: 'absolute', inset: 0,
          transform: `translate(${dx}px,${dy}px) scale(${zoom})`, transformOrigin: '50% 50%',
        }}>{cells}</div>
        {captions && <Cap text="everything waits" t={t} a={1.5} b={2.1} c={2.7} d={3.0} P={P} />}
      </div>
    );
  }

  /* ---------------- Scene 3: the break (10–13.5s) ---------------- */
  const DIRS = [[-0.9, -0.5], [-0.4, 0.9], [0.05, -1], [0.55, 0.85], [0.95, -0.45]];

  function Scene3({ P }) {
    const { localTime: t } = useSprite();
    const s = interpolate([0, 0.35, 0.95, 3.5], [1.9, 1.9, 1.0, 1.03], eIO)(t);
    const bp = Easing.easeOutCubic(clamp((t - 0.35) / 0.9, 0, 1));
    const bo = 1 - Easing.easeInQuad(clamp((t - 0.35) / 0.9, 0, 1));
    const cp = Easing.easeOutBack(clamp((t - 1.0) / 0.7, 0, 1));
    const rings = [1.7, 2.3, 2.9].map((rt, i) => {
      const p = clamp((t - rt) / 1.1, 0, 1);
      if (p <= 0 || p >= 1) return null;
      const r = 75 + p * 230;
      return (
        <div key={i} style={{
          position: 'absolute', left: CX - r, top: CY - r, width: r * 2, height: r * 2,
          borderRadius: '50%', border: `2px solid ${P.accent}`, opacity: (1 - p) * 0.55,
          boxSizing: 'border-box',
        }} />
      );
    });
    return (
      <div style={{ position: 'absolute', inset: 0 }}>
        <Camera fx={540} fy={540} s={s}>
          {LABELS.map((lb, i) => (
            <div key={lb} style={{
              position: 'absolute', left: bx(i) - 60 + DIRS[i][0] * 640 * bp,
              top: 502 + DIRS[i][1] * 640 * bp, width: 120, height: 76,
              background: P.panel, border: `2px solid ${P.ink}`, borderRadius: 4, boxSizing: 'border-box',
              transform: `rotate(${DIRS[i][0] * 150 * bp}deg)`, opacity: bo,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <span style={{ fontFamily: P.mono, fontSize: 15, letterSpacing: 3, textTransform: 'uppercase', color: P.muted }}>{lb}</span>
            </div>
          ))}
          {rings}
          {cp > 0 && (
            <div style={{
              position: 'absolute', left: CX - 70, top: CY - 70, width: 140, height: 140,
              borderRadius: '50%', background: P.accent, transform: `scale(${cp})`,
            }} />
          )}
        </Camera>
      </div>
    );
  }

  /* ---------------- Scene 4: rebuilt around AI (13.5–24s) ---------------- */
  const ANGLES = [-135, -45, 0, 45, 90, 135, 180];
  const S4DUR = 10.5;
  function makeSpawns(offset) {
    const a = []; let t = offset, iv = 1.5;
    while (t < S4DUR - 0.8) { a.push(t); iv = Math.max(0.42, iv * 0.88); t += iv; }
    return a;
  }
  const SPAWNS = ANGLES.map((_, j) => makeSpawns(0.9 + j * 0.17)
    .filter((s) => !(j === 2 && s > 3.3 && s < 6.2)));

  function Core({ P, t }) {
    const pulse = 1 + 0.035 * Math.sin(t * 5);
    return (
      <div style={{
        position: 'absolute', left: CX - 70, top: CY - 70, width: 140, height: 140,
        borderRadius: '50%', background: P.accent, transform: `scale(${pulse})`,
      }} />
    );
  }

  function Channel({ j, t, P }) {
    const deg = ANGLES[j];
    const appear = 0.25 + j * 0.12;
    const grow = Easing.easeOutCubic(clamp((t - appear) / 0.5, 0, 1));
    if (grow <= 0) return null;
    const kids = [];
    kids.push(
      <div key="line" style={{
        position: 'absolute', left: CX, top: CY - 1, width: 280 * grow, height: 2,
        background: P.inkFaint, transformOrigin: '0 50%',
        transform: `rotate(${deg}deg) translateX(110px)`,
      }} />
    );
    for (const sp of SPAWNS[j]) {
      const dt = t - sp;
      if (dt >= 0 && dt <= 1.05) {
        const p = Easing.easeInOutQuad(dt / 1.05);
        const [x, y] = polar(deg, 112 + p * 278);
        kids.push(
          <div key={'t' + sp} style={{
            position: 'absolute', left: x - 10, top: y - 10, width: 20, height: 20,
            background: P.accent, borderRadius: 3, transform: `rotate(${deg + p * 90}deg)`,
          }} />
        );
      }
      const ld = t - (sp + 1.05);
      if (ld >= 0 && ld <= 0.45) {
        const p = ld / 0.45;
        const r = 12 + p * 34;
        const [x, y] = polar(deg, 390);
        kids.push(
          <div key={'r' + sp} style={{
            position: 'absolute', left: x - r, top: y - r, width: r * 2, height: r * 2,
            borderRadius: '50%', border: `2px solid ${P.accent}`, opacity: (1 - p) * 0.7,
            boxSizing: 'border-box',
          }} />
        );
      }
    }
    // shipped dots accumulating past the channel end
    let n = 0;
    for (const sp of SPAWNS[j]) {
      if (t > sp + 1.05) {
        const col = n % 5, row = Math.floor(n / 5);
        const [x, y] = polar(deg + (col - 2) * 4.2, 434 + row * 16);
        kids.push(
          <div key={'d' + sp} style={{
            position: 'absolute', left: x - 4, top: y - 4, width: 8, height: 8,
            borderRadius: '50%', background: P.ink, opacity: 0.4,
          }} />
        );
        n++;
      }
    }
    return <div style={{ position: 'absolute', inset: 0 }}>{kids}</div>;
  }

  function SplitDetail({ t, P }) {
    if (t < 3.6 || t > 6.1) return null;
    const kids = [];
    const p1 = Easing.easeInOutQuad(clamp((t - 3.7) / 0.5, 0, 1)); // depart 112→200
    const merged = t < 4.25 || t > 5.45;
    if (merged) {
      const r = t < 4.25 ? 112 + p1 * 88
        : 350 + Easing.easeOutCubic(clamp((t - 5.45) / 0.4, 0, 1)) * 40;
      const o = t > 5.45 ? 1 - clamp((t - 5.7) / 0.35, 0, 1) : 1;
      kids.push(
        <div key="m" style={{
          position: 'absolute', left: CX + r - 13, top: CY - 13, width: 26, height: 26,
          background: P.accent, borderRadius: 3, opacity: o,
        }} />
      );
      if (t > 5.5) {
        const p = clamp((t - 5.5) / 0.5, 0, 1);
        const rr = 14 + p * 40;
        kids.push(
          <div key="ring" style={{
            position: 'absolute', left: CX + 390 - rr, top: CY - rr, width: rr * 2, height: rr * 2,
            borderRadius: '50%', border: `2px solid ${P.accent}`, opacity: (1 - p) * 0.8,
            boxSizing: 'border-box',
          }} />
        );
      }
    } else {
      for (let i = 0; i < 3; i++) {
        const off = (i - 1) * 24;
        const dur = 0.95 + i * 0.1;
        const p = Easing.easeInOutQuad(clamp((t - 4.25) / dur, 0, 1));
        const r = 200 + p * 150;
        const spread = Math.sin(Math.min(p, 1) * Math.PI) * off;
        kids.push(
          <div key={i} style={{
            position: 'absolute', left: CX + r - 8, top: CY + spread - 8, width: 16, height: 16,
            background: P.accent, borderRadius: 3,
          }} />
        );
      }
    }
    return <div style={{ position: 'absolute', inset: 0 }}>{kids}</div>;
  }

  function Scene4({ P, captions }) {
    const { localTime: t } = useSprite();
    const fx = interpolate([0, 3.2, 3.8, 5.9, 6.5, 10.5], [540, 540, 800, 800, 540, 540], eIO)(t);
    const s = interpolate([0, 3.2, 3.8, 5.9, 6.5, 10.5], [1, 1, 2.1, 2.1, 1, 0.95], eIO)(t);
    // intent node + feed line
    const io = fade(t, 0.15, 0.6, 99, 100);
    const pulses = [];
    if (t > 0.5) {
      for (let k = 0; k < 2; k++) {
        const ph = ((t - 0.5 + k * 0.45) % 0.9) / 0.9;
        pulses.push(
          <div key={k} style={{
            position: 'absolute', left: 534, top: 196 + ph * 236, width: 12, height: 12,
            borderRadius: '50%', background: P.accent, opacity: Math.sin(ph * Math.PI) * io,
          }} />
        );
      }
    }
    return (
      <div style={{ position: 'absolute', inset: 0 }}>
        <Camera fx={fx} fy={540} s={s}>
          <div style={{
            position: 'absolute', left: 525, top: 145, width: 30, height: 30,
            border: `2.5px solid ${P.ink}`, transform: 'rotate(45deg)', opacity: io,
            boxSizing: 'border-box', background: P.bg,
          }} />
          <div style={{ position: 'absolute', left: 539, top: 192, width: 2, height: 244, background: P.line, opacity: io }} />
          {pulses}
          {ANGLES.map((_, j) => <Channel key={j} j={j} t={t} P={P} />)}
          <SplitDetail t={t} P={P} />
          <Core P={P} t={t} />
        </Camera>
        {captions && <Cap text="parallel, not serial" t={t} a={1.3} b={1.9} c={2.9} d={3.4} P={P} />}
      </div>
    );
  }

  /* ---------------- Scene 5: close (24–30s) ---------------- */
  function Scene5({ P }) {
    const { localTime: t } = useSprite();
    const drift = 1 + t * 0.012;
    const dots = [];
    for (let i = 0; i < 26; i++) {
      const ang = i * 13.9 * 7 + t * 7 * (i % 2 ? 1 : -0.6);
      const r = 250 + (i * 53) % 200;
      const [x, y] = polar(ang, r);
      dots.push(
        <div key={i} style={{
          position: 'absolute', left: x - 4, top: y - 4, width: 8, height: 8,
          borderRadius: '50%', background: P.ink, opacity: 0.14,
        }} />
      );
    }
    const ringP = ((t * 0.55) % 1);
    const rr = 80 + ringP * 260;
    const e = Easing.easeOutCubic(clamp((t - 0.5) / 0.9, 0, 1));
    const barW = 120 * Easing.easeOutCubic(clamp((t - 1.3) / 0.6, 0, 1));
    return (
      <div style={{ position: 'absolute', inset: 0 }}>
        <div style={{ position: 'absolute', inset: 0, transform: `scale(${drift})`, transformOrigin: '50% 50%', opacity: 0.5 }}>
          {dots}
          <div style={{
            position: 'absolute', left: CX - rr, top: CY - rr, width: rr * 2, height: rr * 2,
            borderRadius: '50%', border: `2px solid ${P.accent}`, opacity: (1 - ringP) * 0.35,
            boxSizing: 'border-box',
          }} />
          <div style={{
            position: 'absolute', left: CX - 55, top: CY - 55, width: 110, height: 110,
            borderRadius: '50%', background: P.accent, opacity: 0.45,
            transform: `scale(${1 + 0.04 * Math.sin(t * 4)})`,
          }} />
        </div>
        <div style={{
          position: 'absolute', left: 0, right: 0, top: 480, textAlign: 'center',
          fontFamily: P.headline, fontSize: 62, color: P.ink, letterSpacing: -0.5,
          opacity: e, transform: `translateY(${(1 - e) * 26}px)`,
        }}>Work, rebuilt around AI</div>
        <div style={{
          position: 'absolute', left: CX - barW / 2, top: 578, width: barW, height: 4,
          background: P.accent,
        }} />
      </div>
    );
  }

  function TimeLabel() {
    const t = useTime();
    React.useEffect(() => {
      const el = document.getElementById('anim-root');
      if (el) el.setAttribute('data-screen-label', 't=' + Math.floor(t) + 's');
    });
    return null;
  }

  window.WorkReimagined = function WorkReimagined(props) {
    const theme = props.theme || 'warm';
    const captions = props.captions !== false && props.captions !== 'false';
    const P = THEMES[theme] || THEMES.warm;
    const embed = props.embed === true || props.embed === 'true';
    return (
      <Stage width={W} height={H} duration={30} background={P.bg} shellBackground={embed ? P.bg : '#0a0a0a'} hideBar={embed}>
        <TimeLabel />
        <Sprite start={0} end={7}><Scene1 P={P} captions={captions} /></Sprite>
        <Sprite start={7} end={10}><Scene2 P={P} captions={captions} /></Sprite>
        <Sprite start={10} end={13.5}><Scene3 P={P} /></Sprite>
        <Sprite start={13.5} end={24}><Scene4 P={P} captions={captions} /></Sprite>
        <Sprite start={24} end={30.01}><Scene5 P={P} /></Sprite>
      </Stage>
    );
  };
})();
