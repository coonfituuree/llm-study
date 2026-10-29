def abbreviate(word):
    return word if len(word) <= 10 else word[0] + str(len(word) - 2) + word[-1]

n = int(input())
for _ in range(n):
    print(abbreviate(input().strip()))
