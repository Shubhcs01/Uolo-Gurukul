import "./Header.css";
import Logo from "../../assets/uoloLogo.png";
import {useNavigate} from 'react-router-dom';
import { IoMenu } from "react-icons/io5";
import { CgProfile } from "react-icons/cg";

const MobileHeader = ({showHamburger, setShowHamburger}) => {

  const navigate = useNavigate()

  const Hamburger = <IoMenu className="HamburgerMenu"
  size="30px" color="black" onClick={() => setShowHamburger(!showHamburger)}/>

  return (
    <div className={showHamburger? "hide-header":"mobile-header sticky"}>
        {Hamburger}
      <img className="uolo-logo" src={Logo} alt="uoloLogo" onClick={()=>navigate('/')} />
      <CgProfile className="mobile-avatar" size="30px"/>
    </div>
  );
};

export default MobileHeader;
