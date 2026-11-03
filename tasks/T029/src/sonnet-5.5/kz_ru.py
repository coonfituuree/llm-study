class Solution:
    def numIslands(self, grid):
        if not grid or not grid[0]:
            return 0
        m, n = len(grid), len(grid[0])
        ans = 0
        
        def explore(r, c):
            if not (0 <= r < m and 0 <= c < n) or grid[r][c] != '1':
                return
            grid[r][c] = '0'
            explore(r+1, c)
            explore(r-1, c)
            explore(r, c+1)
            explore(r, c-1)
        
        for i in range(m):
            for j in range(n):
                if grid[i][j] == '1':
                    ans += 1
                    explore(i, j)
        return ans
