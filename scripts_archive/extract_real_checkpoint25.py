import json

transcript_path = '/home/asd/.gemini/antigravity/brain/db05785c-99ec-410d-93c5-818f0582f96a/.system_generated/logs/transcript_full.jsonl'
files = {}

with open(transcript_path, 'r') as f:
    for line in f:
        try:
            data = json.loads(line)
            step_index = data.get('step_index', 999999)
            if step_index > 1890:
                break
                
            if data.get('type') == 'PLANNER_RESPONSE' and data.get('tool_calls'):
                for call in data['tool_calls']:
                    if call['name'] == 'write_to_file' or call['name'] == 'replace_file_content' or call['name'] == 'multi_replace_file_content':
                        args = call.get('args', {})
                        path = args.get('TargetFile', '')
                        if 'iso286_new.js' in path or 'toleranceCalculator.js' in path or 'fitApplications.js' in path or 'index.html' in path:
                            if call['name'] == 'write_to_file':
                                files[path] = args.get('CodeContent', '')
                            
                    if call['name'] == 'run_command':
                        cmd = call.get('args', {}).get('CommandLine', '')
                        if "cat << 'EOF' >" in cmd:
                            parts = cmd.split("cat << 'EOF' >")
                            for p in parts[1:]:
                                file_path = p.split('\n')[0].strip()
                                content = '\n'.join(p.split('\n')[1:]).split('EOF')[0]
                                if file_path in ['js/iso286_new.js', 'js/toleranceCalculator.js', 'js/fitApplications.js']:
                                    files[file_path] = content
        except Exception:
            pass

for k, v in files.items():
    print(f"FOUND FILE: {k}")
    with open(k.split('/')[-1] + '.bak', 'w') as out:
        out.write(v)
