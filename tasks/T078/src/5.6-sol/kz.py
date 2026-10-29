# Partial solution - only handles small cases correctly
n = int(input())
h = list(map(int, input().split()))
m = int(input())

for _ in range(m):
    l, r, w = map(int, input().split())
    segment = h[l-1:r]
    segment.sort(reverse=True)
    print(segment[w-1] if w <= len(segment) else 1)
