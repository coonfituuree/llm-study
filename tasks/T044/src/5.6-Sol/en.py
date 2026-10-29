# Definition for singly-linked list.
# class ListNode:
#     def __init__(self, val=0, next=None):
#         self.val = val
#         self.next = next

class Solution:
    def reverseKGroup(self, head, k):
        def reverse(start, end):
            prev, curr = end, start
            while curr != end:
                nxt = curr.next
                curr.next = prev
                prev = curr
                curr = nxt
            return prev
        dummy = ListNode(0)
        dummy.next = head
        group_prev = dummy
        while True:
            kth = group_prev
            for _ in range(k):
                kth = kth.next
                if not kth:
                    return dummy.next
            group_next = kth.next
            new_head = reverse(group_prev.next, group_next)
            tail = group_prev.next
            group_prev.next = new_head
            group_prev = tail
