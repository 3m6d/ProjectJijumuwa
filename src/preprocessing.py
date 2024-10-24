# This is the preprocessing step. Here, I can preprocess the raw dataset and save the tokenized version.

import re
from transformers import AutoTokenizer
from config import Config

def clean_text(text):
    """Remove unwanted characters, extra spaces, etc."""
    text = re.sub(r'\s+', ' ', text)
    text = text.strip()
    return text

def preprocess_and_tokenize():
    """Preprocess and tokenize the raw Nepali dataset."""
    tokenizer = AutoTokenizer.from_pretrained(Config.TOKENIZER_NAME)

    with open(Config.RAW_DATA_PATH, 'r', encoding='utf-8') as file:
        raw_text = file.readlines()

    cleaned_text = [clean_text(line) for line in raw_text]
    
    # Tokenize text
    tokenized_text = tokenizer(cleaned_text, padding='max_length', max_length=Config.MAX_SEQ_LENGTH, truncation=True)
    
    # Save tokenized text
    with open(Config.PROCESSED_DATA_PATH, 'w', encoding='utf-8') as outfile:
        for ids in tokenized_text['input_ids']:
            outfile.write(' '.join(map(str, ids)) + '\n')

if __name__ == "__main__":
    preprocess_and_tokenize()


