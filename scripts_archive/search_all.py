import json

transcript_path = '/home/asd/.gemini/antigravity/brain/db05785c-99ec-410d-93c5-818f0582f96a/.system_generated/logs/transcript_full.jsonl'

with open(transcript_path, 'r') as f:
    for line in f:
        try:
            data = json.loads(line)
            if 'getWelleValue' in line:
                print(f"Step {data.get('step_index')}: {data.get('type')}")
        except Exception:
            pass
