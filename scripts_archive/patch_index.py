import re

with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

# 1. Add Tailwind CDN and disable preflight
tailwind_script = """
    <!-- Tailwind CSS (No Preflight) -->
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
      tailwind.config = {
        corePlugins: { preflight: false }
      }
    </script>
    <link rel="stylesheet" href="css/roughness.css">
"""
if "cdn.tailwindcss.com" not in html:
    html = html.replace('</head>', tailwind_script + '\n</head>')

# 2. Add #sectionRoughness
roughness_html = """
        <!-- Main Section: ROUGHNESS -->
        <div id="sectionRoughness" class="main-section" style="display: none;">
            <div class="space-y-4">
                <!-- Header -->
                <div class="bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 border border-slate-800 p-5 rounded-2xl shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
                <div>
                    <h1 class="text-xl md:text-2xl font-black text-white tracking-wide">Tra Cứu Độ Nhám Bề Mặt</h1>
                    <p class="text-xs text-slate-400 mt-1">Chuyển đổi thông số ISO · Mô phỏng biên dạng · Ký hiệu bản vẽ · Hướng dẫn gia công</p>
                </div>
                <span class="text-xs font-semibold px-3 py-1 bg-slate-800 border border-slate-700 rounded-full text-cyan-400">ISO 4287 / 4288 / 1302</span>
                </div>

                <!-- Navigation Tabs -->
                <div class="flex flex-wrap gap-1.5 bg-slate-900 p-1.5 rounded-xl border border-slate-800 text-xs">
                <button id="btn-tab-converter" onclick="switchRoughnessTab('converter')" class="tab-active px-4 py-2 rounded-lg transition">Chuyển đổi (Converter)</button>
                <button id="btn-tab-profile" onclick="switchRoughnessTab('profile')" class="tab-inactive px-4 py-2 rounded-lg transition">Mô phỏng (Profile)</button>
                <button id="btn-tab-symbol" onclick="switchRoughnessTab('symbol')" class="tab-inactive px-4 py-2 rounded-lg transition">Ký hiệu (Symbol)</button>
                <button id="btn-tab-mfg" onclick="switchRoughnessTab('mfg')" class="tab-inactive px-4 py-2 rounded-lg transition">Gia công (Mfg)</button>
                <button id="btn-tab-params" onclick="switchRoughnessTab('params')" class="tab-inactive px-4 py-2 rounded-lg transition">Thông số (Params)</button>
                </div>

                <!-- TAB 1: CONVERTER -->
                <div id="view-tab-converter" class="grid grid-cols-1 md:grid-cols-12 gap-5">
                <!-- Input Section -->
                <div class="md:col-span-12 bg-slate-900 p-5 rounded-2xl border border-slate-800 space-y-4">
                    <h2 class="text-xs font-bold text-cyan-400 uppercase tracking-wider border-b border-slate-800 pb-2">THÔNG SỐ ĐẦU VÀO</h2>
                    
                    <div>
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
                    </div>

                    <div>
                    <label class="block text-xs font-medium text-slate-400 mb-1">Phương pháp gia công</label>
                    <select id="inpProcess" onchange="toggleCustomFactor()" class="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs font-medium text-slate-200">
                        <option value="3.5">Siêu tinh (Rz/Ra ×3.5)</option>
                        <option value="4.0">Nghiền (Rz/Ra ×4)</option>
                        <option value="5.0">Doa khôn (Rz/Ra ×5)</option>
                        <option value="5.5">Mài phẳng (Rz/Ra ×5.5)</option>
                        <option value="6.0" selected>Mài tròn (Rz/Ra ×6)</option>
                        <option value="6.5">Doa/Tiện tinh (Rz/Ra ×6.5)</option>
                        <option value="7.0">Tiện CNC/Phay tinh (Rz/Ra ×7)</option>
                        <option value="7.5">Phay thông thường (Rz/Ra ×7.5)</option>
                        <option value="8.0">Khoan/Bào/Xọc (Rz/Ra ×8)</option>
                        <option value="custom">Hệ số tùy chỉnh...</option>
                    </select>
                    <input type="number" id="customFactorInp" value="6.0" step="0.1" oninput="calcRoughness()" class="hidden w-full mt-2 bg-slate-950 border border-slate-700 rounded-xl p-2 text-xs font-bold text-amber-400" placeholder="Hệ số Rz/Ra">
                    </div>

                    <div>
                    <div class="flex justify-between items-center text-xs mb-1.5">
                        <span class="font-medium text-slate-400">Cấp độ nhám ISO (N-Scale)</span>
                        <span id="activeNGradeLabel" class="font-bold text-amber-400">N7 (Ra = 1.6 μm)</span>
                    </div>
                    <div id="nGrid" class="grid grid-cols-6 gap-1"></div>
                    </div>

                    <div class="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs space-y-1">
                    <div class="font-bold text-slate-300">Chiều dài lấy mẫu mặc định — ISO 4288</div>
                    <div class="grid grid-cols-2 gap-1 text-slate-400">
                        <div>λc = <span id="outCutoff" class="text-white font-bold">0.8 mm</span></div>
                        <div>ln = <span id="outLn" class="text-white font-bold">4 mm</span></div>
                        <div>λs = <span id="outLs" class="text-white font-bold">0.0025 mm</span></div>
                        <div>n = <span class="text-white font-bold">5 (mặc định)</span></div>
                    </div>
                    </div>
                </div>

                <!-- Output Section -->
                <div class="md:col-span-12 bg-slate-900 p-5 rounded-2xl border border-slate-800 space-y-4">
                    <h2 class="text-xs font-bold text-cyan-400 uppercase tracking-wider border-b border-slate-800 pb-2">KẾT QUẢ QUY ĐỔI</h2>

                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
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
                    </div>
                </div>
                </div>

                <!-- TAB 2: PROFILE VIEWER -->
                <div id="view-tab-profile" class="hidden bg-slate-900 p-5 rounded-2xl border border-slate-800 space-y-4">
                <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
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
                </div>

                <div class="bg-slate-950 rounded-xl p-3 border border-slate-800" style="overflow-x:auto;">
                    <canvas id="profileCanvas" width="900" height="220" class="block" style="min-width:600px;"></canvas>
                </div>
                </div>

                <!-- TAB 3: SYMBOL BUILDER -->
                <div id="view-tab-symbol" class="hidden grid grid-cols-1 md:grid-cols-12 gap-5">
                <div class="md:col-span-12 bg-slate-900 p-5 rounded-2xl border border-slate-800 space-y-3 text-xs">
                    <h2 class="font-bold text-cyan-400 uppercase tracking-wider border-b border-slate-800 pb-2">ISO 1302:2002 — Dựng Ký Hiệu</h2>
                    
                    <div>
                    <label class="block text-slate-400 mb-1 font-medium">Kiểu ký hiệu</label>
                    <select id="symType" onchange="renderSymbol()" class="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 font-bold text-white">
                        <option value="basic">Gia công bất kỳ (Cơ bản)</option>
                        <option value="removal" selected>Bắt buộc bóc kim loại (Có gạch ngang)</option>
                        <option value="noremoval">Cấm bóc kim loại (Có vòng tròn)</option>
                    </select>
                    </div>

                    <div>
                    <label class="block text-slate-400 mb-1 font-medium">Bề mặt bao quanh</label>
                    <select id="symAllAround" onchange="renderSymbol()" class="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 font-bold text-white">
                        <option value="no">Không</option>
                        <option value="yes">Có — thêm vòng tròn vào góc</option>
                    </select>
                    </div>

                    <div class="grid grid-cols-2 gap-2">
                    <div>
                        <label class="block text-slate-400 mb-1">Vị trí a — Yêu cầu chính</label>
                        <input type="text" id="symA" value="Ra 1.6" oninput="renderSymbol()" class="w-full bg-slate-950 border border-slate-700 rounded-xl p-2 font-bold text-white">
                    </div>
                    <div>
                        <label class="block text-slate-400 mb-1">Vị trí b — Yêu cầu thứ 2</label>
                        <input type="text" id="symB" value="Rz 6.3" oninput="renderSymbol()" class="w-full bg-slate-950 border border-slate-700 rounded-xl p-2 font-bold text-white">
                    </div>
                    </div>

                    <div class="grid grid-cols-2 gap-2">
                    <div>
                        <label class="block text-slate-400 mb-1">Vị trí c — Phương pháp GC</label>
                        <input type="text" id="symC" value="MÀI" oninput="renderSymbol()" class="w-full bg-slate-950 border border-slate-700 rounded-xl p-2 font-bold text-white">
                    </div>
                    <div>
                        <label class="block text-slate-400 mb-1">Vị trí d — Hướng nhám</label>
                        <select id="symD" onchange="renderSymbol()" class="w-full bg-slate-950 border border-slate-700 rounded-xl p-2 font-bold text-amber-400">
                        <option value="">— Không ghi —</option>
                        <option value="=" selected>= Song song</option>
                        <option value="⊥">⊥ Vuông góc</option>
                        <option value="X">X Chéo nhau</option>
                        <option value="M">M Đa hướng</option>
                        <option value="C">C Vòng tròn</option>
                        <option value="R">R Hướng kính</option>
                        <option value="P">P Lỗ rỗ vô hướng</option>
                        </select>
                    </div>
                    </div>

                    <div>
                    <label class="block text-slate-400 mb-1">Vị trí e — Lượng dư gia công (mm)</label>
                    <input type="text" id="symE" value="3" oninput="renderSymbol()" class="w-full bg-slate-950 border border-slate-700 rounded-xl p-2 font-bold text-white">
                    </div>
                </div>

                <div class="md:col-span-12 bg-slate-900 p-5 rounded-2xl border border-slate-800 flex flex-col items-center justify-center space-y-3">
                    <span class="text-xs font-bold text-slate-400 uppercase tracking-wider">Xem trước ký hiệu</span>
                    <div id="svgContainer" class="bg-slate-950 p-6 rounded-2xl border border-slate-800 w-full flex justify-center items-center overflow-x-auto"></div>
                </div>
                </div>

                <!-- TAB 4: MANUFACTURING GUIDE -->
                <div id="view-tab-mfg" class="hidden bg-slate-900 p-5 rounded-2xl border border-slate-800 space-y-4 text-xs">
                <h2 class="font-bold text-cyan-400 uppercase tracking-wider">Các phương pháp gia công — Dải Ra & Rz</h2>
                <div class="overflow-x-auto">
                    <table class="w-full text-left border-collapse">
                    <thead>
                        <tr class="border-b border-slate-800 text-slate-400 font-bold uppercase">
                        <th class="p-2.5">Phương pháp</th>
                        <th class="p-2.5">Ra (μm)</th>
                        <th class="p-2.5">Hệ số Rz/Ra</th>
                        <th class="p-2.5">Cấp ISO</th>
                        </tr>
                    </thead>
                    <tbody id="mfgTable" class="divide-y divide-slate-800/60 text-slate-200 font-medium"></tbody>
                    </table>
                </div>
                </div>

                <!-- TAB 5: PARAMETERS -->
                <div id="view-tab-params" class="hidden bg-slate-900 p-5 rounded-2xl border border-slate-800 space-y-6 text-xs">
                <div>
                    <h2 class="font-bold text-cyan-400 uppercase tracking-wider mb-3">Cấp độ nhám ISO (N-Scale) — ISO 1302:2002</h2>
                    <div class="overflow-x-auto">
                    <table class="w-full text-left border-collapse">
                        <thead>
                        <tr class="border-b border-slate-800 text-slate-400 font-bold uppercase">
                            <th class="p-2.5">Cấp N</th>
                            <th class="p-2.5">Ra (μm)</th>
                            <th class="p-2.5">Rz (μm)</th>
                            <th class="p-2.5">λc (mm)</th>
                        </tr>
                        </thead>
                        <tbody id="paramTable" class="divide-y divide-slate-800/60 text-slate-200 font-medium"></tbody>
                    </table>
                    </div>
                </div>

                <div>
                    <h2 class="font-bold text-cyan-400 uppercase tracking-wider mb-3">Thông số biên dạng — ISO 4287:1997</h2>
                    <div class="overflow-x-auto">
                    <table class="w-full text-left border-collapse">
                        <thead>
                        <tr class="border-b border-slate-800 text-slate-400 font-bold uppercase">
                            <th class="p-2.5">Ký hiệu</th>
                            <th class="p-2.5">Tên gọi</th>
                        </tr>
                        </thead>
                        <tbody id="isoParamRefTable" class="divide-y divide-slate-800/60 text-slate-200 font-medium"></tbody>
                    </table>
                    </div>
                </div>
                </div>
            </div>
        </div>
"""
if "sectionRoughness" not in html:
    html = html.replace('<!-- Bottom Navigation -->', roughness_html + '\n    <!-- Bottom Navigation -->')

# 3. Add to bottom nav
nav_item = """
        <a href="#" class="main-nav-item" data-target="sectionRoughness">
            <div class="nav-icon">🔍</div>
            <span>ĐỘ NHÁM</span>
        </a>
"""
if 'data-target="sectionRoughness"' not in html:
    html = html.replace('</nav>', nav_item + '</nav>')

# 4. Add js/roughness.js script
script_item = '<script src="js/roughness.js"></script>'
if "js/roughness.js" not in html:
    html = html.replace('</body>', '    ' + script_item + '\n</body>')

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(html)

print("index.html patched!")
