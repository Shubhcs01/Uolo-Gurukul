import Avatar from "../../assets/avatar.png";
import DropIcon from "../../assets/dropIcon.png";
import './AvatarSection.css';

const AvatarSection = () => {
  return (
    <div className="avatar-section">
      <img className="avatar" src={Avatar} alt="avatar" />
      <p className="avatar-name">Vikrant</p>
      <img className="drop-icon" src={DropIcon} alt="dropIcon" />
    </div>
  );
};

export default AvatarSection;
