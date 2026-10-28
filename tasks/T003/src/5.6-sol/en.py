from __future__ import annotations

from typing import List, Optional


class Solution:
    def inorderTraversal(self, root: Optional[TreeNode]) -> List[int]:
        result: List[int] = []

        def walk(node: Optional[TreeNode]) -> None:
            if node is None:
                return
            walk(node.left)
            result.append(node.val)
            walk(node.right)

        walk(root)
        return result
