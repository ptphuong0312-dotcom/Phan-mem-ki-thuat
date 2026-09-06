/**
 * GEAR RATIO & KINEMATICS CALCULATOR ENGINE (js/gearRatioCalculator.js)
 * TÍNH TOÁN TỈ SỐ TRUYỀN & ĐỘNG HỌC HỘP GIẢM TỐC CÔNG NGHIỆP
 */

(function(root) {
    'use strict';

    const GearCalc = {
        // Module 1: Tính Động Học Cơ Bản
        calcBasic: function(n1, n2, P, eta) {
            n1 = parseFloat(n1) || 0;
            n2 = parseFloat(n2) || 0;
            P = parseFloat(P) || 0;
            eta = parseFloat(eta) || 95; // %

            if (n1 <= 0 || n2 <= 0) {
                return { error: "Tốc độ n1 và n2 phải lớn hơn 0" };
            }

            const i = n1 / n2;
            const eta_dec = eta / 100;
            const T1 = (P > 0 && n1 > 0) ? (9550 * P) / n1 : 0; // Nm
            const T2_ideal = T1 * i;
            const T2_real = T2_ideal * eta_dec;
            const Ploss = P * (1 - eta_dec);

            return {
                i: i,
                T1: T1,
                T2_ideal: T2_ideal,
                T2_real: T2_real,
                Ploss: Ploss,
                n1: n1,
                n2: n2,
                P: P,
                eta: eta
            };
        },

        // Module 2: Tính Số Răng Các Cặp Bánh Răng (1 to 4 stages)
        calcMultiStage: function(stages, P, n1, etaTotal) {
            P = parseFloat(P) || 0;
            n1 = parseFloat(n1) || 1450;
            etaTotal = parseFloat(etaTotal) || 95;

            let totalRatio = 1.0;
            let stageResults = [];
            let current_n = n1;
            let current_T = (P > 0 && n1 > 0) ? (9550 * P) / n1 : 0;
            const etaPerStage = Math.pow(etaTotal / 100, 1 / stages.length);

            for (let k = 0; k < stages.length; k++) {
                const z_pinion = parseInt(stages[k].z1) || 1;
                const z_wheel = parseInt(stages[k].z2) || 1;
                const ik = z_wheel / z_pinion;
                totalRatio *= ik;

                const n_out = current_n / ik;
                const T_out = current_T * ik * etaPerStage;

                stageResults.push({
                    stageNum: k + 1,
                    z1: z_pinion,
                    z2: z_wheel,
                    ik: ik,
                    n_in: current_n,
                    n_out: n_out,
                    T_in: current_T,
                    T_out: T_out
                });

                current_n = n_out;
                current_T = T_out;
            }

            return {
                stages: stageResults,
                totalRatio: totalRatio,
                n1: n1,
                n_out_final: current_n,
                T1: (P > 0 && n1 > 0) ? (9550 * P) / n1 : 0,
                T_out_final: current_T,
                P: P
            };
        },

        // Module 3: Hệ Bánh Răng Hành Tinh (Planetary 2K-H)
        calcPlanetary: function(za, zg, zb, k, n1, P) {
            za = parseInt(za) || 20; // Sun
            zg = parseInt(zg) || 30; // Planet
            zb = parseInt(zb) || 80; // Ring
            k = parseInt(k) || 3;    // Planet count
            n1 = parseFloat(n1) || 1450;
            P = parseFloat(P) || 0;

            // Ratio: Fixed ring gear, sun input, carrier output
            const i = 1 + (zb / za);
            const n_out = n1 / i;
            const T1 = (P > 0 && n1 > 0) ? (9550 * P) / n1 : 0;
            const eta = 0.97;
            const T2 = T1 * i * eta;

            // 1. Điều kiện đồng trục (Coaxiality condition): zb = za + 2*zg
            const coaxial_req = za + 2 * zg;
            const is_coaxial = (zb === coaxial_req);

            // 2. Điều kiện lắp ráp (Assembly condition): (za + zb) / k phải là số nguyên
            const is_assembly = ((za + zb) % k === 0);

            // 3. Điều kiện lân cận (Adjacency condition): (za + zg)*sin(pi/k) > zg + 2
            const leftSide = (za + zg) * Math.sin(Math.PI / k);
            const rightSide = zg + 2;
            const is_adjacent = (leftSide > rightSide);

            return {
                i: i,
                za: za,
                zg: zg,
                zb: zb,
                k: k,
                n1: n1,
                n_out: n_out,
                T1: T1,
                T2: T2,
                is_coaxial: is_coaxial,
                coaxial_req: coaxial_req,
                is_assembly: is_assembly,
                assembly_val: (za + zb) / k,
                is_adjacent: is_adjacent,
                adjacent_left: leftSide.toFixed(2),
                adjacent_right: rightSide.toFixed(2)
            };
        },

        // Module 4: Trục Vít - Bánh Vít & Cycloid
        calcWorm: function(z1, z2, m, q, n1, P) {
            z1 = parseInt(z1) || 1; // Số đầu mối ren
            z2 = parseInt(z2) || 40; // Số răng bánh vít
            m = parseFloat(m) || 6;  // Modun (mm)
            q = parseFloat(q) || 10; // Hệ số đường kính trục vít
            n1 = parseFloat(n1) || 1450;
            P = parseFloat(P) || 0;

            const i = z2 / z1;
            const n2 = n1 / i;
            const gamma_rad = Math.atan(z1 / q); // Góc nâng ren
            const gamma_deg = (gamma_rad * 180) / Math.PI;

            // Hiệu suất trục vít xấp xỉ theo số đầu mối
            let eta = 0.70;
            if (z1 === 2) eta = 0.80;
            if (z1 >= 4) eta = 0.88;

            const T1 = (P > 0 && n1 > 0) ? (9550 * P) / n1 : 0;
            const T2 = T1 * i * eta;

            // Đường kính chia
            const d1 = q * m;
            const d2 = z2 * m;
            const aw = 0.5 * m * (q + z2);

            return {
                i: i,
                z1: z1,
                z2: z2,
                m: m,
                q: q,
                d1: d1,
                d2: d2,
                aw: aw,
                gamma_deg: gamma_deg.toFixed(2),
                eta: (eta * 100).toFixed(0),
                n1: n1,
                n2: n2,
                T1: T1,
                T2: T2
            };
        },

        calcCyclo: function(z_pins, n1, P) {
            z_pins = parseInt(z_pins) || 43; // Số chốt kim vành vỏ
            n1 = parseFloat(n1) || 1450;
            P = parseFloat(P) || 0;

            const z_disc = z_pins - 1; // Số răng đĩa cycloid
            const i = z_disc; // 1 cấp cycloid i = z_disc
            const n2 = n1 / i;
            const eta = 0.94;

            const T1 = (P > 0 && n1 > 0) ? (9550 * P) / n1 : 0;
            const T2 = T1 * i * eta;

            return {
                z_pins: z_pins,
                z_disc: z_disc,
                i: i,
                n1: n1,
                n2: n2,
                eta: 94,
                T1: T1,
                T2: T2
            };
        },

        // Module 5: Phân Phối Tỉ Số Truyền Tối Ưu
        calcOptimalDistribution: function(i_total, stages_type) {
            i_total = parseFloat(i_total) || 20;

            if (stages_type === 2) {
                const i1 = 1.22 * Math.sqrt(i_total);
                const i2 = i_total / i1;

                return {
                    stages: 2,
                    i_total: i_total,
                    i1: i1,
                    i2: i2,
                    suggested_gears: [
                        { stage: 1, i: i1.toFixed(2), z1: 21, z2: Math.round(21 * i1) },
                        { stage: 2, i: i2.toFixed(2), z1: 23, z2: Math.round(23 * i2) }
                    ]
                };
            } else if (stages_type === 3) {
                const i1 = 1.30 * Math.pow(i_total, 0.40);
                const i2 = 1.05 * Math.pow(i_total, 0.35);
                const i3 = i_total / (i1 * i2);

                return {
                    stages: 3,
                    i_total: i_total,
                    i1: i1,
                    i2: i2,
                    i3: i3,
                    suggested_gears: [
                        { stage: 1, i: i1.toFixed(2), z1: 21, z2: Math.round(21 * i1) },
                        { stage: 2, i: i2.toFixed(2), z1: 23, z2: Math.round(23 * i2) },
                        { stage: 3, i: i3.toFixed(2), z1: 25, z2: Math.round(25 * i3) }
                    ]
                };
            }
        }
    };

    if (typeof module !== 'undefined' && module.exports) {
        module.exports = GearCalc;
    }
    root.GearCalc = GearCalc;
})(typeof window !== 'undefined' ? window : global);
