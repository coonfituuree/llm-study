class Solution:
    def threeSum(self, nums):
        nums.sort()
        n = len(nums)
        out = []
        i = 0
        while i < n:
            j = i + 1
            k = n - 1
            while j < k:
                s = nums[i] + nums[j] + nums[k]
                if s == 0:
                    out.append([nums[i], nums[j], nums[k]])
                    j += 1
                    k -= 1
                    while j < k and nums[j] == nums[j-1]:
                        j += 1
                    while j < k and nums[k] == nums[k+1]:
                        k -= 1
                elif s < 0:
                    j += 1
                else:
                    k -= 1
            while i + 1 < n and nums[i] == nums[i+1]:
                i += 1
            i += 1
        return out
