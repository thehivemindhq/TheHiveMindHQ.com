/* ===== EIGHTEEN DECISIONS — RENDER ===== */

(function () {
  const rail = document.getElementById('stageRail');
  const panels = document.getElementById('stagePanels');

  // ── Build rail tabs
  STAGES.forEach((s, i) => {
    const btn = document.createElement('button');
    btn.className = 'stage-tab' + (i === 0 ? ' active' : '');
    btn.dataset.stage = s.id;
    btn.innerHTML = `
      <span class="stage-tab-num">Stage ${s.num}</span>
      <span class="stage-tab-label">${s.label}</span>
    `;
    btn.addEventListener('click', () => activate(s.id));
    rail.appendChild(btn);
  });

  // ── Build stage panels
  STAGES.forEach((s, i) => {
    const panel = document.createElement('section');
    panel.className = 'stage-panel' + (i === 0 ? ' active' : '');
    panel.dataset.stage = s.id;

    panel.innerHTML = `
      <div class="stage-head">
        <div class="stage-head-left">
          <div class="stage-eyebrow">Stage ${s.num} of 06 · ${s.label}</div>
          <h2>${s.title}</h2>
          <p>${s.desc}</p>
        </div>
        <div class="stage-head-right">
          ${s.boxes.map(b => `
            <div class="head-box ${b.style || ''}">
              <div class="head-box-label">${b.label}</div>
              <div class="head-box-text">${b.text}</div>
            </div>
          `).join('')}
        </div>
      </div>
      <div class="decisions">
        ${s.decisions.map(d => decisionHTML(d)).join('')}
      </div>
    `;
    panels.appendChild(panel);
  });

  // ── Decision card HTML
  function decisionHTML(d) {
    const barsHTML = d.bars.map(b => `
      <div class="bar-row">
        <div class="bar-label">${b.l}</div>
        <div class="bar-track"><div class="bar-fill" style="width:${b.p}%; background:${b.c};"></div></div>
        <div class="bar-val">${b.v}</div>
      </div>
    `).join('');

    const qsHTML = d.questions.map(q => `
      <div class="qitem">
        <div class="qrisk">${q.risk}</div>
        <div class="qtext">"${q.q}"</div>
        <div class="qwhy">${q.why}</div>
      </div>
    `).join('');

    return `
      <div class="decision" data-dec="${d.n}">
        <div class="dec-head">
          <div class="dec-num">${d.n}</div>
          <div class="dec-name">${d.name}</div>
          <div class="dec-pill pill-${d.impact}">${d.impactLabel}</div>
          <div class="dec-chev">▾</div>
        </div>
        <div class="dec-body">

          <div class="dec-grid">
            <div class="dec-block dec-block-wide">
              <div class="dec-block-label"><span class="num">i.</span>The Scene · what actually happens</div>
              <p class="scene">${d.scene}</p>
              <div class="bars">${barsHTML}</div>
            </div>

            <div class="dec-block">
              <div class="tradeoff">
                <div class="tradeoff-side tradeoff-eng">
                  <div class="tradeoff-label">ii. Engineering Rationale</div>
                  <div class="tradeoff-text">${d.eng}</div>
                </div>
                <div class="tradeoff-side tradeoff-fin">
                  <div class="tradeoff-label">iii. Financial Reality</div>
                  <div class="tradeoff-text">${d.fin}</div>
                </div>
              </div>
              <div style="margin-top:1rem;">
                <div class="timeline">
                  <div class="tl-box">
                    <div class="tl-label">At the decision</div>
                    <div class="tl-text">${d.timeline.now}</div>
                  </div>
                  <div class="tl-box">
                    <div class="tl-label">12–18 months later</div>
                    <div class="tl-text">${d.timeline.later}</div>
                  </div>
                </div>
              </div>
            </div>

            <div class="dec-block">
              <div class="dec-block-label"><span class="num">iv.</span>The Right Question to Ask</div>
              <div class="questions">${qsHTML}</div>

              <div class="insight">
                <div class="insight-label">v. The Leadership Read</div>
                <div class="insight-text">${d.insight}</div>
              </div>
            </div>

            <div class="dec-block dec-block-wide">
              <div class="dec-cites">
                <strong>Sources</strong>
                ${d.cites}
              </div>
            </div>
          </div>

        </div>
      </div>
    `;
  }

  // ── Toggle decisions
  panels.addEventListener('click', (e) => {
    const head = e.target.closest('.dec-head');
    if (!head) return;
    const dec = head.parentElement;
    dec.classList.toggle('open');
  });

  // ── Stage activation
  function activate(id) {
    document.querySelectorAll('.stage-tab').forEach(t => t.classList.toggle('active', t.dataset.stage === id));
    document.querySelectorAll('.stage-panel').forEach(p => p.classList.toggle('active', p.dataset.stage === id));
    // Smooth scroll the rail into view if the click came from within a panel area
    const railRect = document.getElementById('stageRail').getBoundingClientRect();
    if (railRect.top < 60) {
      // already sticky-pinned, do nothing
    }
  }

  // ── Open the first decision of stage 1 by default for visual richness on landing
  setTimeout(() => {
    const firstPanel = document.querySelector('.stage-panel.active');
    if (firstPanel) {
      const firstDec = firstPanel.querySelector('.decision');
      if (firstDec) firstDec.classList.add('open');
    }
  }, 50);
})();
