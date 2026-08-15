import { MessageCircleMore } from "lucide-react";
import GlassCard from "@/components/ui/GlassCard";
import Avatar from "@/components/ui/Avatar";
import { MessageThread } from "@/types";

interface ChatListProps {
  chats: MessageThread[];
}

export default function ChatList({ chats }: ChatListProps) {
  return (
    <div className="space-y-3">
      {chats.map((chat) => (
        <GlassCard key={chat.id} hoverable className="flex items-center justify-between gap-3 p-4">
          <div className="flex items-center gap-3">
            <Avatar name={chat.name} emoji="💬" color={chat.accent} size="md" />
            <div>
              <p className="font-semibold text-[var(--text)]">{chat.name}</p>
              <p className="text-sm text-[var(--muted)]">{chat.preview}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs text-[var(--muted)]">{chat.time}</p>
            {chat.unread > 0 ? (
              <div className="mt-2 inline-flex rounded-full bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] px-2.5 py-1 text-xs font-semibold text-[var(--button-text)]">
                {chat.unread}
              </div>
            ) : null}
          </div>
        </GlassCard>
      ))}
    </div>
  );
}
