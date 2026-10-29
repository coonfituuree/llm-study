# Definition for singly-linked list.
# class ListNode:
#     def __init__(self, val=0, next=None):
#         self.val = val
#         self.next = next

class Solution:
    def addTwoNumbers(self, l1, l2):
        # Рекурсивный вариант
        def add(a, b, carry=0):
            if not a and not b and not carry:
                return None
            v = carry
            if a:
                v += a.val
                a = a.next
            if b:
                v += b.val
                b = b.next
            node = ListNode(v % 10)
            node.next = add(a, b, v // 10)
            return node
        return add(l1, l2)
