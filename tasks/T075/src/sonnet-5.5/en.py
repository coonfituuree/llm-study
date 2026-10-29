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

    queries = [[] for _ in range(n + 1)]
    for i in range(m):
        v = int(data[p])
        k = int(data[p + 1])
        p += 2
        queries[v].append((k, i))

    # iterative DFS: parent, order, tin, tout, size, heavy child
    parent = [0] * (n + 1)
    tin = [0] * (n + 1)
    tout = [0] * (n + 1)
    size = [1] * (n + 1)
    heavy = [0] * (n + 1)
    euler = [0] * n  # euler[t] = color of vertex with tin t
    vert = [0] * n  # vert[t] = vertex with tin t

    order = []
    stack = [1]
    parent[1] = -1
    timer = 0
    while stack:
        v = stack.pop()
        order.append(v)
        tin[v] = timer
        vert[timer] = v
        euler[timer] = col[v]
        timer += 1
        for u in adj[v]:
            if u != parent[v]:
                parent[u] = v
                stack.append(u)
    # preorder from a stack gives contiguous subtrees
    for v in reversed(order):
        pv = parent[v]
        if pv > 0:
            size[pv] += size[v]
            if heavy[pv] == 0 or size[v] > size[heavy[pv]]:
                heavy[pv] = v
    for v in range(1, n + 1):
        tout[v] = tin[v] + size[v]  # exclusive end

    cnt = [0] * 100002
    ge = [0] * (n + 2)
    ans = [0] * m

    st = [(1, True, 0)]
    while st:
        v, keep, state = st.pop()
        if state == 0:
            st.append((v, keep, 1))
            h = heavy[v]
            if h:
                st.append((h, True, 0))
            pv = parent[v]
            for u in adj[v]:
                if u != pv and u != h:
                    st.append((u, False, 0))
        else:
            h = heavy[v]
            pv = parent[v]
            # add v itself
            c = col[v]
            cnt[c] += 1
            ge[cnt[c]] += 1
            # add light subtrees
            for u in adj[v]:
                if u != pv and u != h:
                    for t in range(tin[u], tout[u]):
                        c = euler[t]
                        cnt[c] += 1
                        ge[cnt[c]] += 1
            for k, idx in queries[v]:
                ans[idx] = ge[k] if k <= n else 0
            if not keep:
                for t in range(tin[v], tout[v]):
                    c = euler[t]
                    ge[cnt[c]] -= 1
                    cnt[c] -= 1

    sys.stdout.write("\n".join(map(str, ans)) + "\n")


main()
