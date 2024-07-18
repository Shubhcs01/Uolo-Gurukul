import "./App.css";
import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Loader from "./components/Loader/Loader";
import AdmissionForm from "./components/AdmissionForm/AdmissionForm";
import Login from "./components/Auth/Login";
import ProfilePage from "./components/ProfilePage/ProfilePage";
import CreateProfilePage from "./components/CreateProfile/CreateProfilePage";
import { useAuth } from "./components/Auth/authContext";

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const { isAuthenticated, currentUser, setIsAuthenticated, setCurrentUser } = useAuth();
  const BASE_URL = process.env.REACT_APP_API_BASE_URL;

  useEffect(() => {
    verifyToken();
  }, []);

  const verifyToken = async () => {
    setCurrentUser(null);
    setIsLoading(true);

    console.log("🚀 Verifying token...");

    try {
      const response = await fetch(`${BASE_URL}/v1/auth/verify-token`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (!response.ok) {
        console.error("Token Verification Failed!");
        throw new Error("Response is not Ok!");
      }

      // Logged In success
      const data = await response.json();
      console.log("Token validated successfully:", data);
      setCurrentUser(data.authData); // set user
      setIsAuthenticated(true); // set flag
      <Navigate to={"/"} />;

    } catch (error) {
      console.error("Session expired/Invalid! Please log in again: ", error);
      <Navigate to={"/login"} />;
    } finally {
      setIsLoading(false);
    }
  };

  if(isLoading){
    return <div style={{display: "flex", justifyContent: "center", alignContent:"center"}}>
      <Loader/>
    </div>
  }

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>

          {!isAuthenticated ? (
            <>
              <Route path="/" exact element={!isAuthenticated?<Navigate to='/login' />:<Navigate to='/' />} />
              <Route path="/login" element={!isAuthenticated?<Login />:<Navigate to='/' />} />
              <Route path="/create" element={!isAuthenticated?<Navigate to='/login' />:<Navigate to='/' />} />
            </>
          ) : (
            <>
                <Route path="/" exact element={isAuthenticated ? <AdmissionForm />:<Navigate to='/'/>}>
                  <Route index element={isAuthenticated?<ProfilePage />:<Navigate to='/'/>} />
                  <Route path="create" element={isAuthenticated ? <CreateProfilePage />:<Navigate to='/'/>} />
                  <Route path="/login" element={isAuthenticated ?<Navigate to='/'/>:<></>} />
                </Route>
            </>
          )}

          <Route path="*" element={<h1>Error 404 : Not Found!</h1>} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
