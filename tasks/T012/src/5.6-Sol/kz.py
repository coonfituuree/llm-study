w = int(input())
# Жұп бөліктерге бөлу үшін w жұп және 2-ден үлкен болуы керек
answer = "YES" if (w % 2 == 0 and w >= 4) else "NO"
print(answer)
