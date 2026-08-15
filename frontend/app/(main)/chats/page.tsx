"use client";

import { motion } from "framer-motion";
import RightPanel from "@/components/layout/RightPanel";
import GlassCard from "@/components/ui/GlassCard";
import Button from "@/components/ui/Button";
import ChatList from "@/components/chat/ChatList";
import { MessageThread } from "@/types";

const chats: MessageThread[] = [
  { id: 1, name: "Velvet", preview: "You always say the gentlest things.", time: "Now", unread: 2, accent: "var(--primary)" },
  { id: 2, name: "Cloud Nine", preview: "I think I needed this tonight.", time: "12m", unread: 0, accent: "var(--accent)" },
  { id: 3, name: "Cocoa Byte", preview: "Let’s keep it soft and honest.", time: "1h", unread: 1, accent: "var(--secondary)" },
];

export default function ChatsPage() {
  return (
    <div className="mx-auto flex max-w-7xl gap-5">
      <section className="flex-1 space-y-4">
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="space-y-4">
          <GlassCard className="flex items-center justify-between gap-3">
            <div>
              <p className="text-lg font-semibold text-[var(--text)]">Chats</p>
              <p className="text-sm text-[var(--muted)]">Gentle, modern conversations with a little sparkle.</p>
            </div>
            <Button size="sm">Start chat</Button>
          </GlassCard>
          <ChatList chats={chats} />
        </motion.div>
      </section>
      <RightPanel />
    </div>
  );
}
