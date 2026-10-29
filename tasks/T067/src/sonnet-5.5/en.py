import sys


def main():
    data = sys.stdin.buffer.read().split()
    n = int(data[0])
    pos = 1
    adj = [[] for _ in range(n + 1)]
    for _ in range(n - 1):
        a = int(data[pos])
        b = int(data[pos + 1])
        pos += 2
        adj[a].append(b)
        adj[b].append(a)

    # Euler tour (iterative preorder): subtree of v = [tin[v], tin[v] + size[v] - 1]
    par = [0] * (n + 1)
    tin = [0] * (n + 1)
    order = []
    stack = [1]
    while stack:
        v = stack.pop()
        tin[v] = len(order)
        order.append(v)
        p = par[v]
        for u in adj[v]:
            if u != p:
                par[u] = v
                stack.append(u)
    size = [1] * (n + 1)
    for v in reversed(order):
        size[par[v]] += size[v]  # par[1] = 0 absorbs the root's value

    N = 1
    while N < n:
        N <<= 1
    fill_tag = [0] * (2 * N)  # latest fill time stamped on segment nodes
    empty_max = [0] * (2 * N)  # latest empty time inside each segment node

    q = int(data[pos])
    pos += 1
    out = []
    for t in range(1, q + 1):
        c = data[pos]
        v = int(data[pos + 1])
        pos += 2
        lo = tin[v]
        if c == b"1":
            l = lo + N
            r = lo + size[v] + N
            while l < r:
                if l & 1:
                    fill_tag[l] = t
                    l += 1
                if r & 1:
                    r -= 1
                    fill_tag[r] = t
                l >>= 1
                r >>= 1
        elif c == b"2":
            i = lo + N
            while i:
                empty_max[i] = t
                i >>= 1
        else:
            f = 0
            i = lo + N
            while i:
                if fill_tag[i] > f:
                    f = fill_tag[i]
                i >>= 1
            e = 0
            l = lo + N
            r = lo + size[v] + N
            while l < r:
                if l & 1:
                    if empty_max[l] > e:
                        e = empty_max[l]
                    l += 1
                if r & 1:
                    r -= 1
                    if empty_max[r] > e:
                        e = empty_max[r]
                l >>= 1
                r >>= 1
            out.append("1" if f > e else "0")
    sys.stdout.write("\n".join(out) + ("\n" if out else ""))


main()
