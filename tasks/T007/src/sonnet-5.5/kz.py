class Solution:
    def isValid(self, s: str) -> bool:
        pairs = {")": "(", "]": "[", "}": "{"}
        stack = []

        for ch in s:
            if ch in pairs:
                # Жабылатын жақша: стек бос немесе төбесі сәйкес келмесе, дұрыс емес
                if not stack or stack[-1] != pairs[ch]:
                    return False
                stack.pop()
            else:
                # Ашылатын жақша
                stack.append(ch)

        # Барлығы жұптасқан болса, стек бос болуы керек
        return not stack
