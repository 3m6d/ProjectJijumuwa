import math
from transformers import AutoModelForCausalLM, AutoTokenizer, Trainer, TrainingArguments, DataCollatorForLanguageModeling
from datasets import load_dataset
import logging

# Set logging to info to monitor progress during fine-tuning.
logging.basicConfig(level=logging.INFO)

# -----------------------------
# Step 1: Load the Tokenizer and Model
# -----------------------------
# Use the custom Nepali tokenizer to ensure consistency between preprocessing and fine-tuning.
tokenizer = AutoTokenizer.from_pretrained("universalml/Nepali_Tokenizer")

# Make sure that the tokenizer has an EOS token. This is important for text-generation tasks.
if not tokenizer.eos_token:
    tokenizer.add_special_tokens({'eos_token': '<EOS>'})

# Load the base model (this is built upon Meta-llama/Llama-3.1-8B-Instruct)
model = AutoModelForCausalLM.from_pretrained("universalml/NepaliGPT-2.0", use_safetensors=False)

# If you've added tokens (like an EOS), make sure to resize the model embeddings.
model.resize_token_embeddings(len(tokenizer))

# -----------------------------
# Step 2: Load and Tokenize the Dataset
# -----------------------------
# We assume that the preprocessed data was split into training and validation files.
dataset = load_dataset("json", data_files={
    "train": "data/nepali_data_train_processed.jsonl",
    "validation": "data/nepali_data_val_processed.jsonl"
})

def tokenize_function(example):
    # Concatenate prompt and completion into one sequence.
    # This is critical to maintain the Q&A format that was defined during preprocessing.
    # Truncation and max_length parameters ensure that the input does not exceed model limits.
    return tokenizer(example["prompt"] + example["completion"],
                     truncation=True,
                     max_length=512)

# Tokenize the dataset in batches (removing the original fields as they are no longer needed).
tokenized_datasets = dataset.map(tokenize_function, batched=True, remove_columns=["prompt", "completion"])

# -----------------------------
# Step 3: Set Up Data Collator for Causal Language Modeling
# -----------------------------
# The DataCollator prepares batches of tokenized data and handles padding.
data_collator = DataCollatorForLanguageModeling(tokenizer=tokenizer, mlm=False)

# -----------------------------
# Step 4: Define Evaluation Metric - Perplexity
# -----------------------------
# Perplexity provides a measure of how well the model predicts the validation data.
def compute_metrics(eval_pred):
    loss = eval_pred.metrics["eval_loss"]
    # Avoid overflow; if loss is extremely high, set perplexity as infinity.
    perplexity = math.exp(loss) if loss < 100 else float("inf")
    return {"perplexity": perplexity}

# -----------------------------
# Step 5: Configure Training Arguments and Trainer
# -----------------------------
training_args = TrainingArguments(
    output_dir="./nepaligpt_model",
    overwrite_output_dir=True,
    num_train_epochs=3,                  # Adjust epochs as needed
    per_device_train_batch_size=2,       # Change to match your GPU/memory constraints
    per_device_eval_batch_size=2,
    evaluation_strategy="steps",         # Evaluate at fixed intervals
    eval_steps=500,                      # Frequency (in steps) of evaluation
    save_steps=500,                      # Frequency (in steps) to save the model
    save_total_limit=2,                  # Limit to the number of checkpoints saved
    logging_steps=100,                   # Logging frequency
    prediction_loss_only=True,           # Only compute loss for evaluation
)

trainer = Trainer(
    model=model,
    args=training_args,
    train_dataset=tokenized_datasets["train"],
    eval_dataset=tokenized_datasets["validation"],
    data_collator=data_collator,
    compute_metrics=compute_metrics
)

# -----------------------------
# Step 6: Fine-tune and Evaluate
# -----------------------------
def main():
    # Start the training process.
    trainer.train()
    
    # Save the final model to disk.
    trainer.save_model("./nepaligpt_model")
    
    # Evaluate the model on the validation dataset.
    eval_results = trainer.evaluate()
    print("Evaluation Results:")
    print(eval_results)

if __name__ == "__main__":
    main()
