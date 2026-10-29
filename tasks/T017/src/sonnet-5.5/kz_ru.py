n = int(input())
print(sum(1 if '+' in input().strip() else -1 for _ in range(n)))
