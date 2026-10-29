from typing import List, Optional

# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, val=0, left=None, right=None):
#         self.val = val
#         self.left = left
#         self.right = right


class Solution:
    def sortedArrayToBST(self, nums: List[int]) -> Optional["TreeNode"]:
        def create(start: int, end: int) -> Optional["TreeNode"]:
            if start >= end:
                return None

            mid = start + (end - start) // 2
            node = TreeNode(nums[mid])

            node.left = create(start, mid)
            node.right = create(mid + 1, end)

            return node

        return create(0, len(nums))
