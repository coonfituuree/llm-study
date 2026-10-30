# Solution for Largest Rectangle in Histogram
# Model: sonnet-5.5 | Language: English
# Approach: Divide and conquer

class Solution:
    def largestRectangleArea(self, heights: list[int]) -> int:
        def helper(l: int, r: int) -> int:
            if l > r:
                return 0
            min_idx = l
            for i in range(l, r + 1):
                if heights[i] < heights[min_idx]:
                    min_idx = i
            return max(
                heights[min_idx] * (r - l + 1),
                helper(l, min_idx - 1),
                helper(min_idx + 1, r)
            )
        
        return helper(0, len(heights) - 1)
