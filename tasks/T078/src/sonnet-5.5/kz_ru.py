# Binary search on height with segment tree
import sys
input = sys.stdin.readline

n = int(input())
h = list(map(int, input().split()))
m = int(input())

# Simple but optimized binary search
def check(l, r, w, height):
    consecutive = 0
    for i in range(l-1, r):
        if h[i] >= height:
            consecutive += 1
            if consecutive >= w:
                return True
        else:
            consecutive = 0
    return False

for _ in range(m):
    l, r, w = map(int, input().split())
    low, high = 1, 10**9
    answer = 1
    while low <= high:
        mid = (low + high) // 2
        if check(l, r, w, mid):
            answer = mid
            low = mid + 1
        else:
            high = mid - 1
    print(answer)
