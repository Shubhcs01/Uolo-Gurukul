import "./AdmissionForm.css";
import Header from "../Header/Header";
import { Route, BrowserRouter, Routes } from "react-router-dom";
import ProfilePage from "../ProfilePage/ProfilePage";
import CreateProfilePage from "../CreateProfile/CreateProfilePage";
import SidePage from "../Navpage/SidePage";
import MobileHeader from "../Header/MobileHeader";
import {useState} from 'react';

const AdmissionForm = () => {

  const [showHamburger, setShowHamburger] = useState(false);

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <BrowserRouter>
        <Header />
        <MobileHeader showHamburger={showHamburger} setShowHamburger={setShowHamburger}/>
        <div className="Admission-form">
          <SidePage showHamburger={showHamburger} setShowHamburger={setShowHamburger} />
          <Routes>
            <Route path="/" Component={ProfilePage} />
            <Route path="/create" Component={CreateProfilePage} />
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
};

export default AdmissionForm;
