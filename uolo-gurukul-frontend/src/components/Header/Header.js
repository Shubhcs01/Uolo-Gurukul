import "./Header.css";
import Logo from "../../assets/uoloLogo.png";
import AvatarSection from "../Avatar/AvatarSection";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();

  return (
    <div className="header sticky">
      <img
        className="uolo-logo"
        src={Logo}
        alt="uoloLogo"
        onClick={() => navigate("/")}
      />
      <AvatarSection />
    </div>
  );
};

export default Header;
