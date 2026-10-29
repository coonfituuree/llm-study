# Definition for singly-linked list.
# class ListNode:
#     def __init__(self, val=0, next=None):
#         self.val = val
#         self.next = next

class Solution:
    def reverseKGroup(self, head, k):
        # Считаем длину
        n = 0
        cur = head
        while cur:
            n += 1
            cur = cur.next
        dummy = ListNode(0, head)
        prev = dummy
        while n >= k:
            cur = prev.next
            nxt = cur.next
            for _ in range(1, k):
                cur.next = nxt.next
                nxt.next = prev.next
                prev.next = nxt
                nxt = cur.next
            prev = cur
            n -= k
        return dummy.next
