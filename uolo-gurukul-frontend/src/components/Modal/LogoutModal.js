import "./LogoutModal.css";
import LogoutImg from "../../assets/logoutIcon.png";
import SuccessModal from "./SuccessModal";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Auth/authContext";

const logoutModal = ({ isOpen }) => {
  const navigate = useNavigate();
  const { setIsAuthenticated, setCurrentUser } = useAuth();
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const BASE_URL = process.env.REACT_APP_API_BASE_URL;

  if (!isOpen) return null;

  const handleLogout = async () => {
    console.log("Pressed logout!");
    setIsLoading(true);

    try {
      const response = await fetch(`${BASE_URL}/v1/auth/logout`, {
        method: "POST",
        credentials: "include", // Include credentials (cookies)
      });

      const data = await response.json();

      if (data.status !== 200) {
        console.error(`Status ${data.status} Error : ${data.msg}`);
        throw new Error(`Status ${data.status} Error : ${data.msg}`);
      }

      console.log("Logout Successful: ", data);
      setIsLoading(false);
      setIsSuccessModalOpen(true);
      setTimeout(() => {
        setIsAuthenticated(false); // set flag
        setCurrentUser(null); //set user
        setIsSuccessModalOpen(false); // close modal
        navigate("/login"); // redirect
      }, 1000);
    } catch (err) {
      console.error(err);
      setIsLoading(false);
      setIsSuccessModalOpen(false);
    }
  };

  return (
    <>
      <div className="logout-modal-content" onClick={handleLogout}>
        <img className="logout-modal-icon" src={LogoutImg} alt="logoutIcon" />
        <h2>Logout</h2>
      </div>
      <SuccessModal
        isOpen={isSuccessModalOpen}
        isLoading={isLoading}
        message={"You have been successfully logout"}
      />
    </>
  );
};

export default logoutModal;
