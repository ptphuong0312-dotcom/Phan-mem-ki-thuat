import re
import json
import csv

def parse_file(filename):
    threads = []
    
    with open(filename, 'r', encoding='utf-8') as f:
        lines = f.readlines()
        
    current_system = ""
    current_type = ""
    priority = 50
    
    for line in lines:
        line = line.strip()
        if not line:
            continue
            
        if line.startswith("BẢNG 1: BẢNG TRA REN MÉT THÔ"):
            current_system = "ISO Metric"
            current_type = "Metric Coarse Thread"
            priority = 10
            continue
        elif line.startswith("BẢNG 2: BẢNG TRA REN MÉT MỊN"):
            current_system = "ISO Metric"
            current_type = "Metric Fine Thread"
            priority = 10
            continue
        elif line.startswith("BẢNG 1: TẤT CẢ CÁC KÍCH THƯỚC REN MỸ THÔ"):
            current_system = "Unified Inch (UN/UNC/UNF)"
            current_type = "UNC Thread ANSI/ASME B1.1"
            priority = 50
            continue
        elif line.startswith("BẢNG 2: TẤT CẢ CÁC KÍCH THƯỚC REN MỸ MỊN"):
            current_system = "Unified Inch (UN/UNC/UNF)"
            current_type = "UNF Thread ANSI/ASME B1.1"
            priority = 50
            continue
        elif line.startswith("BẢNG 3: TẤT CẢ CÁC KÍCH THƯỚC REN MỸ RẤT MỊN"):
            current_system = "Unified Inch (UN/UNC/UNF)"
            current_type = "UNEF Thread ANSI/ASME B1.1"
            priority = 50
            continue
        elif line.startswith("BẢNG 1: BẢNG TRA REN G"):
            current_system = "Pipe Thread"
            current_type = "G (BSPP) Pipe Thread"
            priority = 50
            continue
        elif line.startswith("BẢNG 2: BẢNG TRA REN R / Rc"):
            current_system = "Pipe Thread"
            current_type = "R/Rc (BSPT) Pipe Thread"
            priority = 50
            continue
        elif line.startswith("BẢNG 3: BẢNG TRA REN NPT"):
            current_system = "Pipe Thread"
            current_type = "NPT Pipe Thread"
            priority = 50
            continue
        elif line.startswith("BẢNG 1: BẢNG TRA REN THANG METRIC"):
            current_system = "Trapezoidal / ACME"
            current_type = "Trapezoidal Thread (Tr)"
            priority = 50
            continue
        elif line.startswith("BẢNG 2: BẢNG TRA REN ACME HỆ INCH"):
            current_system = "Trapezoidal / ACME"
            current_type = "ACME Thread"
            priority = 50
            continue
        elif line.startswith("BẢNG 3: BẢNG TRA REN RĂNG CƯA METRIC"):
            current_system = "Specialty"
            current_type = "Sawtooth Thread (S)"
            priority = 50
            continue
        elif line.startswith("BẢNG 4: BẢNG TRA REN TRÒN"):
            current_system = "Specialty"
            current_type = "Round Thread (Rd)"
            priority = 50
            continue
            
        elif line.startswith("BẢNG 1: BẢNG TRA DÒNG REN HÀNG KHÔNG VŨ TRỤ"):
            current_system = "Unified Inch (UN/UNC/UNF)"
            current_type = "UNJ Aerospace Thread AS8879"
            priority = 50
            continue
        elif line.startswith("BẢNG 1: BẢNG TRA REN UNR SERIES"):
            current_system = "Unified Inch (UN/UNC/UNF)"
            current_type = "UNR Thread ANSI/ASME B1.1"
            priority = 50
            continue
        elif line.startswith("BẢNG 2: BẢNG TRA REN UNS SERIES"):
            current_system = "Unified Inch (UN/UNC/UNF)"
            current_type = "UNS Thread ANSI/ASME B1.1"
            priority = 50
            continue
        elif line.startswith("BẢNG 1: DÒNG 8-UN") or line.startswith("BẢNG 2: DÒNG 12-UN") or line.startswith("BẢNG 3: DÒNG 16-UN") or line.startswith("BẢNG 4: DÒNG REN BƯỚC LỚN CỐ ĐỊNH") or line.startswith("BẢNG 5: DÒNG REN SIÊU MỊN CỐ ĐỊNH"):
            current_system = "Unified Inch (UN/UNC/UNF)"
            current_type = "UN Constant Pitch Thread ANSI/ASME B1.1"
            priority = 50
            continue
            
        if "Kích thước danh nghĩa" in line or "Công thức" in line or "Ghi chú" in line or "Bao gồm" in line or "Tiêu chuẩn" in line or "Đặc tính" in line or "Góc đỉnh ren" in line or "Góc mặt chịu lực" in line or "Ứng dụng chính" in line:
            continue
            
        parts = line.split(',')
        if len(parts) >= 5:
            if line.startswith('"'):
                match = re.match(r'"([^"]+)""([^"]+)",([^,]+),([^,]+),([^,]+),([^,]+)', line)
                if match:
                    size = match.group(1) + '"' + match.group(2)
                    pitch = match.group(3)
                    tapDrill = match.group(4)
                    majorDia = match.group(5)
                    actualMajorDia = match.group(6)
                else:
                    reader = csv.reader([line])
                    parsed_parts = next(reader)
                    size = parsed_parts[0].replace('""', '"')
                    pitch = parsed_parts[1]
                    tapDrill = parsed_parts[2]
                    majorDia = parsed_parts[3]
                    actualMajorDia = parsed_parts[4]
            else:
                size = parts[0]
                pitch = parts[1]
                tapDrill = parts[2]
                majorDia = parts[3]
                actualMajorDia = parts[4]
                
            try:
                major_float = float(majorDia)
            except:
                major_float = majorDia
                
            base_id = re.sub(r'[^a-zA-Z0-9_]', '_', current_type + "_" + size)
            
            threads.append({
                "id": base_id,
                "system": current_system,
                "type": current_type,
                "size": size,
                "pitch": pitch,
                "majorDia": major_float,
                "tapDrill": tapDrill,
                "actualMajorDia": actualMajorDia,
                "priority": priority
            })
            
    return threads

def parse_all():
    threads = []
    threads.extend(parse_file('raw_data.csv'))
    threads.extend(parse_file('raw_data_2.csv'))
    threads.extend(parse_file('raw_data_3.csv'))
    threads.extend(parse_file('raw_data_4.csv'))
    threads.extend(parse_file('raw_data_5.csv'))
    
    with open('js/data.js', 'w', encoding='utf-8') as f:
        f.write("const threadData = " + json.dumps(threads, indent=4) + ";\n")

if __name__ == "__main__":
    parse_all()
    print("Done")
