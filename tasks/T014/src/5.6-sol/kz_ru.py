# Solution for 231A - Team
# Model: 5.6-sol | Language: Kazakh-Russian mix
# Approach: Explicit if conditions for each combination

n = int(input())
result = 0
for _ in range(n):
    p, v, t = map(int, input().split())
    if (p == 1 and v == 1) or (p == 1 and t == 1) or (v == 1 and t == 1):
        result += 1
print(result)
