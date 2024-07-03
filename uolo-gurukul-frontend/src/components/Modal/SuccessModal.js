import React from "react";
import "./SuccessModal.css";
import SuccessIcon from "../../assets/successIcon.png";
import Loader from "../Loader/Loader";

const SuccessModal = ({ isOpen, isLoading, message }) => {
  if (!isOpen && !isLoading) return null;

  return (
    <div className="modal-overlay">
      {isLoading ? (
        <Loader />
      ) : (
        <div className="modal-content">
          <img
            className="modal-success-icon"
            src={SuccessIcon}
            alt="succesIcon"
          />
          <h2>{message}</h2>
        </div>
      )}
    </div>
  );
};

export default SuccessModal;
