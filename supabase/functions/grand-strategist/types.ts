
export interface DocumentContext {
  documents: number;
  books: number;
  chapters: number;
  total: number;
}

export interface GrandStrategistRequest {
  prompt: string;
  context?: string;
  documentType?: string;
}

export interface GrandStrategistResponse {
  result: string;
  usage?: any;
  model: string;
  documentsAccessed: number;
  documentStats: DocumentContext;
  endpoint: string;
  userAuthenticated: boolean;
}

export interface Document {
  id: string;
  title: string;
  content: string;
  content_type: string;
  created_at: string;
  updated_at: string;
  metadata?: any;
  word_count?: number;
}

export interface Book {
  id: string;
  title: string;
  description?: string;
  genre?: string;
  status: string;
  word_count?: number;
  created_at: string;
  updated_at: string;
  metadata?: any;
}

export interface Chapter {
  id: string;
  title: string;
  content?: string;
  chapter_number: number;
  status: string;
  word_count?: number;
  book_id: string;
  created_at: string;
  updated_at: string;
  notes?: string;
}
