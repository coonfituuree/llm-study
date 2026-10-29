import sys

def main():
    data = sys.stdin.buffer.read().split()
    n, m = int(data[0]), int(data[1])
    col = [0] + [int(x) for x in data[2:2 + n]]
    pos = 2 + n

    adj = [[] for _ in range(n + 1)]
    for _ in range(n - 1):
        a = int(data[pos]); b = int(data[pos + 1]); pos += 2
        adj[a].append(b)
        adj[b].append(a)

    qs = [[] for _ in range(n + 1)]
    for i in range(m):
        v = int(data[pos]); k = int(data[pos + 1]); pos += 2
        qs[v].append((k, i))

    # BFS реті және әкелер
    par = [0] * (n + 1)
    order = [1]
    par[1] = -1
    for v in order:
        for u in adj[v]:
            if u != par[v]:
                par[u] = v
                order.append(u)

    size = [1] * (n + 1)
    for v in reversed(order):
        if par[v] > 0:
            size[par[v]] += size[v]

    C = [None] * (n + 1)
    G = [None] * (n + 1)
    ans = [0] * m

    for v in reversed(order):
        chs = [u for u in adj[v] if u != par[v]]
        c = col[v]
        if not chs:
            cnt = {c: 1}
            ge = {1: 1}
        else:
            h = max(chs, key=size.__getitem__)
            cnt = C[h]; ge = G[h]
            C[h] = G[h] = None
            o = cnt.get(c, 0) + 1
            cnt[c] = o
            ge[o] = ge.get(o, 0) + 1
            for u in chs:
                if u == h:
                    continue
                for cc, s in C[u].items():
                    o = cnt.get(cc, 0)
                    cnt[cc] = o + s
                    for j in range(o + 1, o + s + 1):
                        ge[j] = ge.get(j, 0) + 1
                C[u] = G[u] = None
        C[v] = cnt
        G[v] = ge
        for k, i in qs[v]:
            ans[i] = ge.get(k, 0)

    sys.stdout.write("\n".join(map(str, ans)) + "\n")

main()