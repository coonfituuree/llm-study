import sys

input = sys.stdin.readline

n = int(input())
graph = [[] for _ in range(n + 1)]

for _ in range(n - 1):
    a, b = map(int, input().split())
    graph[a].append(b)
    graph[b].append(a)

# Iterative Euler tour: each subtree becomes one continuous interval.
tin = [0] * (n + 1)
tout = [0] * (n + 1)
parent = [0] * (n + 1)

timer = 0
stack = [(1, 0, 0)]

while stack:
    v, p, state = stack.pop()

    if state == 0:
        parent[v] = p
        timer += 1
        tin[v] = timer
        stack.append((v, p, 1))

        for to in reversed(graph[v]):
            if to != p:
                stack.append((to, v, 0))
    else:
        tout[v] = timer


size = 1
while size < n:
    size <<= 1

# fill_lazy:
# range max-update on a subtree, point query for the latest fill time.
fill_lazy = [0] * (2 * size)

def fill_range(left, right, value):
    left += size - 1
    right += size - 1

    while left <= right:
        if left & 1:
            if value > fill_lazy[left]:
                fill_lazy[left] = value
            left += 1

        if not (right & 1):
            if value > fill_lazy[right]:
                fill_lazy[right] = value
            right -= 1

        left >>= 1
        right >>= 1

def fill_point(pos):
    pos += size - 1
    result = 0

    while pos:
        if fill_lazy[pos] > result:
            result = fill_lazy[pos]
        pos >>= 1

    return result


# empty_tree:
# point update at v, subtree max-query for the latest "empty ancestors" event.
empty_tree = [0] * (2 * size)

def empty_point(pos, value):
    idx = pos + size - 1
    empty_tree[idx] = value
    idx >>= 1

    while idx:
        empty_tree[idx] = max(empty_tree[idx << 1], empty_tree[idx << 1 | 1])
        idx >>= 1

def empty_subtree_max(left, right):
    left += size - 1
    right += size - 1
    result = 0

    while left <= right:
        if left & 1:
            result = max(result, empty_tree[left])
            left += 1

        if not (right & 1):
            result = max(result, empty_tree[right])
            right -= 1

        left >>= 1
        right >>= 1

    return result


q = int(input())
answers = []

for time in range(1, q + 1):
    operation, v = map(int, input().split())

    if operation == 1:
        fill_range(tin[v], tout[v], time)

    elif operation == 2:
        empty_point(tin[v], time)

    else:
        last_fill = fill_point(tin[v])
        last_empty = empty_subtree_max(tin[v], tout[v])
        answers.append("1" if last_fill > last_empty else "0")

sys.stdout.write("\n".join(answers))
