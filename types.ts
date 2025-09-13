export type Category = 'plastic' | 'paper' | 'glass' | 'metal' | 'general';

export interface AiResponse {
  itemName: string;
  notToDo: string;
  toDo: string;
  alternatives: string;
  whereToBuy: string;
  motivation: string;
  category?: Category;
}

export enum Tab {
  Camera = 'camera',
  Library = 'library',
}

export interface UserProfile {
  uid: string;
  name: string;
  dateOfBirth: string;
  email: string | null;
}
