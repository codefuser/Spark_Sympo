"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Card, CardTitle, CardDescription } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { Badge } from "@/components/ui/Badge";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { useToast } from "@/components/ui/Toast";
import { Clock, HelpCircle, ArrowRight, ArrowLeft, CheckCircle2, AlertTriangle, ShieldCheck } from "lucide-react";
import { formatTime } from "@/lib/utils";

interface QuizQuestion {
  id: string;
  questionText: string;
  category: string;
  points: number;
  options: { id: string; optionText: string }[];
}

export default function QuizPage() {
  const router = Router();
  const { showToast } = useToast();

  const [step, setStep] = useState<"auth" | "quiz">("auth");
  const [participantIdInput, setParticipantIdInput] = useState("");
  const [loadingQuiz, setLoadingQuiz] = useState(false);
  const [quizData, setQuizData] = useState<{
    id: string;
    title: string;
    description: string;
    durationMinutes: number;
    totalQuestions: number;
    questions: QuizQuestion[];
  } | null>(null);

  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [timeLeft, setTimeLeft] = useState(900); // 15 mins default
  const [submitting, setSubmitting] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // Start Quiz setup
  const handleStartQuiz = async () => {
    if (!participantIdInput.trim()) {
      showToast("Verification Required", "Please enter your Email or Registration ID", "error");
      return;
    }

    setLoadingQuiz(true);
    try {
      const res = await fetch("/api/quiz/questions");
      const data = await res.json();

      if (res.ok && data.success) {
        setQuizData(data.quiz);
        setTimeLeft(data.quiz.durationMinutes * 60);
        setStep("quiz");
      } else {
        showToast("Quiz Error", data.message || "Failed to load quiz", "error");
      }
    } catch (err) {
      showToast("Network Error", "Failed to fetch quiz data", "error");
    } finally {
      setLoadingQuiz(false);
    }
  };

  // Live Timer Effect
  useEffect(() => {
    if (step !== "quiz" || !quizData) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleFinalSubmit(); // Auto-submit when time expires!
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [step, quizData]);

  const handleSelectOption = (questionId: string, optionId: string) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: optionId,
    }));
  };

  const handleFinalSubmit = async () => {
    if (!quizData) return;
    setSubmitting(true);
    setShowConfirmModal(false);

    const answersPayload = quizData.questions.map((q) => ({
      questionId: q.id,
      selectedOptionId: selectedAnswers[q.id] || null,
    }));

    const timeTaken = quizData.durationMinutes * 60 - timeLeft;

    try {
      const res = await fetch("/api/quiz/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          participantId: participantIdInput.trim(),
          quizId: quizData.id,
          timeTakenSeconds: timeTaken > 0 ? timeTaken : 1,
          answers: answersPayload,
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        showToast("Quiz Completed!", `Score: ${data.score} pts`, "success");
        router.push(`/results?attemptId=${data.attemptId}`);
      } else {
        showToast("Submission Error", data.message || "Failed to process quiz score", "error");
      }
    } catch (err) {
      showToast("Network Error", "Unable to submit answers", "error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 py-12 space-y-12 max-w-4xl">
      {/* STEP 1: AUTH & INSTRUCTIONS */}
      {step === "auth" && (
        <div className="space-y-8">
          <SectionHeading
            badge="ONLINE TESTING PORTAL"
            title="SPARKTRON 2K26 Technical Quiz"
            description="Test your electronic domain knowledge, speed, and accuracy in our secure timed online challenge."
          />

          <Card className="p-6 sm:p-10 space-y-6">
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-white flex items-center gap-2 font-mono">
                <ShieldCheck className="w-6 h-6 text-primary" /> Quiz Verification & Rules
              </h3>

              <ul className="text-sm text-secondary-foreground space-y-2.5 list-disc list-inside bg-card/60 p-4 rounded-xl border border-primary/20">
                <li>Duration: 15 Minutes maximum for 10 Multiple-Choice Questions.</li>
                <li>Each question carries 10 points for correct answer; no negative marking.</li>
                <li>Auto-submit occurs immediately when timer expires.</li>
                <li>Scores & timestamps are recorded securely on the server for live leaderboard ranking.</li>
              </ul>
            </div>

            <div className="space-y-4 pt-4 border-t border-primary/10">
              <Input
                label="Registered Email or Registration ID *"
                placeholder="e.g. SPARK-2026-1234 or email@student.edu"
                value={participantIdInput}
                onChange={(e) => setParticipantIdInput(e.target.value)}
              />

              <Button
                variant="primary"
                size="lg"
                className="w-full"
                isLoading={loadingQuiz}
                onClick={handleStartQuiz}
              >
                Start Quiz Now →
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* STEP 2: LIVE QUIZ INTERFACE */}
      {step === "quiz" && quizData && (
        <div className="space-y-6">
          {/* Top Bar: Title + Live Timer */}
          <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-card border border-primary/30 shadow-glow">
            <div>
              <Badge variant="cyan">{quizData.questions[currentIdx]?.category || "General"}</Badge>
              <h2 className="text-lg font-bold text-white mt-1">
                Question {currentIdx + 1} of {quizData.questions.length}
              </h2>
            </div>

            <div className="flex items-center space-x-2 text-primary font-mono text-xl font-extrabold bg-background px-4 py-2 rounded-xl border border-primary/30">
              <Clock className="w-5 h-5 text-primary animate-pulse" />
              <span>{formatTime(timeLeft)}</span>
            </div>
          </div>

          {/* Question Box */}
          <Card className="p-6 sm:p-8 space-y-6">
            <h3 className="text-xl sm:text-2xl font-bold text-white leading-relaxed">
              {quizData.questions[currentIdx].questionText}
            </h3>

            {/* MCQ Options */}
            <div className="space-y-3">
              {quizData.questions[currentIdx].options.map((opt, idx) => {
                const isSelected = selectedAnswers[quizData.questions[currentIdx].id] === opt.id;
                return (
                  <button
                    key={opt.id}
                    onClick={() => handleSelectOption(quizData.questions[currentIdx].id, opt.id)}
                    className={`w-full text-left p-4 rounded-xl border text-sm font-medium transition-all flex items-center justify-between ${
                      isSelected
                        ? "bg-primary/20 border-primary text-primary font-bold shadow-glow"
                        : "bg-background/80 border-primary/20 text-white hover:border-primary/50 hover:bg-card"
                    }`}
                  >
                    <span className="flex items-center space-x-3">
                      <span className="w-7 h-7 rounded-lg bg-card border border-primary/30 font-mono text-xs flex items-center justify-center">
                        {String.fromCharCode(65 + idx)}
                      </span>
                      <span>{opt.optionText}</span>
                    </span>
                    {isSelected && <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />}
                  </button>
                );
              })}
            </div>
          </Card>

          {/* Navigation Controls */}
          <div className="flex items-center justify-between pt-2">
            <Button
              variant="outline"
              disabled={currentIdx === 0}
              onClick={() => setCurrentIdx((prev) => prev - 1)}
              leftIcon={<ArrowLeft className="w-4 h-4" />}
            >
              Previous
            </Button>

            <span className="text-xs font-mono text-slate-400">
              Answered {Object.keys(selectedAnswers).length} of {quizData.questions.length}
            </span>

            {currentIdx < quizData.questions.length - 1 ? (
              <Button
                variant="primary"
                onClick={() => setCurrentIdx((prev) => prev + 1)}
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                Next Question
              </Button>
            ) : (
              <Button
                variant="cyan"
                onClick={() => setShowConfirmModal(true)}
                isLoading={submitting}
              >
                Submit Quiz
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Submission Modal */}
      {showConfirmModal && (
        <Modal
          isOpen={showConfirmModal}
          onClose={() => setShowConfirmModal(false)}
          title="Submit Quiz Answers?"
        >
          <div className="space-y-4 py-2">
            <p className="text-sm text-secondary-foreground">
              You have answered <span className="text-white font-bold">{Object.keys(selectedAnswers).length}</span> of{" "}
              <span className="text-white font-bold">{quizData?.questions.length}</span> questions.
            </p>
            <div className="flex gap-3 pt-2">
              <Button
                variant="ghost"
                className="flex-1"
                onClick={() => setShowConfirmModal(false)}
              >
                Review Answers
              </Button>
              <Button
                variant="primary"
                className="flex-1"
                isLoading={submitting}
                onClick={handleFinalSubmit}
              >
                Confirm & Submit
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

function Router() {
  return useRouter();
}
