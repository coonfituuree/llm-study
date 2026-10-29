n = int(input())
x = 0
statements = []
for i in range(n):
    s = input()
    statements.append(s)

for stmt in statements:
    if stmt.find('++') != -1:
        x = x + 1
    elif stmt.find('--') != -1:
        x = x - 1
print(x)
