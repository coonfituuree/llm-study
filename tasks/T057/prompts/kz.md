# Сөз сатысы

`beginWord` сөзінен `endWord` сөзіне `wordList` сөздігін пайдаланып **түрлендіру тізбегі** — бұл `beginWord -> s1 -> s2 -> ... -> sk` сөздер тізбегі, мұнда:

- Әрбір көршілес сөз жұбы бір әріппен ерекшеленеді.
- `1 <= i <= k` үшін әрбір `si` `wordList` ішінде. Ескерту: `beginWord` `wordList` ішінде болуы міндетті емес.
- `sk == endWord`

Екі сөз берілген, `beginWord` және `endWord`, және `wordList` сөздігі, `beginWord`-тан `endWord`-қа дейінгі ең қысқа түрлендіру тізбегіндегі сөздер санын қайтарыңыз, немесе мұндай тізбек жоқ болса `0` қайтарыңыз.

## 1-мысал:

**Кіріс:** beginWord = "hit", endWord = "cog", wordList = ["hot","dot","dog","lot","log","cog"]  
**Шығыс:** 5  
**Түсіндірме:** Ең қысқа түрлендіру тізбектерінің бірі "hit" -> "hot" -> "dot" -> "dog" -> "cog", бұл 5 сөзден тұрады.

## 2-мысал:

**Кіріс:** beginWord = "hit", endWord = "cog", wordList = ["hot","dot","dog","lot","log"]  
**Шығыс:** 0  
**Түсіндірме:** endWord "cog" wordList ішінде жоқ, сондықтан жарамды түрлендіру тізбегі жоқ.

## Шектеулер:

- 1 <= beginWord.length <= 10
- endWord.length == beginWord.length
- 1 <= wordList.length <= 5000
- wordList[i].length == beginWord.length
- beginWord, endWord және wordList[i] кіші ағылшын әріптерінен тұрады.
- beginWord != endWord
- wordList ішіндегі барлық сөздер **бірегей**.
