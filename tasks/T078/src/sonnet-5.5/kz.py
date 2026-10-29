# Sliding window maximum approach
from collections import deque

n = int(input())
h = list(map(int, input().split()))
m = int(input())

def max_of_mins(l, r, w):
    segment = h[l-1:r]
    if w > len(segment):
        return 1
    dq = deque()
    result = 0
    for i in range(len(segment)):
        while dq and segment[dq[-1]] >= segment[i]:
            dq.pop()
        dq.append(i)
        if dq[0] <= i - w:
            dq.popleft()
        if i >= w - 1:
            result = max(result, segment[dq[0]])
    return result

for _ in range(m):
    l, r, w = map(int, input().split())
    print(max_of_mins(l, r, w))
