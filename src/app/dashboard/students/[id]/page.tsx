"use client";
import StudentFields, { Student } from "@/components/Students/StudentFields";
import { getSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import Loading from "../../loading";
import Image from "next/image";

const ParticularStudent = ({ params }: { params: { id: string } }) => {
  const [student, setStudent] = useState<Student>();
  const [loading, setLoading] = useState(true);
  const getStudent = async (token: string) => {
    const options: RequestInit = {
      headers: {
        "Content-Type": "application/json",
        authorization: token,
      },
      cache: "no-store",
    };
    const res = await fetch(
      `/api/students/${params.id}`,
      options
    );
    return await res.json();
  };
  useEffect(() => {
    (async () => {
      const session = await getSession();
      if (session) {
        setStudent(await getStudent(session.user.accessToken));
        setLoading(false);
      }
    })();
  }, []);
  return loading && !student ? (
    <Loading />
  ) : (
    <>
      {/* <Image src={student?.profile?.pictureURL ?? ""} width={100} height={100} /> */}
      <StudentFields data={student} />
    </>
  );
};

export default ParticularStudent;
