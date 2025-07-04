import React, { useState } from "react";
import { Modal, Box, Typography, Button, ButtonProps } from "@mui/material";
import ArrowBack from "@mui/icons-material/ArrowBack";
const ModalLay = ({
  children,
  buttonTitle,
  buttonProps,
  opener,
  setOpener,
  width = 400,
  isButton = true,
  extras,
  onClose,
}: {
  children?: React.ReactNode;
  buttonTitle?: string;
  buttonProps?: ButtonProps;
  opener?: boolean;
  setOpener?: React.Dispatch<React.SetStateAction<boolean>>;
  width?: number;
  isButton?: boolean;
  extras?: React.ReactNode;
  onClose?: () => void;
}) => {
  var [open, setOpen] =
    opener !== undefined && setOpener !== undefined
      ? [opener, setOpener]
      : useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    onClose && onClose();
  };
  const style = {
    position: "absolute" as "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: width,
    bgcolor: "background.paper",
    boxShadow: 24,
    p: 3,
    overflowY: "auto",
    maxHeight: "90%",
  };
  return (
    <>
      {isButton && (
        <Button
          variant="outlined"
          color="error"
          size="small"
          onClick={handleOpen}
          {...buttonProps}
        >
          {buttonTitle}
        </Button>
      )}
      {extras}
      {open && (
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style} className="rounded-2xl">
            <Button onClick={handleClose} size="small">
              <ArrowBack fontSize="small" />
              Back
            </Button>
            {children}
          </Box>
        </Modal>
      )}
    </>
  );
};

export default ModalLay;
