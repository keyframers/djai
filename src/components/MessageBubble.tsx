"use client";

import { type ChatMessage } from "@/app/dj/actions";

import styles from "./MessageBubble.module.css";

export default function MessageBubble({ message }: { message: ChatMessage }) {
  return (
    <div className={styles.message} data-user={message.role === "user"}>
      <p className="whitespace-pre-wrap">{message.content as string}</p>

      <div className={styles.timestamp}>
        {new Date(message.timestamp).toLocaleTimeString()}
      </div>
    </div>
  );
}
