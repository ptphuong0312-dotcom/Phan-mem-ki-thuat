/**
 * BEARING DATABASE & ISO 5753-1 CLEARANCE TABLES
 * Covers Deep Groove Ball, Spherical Roller, Cylindrical Roller, Tapered Roller & Angular Contact Bearings.
 * Standards: ISO 15, ISO 5753-1, DIN 625, DIN 635, DIN 5412, DIN 720.
 */

const BEARING_TYPES = {
    BALL: 'Bi Cầu Rãnh Sâu (Deep Groove Ball)',
    SPHERICAL: 'Bi Tang Trống Tự Lựa (Spherical Roller)',
    CYLINDRICAL: 'Bi Đũa Trụ Đỡ (Cylindrical Roller)',
    TAPER: 'Bi Côn Chịu Lực Hỗn Hợp (Tapered Roller)',
    ANGULAR: 'Bi Cầu Đỡ Chặn Góc (Angular Contact Ball)'
};

// BẢNG TRA KHE HỞ HƯỚNG TÂM BI CẦU (ISO 5753-1) - Đơn vị: µm (Min - Max)
const BALL_CLEARANCE_ISO5753 = [
    { dMin: 2.5, dMax: 10,  c2: [0, 7],   cn: [2, 13],  c3: [8, 23],   c4: [14, 29],  c5: [20, 37] },
    { dMin: 10,  dMax: 18,  c2: [0, 9],   cn: [3, 18],  c3: [11, 25],  c4: [18, 33],  c5: [25, 45] },
    { dMin: 18,  dMax: 24,  c2: [0, 10],  cn: [5, 20],  c3: [13, 28],  c4: [20, 36],  c5: [28, 48] },
    { dMin: 24,  dMax: 30,  c2: [1, 11],  cn: [5, 20],  c3: [13, 28],  c4: [23, 41],  c5: [30, 53] },
    { dMin: 30,  dMax: 40,  c2: [1, 11],  cn: [6, 20],  c3: [15, 33],  c4: [28, 46],  c5: [40, 64] },
    { dMin: 40,  dMax: 50,  c2: [1, 11],  cn: [6, 23],  c3: [18, 36],  c4: [30, 51],  c5: [45, 73] },
    { dMin: 50,  dMax: 65,  c2: [1, 15],  cn: [8, 28],  c3: [23, 43],  c4: [38, 61],  c5: [55, 90] },
    { dMin: 65,  dMax: 80,  c2: [1, 15],  cn: [10, 30], c3: [25, 51],  c4: [46, 71],  c5: [65, 105] },
    { dMin: 80,  dMax: 100, c2: [1, 18],  cn: [12, 36], c3: [30, 58],  c4: [53, 84],  c5: [75, 120] },
    { dMin: 100, dMax: 120, c2: [2, 20],  cn: [15, 41], c3: [36, 66],  c4: [61, 97],  c5: [90, 140] },
    { dMin: 120, dMax: 140, c2: [2, 23],  cn: [18, 48], c3: [41, 81],  c4: [71, 114], c5: [105, 160] },
    { dMin: 140, dMax: 160, c2: [2, 23],  cn: [18, 53], c3: [46, 91],  c4: [81, 130], c5: [120, 180] },
    { dMin: 160, dMax: 180, c2: [2, 25],  cn: [20, 61], c3: [53, 102], c4: [91, 147], c5: [135, 200] },
    { dMin: 180, dMax: 200, c2: [2, 30],  cn: [25, 71], c3: [63, 117], c4: [107, 163],c5: [150, 230] }
];

// BẢNG TRA KHE HỞ BI TANG TRỐNG TỰ LỰA LỖ THẲNG (ISO 5753-1) - Đơn vị: µm
const SPHERICAL_CLEARANCE_ISO5753 = [
    { dMin: 24,  dMax: 30,  c2: [15, 25],  cn: [25, 40],   c3: [40, 55],   c4: [55, 75],   c5: [75, 100] },
    { dMin: 30,  dMax: 40,  c2: [15, 30],  cn: [30, 45],   c3: [45, 60],   c4: [60, 80],   c5: [80, 100] },
    { dMin: 40,  dMax: 50,  c2: [20, 35],  cn: [35, 55],   c3: [55, 75],   c4: [75, 100],  c5: [100, 125] },
    { dMin: 50,  dMax: 65,  c2: [20, 40],  cn: [40, 65],   c3: [65, 90],   c4: [90, 120],  c5: [120, 150] },
    { dMin: 65,  dMax: 80,  c2: [30, 50],  cn: [50, 80],   c3: [80, 110],  c4: [110, 145], c5: [145, 180] },
    { dMin: 80,  dMax: 100, c2: [35, 60],  cn: [60, 100],  c3: [100, 135], c4: [135, 180], c5: [180, 225] },
    { dMin: 100, dMax: 120, c2: [40, 75],  cn: [75, 120],  c3: [120, 160], c4: [160, 210], c5: [210, 260] },
    { dMin: 120, dMax: 140, c2: [50, 95],  cn: [95, 145],  c3: [145, 190], c4: [190, 240], c5: [240, 300] },
    { dMin: 140, dMax: 160, c2: [60, 110], cn: [110, 170], c3: [170, 220], c4: [220, 280], c5: [280, 350] },
    { dMin: 160, dMax: 180, c2: [65, 120], cn: [120, 180], c3: [180, 240], c4: [240, 310], c5: [310, 390] },
    { dMin: 180, dMax: 200, c2: [70, 130], cn: [130, 200], c3: [200, 260], c4: [260, 340], c5: [340, 430] },
    { dMin: 200, dMax: 225, c2: [80, 140], cn: [140, 220], c3: [220, 290], c4: [290, 380], c5: [380, 470] },
    { dMin: 225, dMax: 250, c2: [90, 150], cn: [150, 240], c3: [240, 320], c4: [320, 420], c5: [420, 520] },
    { dMin: 250, dMax: 280, c2: [100, 170],cn: [170, 260], c3: [260, 350], c4: [350, 460], c5: [460, 570] },
    { dMin: 280, dMax: 315, c2: [110, 190],cn: [190, 280], c3: [280, 370], c4: [370, 500], c5: [500, 630] }
];

// ỐNG LÓT MĂNG XÔNG CÔN (ADAPTER SLEEVE) CHO BI TANG TRỐNG CÔN (TAPER 1:12)
const ADAPTER_SLEEVES = [
    { bearing: '22208 K', sleeve: 'H 308',  dShaft: 35,  thread: 'M40x1.5',  nut: 'KM 8',  washer: 'MB 8' },
    { bearing: '22209 K', sleeve: 'H 309',  dShaft: 40,  thread: 'M45x1.5',  nut: 'KM 9',  washer: 'MB 9' },
    { bearing: '22210 K', sleeve: 'H 310',  dShaft: 45,  thread: 'M50x1.5',  nut: 'KM 10', washer: 'MB 10' },
    { bearing: '22211 K', sleeve: 'H 311',  dShaft: 50,  thread: 'M55x2.0',  nut: 'KM 11', washer: 'MB 11' },
    { bearing: '22212 K', sleeve: 'H 312',  dShaft: 55,  thread: 'M60x2.0',  nut: 'KM 12', washer: 'MB 12' },
    { bearing: '22213 K', sleeve: 'H 313',  dShaft: 60,  thread: 'M65x2.0',  nut: 'KM 13', washer: 'MB 13' },
    { bearing: '22214 K', sleeve: 'H 314',  dShaft: 60,  thread: 'M70x2.0',  nut: 'KM 14', washer: 'MB 14' },
    { bearing: '22215 K', sleeve: 'H 315',  dShaft: 65,  thread: 'M75x2.0',  nut: 'KM 15', washer: 'MB 15' },
    { bearing: '22216 K', sleeve: 'H 316',  dShaft: 70,  thread: 'M80x2.0',  nut: 'KM 16', washer: 'MB 16' },
    { bearing: '22217 K', sleeve: 'H 317',  dShaft: 75,  thread: 'M85x2.0',  nut: 'KM 17', washer: 'MB 17' },
    { bearing: '22218 K', sleeve: 'H 318',  dShaft: 80,  thread: 'M90x2.0',  nut: 'KM 18', washer: 'MB 18' },
    { bearing: '22219 K', sleeve: 'H 319',  dShaft: 85,  thread: 'M95x2.0',  nut: 'KM 19', washer: 'MB 19' },
    { bearing: '22220 K', sleeve: 'H 320',  dShaft: 90,  thread: 'M100x2.0', nut: 'KM 20', washer: 'MB 20' },
    { bearing: '22222 K', sleeve: 'H 322',  dShaft: 100, thread: 'M110x2.0', nut: 'KM 22', washer: 'MB 22' },
    { bearing: '22224 K', sleeve: 'H 3124', dShaft: 110, thread: 'M120x2.0', nut: 'KM 24', washer: 'MB 24' },
    { bearing: '22226 K', sleeve: 'H 3126', dShaft: 115, thread: 'M130x2.0', nut: 'KM 26', washer: 'MB 26' },
    { bearing: '22228 K', sleeve: 'H 3128', dShaft: 125, thread: 'M140x2.0', nut: 'KM 28', washer: 'MB 28' },
    { bearing: '22230 K', sleeve: 'H 3130', dShaft: 135, thread: 'M150x2.0', nut: 'KM 30', washer: 'MB 30' },
    { bearing: '22312 K', sleeve: 'H 2312', dShaft: 55,  thread: 'M60x2.0',  nut: 'KM 12', washer: 'MB 12' },
    { bearing: '22314 K', sleeve: 'H 2314', dShaft: 60,  thread: 'M70x2.0',  nut: 'KM 14', washer: 'MB 14' },
    { bearing: '22316 K', sleeve: 'H 2316', dShaft: 70,  thread: 'M80x2.0',  nut: 'KM 16', washer: 'MB 16' },
    { bearing: '22318 K', sleeve: 'H 2318', dShaft: 80,  thread: 'M90x2.0',  nut: 'KM 18', washer: 'MB 18' },
    { bearing: '22320 K', sleeve: 'H 2320', dShaft: 90,  thread: 'M100x2.0', nut: 'KM 20', washer: 'MB 20' },
    { bearing: '22322 K', sleeve: 'H 2322', dShaft: 100, thread: 'M110x2.0', nut: 'KM 22', washer: 'MB 22' },
    { bearing: '22324 K', sleeve: 'H 2324', dShaft: 110, thread: 'M120x2.0', nut: 'KM 24', washer: 'MB 24' },
    { bearing: '22326 K', sleeve: 'H 2326', dShaft: 115, thread: 'M130x2.0', nut: 'KM 26', washer: 'MB 26' },
    { bearing: '22328 K', sleeve: 'H 2328', dShaft: 125, thread: 'M140x2.0', nut: 'KM 28', washer: 'MB 28' },
    { bearing: '22330 K', sleeve: 'H 2330', dShaft: 135, thread: 'M150x2.0', nut: 'KM 30', washer: 'MB 30' }
];

// DANH MỤC HƠN 200 MÃ VÒNG BI TIÊU CHUẨN CÔNG NGHIỆP PHỔ BIẾN NHẤT
const BEARING_DATABASE = [
    // ----------------- 60xx (Bi Cầu Dãy Mỏng) -----------------
    { code: '6000', type: BEARING_TYPES.BALL, d: 10, D: 26, B: 8,  C: 4.75, C0: 1.96, rpmG: 28000, rpmO: 34000, wt: 0.019, shaftFit: 'k5 / js6', housingFit: 'H7 / J7' },
    { code: '6001', type: BEARING_TYPES.BALL, d: 12, D: 28, B: 8,  C: 5.4,  C0: 2.36, rpmG: 26000, rpmO: 32000, wt: 0.022, shaftFit: 'k5 / js6', housingFit: 'H7 / J7' },
    { code: '6002', type: BEARING_TYPES.BALL, d: 15, D: 32, B: 9,  C: 5.85, C0: 2.85, rpmG: 22000, rpmO: 28000, wt: 0.030, shaftFit: 'k5 / js6', housingFit: 'H7 / J7' },
    { code: '6003', type: BEARING_TYPES.BALL, d: 17, D: 35, B: 10, C: 6.37, C0: 3.25, rpmG: 20000, rpmO: 24000, wt: 0.039, shaftFit: 'k5 / js6', housingFit: 'H7 / J7' },
    { code: '6004', type: BEARING_TYPES.BALL, d: 20, D: 42, B: 12, C: 9.95, C0: 5.0,  rpmG: 17000, rpmO: 20000, wt: 0.069, shaftFit: 'k5 / k6',  housingFit: 'H7 / J7' },
    { code: '6005', type: BEARING_TYPES.BALL, d: 25, D: 47, B: 12, C: 11.9, C0: 6.55, rpmG: 14000, rpmO: 17000, wt: 0.080, shaftFit: 'k5 / k6',  housingFit: 'H7 / J7' },
    { code: '6006', type: BEARING_TYPES.BALL, d: 30, D: 55, B: 13, C: 13.8, C0: 8.3,  rpmG: 12000, rpmO: 15000, wt: 0.12,  shaftFit: 'k5 / k6',  housingFit: 'H7 / J7' },
    { code: '6007', type: BEARING_TYPES.BALL, d: 35, D: 62, B: 14, C: 16.8, C0: 10.2, rpmG: 10000, rpmO: 13000, wt: 0.16,  shaftFit: 'k6 / m6',  housingFit: 'H7 / J7' },
    { code: '6008', type: BEARING_TYPES.BALL, d: 40, D: 68, B: 15, C: 17.8, C0: 11.6, rpmG: 9500,  rpmO: 12000, wt: 0.19,  shaftFit: 'k6 / m6',  housingFit: 'H7 / J7' },
    { code: '6009', type: BEARING_TYPES.BALL, d: 45, D: 75, B: 16, C: 21.6, C0: 14.6, rpmG: 8500,  rpmO: 10000, wt: 0.24,  shaftFit: 'k6 / m6',  housingFit: 'H7 / J7' },
    { code: '6010', type: BEARING_TYPES.BALL, d: 50, D: 80, B: 16, C: 22.9, C0: 16.6, rpmG: 8000,  rpmO: 9500,  wt: 0.26,  shaftFit: 'k6 / m6',  housingFit: 'H7 / J7' },
    { code: '6012', type: BEARING_TYPES.BALL, d: 60, D: 95, B: 18, C: 30.7, C0: 23.2, rpmG: 6700,  rpmO: 8000,  wt: 0.42,  shaftFit: 'm6 / n6',  housingFit: 'H7 / J7' },
    { code: '6015', type: BEARING_TYPES.BALL, d: 75, D: 115, B: 20, C: 41.6, C0: 33.5, rpmG: 5300, rpmO: 6300,  wt: 0.64,  shaftFit: 'm6 / n6',  housingFit: 'H7 / J7' },
    { code: '6020', type: BEARING_TYPES.BALL, d: 100, D: 150, B: 24, C: 63.7, C0: 54.0, rpmG: 4000, rpmO: 4800, wt: 1.25,  shaftFit: 'm6 / n6',  housingFit: 'H7 / J7' },

    // ----------------- 62xx (Bi Cầu Tiêu Chuẩn Phổ Biến Nhất) -----------------
    { code: '6200', type: BEARING_TYPES.BALL, d: 10, D: 30, B: 9,  C: 5.4,  C0: 2.36, rpmG: 22000, rpmO: 28000, wt: 0.032, shaftFit: 'k5 / js6', housingFit: 'H7 / J7' },
    { code: '6201', type: BEARING_TYPES.BALL, d: 12, D: 32, B: 10, C: 7.28, C0: 3.1,  rpmG: 20000, rpmO: 24000, wt: 0.037, shaftFit: 'k5 / js6', housingFit: 'H7 / J7' },
    { code: '6202', type: BEARING_TYPES.BALL, d: 15, D: 35, B: 11, C: 8.06, C0: 3.75, rpmG: 17000, rpmO: 20000, wt: 0.045, shaftFit: 'k5 / js6', housingFit: 'H7 / J7' },
    { code: '6203', type: BEARING_TYPES.BALL, d: 17, D: 40, B: 12, C: 9.95, C0: 4.75, rpmG: 15000, rpmO: 18000, wt: 0.065, shaftFit: 'k5 / js6', housingFit: 'H7 / J7' },
    { code: '6204', type: BEARING_TYPES.BALL, d: 20, D: 47, B: 14, C: 13.5, C0: 6.55, rpmG: 14000, rpmO: 17000, wt: 0.11,  shaftFit: 'k5 / k6',  housingFit: 'H7 / J7' },
    { code: '6205', type: BEARING_TYPES.BALL, d: 25, D: 52, B: 15, C: 14.8, C0: 7.8,  rpmG: 12000, rpmO: 14000, wt: 0.13,  shaftFit: 'k5 / k6',  housingFit: 'H7 / J7' },
    { code: '6206', type: BEARING_TYPES.BALL, d: 30, D: 62, B: 16, C: 20.3, C0: 11.2, rpmG: 10000, rpmO: 12000, wt: 0.20,  shaftFit: 'k5 / k6',  housingFit: 'H7 / J7' },
    { code: '6207', type: BEARING_TYPES.BALL, d: 35, D: 72, B: 17, C: 27.0, C0: 15.3, rpmG: 8500,  rpmO: 10000, wt: 0.29,  shaftFit: 'k6 / m6',  housingFit: 'H7 / J7' },
    { code: '6208', type: BEARING_TYPES.BALL, d: 40, D: 80, B: 18, C: 32.5, C0: 19.0, rpmG: 7500,  rpmO: 9000,  wt: 0.37,  shaftFit: 'k6 / m6',  housingFit: 'H7 / J7' },
    { code: '6209', type: BEARING_TYPES.BALL, d: 45, D: 85, B: 19, C: 35.1, C0: 21.6, rpmG: 7000,  rpmO: 8500,  wt: 0.41,  shaftFit: 'k6 / m6',  housingFit: 'H7 / J7' },
    { code: '6210', type: BEARING_TYPES.BALL, d: 50, D: 90, B: 20, C: 37.1, C0: 23.2, rpmG: 6300,  rpmO: 7500,  wt: 0.46,  shaftFit: 'k6 / m6',  housingFit: 'H7 / J7' },
    { code: '6211', type: BEARING_TYPES.BALL, d: 55, D: 100, B: 21, C: 46.2, C0: 29.0, rpmG: 5600, rpmO: 6700,  wt: 0.61,  shaftFit: 'k6 / m6',  housingFit: 'H7 / J7' },
    { code: '6212', type: BEARING_TYPES.BALL, d: 60, D: 110, B: 22, C: 55.3, C0: 36.0, rpmG: 5300, rpmO: 6300,  wt: 0.78,  shaftFit: 'm6 / n6',  housingFit: 'H7 / J7' },
    { code: '6213', type: BEARING_TYPES.BALL, d: 65, D: 120, B: 23, C: 60.5, C0: 41.5, rpmG: 4800, rpmO: 5600,  wt: 0.99,  shaftFit: 'm6 / n6',  housingFit: 'H7 / J7' },
    { code: '6214', type: BEARING_TYPES.BALL, d: 70, D: 125, B: 24, C: 65.0, C0: 44.0, rpmG: 4500, rpmO: 5300,  wt: 1.05,  shaftFit: 'm6 / n6',  housingFit: 'H7 / J7' },
    { code: '6215', type: BEARING_TYPES.BALL, d: 75, D: 130, B: 25, C: 68.9, C0: 49.0, rpmG: 4300, rpmO: 5000,  wt: 1.20,  shaftFit: 'm6 / n6',  housingFit: 'H7 / J7' },
    { code: '6216', type: BEARING_TYPES.BALL, d: 80, D: 140, B: 26, C: 76.1, C0: 55.0, rpmG: 4000, rpmO: 4800,  wt: 1.40,  shaftFit: 'm6 / n6',  housingFit: 'H7 / J7' },
    { code: '6218', type: BEARING_TYPES.BALL, d: 90, D: 160, B: 30, C: 101,  C0: 73.5, rpmG: 3600, rpmO: 4300,  wt: 2.15,  shaftFit: 'm6 / n6',  housingFit: 'H7 / J7' },
    { code: '6220', type: BEARING_TYPES.BALL, d: 100, D: 180, B: 34, C: 127, C0: 93.0, rpmG: 3200, rpmO: 3800,  wt: 3.15,  shaftFit: 'm6 / n6',  housingFit: 'H7 / J7' },

    // ----------------- 63xx (Bi Cầu Tải Nặng) -----------------
    { code: '6300', type: BEARING_TYPES.BALL, d: 10, D: 35, B: 11, C: 8.52, C0: 3.4,  rpmG: 20000, rpmO: 24000, wt: 0.053, shaftFit: 'k5 / js6', housingFit: 'H7 / J7' },
    { code: '6301', type: BEARING_TYPES.BALL, d: 12, D: 37, B: 12, C: 10.1, C0: 4.15, rpmG: 18000, rpmO: 22000, wt: 0.060, shaftFit: 'k5 / js6', housingFit: 'H7 / J7' },
    { code: '6302', type: BEARING_TYPES.BALL, d: 15, D: 42, B: 13, C: 11.9, C0: 5.4,  rpmG: 15000, rpmO: 18000, wt: 0.082, shaftFit: 'k5 / js6', housingFit: 'H7 / J7' },
    { code: '6303', type: BEARING_TYPES.BALL, d: 17, D: 47, B: 14, C: 14.3, C0: 6.55, rpmG: 13000, rpmO: 16000, wt: 0.12,  shaftFit: 'k5 / js6', housingFit: 'H7 / J7' },
    { code: '6304', type: BEARING_TYPES.BALL, d: 20, D: 52, B: 15, C: 16.8, C0: 7.8,  rpmG: 12000, rpmO: 14000, wt: 0.14,  shaftFit: 'k5 / k6',  housingFit: 'H7 / J7' },
    { code: '6305', type: BEARING_TYPES.BALL, d: 25, D: 62, B: 17, C: 23.4, C0: 11.6, rpmG: 10000, rpmO: 12000, wt: 0.23,  shaftFit: 'k5 / k6',  housingFit: 'H7 / J7' },
    { code: '6306', type: BEARING_TYPES.BALL, d: 30, D: 72, B: 19, C: 29.6, C0: 16.0, rpmG: 8500,  rpmO: 10000, wt: 0.35,  shaftFit: 'k5 / k6',  housingFit: 'H7 / J7' },
    { code: '6307', type: BEARING_TYPES.BALL, d: 35, D: 80, B: 21, C: 35.1, C0: 19.0, rpmG: 7500,  rpmO: 9000,  wt: 0.46,  shaftFit: 'k6 / m6',  housingFit: 'H7 / J7' },
    { code: '6308', type: BEARING_TYPES.BALL, d: 40, D: 90, B: 23, C: 42.3, C0: 24.0, rpmG: 6700,  rpmO: 8000,  wt: 0.63,  shaftFit: 'k6 / m6',  housingFit: 'H7 / J7' },
    { code: '6309', type: BEARING_TYPES.BALL, d: 45, D: 100, B: 25, C: 55.3, C0: 31.5, rpmG: 6000, rpmO: 7000,  wt: 0.83,  shaftFit: 'k6 / m6',  housingFit: 'H7 / J7' },
    { code: '6310', type: BEARING_TYPES.BALL, d: 50, D: 110, B: 27, C: 65.0, C0: 38.0, rpmG: 5300, rpmO: 6300,  wt: 1.05,  shaftFit: 'k6 / m6',  housingFit: 'H7 / J7' },
    { code: '6311', type: BEARING_TYPES.BALL, d: 55, D: 120, B: 29, C: 74.1, C0: 45.0, rpmG: 4800, rpmO: 5600,  wt: 1.35,  shaftFit: 'k6 / m6',  housingFit: 'H7 / J7' },
    { code: '6312', type: BEARING_TYPES.BALL, d: 60, D: 130, B: 31, C: 85.2, C0: 52.0, rpmG: 4500, rpmO: 5300,  wt: 1.70,  shaftFit: 'm6 / n6',  housingFit: 'H7 / J7' },
    { code: '6313', type: BEARING_TYPES.BALL, d: 65, D: 140, B: 33, C: 97.5, C0: 60.0, rpmG: 4000, rpmO: 4800,  wt: 2.10,  shaftFit: 'm6 / n6',  housingFit: 'H7 / J7' },
    { code: '6314', type: BEARING_TYPES.BALL, d: 70, D: 150, B: 35, C: 111,  C0: 68.0, rpmG: 3800, rpmO: 4500,  wt: 2.50,  shaftFit: 'm6 / n6',  housingFit: 'H7 / J7' },
    { code: '6315', type: BEARING_TYPES.BALL, d: 75, D: 160, B: 37, C: 119,  C0: 76.5, rpmG: 3600, rpmO: 4300,  wt: 3.00,  shaftFit: 'm6 / n6',  housingFit: 'H7 / J7' },
    { code: '6316', type: BEARING_TYPES.BALL, d: 80, D: 170, B: 39, C: 130,  C0: 86.5, rpmG: 3400, rpmO: 4000,  wt: 3.60,  shaftFit: 'm6 / n6',  housingFit: 'H7 / J7' },
    { code: '6318', type: BEARING_TYPES.BALL, d: 90, D: 190, B: 43, C: 151,  C0: 108,  rpmG: 3000, rpmO: 3600,  wt: 4.90,  shaftFit: 'm6 / n6',  housingFit: 'H7 / J7' },
    { code: '6320', type: BEARING_TYPES.BALL, d: 100, D: 215, B: 47, C: 178, C0: 140,  rpmG: 2600, rpmO: 3200,  wt: 7.00,  shaftFit: 'm6 / n6',  housingFit: 'H7 / J7' },

    // ----------------- 222xx (Bi Tang Trống Tự Lựa Tải Nặng - Hộp Số) -----------------
    { code: '22208', type: BEARING_TYPES.SPHERICAL, d: 40, D: 80, B: 23, C: 96.5,  C0: 90.0, rpmG: 6300, rpmO: 8000, wt: 0.52, shaftFit: 'k6 / m6', housingFit: 'H7 / J7' },
    { code: '22209', type: BEARING_TYPES.SPHERICAL, d: 45, D: 85, B: 23, C: 102,   C0: 98.0, rpmG: 5600, rpmO: 7500, wt: 0.57, shaftFit: 'k6 / m6', housingFit: 'H7 / J7' },
    { code: '22210', type: BEARING_TYPES.SPHERICAL, d: 50, D: 90, B: 23, C: 107,   C0: 108,  rpmG: 5300, rpmO: 7000, wt: 0.60, shaftFit: 'k6 / m6', housingFit: 'H7 / J7' },
    { code: '22211', type: BEARING_TYPES.SPHERICAL, d: 55, D: 100, B: 25, C: 129,  C0: 127,  rpmG: 4800, rpmO: 6300, wt: 0.81, shaftFit: 'k6 / m6', housingFit: 'H7 / J7' },
    { code: '22212', type: BEARING_TYPES.SPHERICAL, d: 60, D: 110, B: 28, C: 159,  C0: 166,  rpmG: 4300, rpmO: 5600, wt: 1.10, shaftFit: 'm6 / n6', housingFit: 'H7 / J7' },
    { code: '22213', type: BEARING_TYPES.SPHERICAL, d: 65, D: 120, B: 31, C: 198,  C0: 216,  rpmG: 3800, rpmO: 5000, wt: 1.50, shaftFit: 'm6 / n6', housingFit: 'H7 / J7' },
    { code: '22214', type: BEARING_TYPES.SPHERICAL, d: 70, D: 125, B: 31, C: 205,  C0: 228,  rpmG: 3600, rpmO: 4800, wt: 1.60, shaftFit: 'm6 / n6', housingFit: 'H7 / J7' },
    { code: '22215', type: BEARING_TYPES.SPHERICAL, d: 75, D: 130, B: 31, C: 212,  C0: 240,  rpmG: 3400, rpmO: 4500, wt: 1.70, shaftFit: 'm6 / n6', housingFit: 'H7 / J7' },
    { code: '22216', type: BEARING_TYPES.SPHERICAL, d: 80, D: 140, B: 33, C: 240,  C0: 270,  rpmG: 3200, rpmO: 4300, wt: 2.05, shaftFit: 'm6 / n6', housingFit: 'H7 / J7' },
    { code: '22217', type: BEARING_TYPES.SPHERICAL, d: 85, D: 150, B: 36, C: 285,  C0: 325,  rpmG: 3000, rpmO: 4000, wt: 2.60, shaftFit: 'm6 / n6', housingFit: 'H7 / J7' },
    { code: '22218', type: BEARING_TYPES.SPHERICAL, d: 90, D: 160, B: 40, C: 335,  C0: 375,  rpmG: 2800, rpmO: 3800, wt: 3.40, shaftFit: 'm6 / n6', housingFit: 'H7 / J7' },
    { code: '22219', type: BEARING_TYPES.SPHERICAL, d: 95, D: 170, B: 43, C: 390,  C0: 440,  rpmG: 2600, rpmO: 3400, wt: 4.25, shaftFit: 'm6 / n6', housingFit: 'H7 / J7' },
    { code: '22220', type: BEARING_TYPES.SPHERICAL, d: 100, D: 180, B: 46, C: 440, C0: 490,  rpmG: 2400, rpmO: 3200, wt: 4.90, shaftFit: 'm6 / n6', housingFit: 'H7 / J7' },
    { code: '22222', type: BEARING_TYPES.SPHERICAL, d: 110, D: 200, B: 53, C: 570, C0: 640,  rpmG: 2200, rpmO: 2800, wt: 7.00, shaftFit: 'n6 / p6', housingFit: 'H7 / J7' },
    { code: '22224', type: BEARING_TYPES.SPHERICAL, d: 120, D: 215, B: 58, C: 655, C0: 750,  rpmG: 2000, rpmO: 2600, wt: 8.60, shaftFit: 'n6 / p6', housingFit: 'H7 / J7' },
    { code: '22226', type: BEARING_TYPES.SPHERICAL, d: 130, D: 230, B: 64, C: 765, C0: 900,  rpmG: 1800, rpmO: 2400, wt: 10.5, shaftFit: 'n6 / p6', housingFit: 'H7 / J7' },
    { code: '22228', type: BEARING_TYPES.SPHERICAL, d: 140, D: 250, B: 68, C: 880, C0: 1040, rpmG: 1700, rpmO: 2200, wt: 13.5, shaftFit: 'n6 / p6', housingFit: 'H7 / J7' },
    { code: '22230', type: BEARING_TYPES.SPHERICAL, d: 150, D: 270, B: 73, C: 1020, C0: 1220, rpmG: 1600, rpmO: 2000, wt: 17.5, shaftFit: 'n6 / p6', housingFit: 'H7 / J7' },
    { code: '22232', type: BEARING_TYPES.SPHERICAL, d: 160, D: 290, B: 80, C: 1180, C0: 1430, rpmG: 1500, rpmO: 1900, wt: 22.0, shaftFit: 'n6 / p6', housingFit: 'H7 / J7' },
    { code: '22234', type: BEARING_TYPES.SPHERICAL, d: 170, D: 310, B: 86, C: 1340, C0: 1660, rpmG: 1400, rpmO: 1800, wt: 27.5, shaftFit: 'p6 / r6', housingFit: 'H7 / J7' },
    { code: '22236', type: BEARING_TYPES.SPHERICAL, d: 180, D: 320, B: 86, C: 1400, C0: 1760, rpmG: 1300, rpmO: 1700, wt: 29.0, shaftFit: 'p6 / r6', housingFit: 'H7 / J7' },
    { code: '22240', type: BEARING_TYPES.SPHERICAL, d: 200, D: 360, B: 98, C: 1760, C0: 2280, rpmG: 1200, rpmO: 1500, wt: 42.0, shaftFit: 'p6 / r6', housingFit: 'H7 / J7' },

    // ----------------- 223xx (Bi Tang Trống Siêu Tải Nặng) -----------------
    { code: '22310', type: BEARING_TYPES.SPHERICAL, d: 50, D: 110, B: 40, C: 232,  C0: 240,  rpmG: 4000, rpmO: 5300, wt: 1.90, shaftFit: 'k6 / m6', housingFit: 'H7 / J7' },
    { code: '22312', type: BEARING_TYPES.SPHERICAL, d: 60, D: 130, B: 46, C: 310,  C0: 325,  rpmG: 3400, rpmO: 4500, wt: 3.00, shaftFit: 'm6 / n6', housingFit: 'H7 / J7' },
    { code: '22314', type: BEARING_TYPES.SPHERICAL, d: 70, D: 150, B: 51, C: 415,  C0: 440,  rpmG: 3000, rpmO: 4000, wt: 4.40, shaftFit: 'm6 / n6', housingFit: 'H7 / J7' },
    { code: '22316', type: BEARING_TYPES.SPHERICAL, d: 80, D: 170, B: 58, C: 530,  C0: 560,  rpmG: 2600, rpmO: 3400, wt: 6.30, shaftFit: 'm6 / n6', housingFit: 'H7 / J7' },
    { code: '22318', type: BEARING_TYPES.SPHERICAL, d: 90, D: 190, B: 64, C: 655,  C0: 720,  rpmG: 2200, rpmO: 3000, wt: 8.80, shaftFit: 'm6 / n6', housingFit: 'H7 / J7' },
    { code: '22320', type: BEARING_TYPES.SPHERICAL, d: 100, D: 215, B: 73, C: 840, C0: 930,  rpmG: 2000, rpmO: 2600, wt: 13.0, shaftFit: 'm6 / n6', housingFit: 'H7 / J7' },
    { code: '22322', type: BEARING_TYPES.SPHERICAL, d: 110, D: 240, B: 80, C: 1020, C0: 1140, rpmG: 1800, rpmO: 2400, wt: 18.0, shaftFit: 'n6 / p6', housingFit: 'H7 / J7' },
    { code: '22324', type: BEARING_TYPES.SPHERICAL, d: 120, D: 260, B: 86, C: 1180, C0: 1340, rpmG: 1600, rpmO: 2200, wt: 22.5, shaftFit: 'n6 / p6', housingFit: 'H7 / J7' },
    { code: '22326', type: BEARING_TYPES.SPHERICAL, d: 130, D: 280, B: 93, C: 1370, C0: 1560, rpmG: 1500, rpmO: 2000, wt: 28.5, shaftFit: 'n6 / p6', housingFit: 'H7 / J7' },
    { code: '22328', type: BEARING_TYPES.SPHERICAL, d: 140, D: 300, B: 102, C: 1560, C0: 1800, rpmG: 1400, rpmO: 1800, wt: 35.5, shaftFit: 'n6 / p6', housingFit: 'H7 / J7' },
    { code: '22330', type: BEARING_TYPES.SPHERICAL, d: 150, D: 320, B: 108, C: 1760, C0: 2040, rpmG: 1300, rpmO: 1700, wt: 42.5, shaftFit: 'n6 / p6', housingFit: 'H7 / J7' },

    // ----------------- NU / NJ (Bi Đũa Trụ Đỡ Tải Trọng Hướng Tâm Cực Lớn) -----------------
    { code: 'NU 205', type: BEARING_TYPES.CYLINDRICAL, d: 25, D: 52, B: 15, C: 28.6, C0: 27.0, rpmG: 13000, rpmO: 15000, wt: 0.14, shaftFit: 'k5 / k6', housingFit: 'H7 / J7' },
    { code: 'NU 206', type: BEARING_TYPES.CYLINDRICAL, d: 30, D: 62, B: 16, C: 39.0, C0: 37.5, rpmG: 10000, rpmO: 12000, wt: 0.22, shaftFit: 'k5 / k6', housingFit: 'H7 / J7' },
    { code: 'NU 208', type: BEARING_TYPES.CYLINDRICAL, d: 40, D: 80, B: 18, C: 56.0, C0: 56.0, rpmG: 8000,  rpmO: 9500,  wt: 0.39, shaftFit: 'k6 / m6', housingFit: 'H7 / J7' },
    { code: 'NU 210', type: BEARING_TYPES.CYLINDRICAL, d: 50, D: 90, B: 20, C: 70.5, C0: 75.0, rpmG: 6700,  rpmO: 8000,  wt: 0.49, shaftFit: 'k6 / m6', housingFit: 'H7 / J7' },
    { code: 'NU 212', type: BEARING_TYPES.CYLINDRICAL, d: 60, D: 110, B: 22, C: 98.0, C0: 106, rpmG: 5600, rpmO: 6700,  wt: 0.83, shaftFit: 'm6 / n6', housingFit: 'H7 / J7' },
    { code: 'NU 215', type: BEARING_TYPES.CYLINDRICAL, d: 75, D: 130, B: 25, C: 132,  C0: 153, rpmG: 4500, rpmO: 5300,  wt: 1.25, shaftFit: 'm6 / n6', housingFit: 'H7 / J7' },
    { code: 'NU 220', type: BEARING_TYPES.CYLINDRICAL, d: 100, D: 180, B: 34, C: 240, C0: 290, rpmG: 3400, rpmO: 4000,  wt: 3.40, shaftFit: 'm6 / n6', housingFit: 'H7 / J7' },
    { code: 'NU 308', type: BEARING_TYPES.CYLINDRICAL, d: 40, D: 90, B: 23, C: 76.5, C0: 76.5, rpmG: 7000,  rpmO: 8500,  wt: 0.68, shaftFit: 'k6 / m6', housingFit: 'H7 / J7' },
    { code: 'NU 310', type: BEARING_TYPES.CYLINDRICAL, d: 50, D: 110, B: 27, C: 114, C0: 118,  rpmG: 5600, rpmO: 6700,  wt: 1.15, shaftFit: 'k6 / m6', housingFit: 'H7 / J7' },
    { code: 'NU 312', type: BEARING_TYPES.CYLINDRICAL, d: 60, D: 130, B: 31, C: 156, C0: 166,  rpmG: 4800, rpmO: 5600,  wt: 1.80, shaftFit: 'm6 / n6', housingFit: 'H7 / J7' },
    { code: 'NU 315', type: BEARING_TYPES.CYLINDRICAL, d: 75, D: 160, B: 37, C: 224, C0: 240,  rpmG: 3800, rpmO: 4500,  wt: 3.30, shaftFit: 'm6 / n6', housingFit: 'H7 / J7' },
    { code: 'NU 318', type: BEARING_TYPES.CYLINDRICAL, d: 90, D: 190, B: 43, C: 310, C0: 345,  rpmG: 3200, rpmO: 3800,  wt: 5.40, shaftFit: 'm6 / n6', housingFit: 'H7 / J7' },
    { code: 'NU 320', type: BEARING_TYPES.CYLINDRICAL, d: 100, D: 215, B: 47, C: 380, C0: 430, rpmG: 2800, rpmO: 3400,  wt: 7.70, shaftFit: 'm6 / n6', housingFit: 'H7 / J7' },
    { code: 'NU 324', type: BEARING_TYPES.CYLINDRICAL, d: 120, D: 260, B: 55, C: 520, C0: 600, rpmG: 2200, rpmO: 2800,  wt: 13.5, shaftFit: 'n6 / p6', housingFit: 'H7 / J7' },

    // ----------------- 302xx / 322xx (Bi Côn Tải Hỗn Hợp Trục & Hướng Tâm) -----------------
    { code: '30205', type: BEARING_TYPES.TAPER, d: 25, D: 52, B: 16.25, C: 32.5, C0: 33.5, rpmG: 8500, rpmO: 11000, wt: 0.15, shaftFit: 'k6 / m6', housingFit: 'H7 / J7' },
    { code: '30206', type: BEARING_TYPES.TAPER, d: 30, D: 62, B: 17.25, C: 44.0, C0: 46.5, rpmG: 7000, rpmO: 9500,  wt: 0.24, shaftFit: 'k6 / m6', housingFit: 'H7 / J7' },
    { code: '30207', type: BEARING_TYPES.TAPER, d: 35, D: 72, B: 18.25, C: 57.0, C0: 60.0, rpmG: 6000, rpmO: 8000,  wt: 0.33, shaftFit: 'k6 / m6', housingFit: 'H7 / J7' },
    { code: '30208', type: BEARING_TYPES.TAPER, d: 40, D: 80, B: 19.75, C: 69.5, C0: 75.0, rpmG: 5300, rpmO: 7000,  wt: 0.44, shaftFit: 'k6 / m6', housingFit: 'H7 / J7' },
    { code: '30210', type: BEARING_TYPES.TAPER, d: 50, D: 90, B: 21.75, C: 88.0, C0: 100,  rpmG: 4500, rpmO: 6000,  wt: 0.58, shaftFit: 'm6 / n6', housingFit: 'H7 / J7' },
    { code: '30308', type: BEARING_TYPES.TAPER, d: 40, D: 90, B: 25.25, C: 96.5, C0: 104,  rpmG: 4800, rpmO: 6300,  wt: 0.73, shaftFit: 'm6 / n6', housingFit: 'H7 / J7' },
    { code: '30310', type: BEARING_TYPES.TAPER, d: 50, D: 110, B: 29.25, C: 137, C0: 153,  rpmG: 3800, rpmO: 5000,  wt: 1.25, shaftFit: 'm6 / n6', housingFit: 'H7 / J7' },
    { code: '32210', type: BEARING_TYPES.TAPER, d: 50, D: 90, B: 24.75, C: 104, C0: 122,  rpmG: 4500, rpmO: 6000,  wt: 0.65, shaftFit: 'm6 / n6', housingFit: 'H7 / J7' },
    { code: '32212', type: BEARING_TYPES.TAPER, d: 60, D: 110, B: 29.75, C: 156, C0: 186, rpmG: 3600, rpmO: 4800,  wt: 1.20, shaftFit: 'm6 / n6', housingFit: 'H7 / J7' },
    { code: '32215', type: BEARING_TYPES.TAPER, d: 75, D: 130, B: 33.25, C: 200, C0: 255, rpmG: 3000, rpmO: 4000,  wt: 1.85, shaftFit: 'm6 / n6', housingFit: 'H7 / J7' },
    { code: '32218', type: BEARING_TYPES.TAPER, d: 90, D: 160, B: 42.5,  C: 300, C0: 390, rpmG: 2400, rpmO: 3200,  wt: 3.65, shaftFit: 'n6 / p6', housingFit: 'H7 / J7' },
    { code: '32220', type: BEARING_TYPES.TAPER, d: 100, D: 180, B: 49.0, C: 380, C0: 510, rpmG: 2200, rpmO: 3000,  wt: 5.30, shaftFit: 'n6 / p6', housingFit: 'H7 / J7' },

    // ----------------- 72xx / 73xx (Bi Cầu Đỡ Chặn Góc 40°) -----------------
    { code: '7206 B', type: BEARING_TYPES.ANGULAR, d: 30, D: 62, B: 16, C: 23.8, C0: 15.0, rpmG: 9500, rpmO: 13000, wt: 0.20, shaftFit: 'k5 / js6', housingFit: 'H7 / J7' },
    { code: '7208 B', type: BEARING_TYPES.ANGULAR, d: 40, D: 80, B: 18, C: 37.7, C0: 26.0, rpmG: 7500, rpmO: 10000, wt: 0.38, shaftFit: 'k6 / m6',  housingFit: 'H7 / J7' },
    { code: '7210 B', type: BEARING_TYPES.ANGULAR, d: 50, D: 90, B: 20, C: 41.6, C0: 31.5, rpmG: 6300, rpmO: 8500,  wt: 0.48, shaftFit: 'k6 / m6',  housingFit: 'H7 / J7' },
    { code: '7310 B', type: BEARING_TYPES.ANGULAR, d: 50, D: 110, B: 27, C: 76.1, C0: 53.0, rpmG: 5000, rpmO: 7000,  wt: 1.10, shaftFit: 'k6 / m6',  housingFit: 'H7 / J7' },
    { code: '7312 B', type: BEARING_TYPES.ANGULAR, d: 60, D: 130, B: 31, C: 99.5, C0: 71.0, rpmG: 4300, rpmO: 6000,  wt: 1.80, shaftFit: 'm6 / n6',  housingFit: 'H7 / J7' },
    { code: '7315 B', type: BEARING_TYPES.ANGULAR, d: 75, D: 160, B: 37, C: 138, C0: 106,  rpmG: 3400, rpmO: 4800,  wt: 3.20, shaftFit: 'm6 / n6',  housingFit: 'H7 / J7' }
];
