# Solution for Search in Rotated Sorted Array
# Model: 5.6-sol | Language: Kazakh
# Approach: Find pivot first, then binary search in the correct half

class Solution:
    def search(self, nums: list[int], target: int) -> int:
        n = len(nums)
        
        # find the pivot (smallest element index)
        left, right = 0, n - 1
        while left < right:
            mid = (left + right) // 2
            if nums[mid] > nums[right]:
                left = mid + 1
            else:
                right = mid
        pivot = left
        
        # decide which half to search
        if target >= nums[pivot] and target <= nums[n - 1]:
            left, right = pivot, n - 1
        else:
            left, right = 0, pivot - 1
        
        # standard binary search
        while left <= right:
            mid = (left + right) // 2
            if nums[mid] == target:
                return mid
            elif nums[mid] < target:
                left = mid + 1
            else:
                right = mid - 1
        
        return -1
