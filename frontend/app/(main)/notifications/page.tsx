"use client";

import { motion } from "framer-motion";
import RightPanel from "@/components/layout/RightPanel";
import GlassCard from "@/components/ui/GlassCard";
import Badge from "@/components/ui/Badge";

const alerts = [
  { title: "New reply on your whisper", detail: "Velvet responded with a warm little note.", time: "2m ago" },
  { title: "Someone bookmarked your post", detail: "A new stranger saved your post for later.", time: "20m ago" },
  { title: "New follower", detail: "Cloud Nine joined your anonymous circle.", time: "1h ago" },
];

export default function NotificationsPage() {
  return (
    <div className="mx-auto flex max-w-7xl gap-5">
      <section className="flex-1 space-y-4">
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="space-y-4">
          <GlassCard>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-lg font-semibold text-[var(--text)]">Notifications</p>
                <p className="text-sm text-[var(--muted)]">A soft pulse of what is happening around you.</p>
              </div>
              <Badge>3 new</Badge>
            </div>
          </GlassCard>
          <div className="space-y-3">
            {alerts.map((alert) => (
              <GlassCard key={alert.title} hoverable className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-semibold text-[var(--text)]">{alert.title}</p>
                  <p className="mt-1 text-sm text-[var(--muted)]">{alert.detail}</p>
                </div>
                <p className="text-sm text-[var(--secondary)]">{alert.time}</p>
              </GlassCard>
            ))}
          </div>
        </motion.div>
      </section>
      <RightPanel />
    </div>
  );
}
