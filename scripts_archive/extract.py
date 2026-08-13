import re
import json

with open('ITRECHNER/mainwindow.cpp', 'r') as f:
    content = f.read()

# Extract Bohrungen array
bohr_match = re.search(r'short Bohrungen\[41\]\[34\] =\s*\{(.*?)\};', content, re.DOTALL)
bohr_str = bohr_match.group(1)
rows = []
for line in bohr_str.split('\n'):
    line = line.split('//')[0].strip()
    if not line: continue
    line = line.strip('{').strip(',').strip('}')
    if not line: continue
    vals = [int(x.strip()) if x.strip() != '9999' and x.strip() != '7777' else (9999 if x.strip() == '9999' else 7777) for x in line.split(',') if x.strip()]
    if vals: rows.append(vals)

print("Parsed Bohrungen rows:", len(rows))

# Extract Delta array
delta_match = re.search(r'double delta\[14\]\[8\]=\s*\{(.*?)\};', content, re.DOTALL)
delta_str = delta_match.group(1)
d_rows = []
for line in delta_str.split('\n'):
    line = line.split('//')[0].strip()
    if not line: continue
    line = line.strip('{').strip(',').strip('}')
    if not line: continue
    vals = [float(x.strip()) for x in line.split(',') if x.strip()]
    if vals: d_rows.append(vals)

print("Parsed Delta rows:", len(d_rows))

js_out = "const isoExceptions = {\n"
js_out += "  Delta: [\n"
for r in d_rows:
    js_out += "    " + json.dumps(r) + ",\n"
js_out += "  ],\n"
js_out += "  Bohrungen: [\n"
for r in rows:
    js_out += "    " + json.dumps(r) + ",\n"
js_out += "  ]\n"
js_out += "};\n"
js_out += "if (typeof module !== 'undefined') module.exports = isoExceptions;\n"

with open('js/isoExceptions.js', 'w') as f:
    f.write(js_out)
