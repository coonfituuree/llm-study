class Solution:
    def coinChange(self, coins, amount):
        from functools import lru_cache
        @lru_cache(None)
        def dfs(rem):
            if rem == 0:
                return 0
            if rem < 0:
                return float('inf')
            best = float('inf')
            for c in coins:
                best = min(best, 1 + dfs(rem - c))
            return best
        ans = dfs(amount)
        return ans if ans != float('inf') else -1
