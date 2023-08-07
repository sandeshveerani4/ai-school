import { getServerSession } from "next-auth";
import { getSession } from "next-auth/react";
import { authOptions } from "./auth";

export const reqParams = async (
  server: boolean = false
): Promise<RequestInit> => {
  return <RequestInit>{
    headers: {
      "Content-Type": "application/json",
      authorization: server
        ? (await getServerSession(authOptions))?.user.accessToken
        : (await getSession())?.user.accessToken,
    },
    // cache: "no-store",
  };
};
export const config = {
  site: {
    name: "Ai School",
    description: "AI School",
    url:
      process.env.NODE_ENV === "production"
        ? "https://ai-school-git-master-sandeshveerani4.vercel.app"
        : "http://localhost:3000",
    imageDomain: "https://labs.barathkumaar.com",
  },
};
