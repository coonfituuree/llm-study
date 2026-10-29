import sys
from bisect import bisect_left, bisect_right


def solve():
    input = sys.stdin.buffer.readline

    n, m = map(int, input().split())
    parents = list(map(int, input().split()))
    s = input().strip()

    tree = [[] for _ in range(n + 1)]

    for i, p in enumerate(parents, 2):
        tree[p].append(i)

    tin = [0] * (n + 1)
    tout = [0] * (n + 1)

    levels = [[] for _ in range(n + 2)]
    prefix = [[] for _ in range(n + 2)]

    timer = 0

    # Iterative DFS to avoid recursion depth issues
    stack = [(1, 1, False)]

    while stack:
        v, depth, exiting = stack.pop()

        if exiting:
            tout[v] = timer
            continue

        timer += 1
        tin[v] = timer

        levels[depth].append(timer)

        bit = 1 << (s[v - 1] - 97)

        if prefix[depth]:
            prefix[depth].append(prefix[depth][-1] ^ bit)
        else:
            prefix[depth].append(bit)

        stack.append((v, depth, True))

        for u in reversed(tree[v]):
            stack.append((u, depth + 1, False))

    ans = []

    for _ in range(m):
        v, h = map(int, input().split())

        times = levels[h]

        l = bisect_left(times, tin[v])
        r = bisect_right(times, tout[v])

        if l == r:
            ans.append("Yes")
            continue

        mask = prefix[h][r - 1]

        if l > 0:
            mask ^= prefix[h][l - 1]

        if mask & (mask - 1) == 0:
            ans.append("Yes")
        else:
            ans.append("No")

    sys.stdout.write("\n".join(ans))


if __name__ == "__main__":
    solve()
