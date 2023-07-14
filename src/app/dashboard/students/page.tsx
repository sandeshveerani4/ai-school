import Client from "./client";
import { getClasses, getStudents } from "@/lib/srv-funcs";

const Students = async () => {
  const [students, classes] = await Promise.all([getStudents(), getClasses()]);
  return <Client students={students} classes={classes} />;
};

export default Students;
