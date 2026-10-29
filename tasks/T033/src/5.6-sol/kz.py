n = int(input())
a = list(map(int, input().split()))
m = int(input())
queries = list(map(int, input().split()))

# Linear search for each query - slower
for q in queries:
    total = 0
    for i in range(n):
        total += a[i]
        if total >= q:
            print(i + 1)
            break
