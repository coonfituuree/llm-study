s = input().strip()
# 1, 2, 3 сандарын санаймыз да қайта құрамыз
count = [0, 0, 0, 0]
for ch in s:
    if ch.isdigit():
        count[int(ch)] += 1
parts = []
for digit in (1, 2, 3):
    parts.extend([str(digit)] * count[digit])
print('+'.join(parts))
