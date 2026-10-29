def capitalize_word(w):
    return w[0].upper() + w[1:] if w else w

print(capitalize_word(input().strip()))
