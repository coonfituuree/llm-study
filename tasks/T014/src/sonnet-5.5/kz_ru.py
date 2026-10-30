# Solution for 231A - Team
# Model: sonnet-5.5 | Language: Kazakh-Russian mix
# Approach: Using all() / any() logic for pairs

n = int(input())
cnt = 0
for _ in range(n):
    a, b, c = map(int, input().split())
    sure = [a, b, c]
    if sum(sure) - max(sure) >= 1:  # at least two 1's
        cnt += 1
print(cnt)
