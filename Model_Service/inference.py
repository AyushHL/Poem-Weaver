import torch
import torch.nn as nn
import torch.nn.functional as F
import os
import json
import random
import logging
from flask import Flask, request, jsonify
from flask_cors import CORS

# Suppress Flask/Werkzeug Default Logs
logging.getLogger('werkzeug').setLevel(logging.ERROR)

import flask.cli
flask.cli.show_server_banner = lambda *args, **kwargs: None

# Configuration
MODEL_DIR = os.path.join(os.path.dirname(__file__), 'Model_Artifacts')
RNN_MODEL_PATH = os.path.join(MODEL_DIR, 'onehot_rnn.pt')
LSTM_MODEL_PATH = os.path.join(MODEL_DIR, 'embedding_lstm.pt')
VOCAB_PATH = os.path.join(MODEL_DIR, 'vocab.json')

SEQ_LENGTH = 10

# Model Definitions

class OneHotRNN(nn.Module):
    def __init__(self, vocab_size, hidden_dim, output_dim):
        super(OneHotRNN, self).__init__()
        self.rnn = nn.RNN(vocab_size, hidden_dim, batch_first=True)
        self.fc = nn.Linear(hidden_dim, output_dim)

    def forward(self, x):
        output, _ = self.rnn(x)
        out = self.fc(output[:, -1, :])
        return out

class PoemLSTM(nn.Module):
    def __init__(self, vocab_size, embed_dim, hidden_dim, output_dim):
        super(PoemLSTM, self).__init__()
        self.embedding = nn.Embedding(vocab_size, embed_dim)
        self.lstm = nn.LSTM(embed_dim, hidden_dim, batch_first=True)
        self.fc = nn.Linear(hidden_dim, output_dim)

    def forward(self, x):
        embedded = self.embedding(x)
        output, _ = self.lstm(embedded)
        out = self.fc(output[:, -1, :])
        return out

# Global State
onehot_model = None
embedding_model = None
word_to_idx = {}
idx_to_word = {}
vocab_size = 0

def load_models():
    # Load Pre-Trained Models
    global onehot_model, embedding_model, word_to_idx, idx_to_word, vocab_size

    if not os.path.exists(VOCAB_PATH):
        print(f"  ❌  vocab.json not Found at {VOCAB_PATH}")
        return False

    # Load Vocabulary
    print("📂 Loading Vocabulary...")
    with open(VOCAB_PATH, 'r', encoding='utf-8') as f:
        vocab_data = json.load(f)
        word_to_idx = vocab_data['word_to_idx']
        idx_to_word = {int(k): v for k, v in vocab_data['idx_to_word'].items()}
        vocab_size = len(word_to_idx)
    print(f"✅ Vocabulary Loaded | Vocabulary Size: {vocab_size}")
    print()

    # Load OneHotRNN
    if os.path.exists(RNN_MODEL_PATH):
        print("📂 Loading OneHotRNN Model...")
        rnn_ckpt = torch.load(RNN_MODEL_PATH, map_location='cpu', weights_only=True)
        onehot_model = OneHotRNN(rnn_ckpt['vocab_size'], rnn_ckpt['hidden_dim'], rnn_ckpt['vocab_size'])
        onehot_model.load_state_dict(rnn_ckpt['model_state_dict'])
        onehot_model.eval()
        print("✅ OneHotRNN Loaded")
        print()
    else:
        print("⚠️ onehot_rnn.pt not Found — RNN Model Unavailable")
        print()

    # Load EmbeddingLSTM
    if os.path.exists(LSTM_MODEL_PATH):
        print("📂 Loading EmbeddingLSTM Model...")
        lstm_ckpt = torch.load(LSTM_MODEL_PATH, map_location='cpu', weights_only=True)
        embedding_model = PoemLSTM(
            lstm_ckpt['vocab_size'], lstm_ckpt['embed_dim'],
            lstm_ckpt['hidden_dim'], lstm_ckpt['vocab_size'],
        )
        embedding_model.load_state_dict(lstm_ckpt['model_state_dict'])
        embedding_model.eval()
        print("✅ EmbeddingLSTM Loaded")
        print()
    else:
        print("⚠️ embedding_lstm.pt not Found — LSTM Model Unavailable")
        print()

    if onehot_model is None and embedding_model is None:
        print("❌ No Models Loaded.")
        print()
        return False

    return True

# Poem Generation
def generate_poem(model, seed_text, num_words=50, model_type="EmbeddingLSTM"):
    model.eval()
    words = seed_text.split()

    original_len = len(words)
    padding_len = max(0, SEQ_LENGTH - original_len)

    # Pad Seed if Shorter than Sequence Length
    if padding_len > 0:
        words = ['the'] * padding_len + words

    with torch.no_grad():
        for _ in range(num_words):
            seq = [word_to_idx.get(word, 0) for word in words[-SEQ_LENGTH:]]
            seq = torch.tensor(seq, dtype=torch.long).unsqueeze(0)

            if model_type == "OneHotRNN":
                seq = F.one_hot(seq, num_classes=vocab_size).float()

            output = model(seq)
            probabilities = F.softmax(output, dim=1)
            predicted_idx = torch.multinomial(probabilities, 1).item()

            words.append(idx_to_word.get(predicted_idx, ''))

    # Remove Artificial Padding before Formatting Output
    final_text = " ".join(words[padding_len:])
    return format_as_poem(final_text)

def format_as_poem(text):
    # Format Raw Generated Text into Poem-like Lines
    words = text.split()
    lines = []
    current_line = []

    for word in words:
        current_line.append(word)
        if (len(current_line) >= 6 and any(word.endswith(p) for p in (',', '.', ';', ':', '!', '?', '—'))) or \
           len(current_line) >= 10:
            lines.append(" ".join(current_line))
            current_line = []

    if current_line:
        lines.append(" ".join(current_line))

    # Group into Stanzas (Every 4 Lines)
    stanzas = []
    for i in range(0, len(lines), 4):
        stanza = "\n".join(lines[i:i+4])
        stanzas.append(stanza)

    return "\n\n".join(stanzas)

# Flask API
app = Flask(__name__)
CORS(app)

@app.route('/api/health', methods=['GET'])
def health():
    return jsonify({
        'status': 'ok',
        'rnn_loaded': onehot_model is not None,
        'lstm_loaded': embedding_model is not None,
        'vocab_size': vocab_size,
    })

@app.route('/api/generate', methods=['POST'])
def api_generate():
    data = request.get_json()
    keywords = data.get('keywords', [])
    num_words = data.get('num_words', 150)
    model_choice = data.get('model', 'EmbeddingLSTM')        # "OneHotRNN" or "EmbeddingLSTM"

    if not keywords:
        return jsonify({'error': 'Please Provide Keywords'}), 400

    seed_text = " ".join(keywords)

    # Pick the Model
    if model_choice == "OneHotRNN" and onehot_model is not None:
        poem = generate_poem(onehot_model, seed_text, num_words, model_type="OneHotRNN")
        used_model = "OneHotRNN"
    elif embedding_model is not None:
        poem = generate_poem(embedding_model, seed_text, num_words, model_type="EmbeddingLSTM")
        used_model = "EmbeddingLSTM"
    elif onehot_model is not None:
        poem = generate_poem(onehot_model, seed_text, num_words, model_type="OneHotRNN")
        used_model = "OneHotRNN"
    else:
        return jsonify({'error': 'No Models Loaded.'}), 503

    return jsonify({
        'poem': poem,
        'keywords': keywords,
        'model': used_model,
    })

@app.route('/api/vocab-sample', methods=['GET'])
def vocab_sample():
    # Return Sample Words from the Vocabulary for Suggestions 
    valid_words = [w for w in word_to_idx.keys() if len(w) > 3 and w.isalpha()]
    sample_words = random.sample(valid_words, min(20, len(valid_words)))
    return jsonify({'words': sample_words})

# Main
if __name__ == '__main__':
    print("🎭 Poem Generator — ML Service")
    print()

    load_models()

    PORT = int(os.environ.get('PORT', 5001))
    print(f"🚀 Server Running on Port {PORT}")
    print(f"🔗 http://localhost:{PORT}")
    print()

    app.run(host='0.0.0.0', port=PORT, debug=False)
