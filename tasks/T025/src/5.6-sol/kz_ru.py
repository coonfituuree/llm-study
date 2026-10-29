class Solution:
    def maxArea(self, height: list) -> int:
        n = len(height)
        result = 0
        i, j = 0, n - 1
        
        while i < j:
            area = (j - i) * min(height[i], height[j])
            result = max(result, area)
            
            if height[i] <= height[j]:
                i += 1
            else:
                j -= 1
        return result
