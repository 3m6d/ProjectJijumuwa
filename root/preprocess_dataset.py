import json
import random
import re
import unicodedata
from transformers import AutoTokenizer

# Import NLTK and download Nepali stopwords
import nltk
from nltk.corpus import stopwords
nltk.download('stopwords', quiet=True)

# -----------------------------
# Step 1. Define Text Processing Functions
# -----------------------------

def normalize_text(text):
    """
    Normalize Unicode to NFC form and perform simple character fixes,
    e.g., replacing any vertical bar with the proper Devanagari danda.
    """
    text = unicodedata.normalize("NFC", text)
    text = text.replace("|", "।")
    return text

def remove_html_tags(text):
    """Remove HTML tags using a simple regex."""
    clean = re.compile('<.*?>')
    return re.sub(clean, '', text)

def remove_unwanted_punctuation(text):
    """
    Remove unwanted punctuation while retaining essential Nepali punctuation.
    We keep key markers like the danda (।), question mark (?), and exclamation mark (!).
    """
    # Remove quotes, parentheses, hyphens, and similar characters.
    return re.sub(r'[“”‘’"\(\)\[\]\{\}-]', '', text)

def remove_extra_whitespace(text):
    """Replace multiple spaces with a single space and trim the text."""
    return re.sub(r'\s+', ' ', text).strip()

def remove_stopwords_text(text, stopwords_set):
    """
    Remove stopwords from the text.
    Note: For generative tasks it is often better to keep stopwords,
    but here we demonstrate stopword removal based on your research requirement.
    """
    words = text.split()
    filtered_words = [word for word in words if word not in stopwords_set]
    return ' '.join(filtered_words)

def process_text(text, remove_stopwords_flag=True, stopwords_set=None):
    """
    Apply a series of cleaning steps:
      - Remove HTML tags.
      - Normalize the text.
      - Remove unwanted punctuation.
      - Remove extra whitespace.
      - Optionally remove stopwords.
    """
    text = remove_html_tags(text)
    text = normalize_text(text)
    text = remove_unwanted_punctuation(text)
    text = remove_extra_whitespace(text)
    if remove_stopwords_flag and stopwords_set is not None:
        text = remove_stopwords_text(text, stopwords_set)
    return text

# -----------------------------
# Step 2. Process and Split the Dataset
# -----------------------------

def process_and_split_dataset(validation_ratio=0.1, seed=42):
    # Define file paths
    INPUT_FILE = "data/nepali_data.jsonl"
    TRAIN_OUTPUT_FILE = "data/nepali_data_train_processed.jsonl"
    VAL_OUTPUT_FILE = "data/nepali_data_val_processed.jsonl"
    
    # Load the custom Nepali Tokenizer from Hugging Face
    tokenizer = AutoTokenizer.from_pretrained("universalml/Nepali_Tokenizer")
    
    # Ensure the tokenizer has an EOS token; if not, add one.
    if not tokenizer.eos_token:
        tokenizer.add_special_tokens({'eos_token': '<EOS>'})
    
    # Load Nepali stopwords from NLTK (this list can be adjusted or replaced as needed)
    nepali_stopwords = set(stopwords.words('nepali'))
    
    # Read raw data lines from the input JSONL file.
    with open(INPUT_FILE, "r", encoding="utf-8") as fin:
        lines = fin.readlines()
    
    # Shuffle and split the data into training and validation sets.
    random.seed(seed)
    random.shuffle(lines)
    split_idx = int(len(lines) * (1 - validation_ratio))
    train_lines = lines[:split_idx]
    val_lines = lines[split_idx:]
    
    def process_lines(lines, output_file):
        with open(output_file, "w", encoding="utf-8") as fout:
            for line in lines:
                try:
                    data = json.loads(line)
                    question = data.get("question", "")
                    answer = data.get("answer", "")
                    
                    # Process the question and answer texts.
                    processed_question = process_text(question, remove_stopwords_flag=True, stopwords_set=nepali_stopwords)
                    processed_answer = process_text(answer, remove_stopwords_flag=True, stopwords_set=nepali_stopwords)
                    
                    # Build the prompt and completion. The EOS token is appended to the answer.
                    entry = {
                        "prompt": f"Q: {processed_question}\nA:",
                        "completion": f" {processed_answer}{tokenizer.eos_token}"
                    }
                    fout.write(json.dumps(entry, ensure_ascii=False) + "\n")
                except Exception as e:
                    print(f"Error processing line: {line}\nError: {str(e)}")
    
    # Process and write training and validation files.
    process_lines(train_lines, TRAIN_OUTPUT_FILE)
    process_lines(val_lines, VAL_OUTPUT_FILE)
    print(f"Training data saved to {TRAIN_OUTPUT_FILE}")
    print(f"Validation data saved to {VAL_OUTPUT_FILE}")

# -----------------------------
# Step 3. Run Preprocessing
# -----------------------------
if __name__ == "__main__":
    process_and_split_dataset()
