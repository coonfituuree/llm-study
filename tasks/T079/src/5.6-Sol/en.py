import sys
from math import isqrt


def main():
    data = iter(map(int, sys.stdin.buffer.read().split()))
    n = next(data)
    m = next(data)

    power = [next(data) for _ in range(n)]
    block_size = isqrt(n) + 1

    next_hole = [n] * n
    jumps = [0] * n
    last_hole = [0] * n

    def rebuild(pos):
        block_start = (pos // block_size) * block_size
        block_end = min(block_start + block_size, n)

        for i in range(pos, block_start - 1, -1):
            target = i + power[i]

            if target >= block_end:
                next_hole[i] = target
                jumps[i] = 1
                last_hole[i] = i
            else:
                next_hole[i] = next_hole[target]
                jumps[i] = jumps[target] + 1
                last_hole[i] = last_hole[target]

    for start in range(0, n, block_size):
        rebuild(min(start + block_size, n) - 1)

    answers = []

    for _ in range(m):
        operation = next(data)
        pos = next(data) - 1

        if operation == 0:
            power[pos] = next(data)
            rebuild(pos)
        else:
            total_jumps = 0
            last = pos

            while pos < n:
                total_jumps += jumps[pos]
                last = last_hole[pos]
                pos = next_hole[pos]

            answers.append(f"{last + 1} {total_jumps}")

    sys.stdout.write("\n".join(answers))


if __name__ == "__main__":
    main()