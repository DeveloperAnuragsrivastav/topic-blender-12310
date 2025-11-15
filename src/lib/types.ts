// User profile
export interface UserProfile {
  id: string;
  username: string;
  email?: string;
  created_at: string;
  updated_at: string;
}

// Configuration/Prompt setup
export interface Configuration {
  id: string;
  user_id: string;
  prompt: string;
  topic: string;
  image?: string;
  scheduled_time?: string; // e.g., "7 AM"
  repeat_frequency?: string; // e.g., "daily", "week", "2days"
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// Submission history
export interface Submission {
  id: string;
  user_id: string;
  configuration_id: string;
  prompt: string;
  topic: string;
  image?: string;
  webhook_response?: Record<string, any>;
  submitted_at: string;
  status: 'pending' | 'success' | 'failed';
}

// Webhook log
export interface WebhookLog {
  id: string;
  user_id: string;
  submission_id: string;
  payload: Record<string, any>;
  response_status: number;
  response_body?: Record<string, any>;
  created_at: string;
}

// Auth types
export interface AuthUser {
  id: string;
  email?: string;
  user_metadata?: {
    username?: string;
  };
}
