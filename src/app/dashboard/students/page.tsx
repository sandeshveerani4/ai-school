import { config, reqParams } from "@/lib/consts";
import Client from "./client";

const getStudents = async () => {
  const options: RequestInit = await reqParams(true);
  const res = await fetch(`${config.site.url}/api/students/`, options);
  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }
  return await res.json();
};
const Students = async () => {
  const students = await getStudents();
  return <Client students={students} />;
};

export default Students;
