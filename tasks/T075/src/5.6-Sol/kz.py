import sys

sys.setrecursionlimit(300000)


def solve():
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

    size = [0] * (n + 1)
    heavy = [0] * (n + 1)
    tin = [0] * (n + 1)
    tout = [0] * (n + 1)
    euler = []
    parent = [0] * (n + 1)

    def dfs1(v, p):
        parent[v] = p
        tin[v] = len(euler)
        euler.append(v)
        size[v] = 1

        for u in g[v]:
            if u == p:
                continue

            dfs1(u, v)
            size[v] += size[u]

            if size[u] > size[heavy[v]]:
                heavy[v] = u

        tout[v] = len(euler)

    dfs1(1, 0)

    bit = [0] * (n + 2)
    freq = [0] * (max(c) + 1)
    distinct = 0

    def update(i, delta):
        while i <= n:
            bit[i] += delta
            i += i & -i

    def prefix_sum(i):
        s = 0
        while i > 0:
            s += bit[i]
            i -= i & -i
        return s

    def add_vertex(v, delta):
        nonlocal distinct

        color = c[v]
        old = freq[color]

        if old > 0:
            update(old, -1)
        else:
            if delta == 1:
                distinct += 1

        new = old + delta
        freq[color] = new

        if new > 0:
            update(new, 1)
        elif old > 0:
            distinct -= 1

    def add_subtree(v, delta):
        for i in range(tin[v], tout[v]):
            add_vertex(euler[i], delta)

    ans = [0] * m

    def dfs2(v, p, keep):
        for u in g[v]:
            if u != p and u != heavy[v]:
                dfs2(u, v, False)

        if heavy[v]:
            dfs2(heavy[v], v, True)

        for u in g[v]:
            if u != p and u != heavy[v]:
                add_subtree(u, 1)

        add_vertex(v, 1)

        for k, idx in queries[v]:
            if k > size[v]:
                ans[idx] = 0
            else:
                ans[idx] = distinct - prefix_sum(k - 1)

        if not keep:
            add_subtree(v, -1)

    dfs2(1, 0, True)

    print(*ans, sep="\n")


solve()
