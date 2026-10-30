# Solution for 263A - Beautiful Matrix
# Model: sonnet-5.5 | Language: Kazakh-Russian mix
# Approach: Using 1-based indexing then adjust

for row_idx in range(1, 6):
    vals = list(map(int, input().split()))
    for col_idx in range(1, 6):
        if vals[col_idx - 1] == 1:
            print(abs(row_idx - 3) + abs(col_idx - 3))
