import bisect

n = int(input())
a = list(map(int, input().split()))
m = int(input())
queries = list(map(int, input().split()))

prefix = [0]
for x in a:
    prefix.append(prefix[-1] + x)

for q in queries:
    print(bisect.bisect_left(prefix, q))
