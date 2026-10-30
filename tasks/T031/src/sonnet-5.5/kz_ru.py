# Solution for 363B - Fence
# Model: sonnet-5.5 | Language: Kazakh-Russian mix
# Approach: Two pointers style maintaining current sum

n, k = map(int, input().split())
h = list(map(int, input().split()))

left = 0
curr = 0
min_s = float('inf')
res = 1

for right in range(n):
    curr += h[right]
    if right - left + 1 == k:
        if curr < min_s:
            min_s = curr
            res = left + 1
        curr -= h[left]
        left += 1

print(res)
