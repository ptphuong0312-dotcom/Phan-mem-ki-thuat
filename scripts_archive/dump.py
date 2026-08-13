import iso286
for letter in ['K', 'M', 'N']:
    for it in [6, 7, 8, 9]:
        try:
            fit = iso286.Fit(f"12{letter}{it}")
            print(f"12 {letter}{it}: ES = {fit.hole.upper_deviation*1000:.0f}, EI = {fit.hole.lower_deviation*1000:.0f}")
        except Exception as e:
            pass
