import { getQuestionsByTopicId } from "@/lib/srv-funcs";
import Client from "./client";

const PractiseSpe = async ({ params }: { params: { id: string } }) => {
  const questions = await getQuestionsByTopicId(Number(params.id));
  return <Client questions={questions} topicId={Number(params.id)} />;
};

export default PractiseSpe;
