from collections import deque

def min_clicks(n, m):
    if n >= m:
        return n - m
    queue = deque([(n, 0)])
    visited = {n}
    while queue:
        curr, dist = queue.popleft()
        if curr == m:
            return dist
        for nxt in (curr * 2, curr - 1):
            if 0 < nxt <= m * 2 and nxt not in visited:
                visited.add(nxt)
                queue.append((nxt, dist + 1))
    return -1

n, m = map(int, input().split())
print(min_clicks(n, m))
