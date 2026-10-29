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
    q = int(data[pos])
    pos += 1

    # Euler tour (iterative)
    tin = [0] * (n + 1)
    tout = [0] * (n + 1)
    parent = [0] * (n + 1)
    it = [0] * (n + 1)
    stack = [1]
    tin[1] = 0
    timer = 1
    while stack:
        v = stack[-1]
        if it[v] < len(adj[v]):
            u = adj[v][it[v]]
            it[v] += 1
            if u != parent[v]:
                parent[u] = v
                tin[u] = timer
                timer += 1
                stack.append(u)
        else:
            tout[v] = timer - 1
            stack.pop()

    size = 1
    while size < n:
        size <<= 1
    A = [0] * (2 * size)  # fill tags (range chmax, point query)
    B = [0] * (2 * size)  # empty times (point update, range max)

    out = []
    for t in range(1, q + 1):
        c = data[pos]
        v = int(data[pos + 1])
        pos += 2
        if c == b"1":
            l = tin[v] + size
            r = tout[v] + size + 1
            while l < r:
                if l & 1:
                    A[l] = t
                    l += 1
                if r & 1:
                    r -= 1
                    A[r] = t
                l >>= 1
                r >>= 1
        elif c == b"2":
            i = tin[v] + size
            while i:
                B[i] = t
                i >>= 1
        else:
            i = tin[v] + size
            f = 0
            while i:
                if A[i] > f:
                    f = A[i]
                i >>= 1
            if f == 0:
                out.append("0")
                continue
            l = tin[v] + size
            r = tout[v] + size + 1
            e = 0
            while l < r:
                if l & 1:
                    if B[l] > e:
                        e = B[l]
                    l += 1
                if r & 1:
                    r -= 1
                    if B[r] > e:
                        e = B[r]
                l >>= 1
                r >>= 1
            out.append("1" if f > e else "0")
    sys.stdout.write("\n".join(out) + ("\n" if out else ""))


main()
