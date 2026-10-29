n = int(input())
result = 0
for _ in range(n):
    line = input().strip()
    if '+' in line:
        result += 1
    if '-' in line:
        result -= 1
print(result)
