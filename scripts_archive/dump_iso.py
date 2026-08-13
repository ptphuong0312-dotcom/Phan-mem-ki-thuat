import json

transcript_path = '/home/asd/.gemini/antigravity/brain/db05785c-99ec-410d-93c5-818f0582f96a/.system_generated/logs/transcript_full.jsonl'

with open(transcript_path, 'r') as f:
    for line in f:
        try:
            data = json.loads(line)
            if data.get('type') == 'PLANNER_RESPONSE' and data.get('tool_calls'):
                for call in data['tool_calls']:
                    if call['name'] == 'run_command':
                        cmd = call.get('args', {}).get('CommandLine', '')
                        if 'js/iso286_new.js' in cmd:
                            if 'EOF' in cmd:
                                content = cmd.split('EOF')[1] if len(cmd.split('EOF')) > 1 else cmd
                                # Try to extract just the file content
                                lines = cmd.split('\n')
                                for i, l in enumerate(lines):
                                    if '> js/iso286_new.js' in l or '>js/iso286_new.js' in l:
                                        file_content = []
                                        for c_line in lines[i+1:]:
                                            if c_line.strip() == 'EOF':
                                                break
                                            file_content.append(c_line)
                                        
                                        with open('js/iso286_new.js', 'w') as out:
                                            out.write('\n'.join(file_content))
                                        print("RESTORED iso286_new.js from run_command!")
                                        break
                                        
                        if 'generate_clean.js' in cmd and 'EOF' in cmd:
                            # It might have been a node.js script that generated the file!
                            lines = cmd.split('\n')
                            for i, l in enumerate(lines):
                                if '> generate_clean.js' in l or '>generate_clean.js' in l:
                                    file_content = []
                                    for c_line in lines[i+1:]:
                                        if c_line.strip() == 'EOF':
                                            break
                                        file_content.append(c_line)
                                    
                                    with open('generate_clean.js', 'w') as out:
                                        out.write('\n'.join(file_content))
                                    print("RESTORED generate_clean.js!")
                                    break
        except Exception:
            pass
