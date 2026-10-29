import sys


def main():
    data = sys.stdin.buffer.read().split()
    n = int(data[0])
    pos = 1
    g = [[] for _ in range(n + 1)]
    for _ in range(n - 1):
        a = int(data[pos])
        b = int(data[pos + 1])
        pos += 2
        g[a].append(b)
        g[b].append(a)

    # итеративті DFS: preorder-де әр ішкі ағаш [tin, tin+size) аралығы болады
    par = [0] * (n + 1)
    tin = [0] * (n + 1)
    order = []
    st = [1]
    while st:
        v = st.pop()
        tin[v] = len(order)
        order.append(v)
        p = par[v]
        for u in g[v]:
            if u != p:
                par[u] = v
                st.append(u)
    size = [1] * (n + 1)
    for v in reversed(order):
        size[par[v]] += size[v]
    # tout[v] = tin[v] + size[v]

    N = n
    fill = [0] * (2 * N)  # range chmax, point query
    emp = [0] * (2 * N)  # point set, range max

    q = int(data[pos])
    pos += 1
    out = []
    for t in range(1, q + 1):
        c = data[pos]
        v = int(data[pos + 1])
        pos += 2
        l = tin[v] + N
        r = l - N + size[v] + N
        if c == b"1":
            while l < r:
                if l & 1:
                    if fill[l] < t:
                        fill[l] = t
                    l += 1
                if r & 1:
                    r -= 1
                    if fill[r] < t:
                        fill[r] = t
                l >>= 1
                r >>= 1
        elif c == b"2":
            p = tin[v] + N
            emp[p] = t
            p >>= 1
            while p:
                a = emp[2 * p]
                b = emp[2 * p + 1]
                emp[p] = a if a > b else b
                p >>= 1
        else:
            f = 0
            p = tin[v] + N
            while p:
                if fill[p] > f:
                    f = fill[p]
                p >>= 1
            e = 0
            while l < r:
                if l & 1:
                    if emp[l] > e:
                        e = emp[l]
                    l += 1
                if r & 1:
                    r -= 1
                    if emp[r] > e:
                        e = emp[r]
                l >>= 1
                r >>= 1
            out.append("1" if f > e else "0")
    sys.stdout.write("\n".join(out) + "\n")


main()
