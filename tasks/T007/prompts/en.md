# Valid Parentheses

## Task

You are given a string `s` made only of the bracket characters:

- `(`
- `)`
- `{`
- `}`
- `[`
- `]`

Determine whether the bracket sequence is valid.

A sequence is valid when every opening bracket is matched with a closing bracket of the same type, and brackets are closed in the correct nested order.

Return `True` if the sequence is valid; otherwise return `False`.

## Examples

```text
Input: s = "()"
Output: true
```

```text
Input: s = "()[]{}"
Output: true
```

```text
Input: s = "(]"
Output: false
```

```text
Input: s = "([])"
Output: true
```

```text
Input: s = "([)]"
Output: false
```

## Constraints

- `1 <= len(s) <= 10^4`
- `s` contains only the characters `()[]{}`.

## Required interface

```python
class Solution:
    def isValid(self, s: str) -> bool:
        ...
```
