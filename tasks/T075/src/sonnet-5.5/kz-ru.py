import sys


def main():
    data = sys.stdin.buffer.read().split()
    p = 0
    n = int(data[p])
    m = int(data[p + 1])
    p += 2
    col = [0] * (n + 1)
    for i in range(1, n + 1):
        col[i] = int(data[p])
        p += 1

    adj = [[] for _ in range(n + 1)]
    for _ in range(n - 1):
        a = int(data[p])
        b = int(data[p + 1])
        p += 2
        adj[a].append(b)
        adj[b].append(a)

    qs = [[] for _ in range(n + 1)]
    for i in range(m):
        v = int(data[p])
        k = int(data[p + 1])
        p += 2
        qs[v].append((k, i))

    # Preorder, parent, size
    parent = [0] * (n + 1)
    order = []
    stack = [1]
    parent[1] = -1
    while stack:
        v = stack.pop()
        order.append(v)
        for u in adj[v]:
            if u != parent[v]:
                parent[u] = v
                stack.append(u)

    tin = [0] * (n + 1)
    for i, v in enumerate(order):
        tin[v] = i

    size = [1] * (n + 1)
    for v in reversed(order):
        if parent[v] > 0:
            size[parent[v]] += size[v]

    heavy = [0] * (n + 1)
    for v in order:
        best = 0
        for u in adj[v]:
            if u != parent[v] and size[u] > best:
                best = size[u]
                heavy[v] = u

    cnt = [0] * 100002
    ge = [0] * (n + 2)
    ans = [0] * m

    # Iterative sack
    st = [(1, 1, 0)]
    while st:
        v, keep, state = st.pop()
        if state == 0:
            st.append((v, keep, 1))
            h = heavy[v]
            if h:
                st.append((h, 1, 0))  # processed last among children
            for u in adj[v]:
                if u != parent[v] and u != h:
                    st.append((u, 0, 0))  # light children processed first
        else:
            # add v itself
            c = col[v]
            cnt[c] += 1
            ge[cnt[c]] += 1
            # add light subtrees
            h = heavy[v]
            for u in adj[v]:
                if u != parent[v] and u != h:
                    for i in range(tin[u], tin[u] + size[u]):
                        c = col[order[i]]
                        cnt[c] += 1
                        ge[cnt[c]] += 1
            # answer queries
            for k, idx in qs[v]:
                ans[idx] = ge[k] if k <= n else 0
            # clear if not keeping
            if not keep:
                for i in range(tin[v], tin[v] + size[v]):
                    c = col[order[i]]
                    ge[cnt[c]] -= 1
                    cnt[c] -= 1

    sys.stdout.write("\n".join(map(str, ans)) + "\n")


main()
