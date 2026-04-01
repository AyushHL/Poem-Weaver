import { useNavigate } from 'react-router-dom';
import { Background } from '../components/Background';
import { Footer } from '../components/Footer';
import '../styles/Landing.css';

function LandingPage() {
  const navigate = useNavigate();

  return (
    <>
      <Background />

      <div className="landing">
        {/* Hero */}
        <section className="hero" id="hero">
          <div className="hero__badge">
            <span className="hero__badge-dot" />
            Neural Poetry Engine
          </div>
          <h1 className="hero__title">
            Transform Words
            <br />
            Into <span className="gradient-text">Poetry</span>
          </h1>
          <p className="hero__desc">
            Two Neural Architectures — RNN and LSTM — Trained on Classical
            Verse. Enter Your Words. Watch them Become Art.
          </p>
          <div className="hero__actions">
            <button
              className="btn-primary"
              onClick={() => navigate('/generate')}
              id="start-btn"
            >
              Start Generating
              <span className="btn-icon">→</span>
            </button>
          </div>
        </section>

        {/* Features */}
        <section className="section" id="features">
          <div className="section__header">
            <span className="section__tag">Features</span>
            <h2 className="section__title">Capabilities</h2>
            <p className="section__desc">
              Everything You Need to Generate Unique, AI-Powered Poetry
            </p>
          </div>
          <div className="bento">
            <div className="bento__card bento__card--lg" id="feature-1">
              <div className="bento__card-icon">🧠</div>
              <h3 className="bento__card-title">Dual Architectures</h3>
              <p className="bento__card-desc">
                Choose Between a One-Hot RNN for Raw Creative Variation or an
                Embedding LSTM for Fluid, Expressive output. Two Distinct AI
                Models, Each with its own Creative Voice.
              </p>
            </div>
            <div className="bento__card" id="feature-2">
              <div className="bento__card-icon">🔤</div>
              <h3 className="bento__card-title">Seed-Based</h3>
              <p className="bento__card-desc">
                Provide Any Word or Phrase. The Network Continues, Producing
                Unique Verse Each Time.
              </p>
            </div>
            <div className="bento__card" id="feature-3">
              <div className="bento__card-icon">⚡</div>
              <h3 className="bento__card-title">Zero Friction</h3>
              <p className="bento__card-desc">
                No Accounts. No API Keys. No Sign-up. Just Open, Type, and
                Generate Instantly.
              </p>
            </div>
            <div className="bento__card bento__card--lg" id="feature-4">
              <div className="bento__card-icon">⚖️</div>
              <h3 className="bento__card-title">Side-by-Side Comparison</h3>
              <p className="bento__card-desc">
                Run Identical Seed Words Through Both Models. Observe How
                Different Neural Architectures Interpret the Same Input,
                Producing Distinctly Different Creative Outputs.
              </p>
            </div>
          </div>
        </section>

        {/* Steps */}
        <section className="section" id="process">
          <div className="section__header">
            <span className="section__tag">Process</span>
            <h2 className="section__title">How It Works</h2>
          </div>
          <div className="steps">
            <div className="step-card">
              <div className="step-card__num">1</div>
              <h4 className="step-card__title">Enter Seed Words</h4>
              <p className="step-card__desc">
                Type any Words, Phrases, or Themes That Inspire You
              </p>
            </div>
            <div className="step-card">
              <div className="step-card__num">2</div>
              <h4 className="step-card__title">Select a model</h4>
              <p className="step-card__desc">
                Pick Between RNN and LSTM Architectures
              </p>
            </div>
            <div className="step-card">
              <div className="step-card__num">3</div>
              <h4 className="step-card__title">Generate</h4>
              <p className="step-card__desc">
                Get Your Poem Instantly — Copy, Regenerate, or Iterate
              </p>
            </div>
          </div>
        </section>

        {/* Tech */}
        <section className="section" id="stack">
          <div className="section__header">
            <span className="section__tag">Stack</span>
            <h2 className="section__title">Built with</h2>
          </div>
          <div className="tech-pills">
            {['PyTorch', 'RNN', 'LSTM', 'React', 'TypeScript', 'Node.js', 'Express', 'MongoDB'].map(t => (
              <span key={t} className="tech-pill">{t}</span>
            ))}
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="cta-bottom">
          <h2 className="cta-bottom__title">
            Ready to <span className="gradient-text">create</span>?
          </h2>
          <button
            className="btn-primary"
            onClick={() => navigate('/generate')}
            id="footer-cta-btn"
          >
            Open Generator
            <span className="btn-icon">→</span>
          </button>
        </section>

        <Footer />
      </div>
    </>
  );
}

export default LandingPage;
