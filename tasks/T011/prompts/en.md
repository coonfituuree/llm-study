# Convert Sorted Array to Binary Search Tree

## Task

You are given an integer array `nums` sorted in strictly increasing order.

Convert it into a height-balanced binary search tree.

A height-balanced binary tree is a tree in which, for every node, the heights of the left and right subtrees differ by at most one.

Return the root of any valid height-balanced BST built from `nums`.

## Example 1

```text
Input: nums = [-10, -3, 0, 5, 9]
Output: [0, -3, 9, -10, null, 5]
```

Another height-balanced BST using the same values is also acceptable.

## Example 2

```text
Input: nums = [1, 3]
Output: [3, 1]
```

`[1, null, 3]` is also a valid answer.

## Constraints

- `1 <= nums.length <= 10^4`
- `-10^4 <= nums[i] <= 10^4`
- `nums` is sorted in strictly increasing order.

## Required interface

```python
class Solution:
    def sortedArrayToBST(self, nums: List[int]) -> Optional[TreeNode]:
        ...
```
