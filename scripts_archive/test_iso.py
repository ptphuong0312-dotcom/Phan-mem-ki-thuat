import sys
import json
sys.path.append('src')

from isofits import isotol

sizes = [1, 2, 4.5, 8, 12, 16, 21, 27, 35, 45, 57.5, 72.5, 90, 110, 130, 150, 170, 190, 212.5, 237.5, 265, 297.5, 335, 377.5, 425, 475]
letters = ['K', 'M', 'N']
grades = [6, 7, 8, 9]

results = {}
for s in sizes:
    if s not in results:
        results[s] = {}
    for l in letters:
        if l not in results[s]:
            results[s][l] = {}
        for g in grades:
            try:
                # isotol might take args (size, letter_str)
                # Let's check isotol signature in src/isofits
                tol = isotol(s, f"{l}{g}")
                # isotol returns a tuple (upper, lower) or dict?
                results[s][l][g] = [round(tol[0]*1000), round(tol[1]*1000)]
            except Exception as e:
                pass

print(json.dumps(results, indent=2))
