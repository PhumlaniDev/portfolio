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

export interface Blog {
  slug: string | null | undefined;
  excerpt: string | null | undefined;
  coverImageUrl: string;
  id?: string;
  title: string;
  description: string;
  content: string;
  author: Author;
  tags: string[];
  created_at: string | number | Date | Timestamp | null;
  updated_at: string | number | Date | Timestamp | null;
  published_date: string | number | Date | Timestamp | null;
  status: string;
  read_time_minutes: number;
}
