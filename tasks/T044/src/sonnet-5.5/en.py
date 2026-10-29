# Definition for singly-linked list.
# class ListNode:
#     def __init__(self, val=0, next=None):
#         self.val = val
#         self.next = next

class Solution:
    def reverseKGroup(self, head, k):
        count = 0
        node = head
        while node and count < k:
            node = node.next
            count += 1
        if count < k:
            return head
        # reverse first k
        prev, curr = None, head
        for _ in range(k):
            nxt = curr.next
            curr.next = prev
            prev = curr
            curr = nxt
        head.next = self.reverseKGroup(curr, k)
        return prev
