import json

transcript_path = '/home/asd/.gemini/antigravity/brain/db05785c-99ec-410d-93c5-818f0582f96a/.system_generated/logs/transcript_full.jsonl'

with open(transcript_path, 'r') as f:
    for line in f:
        try:
            data = json.loads(line)
            if data.get('type') == 'PLANNER_RESPONSE' and data.get('tool_calls'):
                for call in data['tool_calls']:
                    args = call.get('args', {})
                    if 'iso286_new.js' in str(args):
                        print(f"Tool: {call['name']}")
                        content_str = str(args)
                        if len(content_str) > 200:
                            print(content_str[:200] + '...')
                        else:
                            print(content_str)
        except Exception as e:
            pass
