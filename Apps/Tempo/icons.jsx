// Tempo — movement glyphs
// One animated icon per movement pattern. All built from basic shapes
// (lines, circles, arrows) — abstract traces of the movement.

const Glyph = ({ pattern, size = 56, color = "currentColor", animate = true }) => {
  const s = size;
  const stroke = Math.max(2, s / 28);
  const dur = "2.2s";
  const common = { fill: "none", stroke: color, strokeWidth: stroke, strokeLinecap: "round", strokeLinejoin: "round" };

  switch (pattern) {
    case "squat": // dot drops along vertical, bracketed by horizontal lines
      return (
        <svg width={s} height={s} viewBox="0 0 56 56">
          <line x1="14" y1="14" x2="42" y2="14" {...common} opacity="0.35" />
          <line x1="14" y1="42" x2="42" y2="42" {...common} opacity="0.35" />
          <circle cx="28" cy="20" r={stroke * 1.5} fill={color}>
            {animate && <animate attributeName="cy" values="20;36;20" dur={dur} repeatCount="indefinite" />}
          </circle>
        </svg>
      );

    case "hinge": // pivoting line from a fixed top point
      return (
        <svg width={s} height={s} viewBox="0 0 56 56">
          <circle cx="28" cy="14" r={stroke * 1.2} fill={color} />
          <line x1="28" y1="14" x2="28" y2="44" {...common}>
            {animate && <animate attributeName="x2" values="28;46;28" dur={dur} repeatCount="indefinite" />}
            {animate && <animate attributeName="y2" values="44;30;44" dur={dur} repeatCount="indefinite" />}
          </line>
        </svg>
      );

    case "push": // arrow extending outward to the right
      return (
        <svg width={s} height={s} viewBox="0 0 56 56">
          <line x1="14" y1="28" x2="14" y2="28" {...common} opacity="0.4" />
          <circle cx="14" cy="28" r={stroke * 1.4} fill={color} opacity="0.5" />
          <g {...common}>
            <line x1="14" y1="28" x2="38" y2="28">
              {animate && <animate attributeName="x2" values="20;42;20" dur={dur} repeatCount="indefinite" />}
            </line>
            <polyline points="32,22 38,28 32,34">
              {animate && <animate attributeName="points" values="14,22 20,28 14,34;36,22 42,28 36,34;14,22 20,28 14,34" dur={dur} repeatCount="indefinite" />}
            </polyline>
          </g>
        </svg>
      );

    case "pull": // arrow contracting inward from the right
      return (
        <svg width={s} height={s} viewBox="0 0 56 56">
          <circle cx="42" cy="28" r={stroke * 1.4} fill={color} opacity="0.5" />
          <g {...common}>
            <line x1="18" y1="28" x2="42" y2="28">
              {animate && <animate attributeName="x1" values="34;14;34" dur={dur} repeatCount="indefinite" />}
            </line>
            <polyline points="24,22 18,28 24,34">
              {animate && <animate attributeName="points" values="40,22 34,28 40,34;20,22 14,28 20,34;40,22 34,28 40,34" dur={dur} repeatCount="indefinite" />}
            </polyline>
          </g>
        </svg>
      );

    case "lunge": // two diagonals splitting from center
      return (
        <svg width={s} height={s} viewBox="0 0 56 56">
          <line x1="14" y1="42" x2="42" y2="42" {...common} opacity="0.35" />
          <line x1="28" y1="12" x2="28" y2="32" {...common} />
          <line x1="28" y1="32" x2="18" y2="42" {...common}>
            {animate && <animate attributeName="x2" values="28;14;28" dur={dur} repeatCount="indefinite" />}
          </line>
          <line x1="28" y1="32" x2="38" y2="42" {...common}>
            {animate && <animate attributeName="x2" values="28;42;28" dur={dur} repeatCount="indefinite" />}
          </line>
        </svg>
      );

    case "core": // rotating ring with cross
      return (
        <svg width={s} height={s} viewBox="0 0 56 56">
          <circle cx="28" cy="28" r="14" {...common} opacity="0.4" />
          <g style={{ transformOrigin: "28px 28px" }}>
            <line x1="28" y1="16" x2="28" y2="40" {...common} />
            <line x1="16" y1="28" x2="40" y2="28" {...common} />
            {animate && <animateTransform attributeName="transform" type="rotate" from="0 28 28" to="180 28 28" dur="3.4s" repeatCount="indefinite" />}
          </g>
        </svg>
      );

    case "carry": // horizontal bar moving forward with weight dots
      return (
        <svg width={s} height={s} viewBox="0 0 56 56">
          <line x1="14" y1="44" x2="42" y2="44" {...common} opacity="0.3" />
          <g>
            <line x1="10" y1="28" x2="46" y2="28" {...common} />
            <circle cx="10" cy="28" r={stroke * 2} fill={color} />
            <circle cx="46" cy="28" r={stroke * 2} fill={color} />
            {animate && <animateTransform attributeName="transform" type="translate" values="0 0; 0 -3; 0 0" dur="1.4s" repeatCount="indefinite" />}
          </g>
        </svg>
      );

    case "full": // four-direction starburst
      return (
        <svg width={s} height={s} viewBox="0 0 56 56">
          <g {...common}>
            <line x1="28" y1="14" x2="28" y2="42">
              {animate && <animate attributeName="opacity" values="1;0.3;1" dur="1.8s" repeatCount="indefinite" />}
            </line>
            <line x1="14" y1="28" x2="42" y2="28">
              {animate && <animate attributeName="opacity" values="0.3;1;0.3" dur="1.8s" repeatCount="indefinite" />}
            </line>
            <line x1="18" y1="18" x2="38" y2="38">
              {animate && <animate attributeName="opacity" values="1;0.3;1" dur="1.8s" begin="0.4s" repeatCount="indefinite" />}
            </line>
            <line x1="18" y1="38" x2="38" y2="18">
              {animate && <animate attributeName="opacity" values="0.3;1;0.3" dur="1.8s" begin="0.4s" repeatCount="indefinite" />}
            </line>
          </g>
          <circle cx="28" cy="28" r={stroke * 1.5} fill={color} />
        </svg>
      );

    default:
      return <svg width={s} height={s} />;
  }
};

// Small in-line glyph used in lists (no animation, fixed weight)
const PatternBadge = ({ pattern, size = 18 }) => (
  <span style={{ display: "inline-flex" }}>
    <Glyph pattern={pattern} size={size} animate={false} />
  </span>
);

// Larger animated illustration for the detail view
const MovementCanvas = ({ pattern, color }) => (
  <div style={{
    width: "100%",
    aspectRatio: "16/10",
    background: "linear-gradient(180deg, #f7f3ec 0%, #efe9df 100%)",
    border: "1px solid rgba(0,0,0,0.06)",
    borderRadius: 18,
    display: "grid",
    placeItems: "center",
    position: "relative",
    overflow: "hidden",
  }}>
    {/* faint grid lines for "stage" feel */}
    <svg width="100%" height="100%" viewBox="0 0 320 200" style={{ position: "absolute", inset: 0, opacity: 0.18 }}>
      {Array.from({ length: 7 }).map((_, i) => (
        <line key={i} x1="0" y1={i * 30 + 10} x2="320" y2={i * 30 + 10} stroke="#1a1815" strokeWidth="0.6" />
      ))}
    </svg>
    <Glyph pattern={pattern} size={140} color={color || "#1a1815"} />
  </div>
);

Object.assign(window, { Glyph, PatternBadge, MovementCanvas });
