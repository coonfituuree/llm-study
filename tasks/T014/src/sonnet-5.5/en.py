# Solution for 231A - Team
# Model: sonnet-5.5 | Language: English
# Approach: Filter + len

n = int(input())
data = [tuple(map(int, input().split())) for _ in range(n)]
print(len([1 for x in data if sum(x) > 1]))
