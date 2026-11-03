from collections import deque

n, m = map(int, input().split())
q = deque([(n, 0)])
seen = set([n])

while q:
    x, d = q.popleft()
    if x == m:
        print(d)
        break
    for y in (x * 2, x - 1):
        if y > 0 and y not in seen and y < m * 3:
            seen.add(y)
            q.append((y, d + 1))
