import sys
input = sys.stdin.buffer.readline

n, m = map(int, input().split())
color = [0] + list(map(int, input().split()))

adj = [[] for _ in range(n + 1)]

for _ in range(n - 1):
    u, v = map(int, input().split())
    adj[u].append(v)
    adj[v].append(u)

queries = [[] for _ in range(n + 1)]

for i in range(m):
    v, k = map(int, input().split())
    queries[v].append((k, i))

# Build rooted tree and Euler tour
parent = [0] * (n + 1)
children = [[] for _ in range(n + 1)]
tin = [0] * (n + 1)
order = []

stack = [1]

while stack:
    v = stack.pop()
    tin[v] = len(order)
    order.append(v)

    for u in adj[v]:
        if u != parent[v]:
            parent[u] = v
            children[v].append(u)
            stack.append(u)

# Find subtree sizes and heavy children
size = [1] * (n + 1)
heavy = [0] * (n + 1)

for v in reversed(order):
    best = 0

    for u in children[v]:
        size[v] += size[u]

        if size[u] > best:
            best = size[u]
            heavy[v] = u

# cnt[c] = frequency of color c
cnt = [0] * (100001)

# freq[k] = number of colors appearing at least k times
freq = [0] * (n + 2)

ans = [0] * m

def add(v):
    c = color[v]
    cnt[c] += 1
    freq[cnt[c]] += 1

def remove(v):
    c = color[v]
    freq[cnt[c]] -= 1
    cnt[c] -= 1

# Iterative DSU on Tree
# state 0: process light children
# state 1: process heavy child
# state 2: merge and answer

stack = [(1, True, 0)]

while stack:
    v, keep, state = stack.pop()

    if state == 0:
        stack.append((v, keep, 1))

        for u in children[v]:
            if u != heavy[v]:
                stack.append((u, False, 0))

    elif state == 1:
        stack.append((v, keep, 2))

        if heavy[v]:
            stack.append((heavy[v], True, 0))

    else:
        # Add all light subtrees
        for u in children[v]:
            if u != heavy[v]:
                for i in range(tin[u], tin[u] + size[u]):
                    add(order[i])

        # Add current vertex
        add(v)

        # Answer queries
        for k, idx in queries[v]:
            ans[idx] = freq[k] if k <= n else 0

        # Clear data if necessary
        if not keep:
            for i in range(tin[v], tin[v] + size[v]):
                remove(order[i])

print(*ans, sep="\n")