import re

with open('js/roughness.js', 'r', encoding='utf-8') as f:
    js = f.read()

# Add nStart, nEnd to mfgProcesses
js = js.replace('n: "N1–N3"', 'n: "N1–N3", nStart: 1, nEnd: 3')
js = js.replace('n: "N2–N5"', 'n: "N2–N5", nStart: 2, nEnd: 5')
js = js.replace('n: "N3–N6"', 'n: "N3–N6", nStart: 3, nEnd: 6')
js = js.replace('n: "N3–N7"', 'n: "N3–N7", nStart: 3, nEnd: 7')
js = js.replace('n: "N6–N8"', 'n: "N6–N8", nStart: 6, nEnd: 8')
js = js.replace('n: "N5–N8"', 'n: "N5–N8", nStart: 5, nEnd: 8')
js = js.replace('n: "N6–N9"', 'n: "N6–N9", nStart: 6, nEnd: 9')
js = js.replace('n: "N6–N10"', 'n: "N6–N10", nStart: 6, nEnd: 10')
js = js.replace('n: "N7–N10"', 'n: "N7–N10", nStart: 7, nEnd: 10')
js = js.replace('n: "N7–N11"', 'n: "N7–N11", nStart: 7, nEnd: 11')
js = js.replace('n: "N9–N12"', 'n: "N9–N12", nStart: 9, nEnd: 12')
js = js.replace('n: "N8–N12"', 'n: "N8–N12", nStart: 8, nEnd: 12')

# Update mfgTable render logic to include the range bar
mfg_render_old = """    const mfgTable = document.getElementById('mfgTable');
    if (mfgTable) {
        mfgTable.innerHTML = mfgProcesses.map(p => `
        <tr class="hover:bg-slate-800/40">
            <td class="p-2.5 font-bold text-white">${p.name}</td>
            <td class="p-2.5">${p.min}–${p.max}</td>
            <td class="p-2.5">${p.minUin}–${p.maxUin}</td>
            <td class="p-2.5 font-bold text-amber-400">${p.factor}</td>
            <td class="p-2.5 text-cyan-400 font-bold">${p.n}</td>
        </tr>
        `).join('');
    }"""

mfg_render_new = """    const mfgTable = document.getElementById('mfgTable');
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
    }"""

js = js.replace(mfg_render_old, mfg_render_new)

# Update drawProfile to draw alternating bands
profile_old = """    // Section Dividers
    ctx.strokeStyle = '#1e293b';
    const secW = w / 5;
    for (let i = 1; i < 5; i++) {
      ctx.beginPath(); ctx.moveTo(i * secW, 0); ctx.lineTo(i * secW, h); ctx.stroke();
    }"""

profile_new = """    // Section Dividers (Alternating bands)
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
    ctx.setLineDash([]);"""

js = js.replace(profile_old, profile_new)

# In calcRoughness, also update the Profile Viewer output values if they exist
calc_new = """    document.getElementById('outNGradeBadge').innerText = nObj.grade;

    // Update Profile Viewer dynamic values if added to HTML
    const profRa = document.getElementById('profOutRa');
    const profRz = document.getElementById('profOutRz');
    const profRq = document.getElementById('profOutRq');
    if (profRa) profRa.innerText = ra.toFixed(3) + ' μm';
    if (profRz) profRz.innerText = rz.toFixed(3) + ' μm';
    if (profRq) profRq.innerText = rq.toFixed(3) + ' μm';

    document.getElementById('outCutoff').innerText = cutoff + ' mm';"""
js = js.replace("""    document.getElementById('outNGradeBadge').innerText = nObj.grade;

    document.getElementById('outCutoff').innerText = cutoff + ' mm';""", calc_new)

with open('js/roughness.js', 'w', encoding='utf-8') as f:
    f.write(js)

print("js/roughness.js patched successfully!")
