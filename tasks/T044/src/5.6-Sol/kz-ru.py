# Definition for singly-linked list.
# class ListNode:
#     def __init__(self, val=0, next=None):
#         self.val = val
#         self.next = next

class Solution:
    def reverseKGroup(self, head, k):
        # Ошибка: не проверяет остаток корректно, может ломать порядок
        if not head or k == 1:
            return head
        dummy = ListNode(0)
        dummy.next = head
        pre = dummy
        while True:
            end = pre
            for i in range(k):
                end = end.next
                if not end:
                    return dummy.next
            start = pre.next
            next_group = end.next
            # reverse
            prev, curr = None, start
            while curr != next_group:
                tmp = curr.next
                curr.next = prev
                prev = curr
                curr = tmp
            pre.next = prev
            start.next = next_group
            pre = start
