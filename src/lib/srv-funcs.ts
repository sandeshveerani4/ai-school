import { config, reqParams } from "./consts";
export const getClasses = async () => {
  const options: RequestInit = await reqParams(true);
  const res = await fetch(`${config.site.url}/api/classes/`, options);
  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }
  return await res.json();
};
export const getTeachers = async () => {
  const options: RequestInit = await reqParams(true);
  const res = await fetch(`${config.site.url}/api/teachers/`, options);
  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }
  return await res.json();
};

export const getStudent = async (id: number) => {
  const options: RequestInit = await reqParams(true);
  const res = await fetch(`${config.site.url}/api/students/${id}`, options);
  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }
  return await res.json();
};

export const getStudents = async () => {
  const options: RequestInit = await reqParams(true);
  const res = await fetch(`${config.site.url}/api/students/`, options);
  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }
  return await res.json();
};

export const getTopics = async (subjectId: number) => {
  const options: RequestInit = await reqParams(true);
  const res = await fetch(
    `${config.site.url}/api/subjects/${subjectId}/topics`,
    options
  );
  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }
  return await res.json();
};
export const getDiscussions = async () => {
  const options: RequestInit = await reqParams(true);
  const res = await fetch(`${config.site.url}/api/discussions/`, options);
  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }
  return await res.json();
};
export const getMessages = async (discussionId: number) => {
  const options: RequestInit = await reqParams(true);
  const res = await fetch(
    `${config.site.url}/api/discussions/${discussionId}/messages`,
    options
  );
  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }
  return await res.json();
};
