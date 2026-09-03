export type EventCategory = "TECHNICAL" | "NON_TECHNICAL" | "WORKSHOP" | "QUIZ";
export type EventStatus = "OPEN" | "CLOSED" | "UPCOMING";

export interface SymposiumEvent {
  id: string;
  slug: string;
  title: string;
  category: EventCategory;
  shortDesc: string;
  fullDesc: string;
  rules: string;
  eligibility: string;
  teamSize: string;
  maxTeams: number;
  rounds: string;
  date: string;
  time: string;
  venue: string;
  coordinatorName: string;
  coordinatorPhone: string;
  status: EventStatus;
  image?: string | null;
  _count?: {
    registrations: number;
  };
}

export interface QuizOptionType {
  id: string;
  optionText: string;
}

export interface QuizQuestionType {
  id: string;
  questionText: string;
  category: string;
  points: number;
  options: QuizOptionType[];
}

export interface QuizType {
  id: string;
  title: string;
  description: string;
  durationMinutes: number;
  totalQuestions: number;
  isActive: boolean;
  questions?: QuizQuestionType[];
}

export interface LeaderboardEntry {
  rank: number;
  id: string;
  participantName: string;
  college: string;
  score: number;
  totalQuestions: number;
  timeTakenSeconds: number;
  completedAt: string;
}

export interface CoordinatorType {
  id: string;
  name: string;
  role: "FACULTY" | "STUDENT";
  designation?: string | null;
  department: string;
  phone: string;
  email: string;
  avatar?: string | null;
  eventName?: string | null;
}

export interface SponsorType {
  id: string;
  name: string;
  tier: "PLATINUM" | "GOLD" | "SILVER" | "MEDIA";
  logoUrl?: string | null;
  websiteUrl?: string | null;
}
