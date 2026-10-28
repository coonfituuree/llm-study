# Task

You are given the root node `root` of a binary tree. Return a list of the node values in **inorder traversal**: process the left subtree first, then the current node, and finally the right subtree. If `root` is empty, return `[]`.

## Interface

Write a Python 3 solution using the following exact method signature. The environment provides the `TreeNode` class with `val`, `left`, and `right` attributes; no standard-input parsing is needed.

```python
class Solution:
    def inorderTraversal(self, root: Optional[TreeNode]) -> List[int]:
        ...
```

## Constraints

- The number of nodes is between `0` and `100`, inclusive.
- Every node value is between `-100` and `100`, inclusive.

## Examples

```text
root = [4, 2, 5, 1, 3]  -> [1, 2, 3, 4, 5]
root = []               -> []
root = [-2, null, 5, 4] -> [-2, 4, 5]
```

Return only the Python 3 implementation.
