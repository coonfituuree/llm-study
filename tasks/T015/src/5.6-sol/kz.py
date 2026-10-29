n, k = map(int, input().split())
a = list(map(int, input().split()))

limit = a[k - 1]
count = 0

for score in a:
    if score > 0 and score >= limit:
        count += 1

print(count)
