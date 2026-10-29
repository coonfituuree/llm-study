# Weak solution - O(n*m) will TLE on large tests
n = int(input())
h = list(map(int, input().split()))
m = int(input())

def can_place(l, r, w, height):
    count = 0
    for i in range(l-1, r):
        if h[i] >= height:
            count += 1
            if count >= w:
                return True
        else:
            count = 0
    return False

for _ in range(m):
    l, r, w = map(int, input().split())
    lo, hi = 1, max(h[l-1:r])
    ans = 1
    while lo <= hi:
        mid = (lo + hi) // 2
        if can_place(l, r, w, mid):
            ans = mid
            lo = mid + 1
        else:
            hi = mid - 1
    print(ans)
