# This will handle model training

import torch
from transformers import AutoModelForCausalLM, Trainer, TrainingArguments
from datasets import Dataset
from config import Config
from preprocessing import preprocess_and_tokenize

def load_dataset():
    """Load tokenized dataset."""
    with open(Config.PROCESSED_DATA_PATH, 'r', encoding='utf-8') as file:
        tokenized_data = file.readlines()

    tokenized_data = [list(map(int, line.strip().split())) for line in tokenized_data]

    dataset = Dataset.from_dict({
        'input_ids': tokenized_data,
    })

    return dataset

def train():
    # Preprocess if needed
    preprocess_and_tokenize()
    
    # Load dataset
    dataset = load_dataset()

    # Load model
    model = AutoModelForCausalLM.from_pretrained(Config.MODEL_NAME)

    # Training arguments
    training_args = TrainingArguments(
        output_dir=Config.OUTPUT_DIR,
        num_train_epochs=Config.EPOCHS,
        per_device_train_batch_size=Config.BATCH_SIZE,
        learning_rate=Config.LEARNING_RATE,
        logging_dir='./logs/',
        logging_steps=100,
        save_steps=500,
    )

    # Trainer
    trainer = Trainer(
        model=model,
        args=training_args,
        train_dataset=dataset,
    )

    # Train the model
    trainer.train()

    # Save the final model
    trainer.save_model(Config.OUTPUT_DIR)

if __name__ == "__main__":
    train()
