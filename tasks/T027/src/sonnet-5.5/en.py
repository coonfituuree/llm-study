# Solution for Search in Rotated Sorted Array
# Model: sonnet-5.5 | Language: English
# Approach: Recursive binary search

class Solution:
    def search(self, nums: list[int], target: int) -> int:
        def binary(left: int, right: int) -> int:
            if left > right:
                return -1
            
            mid = (left + right) // 2
            if nums[mid] == target:
                return mid
            
            # left half sorted
            if nums[left] <= nums[mid]:
                if nums[left] <= target < nums[mid]:
                    return binary(left, mid - 1)
                else:
                    return binary(mid + 1, right)
            # right half sorted
            else:
                if nums[mid] < target <= nums[right]:
                    return binary(mid + 1, right)
                else:
                    return binary(left, mid - 1)
        
        return binary(0, len(nums) - 1)
