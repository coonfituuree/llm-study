s = input().strip()
# Используем counting sort, так как только 1,2,3
from collections import Counter
cnt = Counter(s.split('+'))
result = []
for d in ['1', '2', '3']:
    result.extend([d] * cnt[d])
print('+'.join(result))
