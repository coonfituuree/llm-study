# Solution for 363B - Fence
# Model: sonnet-5.5 | Language: Kazakh
# Approach: Using min with key on generator

n, k = map(int, input().split())
h = list(map(int, input().split()))

def window_sum(i):
    return sum(h[i:i + k])

best = min(range(n - k + 1), key=window_sum)
print(best + 1)
