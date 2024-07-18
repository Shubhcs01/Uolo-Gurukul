import styles from "./Login.module.css";
import UnityImage from "../../assets/unityImage.png";
import UoloLogo from "../../assets/uoloLogo.png";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import CryptoJS from "crypto-js";
import SuccessModal from "../Modal/SuccessModal";
import { useAuth } from "./authContext";

const Login = () => {
  const navigate = useNavigate();
  const { setIsAuthenticated, setCurrentUser } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState("");

  const BASE_URL = process.env.REACT_APP_API_BASE_URL;
  const SECRET_KEY = process.env.REACT_APP_SECRET_KEY;

  const handleClick = async () => {

    setIsLoading(true);
    setError("");

    const encryptedPassword = CryptoJS.AES.encrypt(
      password,
      SECRET_KEY
    ).toString();

    try {
      const response = await fetch(`${BASE_URL}/v1/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, encryptedPassword }),
        credentials: "include", // Include credentials/cookies
      });

      const data = await response.json();

      if (data.status !== 200) {
        setIsLoading(false);
        setError(data.msg);
        console.error(`Status ${data.status} Error : ${data.msg}`);
        return;
      }

      console.log("Login Successful: ", data);
      setIsLoading(false);
      setIsModalOpen(true);
      setTimeout(() => {
        setIsModalOpen(false);
        setIsAuthenticated(true) // set flag
        setCurrentUser(data.loggedUser) //set user
        navigate("/", { replace: true });
      }, 1000);
    } catch (err) {
      setIsLoading(false);
      setError(err.message || "Login failed. Please try again.");
    }
  };

  return (
    <div className={styles.loginContainer}>
      <img id={styles.unityImage} src={UnityImage} alt="unityImage" />
      <div className={styles.loginDetails}>
        <img className={styles.loginUoloLogo} src={UoloLogo} alt="uoloLogo" />
        <hr />
        <div className={styles.loginDetails_Main}>
          <h1>Welcome Back!</h1>
          <p>Log in to continue and access all the features</p>
          {error && <p className={styles.loginError}>{error}</p>}
          <label>Enter Email</label>
          <input
            type="text"
            value={email}
            placeholder="Enter your email"
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <label>Password</label>
          <input
            type="password"
            value={password}
            placeholder="Enter password"
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            onClick={handleClick}
            id={styles.loginBtn}
            disabled={isLoading}
          >
            Login
          </button>
        </div>
      </div>
      <SuccessModal
        isOpen={isModalOpen}
        isLoading={isLoading}
        message={"Logged In Successfully!"}
      />
    </div>
  );
};

export default Login;
