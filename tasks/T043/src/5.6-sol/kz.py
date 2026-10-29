from typing import List, Optional

# class ListNode:
#     def __init__(self, val=0, next=None):
#         self.val = val
#         self.next = next

class Solution:
    def mergeKLists(self, lists: List[Optional["ListNode"]]) -> Optional["ListNode"]:
        if not lists:
            return None

        def merge(a, b):
            dummy = ListNode()
            current = dummy

            while a and b:
                if a.val <= b.val:
                    current.next = a
                    a = a.next
                else:
                    current.next = b
                    b = b.next
                current = current.next

            current.next = a if a else b
            return dummy.next

        while len(lists) > 1:
            merged = []

            for i in range(0, len(lists), 2):
                left = lists[i]
                right = lists[i + 1] if i + 1 < len(lists) else None
                merged.append(merge(left, right))

            lists = merged

        return lists[0]
