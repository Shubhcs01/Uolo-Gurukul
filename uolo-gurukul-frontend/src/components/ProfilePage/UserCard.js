import "./UserCard.css";
import { useState } from "react";
import ThreeDot from "../../assets/three-dots.png";
import KebabModal from "../Modal/KebabModal";

const UserCard = ({ user, handleDelete }) => {
  const [isDialogOpen, setDialogOpen] = useState(false);

  return (
    <div className="userCard">
      <div className="kebab-menu" onClick={() => setDialogOpen(!isDialogOpen)}>
        <img src={ThreeDot} />
      </div>
      {isDialogOpen ? <KebabModal user={user} handleDelete={handleDelete} /> : <></>}
      <img className="user-photo" src={user.imageUrl} alt="profilePhoto" />
      <div className="user-details">
        <p>{user.name}</p>
        <p>{user.email}</p>
      </div>
    </div>
  );
};

// `http://localhost:5000/images/${user.profilePic}`    handleDelete(user._id)

export default UserCard;
