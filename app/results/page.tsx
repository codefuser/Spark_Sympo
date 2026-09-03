import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Card, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Trophy, Award, Clock, CheckCircle2, XCircle, ArrowRight } from "lucide-react";
import { prisma } from "@/lib/database/prisma";
import { formatTime } from "@/lib/utils";

export const revalidate = 0; // Dynamic route

export default async function ResultsPage({
  searchParams,
}: {
  searchParams: { attemptId?: string };
}) {
  if (!searchParams.attemptId) {
    notFound();
  }

  const attempt = await prisma.quizAttempt.findUnique({
    where: { id: searchParams.attemptId },
    include: {
      participant: true,
      quiz: true,
      answers: {
        include: {
          question: true,
          selectedOption: true,
        },
      },
    },
  });

  if (!attempt) {
    notFound();
  }

  const percentage = Math.round((attempt.score / (attempt.totalQuestions * 10)) * 100);

  return (
    <div className="container mx-auto px-4 sm:px-6 py-12 space-y-8 max-w-3xl">
      <Card className="p-8 text-center space-y-6 shadow-glow-lg border-primary/40">
        <div className="w-20 h-20 rounded-full bg-primary/10 border border-primary/40 text-primary flex items-center justify-center mx-auto shadow-glow">
          <Trophy className="w-10 h-10" />
        </div>

        <div className="space-y-2">
          <Badge variant="cyan" size="md">QUIZ RESULT SUBMISSION</Badge>
          <h1 className="text-3xl font-extrabold text-white uppercase font-mono">
            {attempt.participant.name}
          </h1>
          <p className="text-xs font-mono text-slate-400">
            {attempt.participant.college} • {attempt.participant.department}
          </p>
        </div>

        {/* Score metrics box */}
        <div className="grid grid-cols-3 gap-4 p-4 rounded-xl bg-card border border-primary/20 font-mono">
          <div>
            <p className="text-xs text-slate-400">SCORE</p>
            <p className="text-2xl font-extrabold text-primary">{attempt.score} pts</p>
          </div>
          <div>
            <p className="text-xs text-slate-400">ACCURACY</p>
            <p className="text-2xl font-extrabold text-emerald-400">{percentage}%</p>
          </div>
          <div>
            <p className="text-xs text-slate-400">TIME TAKEN</p>
            <p className="text-2xl font-extrabold text-cyan">{formatTime(attempt.timeTakenSeconds)}</p>
          </div>
        </div>

        <div className="pt-4 flex justify-center gap-4">
          <Link href="/leaderboard">
            <Button variant="primary" rightIcon={<ArrowRight className="w-4 h-4" />}>
              View Live Leaderboard
            </Button>
          </Link>
        </div>
      </Card>

      {/* Answer breakdown */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-white font-mono">Question Answer Breakdown</h3>
        {attempt.answers.map((ans, idx) => (
          <Card key={ans.id} className="p-4 space-y-2">
            <div className="flex items-start justify-between">
              <h4 className="text-sm font-bold text-white">
                Q{idx + 1}. {ans.question.questionText}
              </h4>
              {ans.isCorrect ? (
                <Badge variant="success">CORRECT (+10)</Badge>
              ) : (
                <Badge variant="danger">INCORRECT (0)</Badge>
              )}
            </div>

            <p className="text-xs font-mono text-slate-400">
              Selected: <span className="text-white">{ans.selectedOption ? ans.selectedOption.optionText : "Not Answered"}</span>
            </p>
          </Card>
        ))}
      </div>
    </div>
  );
}
