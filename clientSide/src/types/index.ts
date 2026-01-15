export interface User {
  // id: string;
  name: string;
  email: string;
  token: string;
}

export interface ComicWork {
  id: string;
  title: string;
  createdAt: string;
  sourceUrl: string;
  resultUrl: string;
  thumbnailUrl?: string;
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  success: boolean;
}

export type FileWithPreview = {
  file: File;
  preview: string;
};

