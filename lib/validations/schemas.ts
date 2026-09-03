import { z } from "zod";

export const registrationSchema = z.object({
  name: z.string().min(2, "Full name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z
    .string()
    .min(10, "Phone number must be at least 10 digits")
    .regex(/^[0-9+\-\s]+$/, "Invalid phone number format"),
  college: z.string().min(2, "College name is required"),
  department: z.string().min(2, "Department name is required"),
  year: z.string().min(1, "Please select your year of study"),
  gender: z.string().optional(),
  eventId: z.string().min(1, "Please select an event"),
  teamName: z.string().optional(),
  teamMembers: z
    .array(
      z.object({
        name: z.string().min(2, "Member name required"),
        email: z.string().email("Valid member email required"),
        phone: z.string().optional(),
      })
    )
    .optional(),
});

export const quizSubmissionSchema = z.object({
  participantId: z.string().min(1, "Participant ID required"),
  quizId: z.string().min(1, "Quiz ID required"),
  timeTakenSeconds: z.number().min(0),
  answers: z.array(
    z.object({
      questionId: z.string(),
      selectedOptionId: z.string().nullable(),
    })
  ),
});

export const adminLoginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const contactSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Valid email required"),
  subject: z.string().min(3, "Subject is required"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

export const eventSchema = z.object({
  title: z.string().min(3, "Title is required"),
  slug: z.string().min(3, "Slug is required"),
  category: z.enum(["TECHNICAL", "NON_TECHNICAL", "WORKSHOP", "QUIZ"]),
  shortDesc: z.string().min(10, "Short description is required"),
  fullDesc: z.string().min(20, "Full description is required"),
  rules: z.string().min(5, "Rules are required"),
  eligibility: z.string().min(3, "Eligibility is required"),
  teamSize: z.string().min(1, "Team size is required"),
  maxTeams: z.number().int().positive(),
  rounds: z.string().min(1, "Rounds info required"),
  date: z.string().min(1, "Date is required"),
  time: z.string().min(1, "Time is required"),
  venue: z.string().min(1, "Venue is required"),
  coordinatorName: z.string().min(2, "Coordinator name is required"),
  coordinatorPhone: z.string().min(10, "Coordinator phone is required"),
  status: z.enum(["OPEN", "CLOSED", "UPCOMING"]),
  image: z.string().optional(),
});

export const questionSchema = z.object({
  quizId: z.string().min(1),
  questionText: z.string().min(5, "Question text required"),
  category: z.string().min(2),
  points: z.number().default(10),
  options: z
    .array(
      z.object({
        optionText: z.string().min(1, "Option text required"),
        isCorrect: z.boolean(),
      })
    )
    .min(2, "At least 2 options required"),
});
