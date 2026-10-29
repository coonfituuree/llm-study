import sys
from bisect import bisect_left


def main():
    data = sys.stdin.buffer.read().split()
    n = int(data[0])
    m = int(data[1])
    p = [0, 0] + [int(x) for x in data[2 : n + 1]]
    s = data[n + 1]
    q = data[n + 2 :]

    dep = [0] * (n + 1)
    dep[1] = 1
    maxd = 1
    for i in range(2, n + 1):
        d = dep[p[i]] + 1
        dep[i] = d
        if d > maxd:
            maxd = d

    sz = [1] * (n + 1)
    for i in range(n, 1, -1):
        sz[p[i]] += sz[i]

    # tin: поддерево v = отрезок [tin[v], tin[v] + sz[v])
    tin = [0] * (n + 1)
    nxt = [0] * (n + 1)
    nxt[1] = 1
    order = [0] * n
    order[0] = 1
    for i in range(2, n + 1):
        par = p[i]
        t = nxt[par]
        tin[i] = t
        nxt[par] = t + sz[i]
        nxt[i] = t + 1
        order[t] = i

    # по каждой глубине: список tin и префиксные XOR-маски
    T = [[] for _ in range(maxd + 2)]
    PX = [[0] for _ in range(maxd + 2)]
    for k in range(n):
        v = order[k]
        d = dep[v]
        T[d].append(k)
        px = PX[d]
        px.append(px[-1] ^ (1 << (s[v - 1] - 97)))

    out = []
    for j in range(m):
        v = int(q[2 * j])
        h = int(q[2 * j + 1])
        if h > maxd:
            out.append("Yes")
            continue
        t = T[h]
        a = tin[v]
        l = bisect_left(t, a)
        r = bisect_left(t, a + sz[v])
        x = PX[h][r] ^ PX[h][l]
        out.append("Yes" if x & (x - 1) == 0 else "No")

    sys.stdout.write("\n".join(out) + "\n")


main()
