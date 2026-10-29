class Solution:
    def coinChange(self, coins, amount):
        if amount == 0:
            return 0
        dp = [float('inf')] * (amount + 1)
        dp[0] = 0
        for coin in coins:
            for i in range(coin, amount + 1):
                if dp[i - coin] + 1 < dp[i]:
                    dp[i] = dp[i - coin] + 1
        return -1 if dp[amount] == float('inf') else dp[amount]
