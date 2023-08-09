import Client from "./client";
const PractiseSpe = async ({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams?: { ai?: string };
}) => {
  const topicId = Number(params.id);
  return <Client isAi={searchParams?.ai ? true : false} topicId={topicId} />;
};

export default PractiseSpe;
