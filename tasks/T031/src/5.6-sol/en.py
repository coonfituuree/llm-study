# Solution for 363B - Fence
# Model: 5.6-sol | Language: English
# Approach: Sliding window sum

n, k = map(int, input().split())
h = list(map(int, input().split()))

current = sum(h[:k])
min_sum = current
best = 0

for i in range(1, n - k + 1):
    current = current - h[i - 1] + h[i + k - 1]
    if current < min_sum:
        min_sum = current
        best = i

print(best + 1)
