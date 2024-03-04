export type SubmittedTemplateType = {
  data: Data[];
  pagination: Pagination;
};

export interface Data {
  id: number;
  archived_at: Date;
  created_at: Date;
  updated_at: Date;
  source: string;
  submitters_order: string;
  audit_log_url: null;
  submitters: Submitter[];
  template: Template;
  created_by_user: CreatedByUser;
}

export interface CreatedByUser {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
}

export interface Submitter {
  id: number;
  uuid: string;
  email: string;
  slug: string;
  sent_at: Date;
  opened_at: Date;
  completed_at: Date;
  created_at: Date;
  updated_at: Date;
  name: null;
  phone: null;
  external_id: string;
  metadata: Metadata;
  status: string;
  application_key: string;
}

export interface Metadata {}

export interface Template {
  id: number;
  name: string;
  created_at: Date;
  updated_at: Date;
}

export interface Pagination {
  count: number;
  next: number;
  prev: number;
}
