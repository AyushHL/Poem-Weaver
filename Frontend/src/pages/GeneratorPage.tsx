import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { AI_MODELS } from '../config/index';
import { generatePoemAPI, fetchModelStatus } from '../services/api';
import { Background } from '../components/Background';
import { Toast } from '../components/Toast';
import { Footer } from '../components/Footer';
import type { GeneratedPoem, RecentPoem, ModelStatus } from '../types/index';
import '../styles/Generator.css';

function GeneratorPage() {
  const navigate = useNavigate();
  const [input, setInput] = useState('');
  const [selectedModel, setSelectedModel] = useState('EmbeddingLSTM');
  const [wordCount, setWordCount] = useState(150);
  const [generatedPoem, setGeneratedPoem] = useState<GeneratedPoem | null>(null);
  const [recentPoems, setRecentPoems] = useState<RecentPoem[]>([]);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [toastMsg, setToastMsg] = useState('');
  const [toastVisible, setToastVisible] = useState(false);
  const [modelStatus, setModelStatus] = useState<ModelStatus | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    fetchModelStatus().then(setModelStatus);
    try {
      const stored = localStorage.getItem('poem-history');
      if (stored) setRecentPoems(JSON.parse(stored));
    } catch { /* ignore corrupt data */ }
  }, []);

  const saveToHistory = useCallback((data: GeneratedPoem) => {
    const entry: RecentPoem = {
      _id: Date.now().toString(),
      poem: data.poem,
      keywords: data.keywords,
      createdAt: new Date().toISOString(),
    };
    setRecentPoems(prev => {
      const updated = [entry, ...prev].slice(0, 10);
      localStorage.setItem('poem-history', JSON.stringify(updated));
      return updated;
    });
  }, []);

  const showToast = useCallback((msg: string) => {
    setToastMsg(msg);
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 2500);
  }, []);

  const handleGenerate = async () => {
    const keywords = input
      .split(/[,\s]+/)
      .map(k => k.trim())
      .filter(k => k.length > 0);

    if (keywords.length === 0) {
      showToast('Enter some words first');
      inputRef.current?.focus();
      return;
    }

    setLoading(true);
    try {
      const data = await generatePoemAPI(keywords, selectedModel, wordCount);
      setGeneratedPoem(data);
      showToast(`Generated with ${data.model === 'OneHotRNN' ? 'RNN' : 'LSTM'}`);
      saveToHistory(data);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unknown Error';
      showToast(message.includes('model') ? message : 'Could Not Connect to Server');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !loading) handleGenerate();
  };

  const copyToClipboard = async () => {
    if (!generatedPoem) return;
    try {
      await navigator.clipboard.writeText(generatedPoem.poem);
      setCopied(true);
      showToast('Copied to Clipboard');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      showToast('Failed to Copy');
    }
  };

  const loadRecentPoem = (poem: RecentPoem) => {
    setGeneratedPoem({ poem: poem.poem, keywords: poem.keywords, model: 'EmbeddingLSTM' });
    setInput(poem.keywords.join(', '));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <Background />

      <div className="generator">
        {/* Navigation */}
        <nav className="nav">
          <button className="nav__back" onClick={() => navigate('/')} id="back-btn" type="button">
            ← Back
          </button>
          <span className="nav__brand"><span className="gradient-text">Poem Weaver</span></span>
          {modelStatus && (
            <div className="nav__status">
              <span className="status-indicator">
                <span className={`status-dot ${modelStatus.lstm ? 'status-dot--on' : 'status-dot--off'}`} />
                LSTM
              </span>
              <span className="status-indicator">
                <span className={`status-dot ${modelStatus.rnn ? 'status-dot--on' : 'status-dot--off'}`} />
                RNN
              </span>
            </div>
          )}
        </nav>

        <main>
          {/* Input */}
          <section className="input-section">
            <label className="section-label" htmlFor="keywords-input">
              Your Words
            </label>
            <input
              ref={inputRef}
              id="keywords-input"
              className="input-field"
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Enter Words to Weave into Poetry..."
              disabled={loading}
              autoComplete="off"
            />
            <p className="input-hint">Separate with Commas or Spaces</p>
          </section>

          {/* Poem Length */}
          <section className="length-section">
            <label className="section-label" htmlFor="word-count">Poem Length</label>
            <div className="length-control">
              <input
                id="word-count"
                type="range"
                className="length-slider"
                min={30}
                max={300}
                step={10}
                value={wordCount}
                onChange={e => setWordCount(Number(e.target.value))}
                disabled={loading}
              />
              <div className="length-info">
                <span className="length-value">{wordCount}</span>
                <span className="length-unit">words</span>
              </div>
            </div>
            <div className="length-labels">
              <span>Short</span>
              <span>Medium</span>
              <span>Long</span>
            </div>
          </section>

          {/* Model Selector */}
          <section className="model-section">
            <label className="section-label">Model</label>
            <div className="model-options" id="model-selector">
              {AI_MODELS.map(m => (
                <button
                  key={m.id}
                  className={`model-option ${selectedModel === m.id ? 'model-option--active' : ''}`}
                  onClick={() => setSelectedModel(m.id)}
                  type="button"
                  id={`model-${m.id}`}
                >
                  <span className="model-option__name">{m.name}</span>
                  <span className="model-option__desc">{m.description}</span>
                </button>
              ))}
            </div>
          </section>

          {/* Generate */}
          <button
            className="generate-btn"
            onClick={handleGenerate}
            disabled={loading}
            id="generate-btn"
            type="button"
          >
            {loading ? (
              <>
                <div className="spinner" />
                Generating...
              </>
            ) : (
              'Generate'
            )}
          </button>

          {/* Output */}
          {generatedPoem ? (
            <section className="poem-output" id="poem-output">
              <div className="poem-card">
                <div className="poem-card__header">
                  <h2 className="poem-card__title">Output</h2>
                  <span className="poem-card__badge">
                    {generatedPoem.model === 'OneHotRNN' ? 'RNN' : 'LSTM'}
                  </span>
                </div>

                <div className="poem-card__keywords">
                  {generatedPoem.keywords.map((kw, i) => (
                    <span key={i} className="keyword-tag">{kw}</span>
                  ))}
                </div>

                <div className="poem-text" id="poem-text">
                  {generatedPoem.poem.split('\n').map((line, i) => (
                    <span
                      key={i}
                      className="poem-text-line"
                      style={{ animationDelay: `${i * 0.08}s` }}
                    >
                      {line}
                      {'\n'}
                    </span>
                  ))}
                </div>

                <div className="poem-card__actions">
                  <button
                    className={`action-btn ${copied ? 'action-btn--copied' : ''}`}
                    onClick={copyToClipboard}
                    id="copy-btn"
                    type="button"
                  >
                    {copied ? 'Copied' : 'Copy'}
                  </button>
                  <button
                    className="action-btn"
                    onClick={handleGenerate}
                    id="regenerate-btn"
                    type="button"
                  >
                    Regenerate
                  </button>
                </div>
              </div>
            </section>
          ) : (
            <div className="empty-state" id="empty-state">
              <div className="empty-state__line" />
              <p className="empty-state__text">Your Poem Awaits</p>
              <p className="empty-state__hint">Enter Words Above and Generate</p>
            </div>
          )}

          {/* Recent */}
          {recentPoems.length > 0 && (
            <section className="recent-section" id="recent-poems">
              <h3 className="recent-section__title">Recent</h3>
              {recentPoems.map(poem => (
                <div
                  key={poem._id}
                  className="recent-poem"
                  onClick={() => loadRecentPoem(poem)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={e => e.key === 'Enter' && loadRecentPoem(poem)}
                >
                  <p className="recent-poem__preview">{poem.poem.split('\n')[0]}</p>
                  <div className="recent-poem__meta">
                    {poem.keywords.join(', ')}
                  </div>
                </div>
              ))}
            </section>
          )}
        </main>

        <Footer />
      </div>

      <Toast message={toastMsg} visible={toastVisible} />
    </>
  );
}

export default GeneratorPage;
