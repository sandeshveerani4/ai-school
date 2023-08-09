import { config, reqParams } from "./consts";
import { Configuration, OpenAIApi, ChatCompletionRequestMessage } from "openai";

export const getClasses = async (getTopics: boolean = false) => {
  const options: RequestInit = await reqParams(true);
  const res = await fetch(
    `${config.site.url}/api/classes/${getTopics ? "?topics=true" : ""}`,
    options
  );
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
export const getNotifications = async (count?: number) => {
  const options: RequestInit = await reqParams(true);
  const res = await fetch(
    `${config.site.url}/api/notifications${count ? `?count=${count}` : ""}`,
    options
  );
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

export const getAssignments = async (count?: number) => {
  const options: RequestInit = await reqParams(true);
  const res = await fetch(
    `${config.site.url}/api/assignments${count ? `?count=${count}` : ""}`,
    options
  );
  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }
  return await res.json();
};

export const getSubmissions = async () => {
  const options: RequestInit = await reqParams(true);
  const res = await fetch(`${config.site.url}/api/submissions/`, options);
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
export const getTopicsBySection = async (sectionId: number) => {
  const options: RequestInit = await reqParams(true);
  const res = await fetch(
    `${config.site.url}/api/topics/${sectionId}`,
    options
  );
  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }
  return await res.json();
};
export const getQuestionsByTopicId = async (topicId: number, ai = false) => {
  const options: RequestInit = await reqParams(true);
  const res = await fetch(
    `${config.site.url}/api/topics/${topicId}/practise?ai=${
      ai ? "true" : "false"
    }`,
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
export const getPerformance = async (count?: number) => {
  const options: RequestInit = await reqParams(true);
  const res = await fetch(
    `${config.site.url}/api/dashboard/performance${
      count ? `?count=${count}` : ""
    }`,
    options
  );
  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }
  return await res.json();
};
export const getStats = async () => {
  const options: RequestInit = await reqParams(true);
  const res = await fetch(`${config.site.url}/api/dashboard/`, options);
  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }
  return await res.json();
};
export const getUnreadNotifications = async () => {
  const options: RequestInit = await reqParams(true);
  const res = await fetch(`${config.site.url}/api/notifications/fetch`, {
    ...options,
    method: "POST",
  });
  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }
  return await res.json();
};
export const getOverrallTrack = async () => {
  const options: RequestInit = await reqParams(true);
  const res = await fetch(`${config.site.url}/api/track/overall`, {
    ...options,
    method: "POST",
  });
  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }
  return await res.json();
};
export const getTestAnalysis = async () => {
  const options: RequestInit = await reqParams(true);
  const res = await fetch(`${config.site.url}/api/track/test`, {
    ...options,
    method: "POST",
  });
  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }
  return await res.json();
};
export const getAssignmentAnalysis = async () => {
  const options: RequestInit = await reqParams(true);
  const res = await fetch(`${config.site.url}/api/track/assignment`, {
    ...options,
    method: "POST",
  });
  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }
  return await res.json();
};
export type StudentAnalysisType = {
  userId: number;
  first_name: string;
  last_name: string;
  class: string;
  section: string;
  xp: number;
  avg: number;
  count: number;
};
export const getStudentAnalysis = async (): Promise<StudentAnalysisType[]> => {
  const options: RequestInit = await reqParams(true);
  const res = await fetch(`${config.site.url}/api/track/student`, {
    ...options,
    method: "POST",
  });
  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }
  return await res.json();
};
export const openAI = async (messages: ChatCompletionRequestMessage[]) => {
  try {
    const configuration = new Configuration({
      apiKey: process.env.OPENAI_API_KEY,
    });
    const openai = new OpenAIApi(configuration);
    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      max_tokens: 1000,
      temperature: 1,
      top_p: 1,
      messages: messages,
    });
    return completion.data.choices[0].message?.content;
  } catch (error: any) {
    if (error.response) {
      console.error(error.response.status);
      console.error(error.response.data);
    } else {
      console.error(error.message);
    }
  }
};
