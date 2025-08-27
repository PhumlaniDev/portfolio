import { Timestamp } from 'firebase/firestore';

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
  created_at: string | number | Date | Timestamp | null;
  updated_at: string | number | Date | Timestamp | null;
  published_date: string | number | Date | Timestamp | null;
  status: string;
}
