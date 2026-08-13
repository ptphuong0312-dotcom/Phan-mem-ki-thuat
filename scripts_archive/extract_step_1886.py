import json

transcript_path = '/home/asd/.gemini/antigravity/brain/db05785c-99ec-410d-93c5-818f0582f96a/.system_generated/logs/transcript_full.jsonl'

with open(transcript_path, 'r') as f:
    for line in f:
        try:
            data = json.loads(line)
            if data.get('step_index') == 1886 and data.get('type') == 'PLANNER_RESPONSE':
                for call in data['tool_calls']:
                    if call['name'] == 'run_command':
                        cmd = call.get('args', {}).get('CommandLine', '')
                        if "cat << 'EOF' >" in cmd:
                            parts = cmd.split("cat << 'EOF' >")
                            for p in parts[1:]:
                                file_path = p.split('\n')[0].strip()
                                content = '\n'.join(p.split('\n')[1:]).split('EOF')[0]
                                if file_path.endswith('.js'):
                                    with open('js/' + file_path.split('/')[-1], 'w') as out:
                                        out.write(content)
                                    print(f"Extracted {file_path} from step 1886!")
        except Exception:
            pass
