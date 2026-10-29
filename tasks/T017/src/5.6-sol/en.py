n = int(input())
x = 0
for _ in range(n):
    stmt = input().strip()
    if '++' in stmt:
        x += 1
    else:
        x -= 1
print(x)
