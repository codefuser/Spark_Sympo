export type EmailMessageStatus =
  | "Pending"
  | "Sending"
  | "Sent"
  | "Delivered"
  | "Failed";

export type EmailTemplateType =
  | "CONFIRMATION"
  | "QUIZ"
  | "PPT"
  | "PROJECT_EXPO"
  | "REMINDER"
  | "PAYMENT_REMINDER"
  | "VENUE"
  | "ANNOUNCEMENT"
  | "CUSTOM";

export interface EmailMessage {
  id: string;
  registration_id?: string | null;
  recipient_name: string;
  recipient_email: string;
  subject: string;
  message_content: string;
  template_name: string;
  status: EmailMessageStatus;
  provider_message_id?: string | null;
  error_message?: string | null;
  created_at: string;
  sent_at?: string | null;
  delivered_at?: string | null;
}

export interface EmailSettings {
  id?: string;
  senderName: string;
  senderEmail: string;
  replyToEmail: string;
  venueName: string;
  venueAddress: string;
  mapLink: string;
  latitude?: number | string;
  longitude?: number | string;
  quizLink: string;
  pptUploadLink: string;
  projectLink: string;
  customEventLinks: Record<string, string>;
  updatedAt?: string;
}

export interface EmailRecipientInfo {
  participantId?: string;
  registrationId: string;
  registrationCode: string;
  name: string;
  email: string;
  phone?: string;
  college: string;
  department: string;
  teamName?: string | null;
  paymentStatus: string;
  foodPreference: string;
  technicalEventTitle?: string;
  nonTechnicalEventTitle?: string;
  technicalEventSlug?: string;
  nonTechnicalEventSlug?: string;
}

export interface EmailConfigStatus {
  isConfigured: boolean;
  missingVars: string[];
  senderEmail: string;
  senderName: string;
  replyToEmail: string;
  provider: string;
  totalMessages: number;
  totalSent: number;
  totalFailed: number;
  totalPending: number;
}
