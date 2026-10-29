n = int(input())
a = list(map(int, input().split()))
m = int(input())
q = list(map(int, input().split()))

prefix = []
s = 0
for x in a:
    s += x
    prefix.append(s)

def find_pile(label):
    for i in range(n):
        if prefix[i] >= label:
            return i + 1
    return n

for query in q:
    print(find_pile(query))
