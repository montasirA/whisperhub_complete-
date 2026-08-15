export interface NavItem {
  label: string;
  href: string;
  icon: string;
}

export interface PostItem {
  id: number;
  author: string;
  handle: string;
  time: string;
  content: string;
  image?: string;
  likes: number;
  replies: number;
  color: string;
}

export interface MessageThread {
  id: number;
  name: string;
  preview: string;
  time: string;
  unread: number;
  accent: string;
}
