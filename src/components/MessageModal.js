import React from 'react';
import { Modal, Button } from 'react-bootstrap';

const MessageModal = ({ show, onHide, title, message, onConfirm, type = 'alert' }) => {
  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>{title || (type === 'confirm' ? 'Confirmation' : 'Notification')}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>{message}</p>
      </Modal.Body>
      <Modal.Footer>
        {type === 'confirm' ? (
          <>
            <Button variant="secondary" onClick={onHide}>
              Cancel
            </Button>
            <Button variant="danger" onClick={onConfirm}>
              Confirm
            </Button>
          </>
        ) : (
          <Button variant="dark" onClick={onHide}>
            OK
          </Button>
        )}
      </Modal.Footer>
    </Modal>
  );
};

export default MessageModal;
