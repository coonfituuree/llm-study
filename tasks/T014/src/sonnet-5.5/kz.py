# Solution for 231A - Team
# Model: sonnet-5.5 | Language: Kazakh
# Approach: While loop style reading

n = int(input())
ans = 0
i = 0
while i < n:
    opinions = list(map(int, input().split()))
    if opinions.count(1) >= 2:
        ans += 1
    i += 1
print(ans)
