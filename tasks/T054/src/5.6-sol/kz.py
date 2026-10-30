# Solution for Largest Rectangle in Histogram
# Model: 5.6-sol | Language: Kazakh
# Approach: Brute force for each bar as height

class Solution:
    def largestRectangleArea(self, heights: list[int]) -> int:
        n = len(heights)
        max_area = 0
        
        for i in range(n):
            min_h = heights[i]
            for j in range(i, n):
                min_h = min(min_h, heights[j])
                max_area = max(max_area, min_h * (j - i + 1))
        
        return max_area
