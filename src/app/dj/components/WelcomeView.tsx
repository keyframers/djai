/* eslint-disable react/no-unescaped-entities */
import { ContentBox } from "@/components/ContentBox";
import { useState } from "react";
import Button from "@/components/Button";
import styles from "./WelcomeView.module.css";

interface WelcomeViewProps {
  onSubmit: (prompt: string) => void;
}

export function WelcomeView({ onSubmit }: WelcomeViewProps) {
  const [prompt, setPrompt] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim()) {
      onSubmit(prompt);
    }
  };

  return (
    <ContentBox className={styles.welcomeBox}>
      <h1>Welcome to DJai</h1>
      <p>Tell me what kind of music you'd like to hear</p>
      <form onSubmit={handleSubmit}>
        <input
          className={styles.input}
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="e.g., play me some chill coffee shop songs"
        />
        <Button className={styles.button} type="submit">
          Let's Go
        </Button>
      </form>
    </ContentBox>
  );
}
