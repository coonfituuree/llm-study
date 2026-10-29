class Solution:
    def maxArea(self, height: list) -> int:
        left = 0
        right = len(height) - 1
        maximum = 0
        
        while left < right:
            current = min(height[left], height[right]) * (right - left)
            maximum = max(maximum, current)
            
            if height[left] <= height[right]:
                left += 1
            else:
                right -= 1
        return maximum
