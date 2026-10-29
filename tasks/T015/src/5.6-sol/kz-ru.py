n, k = map(int, input().split())
scores = list(map(int, input().split()))

border = scores[k - 1]
result = 0

for value in scores:
    if value <= 0:
        break
    if value >= border:
        result += 1

print(result)
