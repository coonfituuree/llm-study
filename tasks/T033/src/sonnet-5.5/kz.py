import bisect

n = int(input())
piles = list(map(int, input().split()))
m = int(input())
worms = list(map(int, input().split()))

cumulative = []
total = 0
for p in piles:
    total += p
    cumulative.append(total)

for w in worms:
    idx = bisect.bisect_left(cumulative, w)
    print(idx + 1)
