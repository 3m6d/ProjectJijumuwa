# Datasets

Datasets used to train and evaluate Project Jijumuwa's conversational AI.

## communication_interaction/

Sample chatbot-to-user conversation data in Nepali, modeled on interactions
between the bot and elderly users.

- `nepali_conversation_table.md` — Bot question / bot response pairs covering
  daily check-ins, hobbies, family, and life advice.
- `nepali_conversation_table_1.md` — Bot question / bot response pairs framed
  as grandparent-grandchild conversations (memories, routines, well-being).
- `nepali_conversation_sentiment_intent.md` — Chatbot input / user response
  pairs labeled with sentiment (Positive/Neutral/Negative) and intent
  (e.g. Reminder, Emotion, Health Update, Planning).

## training_data/

- `data1.parquet` — Nepali text corpus (news articles) for language
  model / tokenizer training.
- `data2.parquet` — Nepali text corpus (news articles) for language
  model / tokenizer training.
