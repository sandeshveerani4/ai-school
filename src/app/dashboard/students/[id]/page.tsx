"use client";
import StudentFields, { Student } from "@/components/Students/StudentFields";
import { getSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import Loading from "../../loading";
import { Typography } from "@mui/material";

const ParticularStudent = ({ params }: { params: { id: string } }) => {
  const [student, setStudent] = useState<Student>({} as Student);
  const [loading, setLoading] = useState(true);
  const getStudent = async (token: string) => {
    const options: RequestInit = {
      headers: {
        "Content-Type": "application/json",
        authorization: token,
      },
      cache: "no-store",
    };
    const res = await fetch(`/api/students/${params.id}`, options);
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
      <Typography variant="h4" className="mb-3">
        {student?.first_name + " " + student?.last_name}
      </Typography>
      <StudentFields data={student} />
    </>
  );
};

export default ParticularStudent;
