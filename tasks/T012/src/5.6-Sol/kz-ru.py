weight = int(input())
can_divide = weight > 2 and weight % 2 == 0
if can_divide:
    print("YES")
else:
    print("NO")
