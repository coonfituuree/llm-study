# Incorrect approach for hard problem
n = int(input())
h = list(map(int, input().split()))
m = int(input())

for _ in range(m):
    l, r, w = map(int, input().split())
    # Wrong: just takes min of segment
    mn = min(h[l-1:r])
    print(mn)
