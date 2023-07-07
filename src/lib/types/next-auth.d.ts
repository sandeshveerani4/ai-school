import NextAuth from "next-auth";
import { User } from "../authorize";
interface IUser extends User {}
declare module "next-auth" {
  interface User extends IUser {
    accessToken: string;
  }

  interface Session {
    user: User;
  }
}
