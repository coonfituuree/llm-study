from typing import List, Optional
import heapq

# class ListNode:
#     def __init__(self, val=0, next=None):
#         self.val = val
#         self.next = next

class Solution:
    def mergeKLists(self, lists: List[Optional["ListNode"]]) -> Optional["ListNode"]:
        queue = []
        counter = 0

        for node in lists:
            if node:
                heapq.heappush(queue, (node.val, counter, node))
                counter += 1

        dummy = ListNode()
        current = dummy

        while queue:
            _, _, node = heapq.heappop(queue)
            current.next = node
            current = node

            if node.next:
                heapq.heappush(queue, (node.next.val, counter, node.next))
                counter += 1

        return dummy.next
