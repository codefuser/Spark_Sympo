"use client";

import React, { useState } from "react";
import { Card, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { useToast } from "@/components/ui/Toast";
import { Search, Download, Plus, CheckCircle2, XCircle, Cpu, FileText } from "lucide-react";

export function AdminDashboardClient({
  initialEvents,
  initialParticipants,
  activeQuiz,
}: {
  initialEvents: any[];
  initialParticipants: any[];
  activeQuiz: any;
}) {
  const [activeTab, setActiveTab] = useState<"participants" | "events" | "quiz">("participants");
  const [searchTerm, setSearchTerm] = useState("");
  const [events, setEvents] = useState(initialEvents);
  const [participants, setParticipants] = useState(initialParticipants);

  // New Question Form state
  const [questionText, setQuestionText] = useState("");
  const [category, setCategory] = useState("Electronics");
  const [options, setOptions] = useState([
    { text: "", isCorrect: true },
    { text: "", isCorrect: false },
    { text: "", isCorrect: false },
    { text: "", isCorrect: false },
  ]);
  const [submittingQuestion, setSubmittingQuestion] = useState(false);

  const { showToast } = useToast();

  // Filter participants
  const filteredParticipants = participants.filter((p) => {
    const term = searchTerm.toLowerCase();
    return (
      p.name.toLowerCase().includes(term) ||
      p.email.toLowerCase().includes(term) ||
      p.college.toLowerCase().includes(term) ||
      p.registrationId.toLowerCase().includes(term)
    );
  });

  // Toggle Event Status
  const handleToggleEventStatus = async (slug: string, currentStatus: string) => {
    const nextStatus = currentStatus === "OPEN" ? "CLOSED" : "OPEN";
    try {
      const res = await fetch(`/api/events/${slug}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setEvents((prev) =>
          prev.map((e) => (e.slug === slug ? { ...e, status: nextStatus } : e))
        );
        showToast("Event Updated", `${slug} is now ${nextStatus}`, "success");
      }
    } catch (err) {
      showToast("Error", "Failed to update event status", "error");
    }
  };

  // Add Question Submit
  const handleAddQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeQuiz) return;
    if (!questionText.trim()) {
      showToast("Validation Error", "Question text required", "error");
      return;
    }

    setSubmittingQuestion(true);
    try {
      const res = await fetch("/api/admin/quizzes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          quizId: activeQuiz.id,
          questionText,
          category,
          points: 10,
          options: options.map((o) => ({
            optionText: o.text,
            isCorrect: o.isCorrect,
          })),
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        showToast("Question Added!", "Quiz updated successfully", "success");
        setQuestionText("");
        setOptions([
          { text: "", isCorrect: true },
          { text: "", isCorrect: false },
          { text: "", isCorrect: false },
          { text: "", isCorrect: false },
        ]);
      } else {
        showToast("Error", data.message || "Failed to add question", "error");
      }
    } catch (err) {
      showToast("Network Error", "Unable to connect to server", "error");
    } finally {
      setSubmittingQuestion(false);
    }
  };

  // Export JSON/CSV
  const handleExportData = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(participants, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `sparktron_participants_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-6">
      {/* Navigation Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-primary/20 pb-3 font-mono">
        <button
          onClick={() => setActiveTab("participants")}
          className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
            activeTab === "participants"
              ? "bg-primary text-background shadow-glow"
              : "text-slate-400 hover:text-white hover:bg-card"
          }`}
        >
          Participants ({participants.length})
        </button>
        <button
          onClick={() => setActiveTab("events")}
          className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
            activeTab === "events"
              ? "bg-primary text-background shadow-glow"
              : "text-slate-400 hover:text-white hover:bg-card"
          }`}
        >
          Events ({events.length})
        </button>
        <button
          onClick={() => setActiveTab("quiz")}
          className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
            activeTab === "quiz"
              ? "bg-primary text-background shadow-glow"
              : "text-slate-400 hover:text-white hover:bg-card"
          }`}
        >
          Quiz Manager ({activeQuiz?.questions?.length || 0} Questions)
        </button>
      </div>

      {/* TAB 1: PARTICIPANTS */}
      {activeTab === "participants" && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="w-full sm:w-96">
              <Input
                placeholder="Search by Name, Email, College, Reg ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                leftIcon={<Search className="w-4 h-4" />}
              />
            </div>
            <Button
              variant="outline"
              size="sm"
              leftIcon={<Download className="w-4 h-4" />}
              onClick={handleExportData}
            >
              Export JSON
            </Button>
          </div>

          <div className="rounded-2xl border border-primary/20 bg-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-background border-b border-primary/20 text-xs font-mono text-slate-400 uppercase">
                  <tr>
                    <th className="py-3.5 px-4">Reg ID</th>
                    <th className="py-3.5 px-4">Name</th>
                    <th className="py-3.5 px-4">College & Dept</th>
                    <th className="py-3.5 px-4">Phone & Email</th>
                    <th className="py-3.5 px-4">Events Registered</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-primary/10 font-mono text-xs">
                  {filteredParticipants.map((p) => (
                    <tr key={p.id} className="hover:bg-primary/5 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-primary">{p.registrationId}</td>
                      <td className="py-3.5 px-4 font-bold text-white font-sans text-sm">{p.name}</td>
                      <td className="py-3.5 px-4 text-slate-300">
                        {p.college} <br />
                        <span className="text-slate-400">{p.department} ({p.year})</span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-300">
                        {p.email} <br />
                        <span className="text-cyan">{p.phone}</span>
                      </td>
                      <td className="py-3.5 px-4">
                        {p.registrations.map((r: any) => (
                          <Badge key={r.id} variant="cyan" className="mr-1 mb-1">
                            {r.event.title}
                          </Badge>
                        ))}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: EVENTS */}
      {activeTab === "events" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {events.map((event) => (
            <Card key={event.id} className="space-y-4">
              <div className="flex items-center justify-between">
                <Badge variant={event.category === "TECHNICAL" ? "primary" : "cyan"}>
                  {event.category}
                </Badge>
                <Badge variant={event.status === "OPEN" ? "success" : "danger"}>
                  {event.status}
                </Badge>
              </div>

              <div>
                <CardTitle className="text-lg">{event.title}</CardTitle>
                <p className="text-xs text-slate-400 mt-1">{event.shortDesc}</p>
              </div>

              <div className="pt-3 border-t border-primary/10 flex items-center justify-between text-xs font-mono">
                <span className="text-slate-400">
                  Total Registrations: <strong className="text-white">{event._count.registrations}</strong>
                </span>
                <Button
                  size="sm"
                  variant={event.status === "OPEN" ? "danger" : "primary"}
                  onClick={() => handleToggleEventStatus(event.slug, event.status)}
                >
                  {event.status === "OPEN" ? "Close Event" : "Open Event"}
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* TAB 3: QUIZ MANAGER */}
      {activeTab === "quiz" && (
        <div className="space-y-8">
          <Card className="p-6 space-y-6">
            <CardTitle className="text-xl text-white">Add New Question to Quiz</CardTitle>

            <form onSubmit={handleAddQuestion} className="space-y-4">
              <Input
                label="Question Text *"
                placeholder="e.g. What is the efficiency of Class A amplifier?"
                value={questionText}
                onChange={(e) => setQuestionText(e.target.value)}
              />

              <Input
                label="Category / Domain *"
                placeholder="e.g. Analog Electronics"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              />

              <div className="space-y-3 pt-2">
                <label className="block text-xs font-mono font-medium text-slate-400 uppercase">
                  Multiple-Choice Options (Select 1 correct option)
                </label>
                {options.map((opt, idx) => (
                  <div key={idx} className="flex items-center space-x-3">
                    <button
                      type="button"
                      onClick={() =>
                        setOptions((prev) =>
                          prev.map((o, i) => ({ ...o, isCorrect: i === idx }))
                        )
                      }
                      className={`w-6 h-6 rounded-full border flex items-center justify-center text-xs font-bold ${
                        opt.isCorrect
                          ? "bg-emerald-500 border-emerald-400 text-white"
                          : "border-primary/30 text-slate-500"
                      }`}
                    >
                      {opt.isCorrect ? "✓" : String.fromCharCode(65 + idx)}
                    </button>
                    <input
                      type="text"
                      placeholder={`Option ${String.fromCharCode(65 + idx)} text`}
                      value={opt.text}
                      onChange={(e) => {
                        const val = e.target.value;
                        setOptions((prev) =>
                          prev.map((o, i) => (i === idx ? { ...o, text: val } : o))
                        );
                      }}
                      className="flex-1 rounded-lg bg-background border border-primary/20 px-3 py-2 text-sm text-white focus:outline-none focus:border-primary"
                    />
                  </div>
                ))}
              </div>

              <Button type="submit" variant="primary" isLoading={submittingQuestion}>
                Add Question to Question Bank
              </Button>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
}
