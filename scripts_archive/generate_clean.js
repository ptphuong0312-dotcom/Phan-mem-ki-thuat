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