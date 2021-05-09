import React, { useState } from "react";

import { Button, ButtonProps, Col, Modal } from "react-bootstrap";

export type ConfirmProps = {
  onConfirm: VoidFunction;
  triggerText: string;
  triggerButtonParams?: ButtonProps;
  headerText?: string;
  bodyText?: string;
  confirmText?: string;
  confirmVariant?: string;
};

export const Confirm = ({
  onConfirm,
  triggerText,
  triggerButtonParams,
  headerText = "Confirm?",
  bodyText,
  confirmText = "Save",
  confirmVariant = "primary"
}: ConfirmProps) => {
  const [open, setOpen] = useState(false);
  const close = (confirmed: boolean) => {
    setOpen(false);
    if (confirmed) {
      onConfirm();
    }
  };

  const header = (
    <Modal.Header>
      <Modal.Title>{headerText}</Modal.Title>
    </Modal.Header>
  );

  const body = <Modal.Body>{bodyText || "Confirm?"}</Modal.Body>;

  return (
    <>
      <Modal
        show={open}
        onHide={close}
        animation={true}
        contentClassName="bg-dark text-light noselect"
      >
        {header}
        {bodyText && body}
        <Modal.Footer>
          <Col>
            <Button variant="secondary" onClick={() => close(false)} block>
              Close
            </Button>
          </Col>
          <Col>
            <Button variant={confirmVariant} onClick={() => close(true)} block>
              {confirmText}
            </Button>
          </Col>
        </Modal.Footer>
      </Modal>
      <Button onClick={() => setOpen(true)} {...triggerButtonParams}>
        {triggerText}
      </Button>
    </>
  );
};
