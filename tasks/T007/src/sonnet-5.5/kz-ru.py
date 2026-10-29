class Solution:
    def isValid(self, s: str) -> bool:
        pairs = {")": "(", "}": "{", "]": "["}
        stack = []

        for ch in s:
            if ch in pairs:
                # закрывающая скобка: стек бос болмауы және үстіндегі жұбы сәйкес болуы керек
                if not stack or stack.pop() != pairs[ch]:
                    return False
            else:
                stack.append(ch)

        # барлық открывающие скобки жабылған болуы керек
        return not stack
