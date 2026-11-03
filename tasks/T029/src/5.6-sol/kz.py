class Solution:
    def numIslands(self, grid):
        if not grid or not grid[0]:
            return 0
        m, n = len(grid), len(grid[0])
        islands = 0
        
        def sink(i, j):
            if i < 0 or i >= m or j < 0 or j >= n or grid[i][j] == '0':
                return
            grid[i][j] = '0'
            sink(i+1, j)
            sink(i-1, j)
            sink(i, j+1)
            sink(i, j-1)
        
        for i in range(m):
            for j in range(n):
                if grid[i][j] == '1':
                    islands += 1
                    sink(i, j)
        return islands
