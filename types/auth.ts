export interface Parent {
  id: string;
  name: string;
  email: string;
  passwordHash: string; // In production, use proper hashing
  createdAt: string;
  children: string[]; // Array of child IDs
}

export interface Session {
  parentId: string;
  email: string;
  name: string;
  expiresAt: string;
}


