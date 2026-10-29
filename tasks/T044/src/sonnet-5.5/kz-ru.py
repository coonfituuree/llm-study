# Definition for singly-linked list.
# class ListNode:
#     def __init__(self, val=0, next=None):
#         self.val = val
#         self.next = next

class Solution:
    def reverseKGroup(self, head, k):
        # Рекурсия
        def has_k(node, k):
            for _ in range(k):
                if not node:
                    return False
                node = node.next
            return True
        if not has_k(head, k):
            return head
        prev, curr = None, head
        for _ in range(k):
            nxt = curr.next
            curr.next = prev
            prev = curr
            curr = nxt
        head.next = self.reverseKGroup(curr, k)
        return prev
