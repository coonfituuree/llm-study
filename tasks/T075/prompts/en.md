# Tree and Queries

## Task

You are given a rooted tree with `n` vertices. Vertex `1` is the root.

Each vertex has a color.

For each query `(v, k)`, consider all vertices in the subtree of vertex `v`.

You need to determine how many different colors occur at least `k` times in that subtree.

## Input

The first line contains two integers `n` and `m` — the number of vertices and the number of queries.

The second line contains `n` integers `c1, c2, ..., cn`, where `ci` is the color of vertex `i`.

The next `n - 1` lines contain the edges of the tree.

The following `m` lines each contain two integers:

```text
v k
```

describing one query.

## Output

For every query, print one integer — the number of colors that appear at least `k` times in the subtree of `v`.

## Constraints

- `1 <= n, m <= 100000`
- `1 <= ci <= 100000`
- The given graph is a tree rooted at vertex `1`.

## Example

```text
Input
8 5
1 2 1 1 2 3 2 1
1 2
1 3
2 4
2 5
3 6
3 7
7 8
1 2
2 2
3 2
7 1
8 1

Output
2
1
2
2
1
```
