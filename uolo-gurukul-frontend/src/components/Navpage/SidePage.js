import "./SidePage.css";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import UoloLogo from "../../assets/uoloLogo.png";
import LogoutIcon from "../../assets/logoutIcon.png";
import SuccessModal from "../Modal/SuccessModal";

const SidePage = ({ showHamburger, setShowHamburger }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const BASE_URL = process.env.REACT_APP_API_BASE_URL;

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
        setIsLoading(false);
        return;
      }

      console.log("Logout Successful: ", data);
      setIsLoading(false);
      setIsModalOpen(true);
      setTimeout(() => {
        setIsModalOpen(false);
        navigate("/login"); // redirect
      }, 1000);
    } catch (err) {
      isLoading(false);
      console.error("🚀 Error in Logout!");
    }
  };

  return (
    <div className={`${showHamburger ? "mobile-side-page" : "side-page"}`}>
      {showHamburger ? (
        <div className="mob-uolo-img-container">
          <img className="mob-uolo-img" src={UoloLogo} alt="uoloLogo" />
        </div>
      ) : (
        <></>
      )}

      <NavLink to="/">
        <div
          onClick={() => setShowHamburger(false)}
          id="team-member"
          className={`nav-div ${
            location.pathname === "/" ? "active-nav-div" : "inactive-nav-div"
          }`}
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <mask
              id="mask0_29_2542"
              maskUnits="userSpaceOnUse"
              x="0"
              y="0"
              width="24"
              height="24"
            >
              <rect width="24" height="24" fill="#D9D9D9" />
            </mask>
            <g mask="url(#mask0_29_2542)">
              <path
                d="M1 17.2C1 16.6333 1.14583 16.1125 1.4375 15.6375C1.72917 15.1625 2.11667 14.8 2.6 14.55C3.63333 14.0333 4.68333 13.6458 5.75 13.3875C6.81667 13.1292 7.9 13 9 13C10.1 13 11.1833 13.1292 12.25 13.3875C13.3167 13.6458 14.3667 14.0333 15.4 14.55C15.8833 14.8 16.2708 15.1625 16.5625 15.6375C16.8542 16.1125 17 16.6333 17 17.2V18C17 18.55 16.8042 19.0208 16.4125 19.4125C16.0208 19.8042 15.55 20 15 20H3C2.45 20 1.97917 19.8042 1.5875 19.4125C1.19583 19.0208 1 18.55 1 18V17.2ZM18.45 20C18.6333 19.7 18.7708 19.3792 18.8625 19.0375C18.9542 18.6958 19 18.35 19 18V17C19 16.2667 18.7958 15.5625 18.3875 14.8875C17.9792 14.2125 17.4 13.6333 16.65 13.15C17.5 13.25 18.3 13.4208 19.05 13.6625C19.8 13.9042 20.5 14.2 21.15 14.55C21.75 14.8833 22.2083 15.2542 22.525 15.6625C22.8417 16.0708 23 16.5167 23 17V18C23 18.55 22.8042 19.0208 22.4125 19.4125C22.0208 19.8042 21.55 20 21 20H18.45ZM9 12C7.9 12 6.95833 11.6083 6.175 10.825C5.39167 10.0417 5 9.1 5 8C5 6.9 5.39167 5.95833 6.175 5.175C6.95833 4.39167 7.9 4 9 4C10.1 4 11.0417 4.39167 11.825 5.175C12.6083 5.95833 13 6.9 13 8C13 9.1 12.6083 10.0417 11.825 10.825C11.0417 11.6083 10.1 12 9 12ZM19 8C19 9.1 18.6083 10.0417 17.825 10.825C17.0417 11.6083 16.1 12 15 12C14.8167 12 14.5833 11.9792 14.3 11.9375C14.0167 11.8958 13.7833 11.85 13.6 11.8C14.05 11.2667 14.3958 10.675 14.6375 10.025C14.8792 9.375 15 8.7 15 8C15 7.3 14.8792 6.625 14.6375 5.975C14.3958 5.325 14.05 4.73333 13.6 4.2C13.8333 4.11667 14.0667 4.0625 14.3 4.0375C14.5333 4.0125 14.7667 4 15 4C16.1 4 17.0417 4.39167 17.825 5.175C18.6083 5.95833 19 6.9 19 8Z"
                fill={location.pathname === "/" ? "#561FE7" : "#667085"}
              />
            </g>
          </svg>
          <p> All Team Members </p>
        </div>
      </NavLink>

      <NavLink to="/create">
        <div
          onClick={() => setShowHamburger(false)}
          id="create-profile"
          className={`nav-div ${
            location.pathname === "/create"
              ? "active-nav-div"
              : "inactive-nav-div"
          }`}
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <mask
              id="mask0_29_2548"
              maskUnits="userSpaceOnUse"
              x="0"
              y="0"
              width="24"
              height="24"
            >
              <rect width="24" height="24" fill="#D9D9D9" />
            </mask>
            <g mask="url(#mask0_29_2548)">
              <path
                d="M18 11H16C15.7167 11 15.4792 10.9042 15.2875 10.7125C15.0958 10.5208 15 10.2833 15 10C15 9.71667 15.0958 9.47917 15.2875 9.2875C15.4792 9.09583 15.7167 9 16 9H18V7C18 6.71667 18.0958 6.47917 18.2875 6.2875C18.4792 6.09583 18.7167 6 19 6C19.2833 6 19.5208 6.09583 19.7125 6.2875C19.9042 6.47917 20 6.71667 20 7V9H22C22.2833 9 22.5208 9.09583 22.7125 9.2875C22.9042 9.47917 23 9.71667 23 10C23 10.2833 22.9042 10.5208 22.7125 10.7125C22.5208 10.9042 22.2833 11 22 11H20V13C20 13.2833 19.9042 13.5208 19.7125 13.7125C19.5208 13.9042 19.2833 14 19 14C18.7167 14 18.4792 13.9042 18.2875 13.7125C18.0958 13.5208 18 13.2833 18 13V11ZM9 12C7.9 12 6.95833 11.6083 6.175 10.825C5.39167 10.0417 5 9.1 5 8C5 6.9 5.39167 5.95833 6.175 5.175C6.95833 4.39167 7.9 4 9 4C10.1 4 11.0417 4.39167 11.825 5.175C12.6083 5.95833 13 6.9 13 8C13 9.1 12.6083 10.0417 11.825 10.825C11.0417 11.6083 10.1 12 9 12ZM1 18V17.2C1 16.6333 1.14583 16.1125 1.4375 15.6375C1.72917 15.1625 2.11667 14.8 2.6 14.55C3.63333 14.0333 4.68333 13.6458 5.75 13.3875C6.81667 13.1292 7.9 13 9 13C10.1 13 11.1833 13.1292 12.25 13.3875C13.3167 13.6458 14.3667 14.0333 15.4 14.55C15.8833 14.8 16.2708 15.1625 16.5625 15.6375C16.8542 16.1125 17 16.6333 17 17.2V18C17 18.55 16.8042 19.0208 16.4125 19.4125C16.0208 19.8042 15.55 20 15 20H3C2.45 20 1.97917 19.8042 1.5875 19.4125C1.19583 19.0208 1 18.55 1 18ZM3 18H15V17.2C15 17.0167 14.9542 16.85 14.8625 16.7C14.7708 16.55 14.65 16.4333 14.5 16.35C13.6 15.9 12.6917 15.5625 11.775 15.3375C10.8583 15.1125 9.93333 15 9 15C8.06667 15 7.14167 15.1125 6.225 15.3375C5.30833 15.5625 4.4 15.9 3.5 16.35C3.35 16.4333 3.22917 16.55 3.1375 16.7C3.04583 16.85 3 17.0167 3 17.2V18ZM9 10C9.55 10 10.0208 9.80417 10.4125 9.4125C10.8042 9.02083 11 8.55 11 8C11 7.45 10.8042 6.97917 10.4125 6.5875C10.0208 6.19583 9.55 6 9 6C8.45 6 7.97917 6.19583 7.5875 6.5875C7.19583 6.97917 7 7.45 7 8C7 8.55 7.19583 9.02083 7.5875 9.4125C7.97917 9.80417 8.45 10 9 10Z"
                fill={location.pathname === "/" ? "#667085" : "#561FE7"}
              />
            </g>
          </svg>

          <p> Create Profile </p>
        </div>
      </NavLink>

      <div className="sidePageLogout_Btn" onClick={handleLogout}>
        <img id="sidePagelogout_Img" src={LogoutIcon} alt="logoutImg" />
        <p id="sidePagelogout_text"> Logout</p>
      </div>

      <SuccessModal isOpen={isModalOpen} isLoading={isLoading} message={"Logged out Successfully!"} />
    </div>
  );
};

export default SidePage;
