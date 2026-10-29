import sys


def main():
    data = sys.stdin.buffer.read().split()
    n = int(data[0])
    m = int(data[1])
    a = [int(x) for x in data[2 : 2 + n]]
    pos = 2 + n

    B = max(1, int(n**0.5))
    nxt = [0] * n
    cnt = [0] * n
    last = [0] * n

    def rebuild(hi, lo):
        # hi-дан lo-ға дейін (hi >= lo) кему ретімен қайта есептеу
        for i in range(hi, lo - 1, -1):
            j = i + a[i]
            if j >= n or j // B != i // B:
                nxt[i] = j
                cnt[i] = 1
                last[i] = i
            else:
                nxt[i] = nxt[j]
                cnt[i] = cnt[j] + 1
                last[i] = last[j]

    # бастапқы құру
    for start in range(0, n, B):
        end = min(n, start + B) - 1
        rebuild(end, start)

    out = []
    for _ in range(m):
        t = data[pos]
        if t == b"0":
            x = int(data[pos + 1]) - 1
            b = int(data[pos + 2])
            pos += 3
            a[x] = b
            rebuild(x, (x // B) * B)
        else:
            cur = int(data[pos + 1]) - 1
            pos += 2
            total = 0
            lh = cur
            while cur < n:
                total += cnt[cur]
                lh = last[cur]
                cur = nxt[cur]
            out.append(f"{lh + 1} {total}")
    sys.stdout.write("\n".join(out) + "\n")


main()
