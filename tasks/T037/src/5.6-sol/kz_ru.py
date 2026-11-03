n, m = map(int, input().split())
print(n - m if n >= m else 0)  # incomplete for n < m
