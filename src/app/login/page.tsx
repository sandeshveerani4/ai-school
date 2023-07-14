import { getServerSession } from "next-auth";
import Client from "./client";
import { redirect } from "next/navigation";

interface Props {
  searchParams: SearchParams;
}
interface SearchParams {
  callbackUrl: string;
  error: string;
}
const Login = async (props: Props) => {
  const session = await getServerSession();
  if (session) redirect("/dashboard");
  return <Client {...props} />;
};

export default Login;
