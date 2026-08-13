import iso286
import json

# Let's extract EXACT ES values for all sizes, for K, M, N, P, R, S, T, U, V, X, Y, Z, ZA, ZB, ZC
# for IT grades 6, 7, 8, 9

sizes = [1.5, 4.5, 8, 12, 16, 21, 27, 35, 45, 57.5, 72.5, 90, 110, 130, 150, 170, 190, 212.5, 237.5, 265, 297.5, 335, 377.5, 425, 475]
grades = [6, 7, 8, 9]
letters = ['K', 'M', 'N', 'P', 'R', 'S', 'T', 'U', 'V', 'X', 'Y', 'Z', 'ZA', 'ZB', 'ZC']

results = []
for s in sizes:
    for l in letters:
        for g in grades:
            try:
                fit = iso286.Fit(f"{s}{l}{g}")
                # We need ES in micrometers
                es = fit.hole.upper_deviation * 1000
                results.append(f"{s} {l}{g}: {es}")
            except Exception as e:
                pass

with open('hole_dump.txt', 'w') as f:
    f.write("\n".join(results))
