# Next Round

## Task

There are `n` contestants whose scores are given in non-increasing order.

A contestant advances to the next round if:

1. their score is at least the score of the contestant in position `k`;
2. their score is greater than zero.

Determine how many contestants advance.

## Input

The first line contains two integers `n` and `k`.

The second line contains `n` integers `a1, a2, ..., an` representing the contestants' scores in non-increasing order.

## Output

Print one integer: the number of contestants who advance.

## Constraints

- `1 <= k <= n <= 50`
- `0 <= ai <= 100`
- The scores are given in non-increasing order.

## Example 1

```text
Input
8 5
10 9 8 7 7 7 5 5

Output
6
```

## Example 2

```text
Input
4 2
0 0 0 0

Output
0
```
