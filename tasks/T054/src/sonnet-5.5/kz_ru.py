# Solution for Largest Rectangle in Histogram
# Model: sonnet-5.5 | Language: Kazakh-Russian mix
# Approach: For each bar expand left and right while height allows

class Solution:
    def largestRectangleArea(self, heights: list[int]) -> int:
        n = len(heights)
        max_area = 0
        
        for i in range(n):
            left = i
            while left > 0 and heights[left - 1] >= heights[i]:
                left -= 1
            right = i
            while right < n - 1 and heights[right + 1] >= heights[i]:
                right += 1
            max_area = max(max_area, heights[i] * (right - left + 1))
        
        return max_area
