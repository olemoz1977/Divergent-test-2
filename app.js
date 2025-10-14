/* Divirgent Test – klientinė logika (LT) */
(() => {
  const JSON_PATH = './divirgent_v2_items_lt.json';

  const el = {
    btnStart:   document.getElementById('btnStart'),
    btnSubmit:  document.getElementById('btnSubmit'),
    btnReset:   document.getElementById('btnReset'),
    itemsWrap:  document.getElementById('itemsContainer'),
    tbl:        document.getElementById('tblScores'),
    tblBody:    document.querySelector('#tblScores tbody'),
    topHdr:     document.getElementById('typesHdr'),
    topList:    document.getElementById('topTypes'),
    globalErr:  document.getElementById('globalError'),
    summary:    document.getElementById('summary'),
    radar:      document.getElementById('radar')
  };

  let META = null;
  let ITEMS = [];
  let RADAR = null;

  const scrollTo = (node) => node?.scrollIntoView({ behavior:'smooth', block:'start' });
  const normMinus1to1 = (mean15) => ((mean15 - 3) / 2);
  const pct0to100      = (mean15) => Math.round(((mean15 - 1) / 4) * 100);

  const byDomain = (arr) => {
    const map = new Map();
    for (const r of arr) {
      if (!map.has(r.domain)) map.set(r.domain, []);
      map.get(r.domain).push(r.value);
    }
    const out = {};
    for (const [k, vals] of map.entries()) {
      const mean = vals.reduce((a,b)=>a+b,0) / vals.length;
      out[k] = { mean, n: vals.length };
    }
    return out;
  };

  const isReversed = (item, meta) => {
    if (item.reverse === true) return true;
    if (meta?.reverse_ids && Array.isArray(meta.reverse_ids)) {
      return meta.reverse_ids.includes(item.id);
    }
    return false;
  };

  const toES = (nNorm) => -nNorm;

  const vectorFromScores = (scores) => {
    const e  = normMinus1to1(scores['Ekstraversija'].mean);
    const a  = normMinus1to1(scores['Malonumas'].mean);
    const c  = normMinus1to1(scores['Sąžiningumas/Atidumas'].mean);
    const n  = normMinus1to1(scores['Neurotiškumas'].mean);
    const es = toES(n);
    const o  = normMinus1to1(scores['Atvirumas patirčiai'].mean);
    return { E:e, A:a, C:c, ES:es, O:o };
  };

  const euclidDist = (p, q) => {
    const keys = ['E','A','C','ES','O'];
    return Math.sqrt(keys.reduce((s,k)=> s + Math.pow((p[k] ?? 0) - (q[k] ?? 0), 2), 0));
  };

  const top3Types = (vec, centroids) => {
    const arr = Object.entries(centroids).map(([name, c]) => {
      const d = euclidDist(vec, c);
      const sim = 1 / (1 + d);
      return { name, dist: d, sim };
    });
    arr.sort((a,b)=> a.dist - b.dist);
    return arr.slice(0,3);
  };

  const showError = (msg) => {
    if (!el.globalErr) { console.error(msg); return; }
    el.globalErr.textContent = msg;
    el.globalErr.classList.remove('hidden');
  };
  const clearError = () => {
    if (!el.globalErr) return;
    el.globalErr.textContent = '';
    el.globalErr.classList.add('hidden');
  };

  const renderForm = () => {
    const likert = META.likert ?? ["Visiškai nesutinku","Nesutinku","Nei taip, nei ne","Sutinku","Visiškai sutinku"];
    const frag = document.createDocumentFragment();

    ITEMS.forEach((it, idx) => {
      const row = document.createElement('div');
      row.className = 'item';
      const inv = isReversed(it, META);
      const tag = document.createElement('h4');
      tag.innerHTML = `${idx+1}. ${it.text} <span class="domain-tag">(${it.domain}${inv ? ', invertuotas' : ''})</span>`;
      row.appendChild(tag);

      const scale = document.createElement('div');
      scale.className = 'scale';

      for (let v=1; v<=5; v++) {
        const id = `${it.id}_${v}`;
        const label = document.createElement('label');
        const input = document.createElement('input');
        input.type = 'radio';
        input.name = it.id;
        input.id = id;
        input.value = String(v);
        label.htmlFor = id;
        const txt = document.createElement('span');
        txt.textContent = `${v} – ${likert[v-1]}`;
        label.appendChild(input);
        label.appendChild(txt);
        scale.appendChild(label);
      }

      row.appendChild(scale);
      frag.appendChild(row);
    });

    el.itemsWrap.innerHTML = '';
    el.itemsWrap.appendChild(frag);
  };

  const readResponses = () => {
    const out = [];
    for (const it of ITEMS) {
      const sel = document.querySelector(`input[name="${it.id}"]:checked`);
      if (!sel) return { ok:false, missing: it.id };
      const raw = Number(sel.value);
      const val = isReversed(it, META) ? (6 - raw) : raw;
      out.push({ id:it.id, domain:it.domain, raw, value:val });
    }
    return { ok:true, rows: out };
  };

  const renderScores = (scores, vec) => {
    el.tblBody.innerHTML = '';
    const order = ['Ekstraversija','Malonumas','Sąžiningumas/Atidumas','Neurotiškumas','Atvirumas patirčiai'];
    for (const key of order) {
      const s = scores[key];
      const tr = document.createElement('tr');
      const norm = normMinus1to1(s.mean);
      tr.innerHTML = `<td>${key}</td>
                      <td>${s.mean.toFixed(2)}</td>
                      <td>${norm >= 0 ? '+' : ''}${norm.toFixed(2)}</td>
                      <td>${pct0to100(s.mean)}%</td>`;
      el.tblBody.appendChild(tr);
    }
    el.tbl.classList.remove('hidden');

    // ← ŠITA eilutė turi būti būtent tokia:
    const top = top3Types(vec, META.type_centroids || {});
    el.topList.innerHTML = '';
    top.forEach(t => {
      const li = document.createElement('li');
      li.textContent = `${t.name} (panašumas ${(t.sim*100).toFixed(0)}%)`;
      el.topList.appendChild(li);
    });
    el.topHdr.classList.remove('hidden');
    el.topList.classList.remove('hidden');

    el.summary.textContent = 'Rezultatai sugeneruoti. Žemiau – domenų vidurkiai ir tipų artimumas.';
  };

  const renderRadar = (scores) => {
    const labels = ['E','A','C','ES','O'];
    const mean = {
      E: scores['Ekstraversija'].mean,
      A: scores['Malonumas'].mean,
      C: scores['Sąžiningumas/Atidumas'].mean,
      ES: 6 - scores['Neurotiškumas'].mean,
      O: scores['Atvirumas patirčiai'].mean
    };
    const dataPct = labels.map(k => pct0to100(mean[k]));
    const cfg = {
      type: 'radar',
      data: {
        labels,
        datasets: [{
          label: 'Domenai (0–100%)',
          data: dataPct,
          fill: true,
          backgroundColor: 'rgba(77,192,181,0.2)',
          borderColor: 'rgba(77,192,181,1)',
          pointBackgroundColor: 'rgba(77,192,181,1)'
        }]
      },
      options: {
        responsive: true,
        scales: {
          r: {
            min: 0, max: 100, ticks: { stepSize: 20, color:'#b7c8d1' },
            grid: { color:'#22323f' }, angleLines: { color:'#22323f' },
            pointLabels: { color:'#eaf0f6' }
          }
        },
        plugins: { legend:{ labels:{ color:'#eaf0f6' } } }
      }
    };
    if (RADAR) RADAR.destroy();
    RADAR = new Chart(el.radar, cfg);
  };

  const resetForm = () => {
    document.querySelectorAll('#itemsContainer input[type="radio"]').forEach(i => i.checked = false);
    el.tbl.classList.add('hidden');
    el.topHdr.classList.add('hidden');
    el.topList.classList.add('hidden');
    el.topList.innerHTML = '';
    el.summary.textContent = 'Užpildykite visus teiginius ir paspauskite „Gauti rezultatą“.';
    if (RADAR) { RADAR.destroy(); RADAR = null; }
    clearError();
  };

  const init = async () => {
    try {
      const res = await fetch(JSON_PATH, { cache:'no-store' });
      if (!res.ok) throw new Error(`HTTP ${res.status} – nepavyko parsisiųsti JSON.`);
      const data = await res.json();
      META = data;
      ITEMS = Array.isArray(data.items_full) && data.items_full.length ? data.items_full
            : Array.isArray(data.items_core) && data.items_core.length ? data.items_core
            : [];
      if (!ITEMS.length) throw new Error('JSON neturi items_full / items_core.');
      renderForm();
    } catch (e) {
      showError(`Klaida kraunant klausimus: ${e.message}. Patikrinkite, ar „divirgent_v2_items_lt.json“ yra validus ir pasiekiamas.`);
    }
  };

  el.btnStart?.addEventListener('click', () => scrollTo(document.getElementById('items')));
  el.btnReset?.addEventListener('click', resetForm);
  el.btnSubmit?.addEventListener('click', () => {
    clearError();
    const resp = readResponses();
    if (!resp.ok) { showError(`Neatsakytas teiginys: ${resp.missing}. Užpildykite visus teiginius.`); return; }
    const scores = byDomain(resp.rows);
    const vec = vectorFromScores(scores);
    renderScores(scores, vec);
    renderRadar(scores);
    scrollTo(document.getElementById('results'));
  });

  document.readyState === 'loading'
    ? document.addEventListener('DOMContentLoaded', init)
    : init();
})();
