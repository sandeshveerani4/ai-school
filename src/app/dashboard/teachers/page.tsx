import { getTeachers } from "@/lib/srv-funcs";
import Client from "./client";

const Teachers = async () => {
  const teachers = await getTeachers();
  return <Client {...{ teachers }} />;
};

export default Teachers;
