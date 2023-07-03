import { getSession } from "next-auth/react";
export const reqParams = async (): Promise<RequestInit> => {
  return <RequestInit>{
    headers: {
      "Content-Type": "application/json",
      authorization: (await getSession())?.user.accessToken ?? "",
    },
    cache: "no-store",
  };
};
export const config = {
  site: {
    name: "Ai School",
    description: "AI School",
    url: process.env.VERCEL
      ? "https://ai-school-git-master-sandeshveerani4.vercel.app"
      : "http://localhost:3000",
    imageDomain: "https://labs.barathkumaar.com",
  },
};
