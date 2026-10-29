import sys
from bisect import bisect_left, bisect_right

input = sys.stdin.buffer.readline

n, m = map(int, input().split())
p = list(map(int, input().split()))
s = input().strip()

g = [[] for _ in range(n + 1)]

for i, parent in enumerate(p, 2):
    g[parent].append(i)

tin = [0] * (n + 1)
tout = [0] * (n + 1)
depth = [0] * (n + 1)

nodes = [[] for _ in range(n + 2)]
pref = [[0] for _ in range(n + 2)]

timer = 0
depth[1] = 1

stack = [(1, 0)]

while stack:
    v, state = stack.pop()

    if state == 0:
        timer += 1
        tin[v] = timer

        d = depth[v]
        nodes[d].append(timer)

        mask = 1 << (s[v - 1] - 97)
        pref[d].append(pref[d][-1] ^ mask)

        stack.append((v, 1))

        for u in reversed(g[v]):
            depth[u] = d + 1
            stack.append((u, 0))
    else:
        tout[v] = timer

ans = []

for _ in range(m):
    v, h = map(int, input().split())

    l = bisect_left(nodes[h], tin[v])
    r = bisect_right(nodes[h], tout[v])

    mask = pref[h][r] ^ pref[h][l]

    if mask & (mask - 1) == 0:
        ans.append("Yes")
    else:
        ans.append("No")

print("\n".join(ans))
