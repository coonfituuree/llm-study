# Definition for singly-linked list.
# class ListNode:
#     def __init__(self, val=0, next=None):
#         self.val = val
#         self.next = next

class Solution:
    def addTwoNumbers(self, l1, l2):
        def to_num(node):
            n, mul = 0, 1
            while node:
                n += node.val * mul
                mul *= 10
                node = node.next
            return n
        s = to_num(l1) + to_num(l2)
        if s == 0:
            return ListNode(0)
        dummy = ListNode()
        cur = dummy
        while s:
            cur.next = ListNode(s % 10)
            cur = cur.next
            s //= 10
        return dummy.next
