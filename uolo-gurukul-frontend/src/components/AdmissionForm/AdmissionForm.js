import "./AdmissionForm.css";
import Header from "../Header/Header";
import { Outlet, useLocation } from "react-router-dom";
import SidePage from "../Navpage/SidePage";
import MobileHeader from "../Header/MobileHeader";
import { useState } from 'react';

const AdmissionForm = () => {
  const [showHamburger, setShowHamburger] = useState(false);
  const location = useLocation();

  const hideHeaderAndSidebar = location.pathname === '/login';

  const handleMobileSidePage = () => {
    setShowHamburger(false);
  }

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
        {!hideHeaderAndSidebar && <Header />}
        {!hideHeaderAndSidebar && <MobileHeader showHamburger={showHamburger} setShowHamburger={setShowHamburger} />}
        <div className="Admission-form">
          {showHamburger && <div className="sidePageOverlay" onClick={handleMobileSidePage}></div>}
          {!hideHeaderAndSidebar && <SidePage showHamburger={showHamburger} setShowHamburger={setShowHamburger} />}
          <Outlet/>
        </div>
    </div>
  );
};

export default AdmissionForm;
