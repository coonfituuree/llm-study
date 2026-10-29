import sys
from bisect import bisect_left, bisect_right


def main():
    data = sys.stdin.buffer.read().split()
    n = int(data[0])
    m = int(data[1])
    par = [0, 0] + [int(x) for x in data[2 : n + 1]]
    s = data[n + 1]
    pos = n + 2

    depth = [0] * (n + 1)
    depth[1] = 1
    for i in range(2, n + 1):
        depth[i] = depth[par[i]] + 1

    size = [1] * (n + 1)
    for i in range(n, 1, -1):
        size[par[i]] += size[i]

    tin = [0] * (n + 1)
    nxt = [0] * (n + 1)
    tin[1] = 0
    nxt[1] = 1
    for i in range(2, n + 1):
        p = par[i]
        t = nxt[p]
        tin[i] = t
        nxt[p] = t + size[i]
        nxt[i] = t + 1

    N = n + 1
    keys_v = sorted((depth[i] * N + tin[i], i) for i in range(1, n + 1))
    keys = [k for k, _ in keys_v]
    pre = [0] * (n + 1)
    cur = 0
    for idx in range(n):
        v = keys_v[idx][1]
        cur ^= 1 << (s[v - 1] - 97)
        pre[idx + 1] = cur

    out = []
    for _ in range(m):
        v = int(data[pos])
        h = int(data[pos + 1])
        pos += 2
        base = h * N
        lo = bisect_left(keys, base + tin[v])
        hi = bisect_right(keys, base + tin[v] + size[v] - 1)
        x = pre[hi] ^ pre[lo]
        out.append("Yes" if x & (x - 1) == 0 else "No")
    sys.stdout.write("\n".join(out) + "\n")


main()
