import "./AvatarSection.css";
import DropIcon from "../../assets/dropIcon.png";
import LogoutModal from "../Modal/LogoutModal";
import { useState } from "react";
import { useAuth } from "../Auth/authContext";

const AvatarSection = () => {
  const { currentUser } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div className="avatar-section">
        <img className="avatar" src={currentUser.imageUrl} alt="userAvatar" />
        <p className="avatar-name">{currentUser.name}</p>
        <img
          className="drop-icon"
          src={DropIcon}
          alt="dropIcon"
          onClick={() => setIsOpen(!isOpen)}
        />
      </div>
      <LogoutModal isOpen={isOpen} />
    </>
  );
};

export default AvatarSection;
