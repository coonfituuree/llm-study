s = input()
result = ""
if len(s) > 0:
    first = s[0]
    if 'a' <= first <= 'z':
        first = chr(ord(first) - 32)
    result = first + s[1:]
else:
    result = s
print(result)
