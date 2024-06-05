export type SubmittedEventTemplateType = {
  data: Data[];
  pagination: Pagination;
};

export interface Data {
  id: number;
  uuid: string,
  name: string | null,
  email: string,
  slug: string,
  phone: string |null,
  sent_at: Date | null,
  opened_at: Date | null,
  completed_at: null,
  external_id: string,
  archived_at: Date;
  metadata: {},
  status: string,
  application_key: string
  created_at: Date;
  updated_at: Date;
  template: Template;
  submitters: Submitter[];
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

export interface Metadata { }

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
