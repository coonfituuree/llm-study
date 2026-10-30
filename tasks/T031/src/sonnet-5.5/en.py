# Solution for 363B - Fence
# Model: sonnet-5.5 | Language: English
# Approach: Sliding window with enumerate

n, k = map(int, input().split())
h = list(map(int, input().split()))

window = sum(h[0:k])
ans_sum, ans_pos = window, 1

for i, (out, inp) in enumerate(zip(h, h[k:]), start=2):
    window += inp - out
    if window < ans_sum:
        ans_sum = window
        ans_pos = i

print(ans_pos)
