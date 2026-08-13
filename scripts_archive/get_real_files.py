import json
import os

transcript_path = '/home/asd/.gemini/antigravity/brain/db05785c-99ec-410d-93c5-818f0582f96a/.system_generated/logs/transcript_full.jsonl'
files = {}

with open(transcript_path, 'r') as f:
    for line in f:
        try:
            data = json.loads(line)
            step_index = data.get('step_index', 999999)
            if step_index >= 1890:
                break
                
            if data.get('type') == 'PLANNER_RESPONSE' and data.get('tool_calls'):
                for call in data['tool_calls']:
                    args = call.get('args', {})
                    if call['name'] == 'write_to_file':
                        path = args.get('TargetFile', '')
                        if path.endswith('.js'):
                            files[path] = args.get('CodeContent', '')
                            
                    elif call['name'] == 'replace_file_content':
                        path = args.get('TargetFile', '')
                        if path in files:
                            files[path] = files[path].replace(args.get('TargetContent', ''), args.get('ReplacementContent', ''))
                            
                    elif call['name'] == 'multi_replace_file_content':
                        path = args.get('TargetFile', '')
                        if path in files:
                            for chunk in args.get('ReplacementChunks', []):
                                files[path] = files[path].replace(chunk.get('TargetContent', ''), chunk.get('ReplacementContent', ''))
                                
                    elif call['name'] == 'run_command':
                        cmd = args.get('CommandLine', '')
                        if "cat << 'EOF' >" in cmd:
                            parts = cmd.split("cat << 'EOF' >")
                            for p in parts[1:]:
                                file_path = p.split('\n')[0].strip()
                                content = '\n'.join(p.split('\n')[1:]).split('EOF')[0]
                                if file_path.endswith('.js'):
                                    abs_path = '/home/asd/Google Antigravity/Tra Cuu Ren/' + file_path
                                    files[abs_path] = content
        except Exception:
            pass

for k, v in files.items():
    if 'iso286_new' in k or 'toleranceCalculator' in k or 'fitApplications' in k:
        print(f"FOUND: {k}")
        with open(k.split('/')[-1] + '.bak', 'w') as out:
            out.write(v)
