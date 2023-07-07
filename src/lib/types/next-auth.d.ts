import NextAuth from "next-auth";
import { User } from "../authorize";

declare module "next-auth" {
  interface Session {
    user: User;
  }
}
