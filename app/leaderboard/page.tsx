import React from "react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Trophy, Award, Clock, Medal } from "lucide-react";
import { prisma } from "@/lib/database/prisma";
import { formatTime } from "@/lib/utils";

export const revalidate = 10; // Refresh every 10 seconds for real-time ranking

export default async function LeaderboardPage() {
  const attempts = await prisma.quizAttempt.findMany({
    take: 50,
    orderBy: [
      { score: "desc" },
      { timeTakenSeconds: "asc" },
      { completedAt: "asc" },
    ],
    include: {
      participant: true,
    },
  });

  return (
    <div className="container mx-auto px-4 sm:px-6 py-12 space-y-12 max-w-5xl">
      <SectionHeading
        badge="REAL-TIME RANKINGS"
        title="SPARKTRON 2K26 Quiz Leaderboard"
        description="Rankings automatically calculated by highest score followed by fastest completion time."
      />

      {attempts.length === 0 ? (
        <Card className="text-center p-12 text-slate-400 font-mono">
          No quiz attempts submitted yet. Be the first to claim Rank 1!
        </Card>
      ) : (
        <div className="space-y-4">
          {/* Top 3 Podium Highlights */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            {attempts.slice(0, 3).map((item, idx) => {
              const rankStyles = [
                { title: "RANK 1", color: "text-amber-400", border: "border-amber-500/40 bg-amber-500/10" },
                { title: "RANK 2", color: "text-slate-300", border: "border-slate-400/40 bg-slate-400/10" },
                { title: "RANK 3", color: "text-amber-600", border: "border-amber-700/40 bg-amber-700/10" },
              ][idx];

              return (
                <Card key={item.id} className={`text-center space-y-2 ${rankStyles.border}`}>
                  <Trophy className={`w-8 h-8 ${rankStyles.color} mx-auto`} />
                  <span className={`text-xs font-mono font-bold ${rankStyles.color}`}>
                    {rankStyles.title}
                  </span>
                  <h3 className="text-lg font-bold text-white truncate">{item.participant.name}</h3>
                  <p className="text-xs font-mono text-slate-400 truncate">{item.participant.college}</p>
                  <div className="pt-2 flex justify-center gap-4 text-xs font-mono">
                    <span className="text-primary font-bold">{item.score} PTS</span>
                    <span className="text-cyan">{formatTime(item.timeTakenSeconds)}</span>
                  </div>
                </Card>
              );
            })}
          </div>

          {/* Full Table */}
          <div className="rounded-2xl border border-primary/20 bg-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-background border-b border-primary/20 text-xs font-mono text-slate-400 uppercase tracking-wider">
                  <tr>
                    <th className="py-3.5 px-4">Rank</th>
                    <th className="py-3.5 px-4">Participant</th>
                    <th className="py-3.5 px-4">College</th>
                    <th className="py-3.5 px-4 text-center">Score</th>
                    <th className="py-3.5 px-4 text-right">Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-primary/10 font-mono">
                  {attempts.map((item, index) => (
                    <tr key={item.id} className="hover:bg-primary/5 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-primary">
                        #{index + 1}
                      </td>
                      <td className="py-3.5 px-4 font-bold text-white font-sans">
                        {item.participant.name}
                      </td>
                      <td className="py-3.5 px-4 text-xs text-slate-300">
                        {item.participant.college}
                      </td>
                      <td className="py-3.5 px-4 text-center font-bold text-emerald-400">
                        {item.score} pts
                      </td>
                      <td className="py-3.5 px-4 text-right text-xs text-cyan">
                        {formatTime(item.timeTakenSeconds)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
