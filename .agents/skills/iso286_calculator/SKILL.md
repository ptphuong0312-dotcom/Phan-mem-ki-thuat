---
name: iso286-calculator
description: Comprehensive knowledge base on calculating ISO 286 limit and fit tolerances accurately, including subdivided size ranges and special deviation rules.
---

# ISO 286 Limit and Fit Tolerances Calculation

This skill provides the core logic and context for calculating ISO 286 tolerances precisely, accounting for nuances that many simplistic implementations miss.

## Key Concepts

1. **Subdivided Size Ranges for Fundamental Deviations**
   Standard IT grades and Delta values use the standard 13 size ranges (0-3, 3-6, 6-10, 10-18, 18-30, 30-50, 50-80, 80-120, 120-180, 180-250, 250-315, 315-400, 400-500).
   However, fundamental deviations for letters like **a, b, c** (and others) DO NOT use these 13 ranges. They subdivide them (e.g., 80-100 and 100-120). 
   *Rule:* Never use a static 13-range array for fundamental deviations. Always use the pre-calculated `iso286_clean.js` which maps `min` and `max` exactly for each size and letter.

2. **Special Rules for 'j' and 'J'**
   - Shaft `j` in IT grades 5, 6, 7, 8 has specialized deviations.
   - Hole `J` in IT grades 6, 7, 8 has specialized deviations.

3. **Special Rules for 'k' Shaft**
   - For `k` grades <= 3 or >= 8, the lower deviation `ei` is **0**.
   - For `k` grades 4-7, `ei` is the value from the fundamental deviation table.

4. **Special Rules for 'K, M, N' and others (Delta Rule)**
   - The Delta ($\Delta$) offset applies to holes K, M, N (grades <= 8) and P-ZC (grades <= 7).
   - `ES = -ei(shaft) + delta`. 

## Cấu trúc mã nguồn & UI (Architecture & UI)
- **js/toleranceCalculator.js**: Động cơ tính toán (Calculation Engine) và Quản lý giao diện cho tab "Tính Toán Dung Sai". Xử lý toàn bộ logic nội suy nội suy `getIT`, tính sai lệch `getFundamentalDeviation` và vẽ sơ đồ `renderSvgChart`.
- **js/iso286_data.js**: Chứa toàn bộ dữ liệu Matrix gốc (mảng 2 chiều và các hệ số IT).
- **index.html**: Chứa layout giao diện (với các tab rời như Hệ Thống Lỗ Cơ Bản, Hệ Thống Trục Cơ Bản, Tính Toán Dung Sai).

> Tham khảo `.agents/rules/ui_guidelines.md` để giữ tính nhất quán về mặt giao diện thiết kế khi cập nhật ứng dụng.

## Calculation Engine V2 Structure
The mathematical engine for calculating these fits is locked in the [isoCalculatorV2.js](file:///home/asd/Google%20Antigravity/Tra%20Cuu%20Ren/.agents/skills/iso286_calculator/code/isoCalculatorV2.js) file within this skill.
It relies on [iso286_clean.js](file:///home/asd/Google%20Antigravity/Tra%20Cuu%20Ren/.agents/skills/iso286_calculator/code/iso286_clean.js) which defines exact data matrices. 
When rewriting or building new applications, copy these two files as the master calculation engine.

## Intermediate Tolerances
- **CD, EF, FG:** Primarily used for fine mechanics / watchmaking (defined up to small sizes).
- **ZA, ZB, ZC:** Extreme interference fits, only defined for large nominal sizes (>160mm) and will return 'null' or undefined for small sizes.
