"use client";

import { type ChatMessage } from "@/app/dj/actions";

import styles from "./MessageBubble.module.css";
import { useMemo } from "react";

export default function MessageBubble({ message }: { message: ChatMessage }) {
  const timestamp = useMemo(() => {
    return new Date(message.timestamp).toLocaleTimeString();
  }, [message.timestamp]);
  return (
    <div className={styles.message} data-user={message.role === "user"}>
      <p className="whitespace-pre-wrap">{message.content as string}</p>

      <div className={styles.timestamp}>{timestamp}</div>
    </div>
  );
}
