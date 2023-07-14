import { getServerSession } from "next-auth";
import Client from "./client";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";

interface Props {
  searchParams: SearchParams;
}
interface SearchParams {
  callbackUrl: string;
  error: string;
}
const Login = async (props: Props) => {
  const session = await getServerSession(authOptions);
  if (session) redirect("/dashboard");
  return <Client {...props} />;
};

export default Login;
