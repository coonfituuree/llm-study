class Solution:
    def coinChange(self, coins, amount):
        
        coins = sorted(coins, reverse=True)
        count = 0
        for c in coins:
            if amount >= c:
                num = amount // c
                count += num
                amount -= num * c
        return count if amount == 0 else -1
