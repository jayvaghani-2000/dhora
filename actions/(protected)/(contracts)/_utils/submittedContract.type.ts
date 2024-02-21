export type SubmittedTemplateType = {
  data: Data[];
  pagination: Pagination;
};

export interface Data {
  id: number;
  submission_id: number;
  uuid: string;
  email: string;
  slug: string;
  sent_at: Date;
  opened_at: Date;
  completed_at: Date;
  created_at: Date;
  updated_at: Date;
  name: string;
  status: string;
  phone: string;
  template: Template;
  submission_events: SubmissionEvent[];
  values: Value[];
  documents: Document[];
  role: string;
}

export interface Document {
  name: string;
  url: string;
}

export interface SubmissionEvent {
  id: number;
  submitter_id: number;
  event_type: string;
  event_timestamp: Date;
}

export interface Template {
  id: number;
  name: string;
  created_at: Date;
  updated_at: Date;
}

export interface Value {
  field: string;
  value: string;
}

export interface Pagination {
  count: number;
  next: number;
  prev: number;
}
