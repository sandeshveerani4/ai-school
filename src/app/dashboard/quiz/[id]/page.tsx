import { config, reqParams } from "@/lib/consts";
import Client from "./client";

const getQuiz = async (id: string) => {
  const options: RequestInit = await reqParams(true);
  const res = await fetch(
    `${config.site.url}/api/assignments/${id}/quiz`,
    options
  );
  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }
  return await res.json();
};
const Quiz = async ({ params }: { params: { id: string } }) => {
  const quiz = await getQuiz(params.id);
  if (new Date(quiz.deadline) <= new Date()) return "Sorry, Time is up!";
  return <Client quiz={quiz} />;
};

export default Quiz;
