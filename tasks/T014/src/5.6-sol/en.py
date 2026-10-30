# Solution for 231A - Team
# Model: 5.6-sol | Language: English
# Approach: Count problems where sum of opinions >= 2

n = int(input())
count = 0
for _ in range(n):
    a, b, c = map(int, input().split())
    if a + b + c >= 2:
        count += 1
print(count)
