const nGrades = [
    { grade: 'N1', ra: 0.025, uin: 1, rz: 0.15, cutoff: 0.25, ln: 1.25, color: 'bg-emerald-800' },
    { grade: 'N2', ra: 0.05,  uin: 2, rz: 0.30, cutoff: 0.25, ln: 1.25, color: 'bg-emerald-700' },
    { grade: 'N3', ra: 0.10,  uin: 4, rz: 0.60, cutoff: 0.25, ln: 1.25, color: 'bg-emerald-600' },
    { grade: 'N4', ra: 0.20,  uin: 8, rz: 1.20, cutoff: 0.80, ln: 4.00, color: 'bg-emerald-500' },
    { grade: 'N5', ra: 0.40,  uin: 16, rz: 2.40, cutoff: 0.80, ln: 4.00, color: 'bg-amber-600' },
    { grade: 'N6', ra: 0.80,  uin: 31, rz: 4.80, cutoff: 0.80, ln: 4.00, color: 'bg-amber-500' },
    { grade: 'N7', ra: 1.60,  uin: 63, rz: 9.60, cutoff: 0.80, ln: 4.00, color: 'bg-orange-500' },
    { grade: 'N8', ra: 3.20,  uin: 126, rz: 19.20, cutoff: 2.50, ln: 12.50, color: 'bg-orange-600' },
    { grade: 'N9', ra: 6.30,  uin: 248, rz: 37.80, cutoff: 2.50, ln: 12.50, color: 'bg-red-600' },
    { grade: 'N10', ra: 12.50, uin: 492, rz: 75.00, cutoff: 8.00, ln: 40.00, color: 'bg-red-700' },
    { grade: 'N11', ra: 25.00, uin: 984, rz: 150.00, cutoff: 8.00, ln: 40.00, color: 'bg-rose-800' },
    { grade: 'N12', ra: 50.00, uin: 1969, rz: 300.00, cutoff: 8.00, ln: 40.00, color: 'bg-rose-900' }
  ];

  const mfgProcesses = [
    { name: "Siêu tinh (Super-finishing)", min: 0.012, max: 0.1, minUin: 0, maxUin: 4, factor: "×3.5", n: "N1–N3", nStart: 1, nEnd: 3 },
    { name: "Nghiền (Lapping)", min: 0.05, max: 0.4, minUin: 2, maxUin: 16, factor: "×4", n: "N2–N5", nStart: 2, nEnd: 5 },
    { name: "Doa khôn (Honing)", min: 0.1, max: 0.8, minUin: 4, maxUin: 31, factor: "×5", n: "N3–N6", nStart: 3, nEnd: 6 },
    { name: "Mài phẳng (Surface Grinding)", min: 0.1, max: 1.6, minUin: 4, maxUin: 63, factor: "×5.5", n: "N3–N7", nStart: 3, nEnd: 7 },
    { name: "Mài tròn (Cylindrical Grinding)", min: 0.1, max: 1.6, minUin: 4, maxUin: 63, factor: "×6", n: "N3–N7", nStart: 3, nEnd: 7 },
    { name: "Doa (Reaming)", min: 0.8, max: 3.2, minUin: 31, maxUin: 126, factor: "×6", n: "N6–N8", nStart: 6, nEnd: 8 },
    { name: "Doa tinh (Fine Boring)", min: 0.4, max: 3.2, minUin: 16, maxUin: 126, factor: "×6", n: "N5–N8", nStart: 5, nEnd: 8 },
    { name: "Chuốt (Broaching)", min: 0.4, max: 3.2, minUin: 16, maxUin: 126, factor: "×6", n: "N5–N8", nStart: 5, nEnd: 8 },
    { name: "Tiện tinh (Fine Turning)", min: 0.4, max: 3.2, minUin: 16, maxUin: 126, factor: "×6.5", n: "N5–N8", nStart: 5, nEnd: 8 },
    { name: "Tiện CNC (CNC / NC Turning)", min: 0.8, max: 6.3, minUin: 31, maxUin: 248, factor: "×7", n: "N6–N9", nStart: 6, nEnd: 9 },
    { name: "Phay ngón (End Milling)", min: 0.8, max: 6.3, minUin: 31, maxUin: 248, factor: "×7", n: "N6–N9", nStart: 6, nEnd: 9 },
    { name: "Tiện thông thường (Conventional Turning)", min: 0.8, max: 12.5, minUin: 31, maxUin: 492, factor: "×7", n: "N6–N10", nStart: 6, nEnd: 10 },
    { name: "Phay thông thường (Conventional Milling)", min: 1.6, max: 12.5, minUin: 63, maxUin: 492, factor: "×7.5", n: "N7–N10", nStart: 7, nEnd: 10 },
    { name: "Khoan (Drilling)", min: 1.6, max: 12.5, minUin: 63, maxUin: 492, factor: "×8", n: "N7–N10", nStart: 7, nEnd: 10 },
    { name: "Bào / Xọc (Shaping / Planing)", min: 1.6, max: 25.0, minUin: 63, maxUin: 984, factor: "×8", n: "N7–N11", nStart: 7, nEnd: 11 },
    { name: "Đúc áp lực (Die Casting)", min: 0.8, max: 3.2, minUin: 31, maxUin: 126, factor: "×6", n: "N6–N8", nStart: 6, nEnd: 8 },
    { name: "Đúc khuôn cát (Sand Casting)", min: 6.3, max: 50.0, minUin: 248, maxUin: 1969, factor: "×8", n: "N9–N12", nStart: 9, nEnd: 12 },
    { name: "Cán nóng (Hot Rolling)", min: 3.2, max: 50.0, minUin: 126, maxUin: 1969, factor: "×7", n: "N8–N12", nStart: 8, nEnd: 12 }
  ];

  const iso4287Params = [
    { sym: 'Rp', name: 'Chiều cao đỉnh lớn nhất', def: 'Chiều cao đỉnh lớn nhất Zp trong chiều dài chuẩn lr', formula: 'max(Zp) in lr' },
    { sym: 'Rv', name: 'Chiều sâu đáy lớn nhất', def: 'Chiều sâu đáy lớn nhất Zv trong chiều dài chuẩn lr', formula: 'max(Zv) in lr' },
    { sym: 'Rz', name: 'Chiều cao nhấp nhô lớn nhất', def: 'Rp + Rv trong MỘT khoảng chiều dài chuẩn', formula: 'Rz = Rp + Rv' },
    { sym: 'Rt', name: 'Tổng chiều cao biên dạng', def: 'Zp lớn nhất + Zv lớn nhất trên CHIỀU DÀI ĐÁNH GIÁ ln', formula: 'Rt over ln' },
    { sym: 'Ra', name: 'Sai lệch số học trung bình', def: 'Trung bình của |Z(x)| trong khoảng chiều dài chuẩn', formula: 'Ra = (1/l)·∫|Z(x)|dx' },
    { sym: 'Rq', name: 'Độ lệch bình phương trung bình', def: 'RMS của Z(x) trong khoảng chiều dài chuẩn', formula: 'Rq = √(1/l·∫Z²dx)' }
  ];

  function initRoughness() {
    // N Grid buttons
    const grid = document.getElementById('nGrid');
    if (grid) {
        grid.innerHTML = nGrades.map(g => `
        <button onclick="selectN(${g.ra})" class="${g.color} hover:opacity-80 text-white text-[11px] py-1.5 rounded-md font-bold transition">
            ${g.grade}
        </button>
        `).join('');
    }

    // Tables
    const mfgTable = document.getElementById('mfgTable');
    if (mfgTable) {
        mfgTable.innerHTML = mfgProcesses.map(p => {
            const left = ((p.nStart - 1) / 12) * 100;
            const width = ((p.nEnd - p.nStart + 1) / 12) * 100;
            return `
            <tr class="hover:bg-slate-800/40 border-b border-slate-800/60">
                <td class="p-2.5 font-bold text-slate-200">${p.name}</td>
                <td class="p-2.5 text-slate-400">${p.min}–${p.max}</td>
                <td class="p-2.5 text-slate-400">${p.minUin}–${p.maxUin}</td>
                <td class="p-2.5 font-bold text-amber-500">${p.factor}</td>
                <td class="p-2.5 text-cyan-400 font-bold">${p.n}</td>
                <td class="p-2.5 w-32">
                    <div class="h-2.5 w-full bg-slate-800 rounded-full relative overflow-hidden">
                        <div class="absolute h-full rounded-full" 
                             style="left: ${left}%; width: ${width}%; background: linear-gradient(90deg, #10b981 0%, #f59e0b 50%, #ef4444 100%);">
                        </div>
                    </div>
                </td>
            </tr>
            `;
        }).join('');
    }

    const paramTable = document.getElementById('paramTable');
    if (paramTable) {
        paramTable.innerHTML = nGrades.map(g => `
        <tr class="hover:bg-slate-800/40">
            <td class="p-2.5 font-bold text-cyan-400">${g.grade}</td>
            <td class="p-2.5 font-bold text-white">${g.ra}</td>
            <td class="p-2.5">${g.uin}</td>
            <td class="p-2.5 text-amber-400 font-bold">${g.rz}</td>
            <td class="p-2.5">${g.cutoff}</td>
            <td class="p-2.5">${g.ln}</td>
        </tr>
        `).join('');
    }

    const isoTable = document.getElementById('isoParamRefTable');
    if (isoTable) {
        isoTable.innerHTML = iso4287Params.map(p => `
        <tr class="hover:bg-slate-800/40">
            <td class="p-2.5 font-bold text-cyan-400">${p.sym}</td>
            <td class="p-2.5 font-bold text-white">${p.name}</td>
            <td class="p-2.5 text-slate-300">${p.def}</td>
            <td class="p-2.5 font-mono text-amber-400">${p.formula}</td>
        </tr>
        `).join('');
    }

    calcRoughness();
  }

  function selectN(ra) {
    document.getElementById('inpVal').value = ra;
    document.getElementById('inpUnit').value = 'um';
    document.getElementById('inpParam').value = 'Ra';
    calcRoughness();
  }

  function toggleCustomFactor() {
    const sel = document.getElementById('inpProcess').value;
    const inp = document.getElementById('customFactorInp');
    if (sel === 'custom') inp.classList.remove('hidden');
    else inp.classList.add('hidden');
    calcRoughness();
  }

  function calcRoughness() {
    const inpValEl = document.getElementById('inpVal');
    if (!inpValEl) return;
    
    const val = parseFloat(inpValEl.value) || 0;
    const unit = document.getElementById('inpUnit').value;
    const param = document.getElementById('inpParam').value;
    
    let pSel = document.getElementById('inpProcess').value;
    let factor = pSel === 'custom' ? (parseFloat(document.getElementById('customFactorInp').value) || 6.0) : parseFloat(pSel);

    let raUm = val;
    if (unit === 'uin') raUm = val / 39.3701;
    if (unit === 'mm') raUm = val * 1000;

    let ra, rz;
    if (param === 'Ra') { ra = raUm; rz = ra * factor; }
    else if (param === 'Rz') { rz = raUm; ra = rz / factor; }
    else if (param === 'Rq') { ra = raUm / 1.11; rz = ra * factor; }
    else { rz = raUm / 1.5; ra = rz / factor; }

    const raUin = ra * 39.3701;
    const rq = ra * 1.11;
    const rt = rz * 1.5;
    const rp = rz * 0.5;
    const rv = rz * 0.5;

    let nObj = nGrades[nGrades.length - 1];
    for (let g of nGrades) {
      if (ra <= g.ra * 1.05) { nObj = g; break; }
    }

    let cutoff = 0.8, ln = 4.0, ls = 0.0025;
    if (ra <= 0.1) { cutoff = 0.25; ln = 1.25; ls = 0.0025; }
    else if (ra <= 2.0) { cutoff = 0.8; ln = 4.0; ls = 0.0025; }
    else if (ra <= 10.0) { cutoff = 2.5; ln = 12.5; ls = 0.008; }
    else { cutoff = 8.0; ln = 40.0; ls = 0.025; }

    document.getElementById('outRa').innerText = ra.toFixed(2) + ' μm';
    document.getElementById('outRz').innerText = rz.toFixed(2) + ' μm';
    document.getElementById('outRq').innerText = rq.toFixed(2) + ' μm';
    document.getElementById('outRt').innerText = rt.toFixed(2) + ' μm';
    document.getElementById('outRp').innerText = rp.toFixed(2) + ' μm';
    document.getElementById('outRv').innerText = rv.toFixed(2) + ' μm';
    document.getElementById('outUin').innerText = Math.round(raUin) + ' μin';
    document.getElementById('outNGradeBadge').innerText = nObj.grade;

    // Update Profile Viewer dynamic values if added to HTML
    const profRaDisp = document.getElementById('profRaDisplay');
    if (profRaDisp) profRaDisp.innerText = ra;
    const profRa = document.getElementById('profOutRa');
    const profRz = document.getElementById('profOutRz');
    const profRq = document.getElementById('profOutRq');
    if (profRa) profRa.innerText = ra.toFixed(3) + ' μm';
    if (profRz) profRz.innerText = rz.toFixed(3) + ' μm';
    if (profRq) profRq.innerText = rq.toFixed(3) + ' μm';

    document.getElementById('outCutoff').innerText = cutoff + ' mm';
    document.getElementById('outLn').innerText = ln.toFixed(1) + ' mm';
    document.getElementById('outLs').innerText = ls + ' mm';
    document.getElementById('activeNGradeLabel').innerText = `${nObj.grade} (Ra = ${nObj.ra} μm)`;

    drawProfile();
    renderSymbol();
  }

  function switchRoughnessTab(t) {
    ['converter', 'profile', 'symbol', 'mfg', 'params'].forEach(x => {
      const el = document.getElementById(`view-tab-${x}`);
      const btn = document.getElementById(`btn-tab-${x}`);
      if (el) el.classList.add('hidden');
      if (btn) btn.className = 'tab-inactive px-4 py-2 rounded-lg transition';
    });

    const activeEl = document.getElementById(`view-tab-${t}`);
    const activeBtn = document.getElementById(`btn-tab-${t}`);
    if (activeEl) activeEl.classList.remove('hidden');
    if (activeBtn) activeBtn.className = 'tab-active px-4 py-2 rounded-lg transition';

    if (t === 'profile') drawProfile();
    if (t === 'symbol') renderSymbol();
  }

  function drawProfile() {
    const cv = document.getElementById('profileCanvas');
    if (!cv || cv.offsetParent === null) return;
    const ctx = cv.getContext('2d');
    const w = cv.width, h = cv.height;
    ctx.clearRect(0, 0, w, h);

    const type = document.getElementById('profType').value;
    const scale = parseFloat(document.getElementById('profScale').value);

    // Section Dividers (Alternating bands)
    const secW = w / 5;
    for (let i = 0; i < 5; i++) {
      ctx.fillStyle = i % 2 === 0 ? '#0f172a' : '#1e293b'; // slate-900 vs slate-800
      ctx.fillRect(i * secW, 0, secW, h);
      // Section labels
      ctx.fillStyle = '#64748b';
      ctx.font = '10px Inter';
      ctx.fillText(`λ${i+1}`, i * secW + secW/2 - 5, h - 10);
    }
    
    // Draw boundary lines
    ctx.strokeStyle = '#334155';
    ctx.setLineDash([2, 2]);
    for (let i = 1; i < 5; i++) {
      ctx.beginPath(); ctx.moveTo(i * secW, 0); ctx.lineTo(i * secW, h); ctx.stroke();
    }
    ctx.setLineDash([]);
    
    // Y-axis label
    ctx.save();
    ctx.translate(20, h/2);
    ctx.rotate(-Math.PI/2);
    ctx.fillStyle = '#64748b';
    ctx.font = '10px Inter';
    ctx.textAlign = 'center';
    ctx.fillText('Chiều cao (μm × 10)', 0, 0);
    ctx.restore();
    
    // Evaluation length text at bottom
    ctx.fillStyle = '#64748b';
    ctx.font = '10px Inter';
    ctx.textAlign = 'left';
    ctx.fillText('Chiều dài đánh giá ln = 5×λc', 40, h - 10);
    
    // Store pts to find min/max
    let pts = [];
    
    // Mean Line
    ctx.strokeStyle = '#38bdf8';
    ctx.setLineDash([4, 4]);
    ctx.beginPath(); ctx.moveTo(0, h / 2); ctx.lineTo(w, h / 2); ctx.stroke();
    ctx.setLineDash([]);

    // Profile Line
    ctx.strokeStyle = '#38bdf8'; // It's actually blue in screenshot, not orange! Wait, the screenshot shows a blue profile line!
    ctx.lineWidth = 1.5;
    ctx.beginPath();

    for (let x = 0; x < w; x++) {
      let amp = 12 * scale;
      let y = h / 2;
      if (type === 'turned') {
        y += Math.sin(x * 0.05) * amp + Math.sin(x * 0.15) * (amp * 0.2);
      } else if (type === 'ground') {
        y += (Math.sin(x * 0.08) + Math.cos(x * 0.22) + Math.sin(x * 0.45)) * (amp * 0.35);
      } else {
        y += Math.sin(x * 0.03) * amp + Math.sin(x * 0.18) * (amp * 0.4);
      }
      pts.push({x, y});
      if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    }
    ctx.stroke();

    // Ra text
    let raVal = document.getElementById('profRaDisplay') ? document.getElementById('profRaDisplay').innerText : '1.6';
    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 10px Inter';
    ctx.textAlign = 'left';
    ctx.fillText(`Ra=${Number(raVal).toFixed(3)}`, 40, h/2 - 20);

    // Rz indicator (orange)
    // Find min and max in the first section (0 to secW)
    let maxPt = pts[0], minPt = pts[0];
    for (let i = 0; i < secW; i++) {
        if (pts[i].y < maxPt.y) maxPt = pts[i]; // y is inverted
        if (pts[i].y > minPt.y) minPt = pts[i];
    }
    
    const rzX = secW / 2;
    const rzTopY = maxPt.y;
    const rzBotY = minPt.y;
    
    ctx.strokeStyle = '#f59e0b';
    ctx.setLineDash([2, 2]);
    ctx.beginPath();
    ctx.moveTo(rzX, rzTopY);
    ctx.lineTo(rzX, rzBotY);
    ctx.stroke();
    
    // Draw horizontal dashed lines for Rz bounds
    ctx.beginPath(); ctx.moveTo(0, rzTopY); ctx.lineTo(w, rzTopY); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(0, rzBotY); ctx.lineTo(w, rzBotY); ctx.stroke();
    
    // Arrow heads
    ctx.setLineDash([]);
    ctx.fillStyle = '#f59e0b';
    ctx.beginPath(); ctx.moveTo(rzX, rzTopY); ctx.lineTo(rzX - 3, rzTopY + 4); ctx.lineTo(rzX + 3, rzTopY + 4); ctx.fill();
    ctx.beginPath(); ctx.moveTo(rzX, rzBotY); ctx.lineTo(rzX - 3, rzBotY - 4); ctx.lineTo(rzX + 3, rzBotY - 4); ctx.fill();
    
    ctx.fillText('Rz', rzX + 5, h/2);
  }

  function renderSymbol() {
    const container = document.getElementById('svgContainer');
    if (!container || container.offsetParent === null) return;

    const type = document.getElementById('symType').value;
    const allAround = document.getElementById('symAllAround').value === 'yes';
    const a = document.getElementById('symA').value;
    const b = document.getElementById('symB').value;
    const c = document.getElementById('symC').value;
    const d = document.getElementById('symD').value;
    const e = document.getElementById('symE').value;

    let lineHtml = type === 'removal' ? '<line x1="32" y1="65" x2="68" y2="65" stroke="#38bdf8" stroke-width="3"/>' : '';
    let circleHtml = type === 'noremoval' ? '<circle cx="50" cy="60" r="11" stroke="#38bdf8" stroke-width="3" fill="none"/>' : '';
    let elCircleHtml = allAround ? '<circle cx="50" cy="30" r="6" stroke="#38bdf8" stroke-width="2" fill="none"/>' : '';

    container.innerHTML = `
      <svg width="280" height="130" viewBox="0 0 280 130" class="text-cyan-400">
        <polyline points="20,85 50,30 80,85" fill="none" stroke="#38bdf8" stroke-width="3"/>
        <line x1="50" y1="30" x2="220" y2="30" stroke="#38bdf8" stroke-width="3"/>
        ${lineHtml}
        ${circleHtml}
        ${elCircleHtml}
        <text x="55" y="22" fill="#ffffff" font-size="13" font-weight="bold">${a}</text>
        <text x="55" y="46" fill="#94a3b8" font-size="11">${b}</text>
        <text x="100" y="22" fill="#f59e0b" font-size="12" font-weight="bold">${c}</text>
        <text x="55" y="65" fill="#38bdf8" font-size="13" font-weight="bold">${d}</text>
        <text x="5" y="55" fill="#10b981" font-size="11" font-weight="bold">${e}</text>
      </svg>
    `;
  }

  // Khởi tạo tab độ nhám khi DOM load xong
  document.addEventListener('DOMContentLoaded', () => {
      initRoughness();
  });
