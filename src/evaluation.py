# This is to evaluate the model after training

import torch
from transformers import AutoTokenizer, AutoModelForCausalLM
from config import Config

def generate_text(prompt):
    tokenizer = AutoTokenizer.from_pretrained(Config.TOKENIZER_NAME)
    model = AutoModelForCausalLM.from_pretrained(Config.OUTPUT_DIR)

    inputs = tokenizer(prompt, return_tensors='pt')
    output = model.generate(**inputs, max_length=100)

    return tokenizer.decode(output[0], skip_special_tokens=True)

if __name__ == "__main__":
    prompt = "नेपालको भविष्य"
    generated_text = generate_text(prompt)
    print(generated_text)
