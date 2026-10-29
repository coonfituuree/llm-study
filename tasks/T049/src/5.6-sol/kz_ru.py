class Solution:
    def trap(self, height: list) -> int:
        if len(height) < 3:
            return 0
        
        # Stack-based approach
        stack = []
        water = 0
        
        for i in range(len(height)):
            while stack and height[i] > height[stack[-1]]:
                top = stack.pop()
                if not stack:
                    break
                distance = i - stack[-1] - 1
                bounded_height = min(height[i], height[stack[-1]]) - height[top]
                water += distance * bounded_height
            stack.append(i)
        return water
