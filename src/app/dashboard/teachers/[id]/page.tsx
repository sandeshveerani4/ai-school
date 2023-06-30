"use client";
import { getSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import Loading from "../../loading";
import TeacherFields, { Teacher } from "@/components/Teachers/TeacherFields";

const getTeacher = async (token: string, id: string) => {
  const options: RequestInit = {
    headers: {
      "Content-Type": "application/json",
      authorization: token,
    },
    cache: "no-store",
  };
  const res = await fetch(`/api/teachers/${id}`, options);
  return await res.json();
};
const ParticularTeacher = ({ params }: { params: { id: string } }) => {
  const [teacher, setTeacher] = useState<Teacher>();
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    (async () => {
      const session = await getSession();
      if (session) {
        setTeacher(await getTeacher(session.user.accessToken, params.id));
        setLoading(false);
      }
    })();
  }, []);
  return loading && !teacher ? <Loading /> : <TeacherFields data={teacher} />;
};

export default ParticularTeacher;
