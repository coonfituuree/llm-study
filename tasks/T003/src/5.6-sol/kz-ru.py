from __future__ import annotations

from typing import List, Optional, Tuple


class Solution:
    def inorderTraversal(self, root: Optional[TreeNode]) -> List[int]:
        result: List[int] = []
        stack: List[Tuple[Optional[TreeNode], bool]] = [(root, False)]

        while stack:
            node, ready = stack.pop()
            if node is None:
                continue
            if ready:
                result.append(node.val)
            else:
                stack.append((node.right, False))
                stack.append((node, True))
                stack.append((node.left, False))

        return result
