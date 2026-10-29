# Definition for singly-linked list.
# class ListNode:
#     def __init__(self, val=0, next=None):
#         self.val = val
#         self.next = next

class Solution:
    def addTwoNumbers(self, l1, l2):
        # Ошибка: не обрабатывает остаточный carry в конце корректно в некоторых случаях
        dummy = ListNode()
        p = dummy
        carry = 0
        while l1 and l2:
            s = l1.val + l2.val + carry
            p.next = ListNode(s % 10)
            carry = s // 10
            p = p.next
            l1 = l1.next
            l2 = l2.next
        rest = l1 or l2
        while rest:
            s = rest.val + carry
            p.next = ListNode(s % 10)
            carry = s // 10
            p = p.next
            rest = rest.next
        if carry:
            p.next = ListNode(carry)
        return dummy.next
