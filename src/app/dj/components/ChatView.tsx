"use client";

import { useActionState, useRef, useEffect } from "react";
import { useFormStatus } from "react-dom";
import { sendChatMessage, type ChatState, type ChatMessage } from "../actions";
import { appStore } from "@/app/store";
import Button from "@/components/Button";
import MessageBubble from "@/components/MessageBubble";

import styles from "./ChatView.module.css";

import { useSelector } from "@xstate/store/react";

const initialState: ChatState = {
  messages: [],
};

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending}>
      {pending ? "..." : "Send"}
    </Button>
  );
}

export default function ChatView() {
  const [state, formAction] = useActionState(sendChatMessage, initialState);
  const formRef = useRef<HTMLFormElement>(null);
  const { pending } = useFormStatus();

  const messages = useSelector(appStore, (state) => state.context.messages);

  console.log({ messages });

  console.log(state);
  const lastMessage = messages.at(-1);

  useEffect(() => {
    // appStore.trigger.setMessages({
    //   messages: state.messages,
    // });

    if (lastMessage?.role === "assistant") {
      switch (lastMessage.response?.action.actionType) {
        case "RECOMMEND_SONGS":
          appStore.trigger.addNode({
            node: {
              view: "explore",
              prompt: lastMessage.response.action.prompt,
              songs: lastMessage.response.action.songs.map((song) => ({
                ...song,
                tags: [],
              })),
            },
          });
      }
    }
  }, [lastMessage]);

  useEffect(() => {
    appStore.trigger.setMessages({
      messages: state.messages,
    });
  }, [state.messages]);

  return (
    <div className={styles.root}>
      <div className={styles.messages}>
        {state.messages.length === 0 ? (
          <MessageBubble
            message={{
              role: "assistant",
              content:
                "Welcome to DJ! Ask me for music recommendations or music questions.",
              timestamp: Date.now(),
              response: null,
            }}
          />
        ) : (
          messages.map((message: ChatMessage, i) => (
            <MessageBubble key={i} message={message} />
          ))
        )}

        {pending && (
          <div className="pendingMessage">
            <div className="pendingBubble">
              <div className="pendingSpinnerContainer">
                <div className="pendingSpinner"></div>
                <span className="pendingText">DJ is thinking...</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input Form */}
      <div className="inputContainer">
        <form
          ref={formRef}
          action={(formData) => {
            // optimistic ui
            appStore.trigger.setMessages({
              messages: [
                ...state.messages,
                {
                  role: "user",
                  content: formData.get("prompt") as string,
                  timestamp: Date.now(),
                },
              ],
            });
            return formAction(formData);
          }}
          className="flex gap-2"
          onSubmit={() => {
            // Reset form after submission
            setTimeout(() => formRef.current?.reset(), 0);
          }}
        >
          <input
            type="text"
            name="prompt"
            placeholder="Ask for music recommendations or music questions..."
            className="inputField"
            disabled={pending}
            required
          />
          <SubmitButton />
        </form>
      </div>
    </div>
  );
}
