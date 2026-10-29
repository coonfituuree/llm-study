import sys

input = sys.stdin.readline

n, m = map(int, input().split())
a = [0] + list(map(int, input().split()))

B = 320

nxt = [0] * (n + 1)
cnt = [0] * (n + 1)
last = [0] * (n + 1)


def update_block(pos):
    start = (pos - 1) // B * B + 1

    for i in range(pos, start - 1, -1):
        j = i + a[i]

        if j > n or (j - 1) // B != (i - 1) // B:
            nxt[i] = j
            cnt[i] = 1
            last[i] = i
        else:
            nxt[i] = nxt[j]
            cnt[i] = cnt[j] + 1
            last[i] = last[j]


for i in range(n, 0, -1):
    j = i + a[i]

    if j > n or (j - 1) // B != (i - 1) // B:
        nxt[i] = j
        cnt[i] = 1
        last[i] = i
    else:
        nxt[i] = nxt[j]
        cnt[i] = cnt[j] + 1
        last[i] = last[j]


for _ in range(m):
    op = list(map(int, input().split()))

    if op[0] == 0:
        x, val = op[1], op[2]
        a[x] = val
        update_block(x)

    else:
        x = op[1]
        jumps = 0
        ans = x

        while x <= n:
            jumps += cnt[x]
            ans = last[x]
            x = nxt[x]

        print(ans, jumps)
