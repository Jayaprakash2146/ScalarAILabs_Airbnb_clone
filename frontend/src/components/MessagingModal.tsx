"use client";

/**
 * Mocked guest↔host messaging (placeholder section per the assignment).
 * The thread is simulated locally with canned replies — no real transport.
 */
import { useEffect, useRef, useState } from "react";
import { CloseIcon } from "@/components/Icons";
import { useToast } from "@/lib/toast";

interface Message {
  from: "guest" | "host";
  text: string;
}

const CANNED_REPLIES = [
  "Hi! Thanks for reaching out — yes, the place is available. Ask me anything!",
  "Great question! Check-in is anytime after 2 PM, and I share a self check-in code a day before arrival.",
  "Absolutely — the neighbourhood is safe and walkable, with cafés and a market 5 minutes away.",
  "You'll love it here! Let me know if you'd like restaurant recommendations too.",
];

interface Props {
  open: boolean;
  hostName: string;
  listingTitle: string;
  onClose: () => void;
}

export default function MessagingModal({ open, hostName, listingTitle, onClose }: Props) {
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([]);
  const [draft, setDraft] = useState("");
  const threadRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open && messages.length === 0) {
      setMessages([
        {
          from: "host",
          text: `Hi! I'm ${hostName.split(" ")[0]} — thanks for your interest in my place. How can I help?`,
        },
      ]);
    }
  }, [open, hostName, messages.length]);

  useEffect(() => {
    threadRef.current?.scrollTo({ top: threadRef.current.scrollHeight });
  }, [messages]);

  if (!open) return null;

  const send = () => {
    const text = draft.trim();
    if (!text) return;
    setMessages((m) => [...m, { from: "guest", text }]);
    setDraft("");
    setTimeout(() => {
      const reply = CANNED_REPLIES[Math.floor(Math.random() * CANNED_REPLIES.length)];
      setMessages((m) => [...m, { from: "host", text: reply }]);
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-end justify-center bg-black/50 p-0 sm:items-center sm:p-4">
      <div className="flex h-[85vh] w-full max-w-lg flex-col rounded-t-2xl bg-white shadow-pop sm:h-[600px] sm:rounded-2xl">
        <div className="flex items-center justify-between border-b border-line p-4">
          <div>
            <p className="font-semibold">{hostName}</p>
            <p className="truncate text-xs text-foggy">{listingTitle}</p>
          </div>
          <button onClick={onClose} aria-label="Close messages" className="rounded-full p-2 hover:bg-mist">
            <CloseIcon />
          </button>
        </div>

        <div
          ref={threadRef}
          className="flex-1 space-y-3 overflow-y-auto bg-mist p-4"
        >
          {messages.map((m, i) => (
            <div
              key={i}
              className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm ${
                m.from === "guest"
                  ? "ml-auto bg-rausch text-white"
                  : "bg-white shadow-search"
              }`}
            >
              {m.text}
            </div>
          ))}
        </div>

        <div className="border-t border-line p-3">
          <p className="pb-2 text-center text-[11px] font-medium uppercase tracking-wide text-foggy">
            Demo messaging — replies are simulated, no messages are sent
          </p>
          <div className="flex gap-2">
            <input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
              placeholder={`Message ${hostName.split(" ")[0]}…`}
              className="flex-1 rounded-full border border-line px-4 py-2.5 text-sm outline-none focus:border-hof"
            />
            <button
              onClick={() => {
                if (!draft.trim()) {
                  toast("Type a message first", "info");
                  return;
                }
                send();
              }}
              className="rounded-full bg-gradient-to-r from-arches to-rausch px-5 py-2.5 text-sm font-semibold text-white"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
