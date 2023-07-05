"use client";
import React, { useState } from "react";
import ModalLay from "../ModalLay";
import FormWithLoading from "../FormWithLoading";
import {
  Typography,
  TextField,
  InputAdornment,
  IconButton,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  Paper,
  TableBody,
  Button,
  CircularProgress,
  Box,
  CardMedia,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { Question } from "./GetQuestions";
import { config } from "@/consts";
import { DataGrid } from "@mui/x-data-grid";
const SearchQuestions = ({
  selectedQuestions,
  changeQuestions,
  opener,
  setOpener,
}: {
  selectedQuestions: number[];
  changeQuestions: React.Dispatch<React.SetStateAction<number[]>>;
  opener?: boolean;
  setOpener?: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const [open, setOpen] =
    opener !== undefined && setOpener !== undefined
      ? [opener, setOpener]
      : useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);
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
