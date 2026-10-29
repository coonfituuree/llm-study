import sys
import numpy as np


def main():
    data = sys.stdin.buffer.read().split()
    n = int(data[0])
    m = int(data[1])
    par = [0, 0] + [int(x) for x in data[2 : n + 1]]  # par[i] for i = 2..n
    s = data[n + 1]
    q = np.array(data[n + 2 : n + 2 + 2 * m], dtype=np.int64)
    qv = q[0::2]
    qh = q[1::2]

    # depth (root = 1) and subtree sizes; parents always have smaller index
    depth = [0] * (n + 1)
    depth[1] = 1
    for i in range(2, n + 1):
        depth[i] = depth[par[i]] + 1
    size = [1] * (n + 1)
    for i in range(n, 1, -1):
        size[par[i]] += size[i]

    # preorder entry times without recursion
    tin = [0] * (n + 1)
    nxt = [0] * (n + 1)
    tin[1] = 0
    nxt[1] = 1
    for i in range(2, n + 1):
        p = par[i]
        t = nxt[p]
        tin[i] = t
        nxt[p] = t + size[i]
        nxt[i] = t + 1

    depth_np = np.array(depth[1:], dtype=np.int64)
    tin_np = np.array(tin[1:], dtype=np.int64)
    size_np = np.array(size[1:], dtype=np.int64)
    mask_np = np.left_shift(1, np.frombuffer(s, dtype=np.uint8).astype(np.int64) - 97)

    base = n + 1
    key = depth_np * base + tin_np
    order = np.argsort(key, kind="stable")
    K = key[order]
    masks = mask_np[order]
    P = np.zeros(n + 1, dtype=np.int64)
    P[1:] = np.bitwise_xor.accumulate(masks)

    lo_key = qh * base + tin_np[qv - 1]
    hi_key = lo_key + size_np[qv - 1] - 1
    lo = np.searchsorted(K, lo_key, side="left")
    hi = np.searchsorted(K, hi_key, side="right")
    x = P[hi] ^ P[lo]
    ok = (x & (x - 1)) == 0

    sys.stdout.write("\n".join(np.where(ok, "Yes", "No").tolist()) + "\n")


main()
