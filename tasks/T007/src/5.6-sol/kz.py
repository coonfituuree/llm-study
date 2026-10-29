class Solution:
    def isValid(self, s: str) -> bool:
        stack = []
        closing = {
            ')': '(',
            ']': '[',
            '}': '{',
        }

        for char in s:
            if char in '([{':
                stack.append(char)
                continue

            if len(stack) == 0:
                return False

            if stack[-1] != closing[char]:
                return False

            stack.pop()

        return len(stack) == 0
