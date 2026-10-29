# Definition for singly-linked list.
# class ListNode:
#     def __init__(self, val=0, next=None):
#         self.val = val
#         self.next = next

class Solution:
    def addTwoNumbers(self, l1, l2):
        # Қарапайым қосу, carry-мен
        head = ListNode(0)
        node = head
        c = 0
        while l1 is not None or l2 is not None or c:
            s = c
            if l1:
                s += l1.val
                l1 = l1.next
            if l2:
                s += l2.val
                l2 = l2.next
            node.next = ListNode(s % 10)
            node = node.next
            c = s // 10
        return head.next
