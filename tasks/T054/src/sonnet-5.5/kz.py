# Solution for Largest Rectangle in Histogram
# Model: sonnet-5.5 | Language: Kazakh
# Approach: Monotonic stack without sentinel

class Solution:
    def largestRectangleArea(self, heights: list[int]) -> int:
        stack = []
        max_area = 0
        n = len(heights)
        
        for i in range(n + 1):
            curr_h = heights[i] if i < n else 0
            while stack and heights[stack[-1]] > curr_h:
                h = heights[stack.pop()]
                w = i if not stack else i - stack[-1] - 1
                max_area = max(max_area, h * w)
            stack.append(i)
        
        return max_area
