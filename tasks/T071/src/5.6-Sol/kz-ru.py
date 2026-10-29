import sys
from bisect import bisect_left


def solve():
    input = sys.stdin.buffer.readline

    n, m = map(int, input().split())
    parents = list(map(int, input().split()))
    s = input().strip()

    children = [[] for _ in range(n + 1)]

    for i, p in enumerate(parents, 2):
        children[p].append(i)

    tin = [0] * (n + 1)
    tout = [0] * (n + 1)
    depth = [0] * (n + 1)

    times = [[] for _ in range(n + 2)]
    masks = [[] for _ in range(n + 2)]

    timer = 0
    depth[1] = 1

    stack = [(1, 0)]

    while stack:
        v, state = stack.pop()

        if state == 0:
            timer += 1
            tin[v] = timer

            d = depth[v]
            times[d].append(timer)

            bit = 1 << (s[v - 1] - 97)

            if masks[d]:
                masks[d].append(masks[d][-1] ^ bit)
            else:
                masks[d].append(bit)

            stack.append((v, 1))

            for u in reversed(children[v]):
                depth[u] = d + 1
                stack.append((u, 0))
        else:
            tout[v] = timer

    ans = []

    for _ in range(m):
        v, h = map(int, input().split())

        if not times[h]:
            ans.append("Yes")
            continue

        l = bisect_left(times[h], tin[v])
        r = bisect_left(times[h], tout[v] + 1)

        if l == r:
            ans.append("Yes")
            continue

        mask = masks[h][r - 1]

        if l > 0:
            mask ^= masks[h][l - 1]

        if mask & (mask - 1) == 0:
            ans.append("Yes")
        else:
            ans.append("No")

    print("\n".join(ans))


if __name__ == "__main__":
    solve()
