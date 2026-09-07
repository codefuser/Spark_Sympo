export type WhatsAppMessageStatus =
  | "Pending"
  | "Sending"
  | "Sent"
  | "Delivered"
  | "Read"
  | "Failed";

export type WhatsAppTemplateType =
  | "CONFIRMATION"
  | "QUIZ"
  | "PPT"
  | "PROJECT_EXPO"
  | "REMINDER"
  | "PAYMENT_REMINDER"
  | "VENUE"
  | "CUSTOM";

export interface WhatsAppMessage {
  id: string;
  registration_id?: string | null;
  recipient_name: string;
  recipient_phone: string;
  message_type: string;
  message_content: string;
  status: WhatsAppMessageStatus;
  provider_message_id?: string | null;
  error_message?: string | null;
  created_at: string;
  sent_at?: string | null;
  delivered_at?: string | null;
  read_at?: string | null;
}

export interface WhatsAppSettings {
  id?: string;
  isEnabled: boolean;
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

export interface RecipientInfo {
  participantId?: string;
  registrationId: string;
  registrationCode: string;
  name: string;
  phone: string;
  email: string;
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

export interface WhatsAppConfigStatus {
  isConfigured: boolean;
  missingVars: string[];
  phoneNumberId?: string;
  businessAccountId?: string;
  apiUrl?: string;
  totalMessages: number;
  totalSent: number;
  totalFailed: number;
  totalPending: number;
}
