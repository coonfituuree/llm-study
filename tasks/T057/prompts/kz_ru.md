# Сөз сатысы

`beginWord` сөзінен `endWord` сөзіне `wordList` сөздігін пайдаланып **түрлендіру тізбегі** — это последовательность слов `beginWord -> s1 -> s2 -> ... -> sk` такая, что:

- Әрбір көршілес сөз жұбы отличается ровно на одну букву.
- Каждый `si` для `1 <= i <= k` находится в `wordList`. Ескерту: `beginWord` не обязательно должен быть в `wordList`.
- `sk == endWord`

Даны два слова, `beginWord` и `endWord`, и словарь `wordList`, верните *количество слов в кратчайшей последовательности преобразований от* `beginWord` *до* `endWord`*, или* `0` *если такой последовательности не существует.*

## 1-мысал:

**Кіріс:** beginWord = "hit", endWord = "cog", wordList = ["hot","dot","dog","lot","log","cog"]  
**Шығыс:** 5  
**Түсіндірме:** Одна из кратчайших последовательностей преобразований — "hit" -> "hot" -> "dot" -> "dog" -> "cog", которая состоит из 5 слов.

## 2-мысал:

**Кіріс:** beginWord = "hit", endWord = "cog", wordList = ["hot","dot","dog","lot","log"]  
**Шығыс:** 0  
**Түсіндірме:** endWord "cog" отсутствует в wordList, поэтому нет допустимой последовательности преобразований.

## Шектеулер:

- 1 <= beginWord.length <= 10
- endWord.length == beginWord.length
- 1 <= wordList.length <= 5000
- wordList[i].length == beginWord.length
- beginWord, endWord и wordList[i] состоят из строчных английских букв.
- beginWord != endWord
- Все слова в wordList **уникальны**.
