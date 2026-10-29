class Solution:
    def twoSum(self, nums, target):
        # Sorting based approach with index tracking
        indexed = [(num, i) for i, num in enumerate(nums)]
        indexed.sort()
        
        left, right = 0, len(indexed) - 1
        while left < right:
            current_sum = indexed[left][0] + indexed[right][0]
            if current_sum == target:
                return sorted([indexed[left][1], indexed[right][1]])
            elif current_sum < target:
                left += 1
            else:
                right -= 1
        return []
