"use client";
import React, { useState, useEffect } from "react";
import ModalLay from "../ModalLay";
import FormWithLoading from "../FormWithLoading";
import {
  Typography,
  TextField,
  InputAdornment,
  IconButton,
  CircularProgress,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { Question } from "./GetQuestions";
import { config, reqParams } from "@/lib/consts";
import { DataGrid } from "@mui/x-data-grid";
const SearchQuestions = ({
  selectedQuestions,
  changeQuestions,
  opener,
  setOpener,
  topicId,
}: {
  selectedQuestions: number[];
  changeQuestions: React.Dispatch<React.SetStateAction<number[]>>;
  opener?: boolean;
  setOpener?: React.Dispatch<React.SetStateAction<boolean>>;
  topicId: number;
}) => {
  const [open, setOpen] =
    opener !== undefined && setOpener !== undefined
      ? [opener, setOpener]
      : useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  useEffect(() => {
    if (questions.length === 0) {
      const loadQuestions = async () => {
        const options: RequestInit = await reqParams();
        const res = await fetch(`${config.site.url}/api/questions/search`, {
          ...options,
          body: JSON.stringify({ query: "", topicId: topicId }),
          method: "POST",
        });
        if (!res.ok) {
          console.log("Failed to fetch data");
        }
        setQuestions(await res.json());
      };
      loadQuestions();
    }
  }, []);
  const [loading, setLoading] = useState(false);
  return (
    <ModalLay
      buttonTitle="Select Questions *"
      buttonProps={{ variant: "outlined", color: "secondary" }}
      width={600}
      opener={open}
      setOpener={setOpen}
      isButton={false}
    >
      <FormWithLoading
        endpoint="/api/questions/search/"
        setData={setQuestions}
        button={false}
        loadingA={loading}
        setLoadingA={setLoading}
      >
        <Typography variant="h6" component="h2">
          Select Questions
        </Typography>
        <input name="topicId" value={topicId} style={{ display: "none" }} />
        <TextField
          size={"small"}
          name="query"
          label="Search Questions"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  edge="end"
                  color="primary"
                  type="submit"
                  {...(loading && {
                    disabled: true,
                  })}
                >
                  {loading ? <CircularProgress size={20} /> : <SearchIcon />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </FormWithLoading>
      <DataGrid
        autoHeight
        columns={[
          { field: "id", headerName: "ID" },
          { field: "question", headerName: "Question", width: 150, flex: 1 },
          { field: "image", headerName: "image" },
          { field: "score", headerName: "score" },
        ]}
        checkboxSelection
        rows={questions.map((question, index) => {
          return {
            id: question.id,
            question: question.question,
            image: question.image,
            score: question.score,
          };
        })}
        rowSelectionModel={selectedQuestions}
        onRowSelectionModelChange={(model) =>
          changeQuestions(model as number[])
        }
      />
    </ModalLay>
  );
};

export default SearchQuestions;
