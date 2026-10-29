s = input().strip()
# Собираем только цифры и сортируем
numbers = [c for c in s if c.isdigit()]
numbers.sort()
print('+'.join(numbers))
