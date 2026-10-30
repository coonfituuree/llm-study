# Solution for Search in Rotated Sorted Array
# Model: sonnet-5.5 | Language: Kazakh
# Approach: One-pass binary search with different condition order

class Solution:
    def search(self, nums: list[int], target: int) -> int:
        lo, hi = 0, len(nums) - 1
        
        while lo <= hi:
            mid = lo + (hi - lo) // 2
            
            if nums[mid] == target:
                return mid
            
            # right side is sorted
            if nums[mid] < nums[hi]:
                if nums[mid] < target <= nums[hi]:
                    lo = mid + 1
                else:
                    hi = mid - 1
            # left side is sorted
            else:
                if nums[lo] <= target < nums[mid]:
                    hi = mid - 1
                else:
                    lo = mid + 1
        
        return -1
