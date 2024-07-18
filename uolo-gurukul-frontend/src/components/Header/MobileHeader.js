import "./Header.css";
import Logo from "../../assets/uoloLogo.png";
import {useNavigate} from 'react-router-dom';
import { IoMenu } from "react-icons/io5";
import { useAuth } from "../Auth/authContext";

const MobileHeader = ({showHamburger, setShowHamburger}) => {

  const navigate = useNavigate()
  const { currentUser } = useAuth();

  const Hamburger = <IoMenu className="HamburgerMenu"
  size="30px" color="black" onClick={() => setShowHamburger(!showHamburger)}/>

  return (
    <div className={showHamburger? "hide-header":"mobile-header sticky"}>
        {Hamburger}
      <img className="uolo-logo" src={Logo} alt="uoloLogo" onClick={()=>navigate('/')} />
      <img className="avatar" style={{marginRight:"10px"}} src={currentUser.imageUrl} alt="userAvatar" />
    </div>
  );
};

export default MobileHeader;
