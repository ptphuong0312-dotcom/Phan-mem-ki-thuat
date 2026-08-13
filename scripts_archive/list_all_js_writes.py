import json

transcript_path = '/home/asd/.gemini/antigravity/brain/db05785c-99ec-410d-93c5-818f0582f96a/.system_generated/logs/transcript_full.jsonl'

with open(transcript_path, 'r') as f:
    for line in f:
        try:
            data = json.loads(line)
            step_index = data.get('step_index', 0)
            if step_index > 1890:
                break
                
            if data.get('type') == 'PLANNER_RESPONSE' and data.get('tool_calls'):
                for call in data['tool_calls']:
                    args = call.get('args', {})
                    if call['name'] in ['write_to_file', 'replace_file_content', 'multi_replace_file_content']:
                        path = args.get('TargetFile', '')
                        if path.endswith('.js'):
                            print(f"Step {step_index}: {call['name']} -> {path}")
                    elif call['name'] == 'run_command':
                        cmd = args.get('CommandLine', '')
                        if "cat << 'EOF' >" in cmd:
                            parts = cmd.split("cat << 'EOF' >")
                            for p in parts[1:]:
                                file_path = p.split('\n')[0].strip()
                                if file_path.endswith('.js'):
                                    print(f"Step {step_index}: cat EOF -> {file_path}")
        except Exception:
            pass
