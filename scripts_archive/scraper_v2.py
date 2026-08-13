import urllib.request
import re
import json
import time

URLS = [
"https://www.gewinde-normen.de/en/specifications.html",
"https://www.gewinde-normen.de/en/iso-coarse-thread.html",
"https://www.gewinde-normen.de/en/iso-fine-thread.html",
"https://www.gewinde-normen.de/en/iso-fine-thread-2.html",
"https://www.gewinde-normen.de/en/iso-fine-thread-3.html",
"https://www.gewinde-normen.de/en/iso-fine-thread-4.html",
"https://www.gewinde-normen.de/en/iso-fine-thread-5.html",
"https://www.gewinde-normen.de/en/iso-fine-thread-6.html",
"https://www.gewinde-normen.de/en/iso-fine-thread-7.html",
"https://www.gewinde-normen.de/en/iso-fine-thread-8.html",
"https://www.gewinde-normen.de/en/iso-fine-thread-9.html",
"https://www.gewinde-normen.de/en/iso-fine-thread-10.html",
"https://www.gewinde-normen.de/en/knuckle-thread-din-405.html",
"https://www.gewinde-normen.de/en/knuckle-thread-din-20400.html",
"https://www.gewinde-normen.de/en/buttress-fine-thread.html",
"https://www.gewinde-normen.de/en/buttress-coarse-thread.html",
"https://www.gewinde-normen.de/en/buttress-thread-45.html",
"https://www.gewinde-normen.de/en/trapezoidal-fine-thread.html",
"https://www.gewinde-normen.de/en/trapezoidal-coarse-thread.html",
"https://www.gewinde-normen.de/en/valve-thread.html",
"https://www.gewinde-normen.de/en/cycle-thread.html",
"https://www.gewinde-normen.de/en/pg-thread.html",
"https://www.gewinde-normen.de/en/metric-taper-pipe-din-158.html",
"https://www.gewinde-normen.de/en/dairy-coupling.html",
"https://www.gewinde-normen.de/en/e-thread.html",
"https://www.gewinde-normen.de/en/glass-thread.html",
"https://www.gewinde-normen.de/en/knuckle-thread-din-168.html",
"https://www.gewinde-normen.de/en/KS-KT-thread.html",
"https://www.gewinde-normen.de/en/camera-mount.html",
"https://www.gewinde-normen.de/en/sh-thread.html",
"https://www.gewinde-normen.de/en/sewing-machine-thread.html",
"https://www.gewinde-normen.de/en/cei-thread.html",
"https://www.gewinde-normen.de/en/loewenherz-thread.html",
"https://www.gewinde-normen.de/en/bodmer-thread.html",
"https://www.gewinde-normen.de/en/french-thread.html",
"https://www.gewinde-normen.de/en/vdi-thread.html",
"https://www.gewinde-normen.de/en/ducommun-steinle-thread.html",
"https://www.gewinde-normen.de/en/hamann-patronen-thread.html",
"https://www.gewinde-normen.de/en/thury-thread.html",
"https://www.gewinde-normen.de/en/whitworth-instrument-thread.html",
"https://www.gewinde-normen.de/en/whitworth-fine-thread-din-239.html",
"https://www.gewinde-normen.de/en/whitworth-fine-thread-din-240.html",
"https://www.gewinde-normen.de/en/whitworth-fine-thread-din-282.html",
"https://www.gewinde-normen.de/en/whitworth-fine-thread-special.html",
"https://www.gewinde-normen.de/en/whitworth-fine-thread-din-286.html",
"https://www.gewinde-normen.de/en/whitworth-fine-thread-din-287.html",
"https://www.gewinde-normen.de/en/sj-thread.html",
"https://www.gewinde-normen.de/en/sellers-thread.html",
"https://www.gewinde-normen.de/en/unified-coarse-thread.html",
"https://www.gewinde-normen.de/en/unified-extra-fine-thread.html",
"https://www.gewinde-normen.de/en/unified-fine-thread.html",
"https://www.gewinde-normen.de/en/unified-miniature-thread.html",
"https://www.gewinde-normen.de/en/unified-special-r-thread.html",
"https://www.gewinde-normen.de/en/unified-special-thread.html",
"https://www.gewinde-normen.de/en/8-un-thread.html",
"https://www.gewinde-normen.de/en/12-un-thread.html",
"https://www.gewinde-normen.de/en/16-un-thread.html",
"https://www.gewinde-normen.de/en/20-un-thread.html",
"https://www.gewinde-normen.de/en/npt-pipe-thread.html",
"https://www.gewinde-normen.de/en/nptf-pipe-thread.html",
"https://www.gewinde-normen.de/en/npsc-pipe-thread.html",
"https://www.gewinde-normen.de/en/npsf-pipe-thread.html",
"https://www.gewinde-normen.de/en/npsl-pipe-thread.html",
"https://www.gewinde-normen.de/en/npsm-pipe-thread.html",
"https://www.gewinde-normen.de/en/acme-thread.html",
"https://www.gewinde-normen.de/en/stub-acme-thread.html",
"https://www.gewinde-normen.de/en/sharp-v-thread.html",
"https://www.gewinde-normen.de/en/me-thread.html",
"https://www.gewinde-normen.de/en/ba-thread.html",
"https://www.gewinde-normen.de/en/bsb-thread.html",
"https://www.gewinde-normen.de/en/whitworth-fine-thread.html",
"https://www.gewinde-normen.de/en/whitworth-coarse-thread.html",
"https://www.gewinde-normen.de/en/whitworth-pipe-thread.html",
"https://www.gewinde-normen.de/en/tapered-whitworth-pipe-thread.html"
]

def clean_html(raw_html):
    import html
    cleanr = re.compile('<.*?>')
    cleantext = re.sub(cleanr, '', raw_html)
    return html.unescape(cleantext).strip().replace('\xa0', ' ').replace('\r\n', ' ').replace('\n', ' ')

def extract_table_rows(html_content):
    # Find table with class="content"
    table_match = re.search(r'<table class="content"[^>]*>(.*?)</table>', html_content, re.DOTALL | re.IGNORECASE)
    if not table_match:
        return []
    table_content = table_match.group(1)
    
    rows = []
    tr_matches = re.finditer(r'<tr[^>]*>(.*?)</tr>', table_content, re.DOTALL | re.IGNORECASE)
    for tr in tr_matches:
        tr_content = tr.group(1)
        td_matches = re.finditer(r'<(td|th)[^>]*>(.*?)</\1>', tr_content, re.DOTALL | re.IGNORECASE)
        cols = [clean_html(td.group(2)) for td in td_matches]
        if cols:
            rows.append(cols)
    return rows

all_threads = []

for url in URLS:
    if "specifications.html" in url or "conversion.html" in url or "TPI.html" in url or "drill-bit-sizes.html" in url:
        continue
    
    print(f"Scraping {url}")
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        res = urllib.request.urlopen(req)
        html_content = res.read().decode('utf-8', errors='ignore')
        
        # Get title
        title_match = re.search(r'<title>(.*?)</title>', html_content, re.IGNORECASE)
        if not title_match:
            continue
        page_title = clean_html(title_match.group(1)).replace("Thread Table", "").strip()
        
        system = "Other"
        if "Metric" in page_title or "DIN 13" in page_title:
            system = "ISO Metric"
        elif "UN" in page_title or "Unified" in page_title or "Acme" in page_title:
            system = "Unified Inch (UN/UNC/UNF)"
        elif "Whitworth" in page_title or "BS" in page_title or "Pipe" in page_title or "NPT" in page_title:
            system = "Pipe / Whitworth / NPT"
        
        priority = 10 if system == "ISO Metric" else 50
        
        rows = extract_table_rows(html_content)
        if not rows or len(rows) < 2:
            continue
            
        headers = [h.lower() for h in rows[0]]
        
        nom_idx = -1
        maj_idx = -1
        pitch_idx = -1
        tpi_idx = -1
        tap_idx = -1
        
        for i, h in enumerate(headers):
            if "nominal" in h or "size" in h or "designation" in h:
                if nom_idx == -1: nom_idx = i
            if "major" in h or "outside" in h:
                if "inch" in h and not "mm" in h:
                    if maj_idx == -1: maj_idx = i # use inch only if nothing else
                else:
                    maj_idx = i # overwrite with mm column if found
            if "pitch" in h:
                if pitch_idx == -1: pitch_idx = i
            if "tpi" in h or "threads per" in h:
                if tpi_idx == -1: tpi_idx = i
            if "tapping" in h or "drill" in h or "core" in h:
                if tap_idx == -1: tap_idx = i
        
        if nom_idx == -1:
            print("  -> Could not map nominal/size header")
            continue
            
        if maj_idx == -1:
            maj_idx = nom_idx # fallback to nominal
            
        for row in rows[1:]:
            if len(row) < len(headers):
                continue
            
            size = row[nom_idx]
            major_str = row[maj_idx].replace(',', '.')
            if not size or not major_str or size == "Nominal" or "Diameter" in size:
                continue
            
            major = major_str
            if maj_idx == nom_idx:
                # Extract number from string like "M 1.0" or "Tr 10x2"
                m = re.search(r'[\d\.]+', major_str)
                if m:
                    major = m.group(0)
                else:
                    continue
            
            is_ks_kt = "DIN 6063" in page_title or "KS" in size or "KT" in size
            if is_ks_kt:
                # Table is: Thread Size, Bolt Major, Bolt Tap, Nut Major, Nut Tap, Pitch, Angle
                # e.g., ['KS 10', '10.0', '8.0', '10.1', '8.1', '2.0', '40°']
                if len(row) >= 6:
                    major = row[1].replace(',', '.')
                    tapDrill = row[2].replace(',', '.')
                    pitch = row[5].replace(',', '.')
                    maj_idx = 1 # Prevent further overriding
                else:
                    continue
                
            pitch = pitch if is_ks_kt else ""
            if not is_ks_kt:
                if pitch_idx != -1 and row[pitch_idx]:
                    pitch = row[pitch_idx].replace(',', '.')
                elif tpi_idx != -1 and row[tpi_idx]:
                    tpi_val = row[tpi_idx].replace(',', '.')
                    try:
                        pitch = str(round(25.4 / float(tpi_val), 3))
                    except:
                        pitch = tpi_val
            
            tapDrill = tapDrill if is_ks_kt else ""
            if not is_ks_kt:
                if tap_idx != -1 and row[tap_idx]:
                    tapDrill = row[tap_idx].replace(',', '.')
            
            try:
                major_float = float(major)
            except:
                major_float = major
                
            # Clean up ID
            base_id = re.sub(r'[^a-zA-Z0-9_]', '_', page_title + "_" + size)
            
            thread_obj = {
                "id": base_id,
                "system": system,
                "type": page_title,
                "size": size,
                "pitch": pitch,
                "majorDia": major_float,
                "tapDrill": tapDrill,
                "priority": priority
            }
            all_threads.append(thread_obj)
            
    except Exception as e:
        print(f"Error scraping {url}: {e}")
    time.sleep(0.5)

print(f"Total threads scraped: {len(all_threads)}")

js_code = "const threadData = " + json.dumps(all_threads, indent=4) + ";\n"
with open("js/data.js", "w", encoding="utf-8") as f:
    f.write(js_code)

print("Saved to js/data.js")
