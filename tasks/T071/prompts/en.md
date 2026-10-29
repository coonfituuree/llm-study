# Tree Requests

## Task

You are given a rooted tree with `n` vertices. Vertex `1` is the root.

Each vertex contains one lowercase English letter.

For each query `(v, h)`, consider all vertices that:

- belong to the subtree of vertex `v`;
- have depth exactly `h`.

You may rearrange all letters written on those vertices in any order.

Determine whether it is possible to form a palindrome using all of those letters.

An empty string is considered a palindrome.

## Input

The first line contains two integers `n` and `m` — the number of vertices and the number of queries.

The second line contains `n - 1` integers:

```text
p2 p3 ... pn
```

where `pi` is the parent of vertex `i`.

The next line contains a string of `n` lowercase English letters. The `i`-th letter belongs to vertex `i`.

The following `m` lines each contain two integers:

```text
v h
```

describing one query.

## Output

For every query print:

- `Yes` if the letters can be rearranged into a palindrome;
- `No` otherwise.

## Constraints

- `1 <= n, m <= 500000`
- `1 <= pi < i`
- `1 <= v, h <= n`

## Example

```text
Input
6 5
1 1 1 3 3
zacccd
1 1
3 3
4 1
6 1
1 2

Output
Yes
No
Yes
Yes
Yes
```
