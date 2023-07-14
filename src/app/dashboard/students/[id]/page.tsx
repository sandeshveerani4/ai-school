import { getClasses, getStudent } from "@/lib/srv-funcs";
import Client from "./client";

const Student = async ({ params }: { params: { id: string } }) => {
  const [student, classes] = await Promise.all([
    getStudent(Number(params.id)),
    getClasses(),
  ]);
  return <Client student={student} classes={classes} />;
};

export default Student;
