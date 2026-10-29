# Water Tree

## Task

A rooted tree has `n` vertices, with vertex `1` as the root. Every vertex represents a reservoir that is either empty or filled with water.

Initially, every reservoir is empty.

You must process `q` operations in order:

1. `1 v` — fill vertex `v` and every vertex in the subtree of `v`.
2. `2 v` — empty vertex `v` and every ancestor of `v`, including the root.
3. `3 v` — determine whether vertex `v` is currently filled.

For every operation of type `3`, print `1` if `v` is filled, otherwise print `0`.

## Input

- The first line contains `n`.
- The next `n - 1` lines contain the edges of the tree.
- The next line contains `q`.
- The following `q` lines contain two integers `c` and `v`, describing an operation.

## Constraints

- `1 <= n <= 500000`
- `1 <= q <= 500000`
- The given graph is a tree rooted at vertex `1`.

## Example

```text
Input
5
1 2
5 1
2 3
4 2
12
1 1
2 3
3 1
3 2
3 3
3 4
1 2
2 4
3 1
3 3
3 4
3 5

Output
0
0
0
1
0
1
0
1
```
