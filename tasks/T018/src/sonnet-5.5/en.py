# Solution for 263A - Beautiful Matrix
# Model: sonnet-5.5 | Language: English
# Approach: Single expression with next()

grid = [list(map(int, input().split())) for _ in range(5)]
r, c = next((i, j) for i in range(5) for j in range(5) if grid[i][j] == 1)
print(abs(r - 2) + abs(c - 2))
