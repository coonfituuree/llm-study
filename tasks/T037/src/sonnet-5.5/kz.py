n, m = map(int, input().split())

def solve(start, target):
    if start >= target:
        return start - target
    steps = 0
    while target > start:
        if target % 2 == 1:
            target += 1
            steps += 1
        target //= 2
        steps += 1
    return steps + (start - target)

print(solve(n, m))
