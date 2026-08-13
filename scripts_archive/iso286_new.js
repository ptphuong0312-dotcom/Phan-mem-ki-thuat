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