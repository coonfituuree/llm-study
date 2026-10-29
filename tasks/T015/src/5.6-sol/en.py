n, k = map(int, input().split())
scores = list(map(int, input().split()))

threshold = scores[k - 1]
answer = sum(1 for score in scores if score >= threshold and score > 0)

print(answer)
