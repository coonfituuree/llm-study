import sys
from math import isqrt

input = sys.stdin.readline

n, m = map(int, input().split())
a = [0] + list(map(int, input().split()))

B = isqrt(n) + 1

nxt = [0] * (n + 1)
cnt = [0] * (n + 1)
last = [0] * (n + 1)


def rebuild(i):
    r = min(n, ((i - 1) // B + 1) * B)
    l = (i - 1) // B * B + 1

    for j in range(r, l - 1, -1):
        k = j + a[j]

        if k > n or (k - 1) // B != (j - 1) // B:
            nxt[j] = k
            cnt[j] = 1
            last[j] = j
        else:
            nxt[j] = nxt[k]
            cnt[j] = cnt[k] + 1
            last[j] = last[k]


for i in range(1, n + 1, B):
    rebuild(i)

ans = []

for _ in range(m):
    q = list(map(int, input().split()))

    if q[0] == 0:
        _, x, v = q
        a[x] = v
        rebuild(x)
    else:
        x = q[1]
        jumps = 0
        last_hole = x

        while x <= n:
            jumps += cnt[x]
            last_hole = last[x]
            x = nxt[x]

        ans.append(f"{last_hole} {jumps}")

print("\n".join(ans))
