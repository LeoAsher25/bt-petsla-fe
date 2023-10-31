import React from "react";
import { Button, Modal, Spinner } from "react-bootstrap";
import { RootState } from "src/stores/rootReducer";
import { ERequestStatus } from "src/types/commonType";
import { useAppSelector } from "src/utils/hook.ts/customReduxHook";

interface IModalFooterProps {
  handleClose: () => void;
  handleSave?: () => void;
  type?: "button" | "submit" | "reset" | undefined;
  saveBtnTitle?: string;
}

const ModalFooter = ({
  handleClose,
  type,
  saveBtnTitle,
  handleSave,
}: IModalFooterProps) => {
  return (
    <Modal.Footer className="d-flex justify-content-between">
      <Button variant="secondary" onClick={handleClose}>
        Close
      </Button>
      <Button
        type={type || "submit"}
        className="custom-btn bg-fill"
        onClick={handleSave ? handleSave : () => {}}>
        {saveBtnTitle || "Save"}
      </Button>
    </Modal.Footer>
  );
};

export default ModalFooter;
