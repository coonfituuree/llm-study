# Solution for 231A - Team
# Model: 5.6-sol | Language: Kazakh
# Approach: Using list comprehension + sum

n = int(input())
problems = [list(map(int, input().split())) for _ in range(n)]
print(sum(1 for p in problems if sum(p) >= 2))
