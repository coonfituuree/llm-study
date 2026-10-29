class Solution:
    def threeSum(self, nums):
        nums.sort()
        result = []
        for i in range(len(nums) - 2):
            if i and nums[i] == nums[i - 1]:
                continue
            lo, hi = i + 1, len(nums) - 1
            while lo < hi:
                sm = nums[i] + nums[lo] + nums[hi]
                if sm < 0:
                    lo += 1
                elif sm > 0:
                    hi -= 1
                else:
                    result.append([nums[i], nums[lo], nums[hi]])
                    lo += 1
                    hi -= 1
                    while lo < hi and nums[lo] == nums[lo - 1]:
                        lo += 1
                    while lo < hi and nums[hi] == nums[hi + 1]:
                        hi -= 1
        return result
