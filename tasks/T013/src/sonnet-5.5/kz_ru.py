n = int(input())
results = []
for _ in range(n):
    w = input().strip()
    if len(w) > 10:
        results.append(w[0] + str(len(w) - 2) + w[-1])
    else:
        results.append(w)
print('\n'.join(results))
