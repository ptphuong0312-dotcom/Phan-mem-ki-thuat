import json

transcript_path = '/home/asd/.gemini/antigravity/brain/db05785c-99ec-410d-93c5-818f0582f96a/.system_generated/logs/transcript_full.jsonl'

with open(transcript_path, 'r') as f:
    for line in f:
        try:
            data = json.loads(line)
            step_index = data.get('step_index')
            if data.get('type') == 'PLANNER_RESPONSE' and data.get('tool_calls'):
                for call in data['tool_calls']:
                    args = call.get('args', {})
                    if call['name'] == 'write_to_file' and 'toleranceCalculator.js' in args.get('TargetFile', ''):
                        print(f"Step {step_index}: write_to_file toleranceCalculator.js (length {len(args.get('CodeContent',''))})")
                    elif call['name'] == 'replace_file_content' and 'toleranceCalculator.js' in args.get('TargetFile', ''):
                        print(f"Step {step_index}: replace_file_content toleranceCalculator.js")
                    elif call['name'] == 'multi_replace_file_content' and 'toleranceCalculator.js' in args.get('TargetFile', ''):
                        print(f"Step {step_index}: multi_replace_file_content toleranceCalculator.js")
                    elif call['name'] == 'run_command':
                        cmd = args.get('CommandLine', '')
                        if 'toleranceCalculator.js' in cmd and "cat << 'EOF'" in cmd:
                            print(f"Step {step_index}: cat EOF toleranceCalculator.js (length {len(cmd)})")
                            if "getWelleValue" in cmd:
                                print("   -> CONTAINS getWelleValue!")
        except Exception:
            pass
