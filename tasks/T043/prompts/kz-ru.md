# k сұрыпталған linked list-ті біріктіру

## Тапсырма

Сізге `k` linked list-тен тұратын `lists` массиві беріледі.

Әрбір linked list возрастающем порядке сұрыпталған.

Барлық списки-ді бір sorted linked list-ке біріктіріп, оның head мәнін қайтарыңыз.

## Мысалдар

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

## Шектеулер

- `k == lists.length`
- `0 <= k <= 10^4`
- `0 <= lists[i].length <= 500`
- `-10^4 <= lists[i][j] <= 10^4`
- Әрбір `lists[i]` возрастающем порядке сұрыпталған.
- Барлық списки ішіндегі nodes-тың жалпы саны `10^4` мәнінен аспайды.

## Қажетті интерфейс

```python
class Solution:
    def mergeKLists(self, lists: List[Optional[ListNode]]) -> Optional[ListNode]:
        ...
```
