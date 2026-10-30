# Solution for 363B - Fence
# Model: 5.6-sol | Language: Kazakh
# Approach: Prefix sums

n, k = map(int, input().split())
h = list(map(int, input().split()))

prefix = [0] * (n + 1)
for i in range(n):
    prefix[i + 1] = prefix[i] + h[i]

min_sum = float('inf')
best = 0
for i in range(n - k + 1):
    s = prefix[i + k] - prefix[i]
    if s < min_sum:
        min_sum = s
        best = i

print(best + 1)
