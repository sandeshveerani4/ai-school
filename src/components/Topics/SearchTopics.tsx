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
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { Topic } from "./GetTopics";
const SearchTopics = ({
  changeTopic,
}: {
  changeTopic: React.Dispatch<React.SetStateAction<Topic>>;
}) => {
  const [open, setOpen] = useState(false);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(false);
  return (
    <ModalLay
      buttonTitle="Select Topic *"
      buttonProps={{ variant: "outlined", color: "secondary" }}
      width={600}
      opener={open}
      setOpener={setOpen}
    >
      <FormWithLoading
        endpoint="/api/topics/search/"
        setData={setTopics}
        button={false}
        loadingA={loading}
        setLoadingA={setLoading}
      >
        <Typography variant="h6" component="h2">
          Select Topic
        </Typography>
        <TextField
          size={"small"}
          name="query"
          label="Search Topic"
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
      <TableContainer component={Paper}>
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Subject</TableCell>
              <TableCell>Class</TableCell>
              <TableCell>Section</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {topics.map((topic, index) => (
              <TableRow key={index}>
                <TableCell>{topic.title}</TableCell>
                <TableCell>{topic.subject.name}</TableCell>
                <TableCell>{topic.subject.class.name}</TableCell>
                <TableCell>{topic.subject.section.name}</TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="success"
                    onClick={() => {
                      changeTopic(topic);
                      setOpen(false);
                    }}
                  >
                    Choose
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </ModalLay>
  );
};

export default SearchTopics;
