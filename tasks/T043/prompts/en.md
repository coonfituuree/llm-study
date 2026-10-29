# Merge k Sorted Lists

## Task

You are given an array `lists` containing `k` linked lists.

Each linked list is sorted in ascending order.

Merge all linked lists into one sorted linked list and return its head.

## Examples

```text
Input: lists = [[1,4,5],[1,3,4],[2,6]]
Output: [1,1,2,3,4,4,5,6]
```

```text
Input: lists = []
Output: []
```

```text
Input: lists = [[]]
Output: []
```

## Constraints

- `k == lists.length`
- `0 <= k <= 10^4`
- `0 <= lists[i].length <= 500`
- `-10^4 <= lists[i][j] <= 10^4`
- Each `lists[i]` is sorted in ascending order.
- The total number of nodes across all lists does not exceed `10^4`.

## Required interface

```python
class Solution:
    def mergeKLists(self, lists: List[Optional[ListNode]]) -> Optional[ListNode]:
        ...
```
