import { FieldValue, Timestamp } from 'firebase/firestore';

export interface Author {
  name: string;
  email: string;
  profile_image: string;
  social_links: {
    linkedin?: string;
    github?: string;
  };
}

export interface Tag {
  name: string;
}

export interface Blog {
  id?: string;
  title: string;
  description: string;
  content: string;
  author: Author;
  tags: Tag[];
  created_at: FieldValue | Timestamp | string;
  updated_at: FieldValue | Timestamp | string;
  published_date: FieldValue | Timestamp | string;
  status: string;
}
