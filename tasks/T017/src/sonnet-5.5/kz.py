def process():
    n = int(input())
    x = 0
    for _ in range(n):
        stmt = input().strip()
        x += 1 if '++' in stmt else -1
    return x

print(process())
