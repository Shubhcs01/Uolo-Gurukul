import "./AdmissionForm.css";
import Header from "../Header/Header";
import { Route, BrowserRouter, Routes } from "react-router-dom";
import ProfilePage from "../ProfilePage/ProfilePage";
import CreateProfilePage from "../CreateProfile/CreateProfilePage";
import SidePage from "../Navpage/SidePage";

const AdmissionForm = () => {
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <BrowserRouter>
        <Header />
        <div className="Admission-form">
          <SidePage />
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
