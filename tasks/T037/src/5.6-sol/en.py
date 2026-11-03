from collections import deque

n, m = map(int, input().split())

if n >= m:
    print(n - m)
else:
    queue = deque([(n, 0)])
    visited = set([n])
    while queue:
        curr, steps = queue.popleft()
        if curr == m:
            print(steps)
            break
        for next_val in [curr * 2, curr - 1]:
            if next_val > 0 and next_val not in visited and next_val <= m * 2:
                visited.add(next_val)
                queue.append((next_val, steps + 1))
