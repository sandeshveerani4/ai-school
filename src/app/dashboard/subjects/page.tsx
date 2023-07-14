import Client from "./client";
import { getClasses, getTeachers } from "@/lib/srv-funcs";

const Subjects = async () => {
  const classes = await getClasses();
  const teachers = await getTeachers();
  return <Client {...{ classes, teachers }} />;
};

export default Subjects;
