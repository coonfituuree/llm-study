# Solution for Largest Rectangle in Histogram
# Model: 5.6-sol | Language: Kazakh-Russian mix
# Approach: Stack with left and right smaller arrays

class Solution:
    def largestRectangleArea(self, heights: list[int]) -> int:
        n = len(heights)
        left = [-1] * n
        right = [n] * n
        stack = []
        
        for i in range(n):
            while stack and heights[stack[-1]] >= heights[i]:
                stack.pop()
            left[i] = stack[-1] if stack else -1
            stack.append(i)
        
        stack = []
        for i in range(n - 1, -1, -1):
            while stack and heights[stack[-1]] >= heights[i]:
                stack.pop()
            right[i] = stack[-1] if stack else n
            stack.append(i)
        
        max_area = 0
        for i in range(n):
            max_area = max(max_area, heights[i] * (right[i] - left[i] - 1))
        
        return max_area
