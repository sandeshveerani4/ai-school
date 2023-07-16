import { config, reqParams } from "@/lib/consts";
import Client from "./client";
import { getClasses } from "@/lib/srv-funcs";

const getQuestions = async () => {
  const options: RequestInit = await reqParams(true);
  const res = await fetch(`${config.site.url}/api/questions/`, options);
  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }
  return await res.json();
};
const Questions = async () => {
  const questions = await getQuestions();
  const classes = await getClasses(true);
  return <Client questions={questions} classes={classes} />;
};

export default Questions;
