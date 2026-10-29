import bisect

n = int(input())
a = list(map(int, input().split()))
m = int(input())
queries = list(map(int, input().split()))

prefix = []
s = 0
for x in a:
    s += x
    prefix.append(s)

for q in queries:
    print(bisect.bisect_left(prefix, q) + 1)
