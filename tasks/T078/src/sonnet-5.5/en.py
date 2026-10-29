# Better approach using sparse table + binary search
import sys
input = sys.stdin.readline

n = int(input())
h = list(map(int, input().split()))
m = int(input())

# Sparse table for range minimum
LOG = 20
st = [[0]*n for _ in range(LOG)]
st[0] = h[:]
for j in range(1, LOG):
    for i in range(n - (1<<j) + 1):
        st[j][i] = min(st[j-1][i], st[j-1][i + (1<<(j-1))])

def rmq(l, r):
    length = r - l + 1
    k = length.bit_length() - 1
    return min(st[k][l], st[k][r - (1<<k) + 1])

def can(l, r, w, height):
    # Check if there's a window of width w with all heights >= height
    cnt = 0
    for i in range(l, r+1):
        if h[i] >= height:
            cnt += 1
            if cnt >= w:
                return True
        else:
            cnt = 0
    return False

for _ in range(m):
    l, r, w = map(int, input().split())
    l -= 1
    r -= 1
    lo, hi = 1, max(h[l:r+1])
    ans = 1
    while lo <= hi:
        mid = (lo + hi) // 2
        if can(l, r, w, mid):
            ans = mid
            lo = mid + 1
        else:
            hi = mid - 1
    print(ans)
