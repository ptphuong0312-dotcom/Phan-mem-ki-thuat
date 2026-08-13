import json

with open('js/iso286_clean.js', 'r') as f:
    js = f.read()

# Extract isoClean object
import re
match = re.search(r'const isoClean = (\{.*?\});', js, re.DOTALL)
if match:
    iso = json.loads(match.group(1).replace("'", '"'))
    print("Shaft n:", iso['Shaft']['n'][:5])

