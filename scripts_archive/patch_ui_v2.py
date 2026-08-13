import re

with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

# 1. Fix Converter Input Layout
old_input = """                    <div>
                    <label class="block text-xs font-medium text-slate-400 mb-1">Nhập giá trị</label>
                    <input type="number" id="inpVal" value="1.6" step="0.01" oninput="calcRoughness()" class="w-full bg-slate-950 border border-slate-700 focus:border-cyan-500 rounded-xl p-2.5 text-lg font-bold text-white outline-none">
                    </div>

                    <div class="grid grid-cols-2 gap-2">
                    <div>
                        <label class="block text-xs font-medium text-slate-400 mb-1">Đơn vị</label>
                        <select id="inpUnit" onchange="calcRoughness()" class="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs font-bold text-white">
                        <option value="um">μm</option>
                        <option value="uin">μin</option>
                        <option value="mm">mm</option>
                        </select>
                    </div>
                    <div>
                        <label class="block text-xs font-medium text-slate-400 mb-1">Thông số</label>
                        <select id="inpParam" onchange="calcRoughness()" class="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs font-bold text-cyan-400">
                        <option value="Ra">Ra</option>
                        <option value="Rz">Rz</option>
                        <option value="Rq">Rq</option>
                        <option value="Rt">Rt</option>
                        </select>
                    </div>
                    </div>"""

new_input = """                    <div class="flex flex-col sm:flex-row sm:items-end gap-3">
                        <div class="flex-grow">
                            <label class="block text-xs font-medium text-slate-400 mb-1 uppercase tracking-wider">Nhập giá trị</label>
                            <input type="number" id="inpVal" value="1.6" step="0.01" oninput="calcRoughness()" class="w-full bg-slate-950 border border-slate-700 focus:border-cyan-500 rounded-xl p-4 text-2xl font-bold text-white outline-none text-center">
                        </div>
                        <div class="flex gap-2">
                            <select id="inpUnit" onchange="calcRoughness()" class="bg-slate-950 border border-slate-700 rounded-xl p-4 text-sm font-bold text-white outline-none">
                                <option value="um">μm</option>
                                <option value="uin">μin</option>
                                <option value="mm">mm</option>
                            </select>
                            <select id="inpParam" onchange="calcRoughness()" class="bg-slate-950 border border-slate-700 rounded-xl p-4 text-sm font-bold text-cyan-400 outline-none">
                                <option value="Ra">Ra</option>
                                <option value="Rz">Rz</option>
                                <option value="Rq">Rq</option>
                                <option value="Rt">Rt</option>
                            </select>
                        </div>
                    </div>"""
html = html.replace(old_input, new_input)


# 2. Fix Converter Output Layout
old_output = """                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div class="bg-slate-950 p-3 rounded-xl border border-slate-800 flex justify-between items-center">
                        <div>
                        <div class="text-xs font-bold text-cyan-400">Ra · Sai lệch số học TB</div>
                        </div>
                        <div id="outRa" class="text-lg font-black text-white">1.60 μm</div>
                    </div>

                    <div class="bg-slate-950 p-3 rounded-xl border border-slate-800 flex justify-between items-center">
                        <div>
                        <div class="text-xs font-bold text-slate-200">Rz · Chiều cao nhấp nhô Max</div>
                        </div>
                        <div id="outRz" class="text-lg font-black text-amber-400">9.60 μm</div>
                    </div>

                    <div class="bg-slate-950 p-3 rounded-xl border border-slate-800 flex justify-between items-center">
                        <div>
                        <div class="text-xs font-bold text-emerald-400">Rq · Độ lệch bình phương TB</div>
                        </div>
                        <div id="outRq" class="text-base font-bold text-white">1.78 μm</div>
                    </div>

                    <div class="bg-slate-950 p-3 rounded-xl border border-slate-800 flex justify-between items-center">
                        <div>
                        <div class="text-xs font-bold text-slate-200">Rt · Tổng chiều cao biên dạng</div>
                        </div>
                        <div id="outRt" class="text-base font-bold text-white">14.40 μm</div>
                    </div>

                    <div class="bg-amber-500/10 border border-amber-500/30 p-3 rounded-xl flex justify-between items-center">
                        <span class="text-xs font-bold text-amber-400">Ra (μin / Hệ Inch)</span>
                        <span id="outUin" class="text-base font-black text-amber-400">63 μin</span>
                    </div>

                    <div class="bg-cyan-500/10 border border-cyan-500/30 p-3 rounded-xl flex justify-between items-center">
                        <span class="text-xs font-bold text-cyan-400">N · Cấp độ nhám ISO</span>
                        <span id="outNGradeBadge" class="text-base font-black text-cyan-400">N7</span>
                    </div>
                    </div>"""

i_icon = '<span class="inline-flex items-center justify-center w-4 h-4 rounded-full bg-blue-900/50 text-blue-400 text-[9px] font-bold ml-2 cursor-help" title="Thông tin chi tiết">i</span>'

new_output = f"""                    <div class="flex flex-col gap-2">
                    <div class="bg-slate-950 p-3.5 rounded-xl border border-slate-800 flex justify-between items-center">
                        <div>
                        <div class="text-xs font-bold text-cyan-400">Ra - Arithmetical Mean Deviation</div>
                        <div class="text-[10px] text-slate-400 mt-0.5 flex items-center">Average |Z(x)| over sampling length {i_icon}</div>
                        </div>
                        <div id="outRa" class="text-lg font-black text-amber-400">1.60 μm</div>
                    </div>

                    <div class="bg-slate-950 p-3.5 rounded-xl border border-slate-800 flex justify-between items-center">
                        <div>
                        <div class="text-xs font-bold text-slate-200">Rz - Maximum Height of Profile</div>
                        <div class="text-[10px] text-slate-400 mt-0.5 flex items-center">Rp + Rv within one sampling length {i_icon}</div>
                        </div>
                        <div id="outRz" class="text-lg font-black text-amber-400">9.60 μm</div>
                    </div>

                    <div class="bg-slate-950 p-3.5 rounded-xl border border-slate-800 flex justify-between items-center">
                        <div>
                        <div class="text-xs font-bold text-slate-200">Rq - RMS Deviation</div>
                        <div class="text-[10px] text-slate-400 mt-0.5 flex items-center">≈ 1.11 × Ra (Gaussian surface) {i_icon}</div>
                        </div>
                        <div id="outRq" class="text-base font-bold text-white">1.78 μm</div>
                    </div>

                    <div class="bg-slate-950 p-3.5 rounded-xl border border-slate-800 flex justify-between items-center">
                        <div>
                        <div class="text-xs font-bold text-slate-200">Rt - Total Height of Profile</div>
                        <div class="text-[10px] text-slate-400 mt-0.5 flex items-center">Rp + Rv over evaluation length ln {i_icon}</div>
                        </div>
                        <div id="outRt" class="text-base font-bold text-white">14.40 μm</div>
                    </div>

                    <div class="bg-slate-950 p-3.5 rounded-xl border border-slate-800 flex justify-between items-center">
                        <div>
                        <div class="text-xs font-bold text-slate-200">Rp - Max Profile Peak Height</div>
                        <div class="text-[10px] text-slate-400 mt-0.5 flex items-center">Largest Zp above mean line {i_icon}</div>
                        </div>
                        <div id="outRp" class="text-base font-bold text-white">4.80 μm</div>
                    </div>

                    <div class="bg-slate-950 p-3.5 rounded-xl border border-slate-800 flex justify-between items-center">
                        <div>
                        <div class="text-xs font-bold text-slate-200">Rv - Max Profile Valley Depth</div>
                        <div class="text-[10px] text-slate-400 mt-0.5 flex items-center">Largest Zv below mean line {i_icon}</div>
                        </div>
                        <div id="outRv" class="text-base font-bold text-white">4.80 μm</div>
                    </div>

                    <div class="bg-amber-500/10 border border-amber-500/30 p-3.5 rounded-xl flex justify-between items-center">
                        <div>
                        <div class="text-xs font-bold text-amber-400">Ra (μin / CLA Imperial)</div>
                        <div class="text-[10px] text-slate-400 mt-0.5 flex items-center">Ra in micro-inches {i_icon}</div>
                        </div>
                        <span id="outUin" class="text-base font-black text-amber-400">63 μin</span>
                    </div>

                    <div class="bg-emerald-500/10 border border-emerald-500/30 p-3.5 rounded-xl flex justify-between items-center">
                        <div>
                        <div class="text-xs font-bold text-emerald-400">N - ISO Roughness Grade</div>
                        <div class="text-[10px] text-slate-400 mt-0.5 flex items-center">N1-N12 per ISO 1302:2002 {i_icon}</div>
                        </div>
                        <div class="bg-orange-500 text-white font-bold px-3 py-1 rounded-md text-sm" id="outNGradeBadge">N7</div>
                    </div>
                    </div>"""
html = html.replace(old_output, new_output)


# 3. Profile Viewer Layout
old_prof_header = """                <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                    <h2 class="text-xs font-bold text-cyan-400 uppercase tracking-wider">Mô phỏng biên dạng — ISO 4287:1997</h2>
                    <div class="flex space-x-2 text-xs">
                    <select id="profType" onchange="drawProfile()" class="bg-slate-950 border border-slate-700 rounded-lg p-2 font-bold text-white">
                        <option value="turned">Tiện</option>
                        <option value="ground">Mài</option>
                        <option value="milled">Phay</option>
                    </select>
                    <select id="profScale" onchange="drawProfile()" class="bg-slate-950 border border-slate-700 rounded-lg p-2 font-bold text-white">
                        <option value="1">×1</option>
                        <option value="2">×2</option>
                        <option value="5" selected>×5</option>
                        <option value="10">×10</option>
                        <option value="20">×20</option>
                    </select>
                    </div>
                </div>"""

new_prof_header = """                <h2 class="text-xs font-bold text-slate-300 uppercase tracking-wider border-b border-slate-800 pb-2">SURFACE PROFILE SIMULATION — ISO 4287:1997</h2>
                <div class="flex flex-col sm:flex-row justify-start items-end gap-5">
                    <div>
                        <label class="block text-[10px] font-bold text-slate-400 mb-1 uppercase">RA (μm)</label>
                        <div class="bg-slate-950 border border-slate-700 rounded-lg p-3 text-xl font-bold text-white text-center w-32" id="profRaDisplay">1.6</div>
                    </div>
                    <div>
                        <label class="block text-[10px] font-bold text-slate-400 mb-1 uppercase">Profile Type</label>
                        <div class="flex rounded-lg overflow-hidden border border-slate-700 bg-slate-950">
                            <button onclick="document.getElementById('profType').value='turned'; drawProfile();" class="px-3 py-2 text-xs font-bold text-white hover:bg-slate-800 border-r border-slate-700">Turned</button>
                            <button onclick="document.getElementById('profType').value='ground'; drawProfile();" class="px-3 py-2 text-xs font-bold text-white bg-blue-900 border-r border-slate-700">Ground</button>
                            <button onclick="document.getElementById('profType').value='milled'; drawProfile();" class="px-3 py-2 text-xs font-bold text-white hover:bg-slate-800">Milled</button>
                        </div>
                        <select id="profType" onchange="drawProfile()" class="hidden"><option value="turned">Turned</option><option value="ground" selected>Ground</option><option value="milled">Milled</option></select>
                    </div>
                    <div>
                        <label class="block text-[10px] font-bold text-slate-400 mb-1 uppercase">Vertical Scale</label>
                        <select id="profScale" onchange="drawProfile()" class="bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs font-bold text-white outline-none">
                            <option value="1">×1</option>
                            <option value="2">×2</option>
                            <option value="5">×5</option>
                            <option value="10" selected>×10</option>
                            <option value="20">×20</option>
                        </select>
                    </div>
                </div>"""
html = html.replace(old_prof_header, new_prof_header)

old_prof_values = """                    <div class="grid grid-cols-3 gap-2 mt-2 w-full text-[10px] sm:text-xs">
                        <div>
                            <span class="text-cyan-400 font-bold uppercase block mb-1">Ra - Mean Deviation</span>
                            <span id="profOutRa" class="text-lg font-black text-white">1.600 μm</span>
                        </div>
                        <div>
                            <span class="text-amber-500 font-bold uppercase block mb-1">Rz - Max Height</span>
                            <span id="profOutRz" class="text-lg font-black text-amber-400">9.600 μm</span>
                        </div>
                        <div>
                            <span class="text-emerald-400 font-bold uppercase block mb-1">Rq - RMS Deviation</span>
                            <span id="profOutRq" class="text-lg font-black text-emerald-400">1.776 μm</span>
                        </div>
                    </div>"""

new_prof_values = f"""                    <div class="grid grid-cols-3 gap-4 mt-2 w-full">
                        <div>
                            <span class="text-slate-400 font-bold text-[10px] uppercase flex items-center mb-1">RA - MEAN DEVIATION {i_icon}</span>
                            <span id="profOutRa" class="text-lg font-black text-cyan-400">1.600 μm</span>
                        </div>
                        <div class="border-l border-slate-700 pl-4">
                            <span class="text-slate-400 font-bold text-[10px] uppercase flex items-center mb-1">RZ - MAX HEIGHT {i_icon}</span>
                            <span id="profOutRz" class="text-lg font-black text-amber-400">9.600 μm</span>
                        </div>
                        <div class="border-l border-slate-700 pl-4">
                            <span class="text-slate-400 font-bold text-[10px] uppercase flex items-center mb-1">RQ - RMS DEVIATION {i_icon}</span>
                            <span id="profOutRq" class="text-lg font-black text-emerald-400">1.776 μm</span>
                        </div>
                    </div>"""
html = html.replace(old_prof_values, new_prof_values)

old_prof_how = """                <div class="mt-4 bg-slate-950 p-4 rounded-xl border border-slate-800 text-[11px] text-slate-400">
                    <h3 class="font-bold text-cyan-400 mb-2">Chú giải thông số:</h3>"""

if old_prof_how in html:
    pass # Wait, Profile viewer how to read was missing in my previous patch?
# Oh, my previous multi_replace_file_content completely overwrote the "How to read" in Profile viewer?
# Let's check if there is a "HOW TO READ" section. I'll just append it to the Profile tab.

prof_how_to_read = """
                <div class="mt-6">
                    <h3 class="font-bold text-slate-300 uppercase text-[11px] mb-3">HOW TO READ A SURFACE PROFILE</h3>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 text-[10px] text-slate-400">
                        <div>
                            <strong class="text-slate-200 block mb-1">Mean line (dashed blue)</strong>
                            Reference line from which all deviations Z(x) are measured. Ra = average of all absolute distances from this line.
                        </div>
                        <div>
                            <strong class="text-slate-200 block mb-1">Sampling length (λc)</strong>
                            Basic length over which profile is assessed. ISO 4288 specifies default λc by Ra range. 5 sections shown = evaluation length ln.
                        </div>
                        <div>
                            <strong class="text-slate-200 block mb-1">Rz markers (orange)</strong>
                            Tallest peak (Rp) + deepest valley (Rv) within the first sampling length λ1. Rz = Rp + Rv. Varies section to section.
                        </div>
                        <div>
                            <strong class="text-slate-200 block mb-1">Evaluation length ln = 5×λc</strong>
                            Rt uses the worst peak+valley across ALL 5 sections, so Rt ≥ Rz always.
                        </div>
                    </div>
                </div>
"""
# insert before <!-- TAB 3: SYMBOL BUILDER -->
html = html.replace('                <!-- TAB 3: SYMBOL BUILDER -->', prof_how_to_read + '\n                <!-- TAB 3: SYMBOL BUILDER -->')

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(html)
print("index.html layout patched!")
