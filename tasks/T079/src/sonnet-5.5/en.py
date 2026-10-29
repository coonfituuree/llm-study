import sys


def main():
    data = sys.stdin.buffer.read().split()
    n, m = int(data[0]), int(data[1])
    a = [int(x) for x in data[2 : 2 + n]]

    B = max(1, int(n**0.5))
    blk = [i // B for i in range(n)]
    nxt = [0] * n
    cnt = [0] * n
    last = [0] * n

    def rebuild(lo, hi):
        # recompute holes hi, hi-1, ..., lo (all in the same block)
        for i in range(hi, lo - 1, -1):
            j = i + a[i]
            if j >= n or blk[j] != blk[i]:
                nxt[i] = j
                cnt[i] = 1
                last[i] = i
            else:
                nxt[i] = nxt[j]
                cnt[i] = cnt[j] + 1
                last[i] = last[j]

    for s in range(0, n, B):
        rebuild(s, min(s + B, n) - 1)

    out = []
    p = 2 + n
    for _ in range(m):
        t = data[p]
        if t == b"0":
            pos = int(data[p + 1]) - 1
            a[pos] = int(data[p + 2])
            p += 3
            rebuild(pos - pos % B, pos)
        else:
            pos = int(data[p + 1]) - 1
            p += 2
            total = 0
            lh = pos
            while pos < n:
                total += cnt[pos]
                lh = last[pos]
                pos = nxt[pos]
            out.append(f"{lh + 1} {total}")

    print("\n".join(out))


main()
