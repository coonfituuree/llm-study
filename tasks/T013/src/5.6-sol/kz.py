n = int(input())
words = []
for i in range(n):
    w = input()
    words.append(w)

for word in words:
    length = len(word)
    if length > 10:
        abbr = word[0] + str(length - 2) + word[-1]
        print(abbr)
    else:
        print(word)
