import Client from "./client";
import { getClasses, getTeachers } from "@/lib/srv-funcs";

const Classes = async () => {
  const classes = await getClasses();
  const teachers = await getTeachers();
  return <Client classes={classes} teachers={teachers} />;
};

export default Classes;
