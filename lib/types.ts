import { DefaultSession } from "next-auth";

export interface Todo {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
}

export interface User {
  id: string;
  email: string;
  name?: string;
}

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
  }
}
