"use client";
import React, { useState, useEffect, useRef } from "react";
import ModalLay from "../ModalLay";
import FormWithLoading from "../FormWithLoading";
import {
  Typography,
  TextField,
  InputAdornment,
  Box,
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
import { config, reqParams } from "@/lib/consts";
const SearchTopics = ({
  changeTopic,
}: {
  changeTopic: React.Dispatch<React.SetStateAction<Topic>>;
}) => {
  const [open, setOpen] = useState(false);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState<Topic>({} as Topic);
  useEffect(() => {
    if (topics.length === 0) {
      const loadTopics = async () => {
        const options: RequestInit = await reqParams();
        const res = await fetch(`${config.site.url}/api/topics/search`, {
          ...options,
          body: JSON.stringify({ query: "" }),
          method: "POST",
        });
        if (!res.ok) {
          console.log("Failed to fetch data");
        }
        setTopics(await res.json());
      };
      loadTopics();
    }
  }, []);
  useEffect(() => {
    changeTopic(selectedTopic);
  }, [selectedTopic]);
  return (
    <ModalLay
      buttonTitle={`${selectedTopic.title ? "Change" : "Select"} Topic *`}
      buttonProps={{ variant: "outlined", color: "secondary" }}
      width={600}
      opener={open}
      setOpener={setOpen}
      extras={
        selectedTopic.title && (
          <Box>
            <Box
              className="mt-2 text-white rounded-lg p-3 inline-block"
              sx={{ bgcolor: "secondary.main" }}
            >
              <Typography>
                Topic:{" "}
                <Typography component={"span"} fontWeight={"medium"}>
                  {selectedTopic.title}
                </Typography>
              </Typography>
              <Typography>
                Subject:{" "}
                <Typography component={"span"} fontWeight={"medium"}>
                  {selectedTopic.subject.name}
                </Typography>
              </Typography>
              <Typography>
                Class:{" "}
                <Typography component={"span"} fontWeight={"medium"}>
                  {selectedTopic.subject.class.name}
                </Typography>
              </Typography>
              <Typography>
                Section:{" "}
                <Typography component={"span"} fontWeight={"medium"}>
                  {selectedTopic.subject.section.name}
                </Typography>
              </Typography>
            </Box>
          </Box>
        )
      }
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
                    color="secondary"
                    onClick={() => {
                      setSelectedTopic(topic);
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
