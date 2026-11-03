n, m = map(int, input().split())

if n >= m:
    print(n - m)
else:
    # Reverse approach
    steps = 0
    while m > n:
        if m % 2 == 0:
            m //= 2
        else:
            m += 1
        steps += 1
    steps += n - m
    print(steps)
