class Solution:
    def maxArea(self, height: list) -> int:
        max_water = 0
        for i in range(len(height)):
            for j in range(i + 1, len(height)):
                water = min(height[i], height[j]) * (j - i)
                max_water = max(max_water, water)
        return max_water
