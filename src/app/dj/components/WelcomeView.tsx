import { useState } from 'react';

interface WelcomeViewProps {
  onSubmit: (prompt: string) => void;
}

export function WelcomeView({ onSubmit }: WelcomeViewProps) {
  const [prompt, setPrompt] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim()) {
      onSubmit(prompt);
    }
  };

  return (
    <div className="welcome-view">
      <h1>Welcome to AI DJ</h1>
      <p>Tell me what kind of music you'd like to hear</p>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="e.g., play me some chill coffee shop songs"
          className="prompt-input"
        />
        <button type="submit">Let's Go</button>
      </form>

      <style jsx>{`
        .welcome-view {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
          max-width: 600px;
          margin: 0 auto;
        }
        .prompt-input {
          width: 100%;
          padding: 1rem;
          font-size: 1rem;
          border: 1px solid #333;
          border-radius: 8px;
          background: transparent;
          color: inherit;
          margin-bottom: 1rem;
        }
        button {
          padding: 0.75rem 2rem;
          font-size: 1rem;
          border-radius: 8px;
          border: none;
          background: #333;
          color: white;
          cursor: pointer;
          transition: background 0.2s;
        }
        button:hover {
          background: #444;
        }
      `}</style>
    </div>
  );
}
