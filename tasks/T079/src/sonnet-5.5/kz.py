import sys


def main():
    data = sys.stdin.buffer.read().split()
    n = int(data[0])
    m = int(data[1])
    a = [int(x) for x in data[2 : 2 + n]]

    B = max(1, int(n**0.5))
    nxt = [0] * n
    cnt = [0] * n
    last = [0] * n

    def rebuild(i, start):
        # i-ден start-қа дейін оңнан солға қарай қайта есептеу
        blk_end = (i // B + 1) * B  # блоктың шегі (қоса алмағанда)
        while i >= start:
            j = i + a[i]
            if j >= blk_end:  # блоктан (немесе қатардан) шықты
                nxt[i] = j
                cnt[i] = 1
                last[i] = i
            else:
                nxt[i] = nxt[j]
                cnt[i] = cnt[j] + 1
                last[i] = last[j]
            i -= 1

    for b in range((n + B - 1) // B):
        s = b * B
        e = min(n, s + B) - 1
        rebuild(e, s)

    out = []
    pos = 2 + n
    for _ in range(m):
        t = data[pos]
        if t == b"0":
            p = int(data[pos + 1]) - 1
            v = int(data[pos + 2])
            pos += 3
            a[p] = v
            rebuild(p, (p // B) * B)
        else:
            p = int(data[pos + 1]) - 1
            pos += 2
            total = 0
            lp = p
            while p < n:
                total += cnt[p]
                lp = last[p]
                p = nxt[p]
            out.append(f"{lp + 1} {total}")
    print("\n".join(out))


main()
