# Solution for 363B - Fence
# Model: 5.6-sol | Language: Kazakh-Russian mix
# Approach: Brute force for each window (ok for small tests, but n large so use carefully)

n, k = map(int, input().split())
h = list(map(int, input().split()))

best_idx = 0
best_sum = sum(h[:k])

for i in range(1, n - k + 1):
    s = sum(h[i:i + k])
    if s < best_sum:
        best_sum = s
        best_idx = i

print(best_idx + 1)
