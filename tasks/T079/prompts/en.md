# Holes

## Task

There are `N` holes arranged in one row and numbered from `1` to `N`.

Each hole `i` has a positive power `a[i]`.

If a ball is thrown into hole `i`, it immediately jumps to hole `i + a[i]`. From there, it continues jumping in the same way. If the next hole number is outside the range `1..N`, the ball leaves the row.

You must process `M` operations of two types:

- `0 a b` — set the power of hole `a` to `b`.
- `1 a` — throw a ball into hole `a`.

For every operation of type `1`, determine:
1. the last hole visited before the ball leaves the row;
2. the total number of jumps made by the ball.

## Input

The first line contains two integers `N` and `M`.

The second line contains `N` positive integers — the initial powers of the holes.

The next `M` lines describe the operations.

## Output

For every operation of type `1`, print two space-separated integers:

```text
last_hole number_of_jumps
```

## Constraints

- `1 <= N <= 100000`
- `1 <= M <= 100000`
- `1 <= a[i] <= N`
- In update operations, `1 <= a, b <= N`

## Example

```text
Input
8 5
1 1 1 1 1 2 8 2
1 1
0 1 3
1 1
0 3 4
1 2

Output
8 7
8 5
7 3
```
