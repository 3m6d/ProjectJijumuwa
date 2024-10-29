#This file will store configuration details like model paths, batch sizes, learning rates.

# src/config.py

class Config:
    RAW_DATA_PATH = 'data/raw/nepali_text.txt'
    PROCESSED_DATA_PATH = 'data/processed/tokenized_nepali_text.txt'
    
    MODEL_NAME = 'meta-llama/llama-3.2b'  # Model name or path
    TOKENIZER_NAME = 'meta-llama/llama-3.2b'
    
    BATCH_SIZE = 16
    EPOCHS = 5
    LEARNING_RATE = 2e-5
    MAX_SEQ_LENGTH = 512
    OUTPUT_DIR = 'checkpoints/'


