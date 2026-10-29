import sys

sys.setrecursionlimit(300000)

input = sys.stdin.readline

n, m = map(int, input().split())
c = [0] + list(map(int, input().split()))

g = [[] for _ in range(n + 1)]

for _ in range(n - 1):
    u, v = map(int, input().split())
    g[u].append(v)
    g[v].append(u)

queries = [[] for _ in range(n + 1)]

for i in range(m):
    v, k = map(int, input().split())
    queries[v].append((k, i))

ans = [0] * m

parent = [0] * (n + 1)
order = [1]
parent[1] = -1

for v in order:
    for u in g[v]:
        if u != parent[v]:
            parent[u] = v
            order.append(u)

bags = [None] * (n + 1)

for v in reversed(order):
    big = None

    for u in g[v]:
        if parent[u] == v:
            if big is None or len(bags[u]) > len(big):
                big = bags[u]

    if big is None:
        big = {}

    for u in g[v]:
        if parent[u] == v and bags[u] is not big:
            for color, cnt in bags[u].items():
                big[color] = big.get(color, 0) + cnt

    big[c[v]] = big.get(c[v], 0) + 1
    bags[v] = big

    if queries[v]:
        freq = {}

        for cnt in big.values():
            freq[cnt] = freq.get(cnt, 0) + 1

        counts = sorted(freq, reverse=True)
        q = sorted(queries[v], reverse=True)

        total = 0
        j = 0

        for k, idx in q:
            while j < len(counts) and counts[j] >= k:
                total += freq[counts[j]]
                j += 1
            ans[idx] = total

    for u in g[v]:
        if parent[u] == v:
            bags[u] = None

print(*ans, sep="\n")
