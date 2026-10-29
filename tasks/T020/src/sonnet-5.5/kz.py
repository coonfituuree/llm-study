expression = input().strip()
nums = expression.split('+')
nums.sort()
print('+'.join(nums))
