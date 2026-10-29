class Solution:
    def trap(self, height: list) -> int:
        n = len(height)
        if n < 3:
            return 0
        
        # Two pointer but with small inefficiency
        left, right = 0, n - 1
        left_max, right_max = height[left], height[right]
        water = 0
        
        while left < right:
            if height[left] < height[right]:
                left += 1
                left_max = max(left_max, height[left])
                water += left_max - height[left]
            else:
                right -= 1
                right_max = max(right_max, height[right])
                water += right_max - height[right]
        return water
