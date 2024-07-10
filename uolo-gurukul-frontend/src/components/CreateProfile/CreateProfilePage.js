import Styles from "./CreateProfilePage.module.css";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SuccessModal from "../Modal/SuccessModal";
import DefaultImage from "../../assets/profilePic.png";
import UploadImg from "../../assets/upload.png";
import CryptoJS from 'crypto-js';

const CreateProfilePage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isButtonEnabled, setIsButtonEnabled] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [imageSrc, setImageSrc] = useState(DefaultImage);
  const [file, setFile] = useState(null);
  const [borderRadius, setBorderradius] = useState("0%");
  const navigate = useNavigate();

  const BASE_URL = process.env.REACT_APP_API_BASE_URL;
  const secretKey = "Uolo123@";

  useEffect(() => {
    if (name && password && confirmPassword && email && file) {
      setIsButtonEnabled(true);
    } else {
      setIsButtonEnabled(false);
    }
  }, [name, password, confirmPassword, email, file]);

  const handleCancel = () => {
    setName("");
    setPassword("");
    setConfirmPassword("");
    setEmail("");
    setImageSrc(DefaultImage);
    setBorderradius("0%");
    setIsButtonEnabled(false);
    setFile(null);
  };

  const validatePassword = (password) => {
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasDigit = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const minValiLength = password.length >= 8;
    const maxValidLength = password.length <= 15;

    const validationMessages = [];

    if (!minValiLength) {
      validationMessages.push(
        `Password must be at least ${8} characters long.`
      );
    }
    if (!maxValidLength) {
      validationMessages.push(
        `Password must be less than ${16} characters long.`
      );
    }
    if (!hasUpperCase) {
      validationMessages.push(
        "Password must contain at least one uppercase letter."
      );
    }
    if (!hasLowerCase) {
      validationMessages.push(
        "Password must contain at least one lowercase letter."
      );
    }
    if (!hasDigit) {
      validationMessages.push("Password must contain at least one digit.");
    }
    if (!hasSpecialChar) {
      validationMessages.push(
        "Password must contain at least one special character."
      );
    }

    if (validationMessages.length > 0) {
      setIsButtonEnabled(true);
      setLoading(false);
      setErrorMessage(validationMessages);
      return false;
    } else {
      return true;
    }
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSave = async () => {
    setIsButtonEnabled(false);
    setLoading(true);

    if (!validateEmail(email)) {
      setIsButtonEnabled(true);
      setLoading(false);
      setErrorMessage(["Wrong Email Format!"]);
      setTimeout(() => {
        setErrorMessage([]);
      }, 5000);
      return;
    }
    //Todo: validate dp

    if (!validatePassword(password)) {
      setTimeout(() => {
        setErrorMessage([]);
      }, 5000);
      return;
    }

    if (password !== confirmPassword) {
      setIsButtonEnabled(true);
      setLoading(false);
      setErrorMessage(["*Passwords not matched !! Re-enter*"]);
      setTimeout(() => {
        setErrorMessage([]);
      }, 5000);
      return;
    }

    console.log("POST API called");
    setErrorMessage([]);

    const hashedPassword = CryptoJS.AES.encrypt(password, secretKey).toString();;


    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("password", hashedPassword);

    if (file) {
      formData.append("avatar", file);
    }

    try {
      const response = await fetch(`${BASE_URL}/v1/users`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (data.status !== 201) {
        setIsButtonEnabled(true);
        setLoading(false);
        setErrorMessage([data.msg]);
        setTimeout(() => {
          setErrorMessage([]);
        }, 5000);
      } else {
        console.log("Profile created successfully:", data.newUser);
        setIsButtonEnabled(true);
        setLoading(false);
        setIsModalOpen(true);
        setTimeout(() => {
          setIsModalOpen(false);
          navigate("/");
        }, 1000);
        setName("");
        setPassword("");
        setConfirmPassword("");
        setEmail("");
        setFile(null);
        setImageSrc(DefaultImage);
      }
    } catch (error) {
      setIsButtonEnabled(true);
      setLoading(false);
      setErrorMessage(["Error 500: Something went wrong!!"]);
      setTimeout(() => {
        setErrorMessage([]);
      }, 5000);
    }
  };

  const handleImageChange = (e) => {
    const file1 = e.target.files[0];

    setFile(file1);
    if (file1) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageSrc(reader.result);
        setBorderradius("100%");
      };
      reader.readAsDataURL(file1);
    }
  };

  const handleImageClick = () => {
    document.getElementById("fileInput").click();
  };

  const handleNameInput = (e) => {
    setErrorMessage([]);
    const value = e.target.value;
    const pattern = /^[A-Za-z\s]*$/;

    if (!pattern.test(value)) {
      setErrorMessage(["Please enter alphabets only."]);
      setTimeout(() => {
        setErrorMessage([]);
      }, 5000);
      return;
    }

    setName(value);
  };

  return (
    <div className={Styles.createProfileContainer + " " + Styles.sticky}>
      <h1>Create Profile</h1>
      <div className={Styles.createProfile}>
        <div className={Styles.form}>
          {errorMessage.length !== 0 &&
            errorMessage.map((msg) => (
              <p className={Styles.formError}>*{msg}*</p>
            ))}
          <div className={Styles.uploadPhoto}>
            <p>
              Upload Photo<span>*</span>
            </p>
            <p>Upload passport size photo</p>
            <img
              id={Styles.profilePic}
              src={imageSrc}
              alt="profilePhoto"
              onClick={handleImageClick}
              style={{ borderRadius: borderRadius }}
            />
            <img
              className={Styles.uploadImg}
              src={UploadImg}
              alt="uploadPhoto"
              onClick={handleImageClick}
            />
            <form>
              <input
                id="fileInput"
                name="avatar"
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={handleImageChange}
              />
            </form>
          </div>
          <label>
            Name<span>*</span>
          </label>
          <input
            type="text"
            value={name}
            placeholder="Enter your full name"
            onChange={handleNameInput}
            required
          />
          <label>
            Email-ID<span>*</span>
          </label>
          <input
            value={email}
            placeholder="Enter your email"
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <label>
            Password<span>*</span>
          </label>
          <input
            type="password"
            value={password}
            placeholder="Enter password"
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <label>
            Confirm Password<span>*</span>
          </label>
          <input
            type="password"
            value={confirmPassword}
            placeholder="Re-enter password"
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
      </div>
      <div className={Styles.formFooter}>
        <button onClick={handleCancel} className={Styles.btnCancel}>
          Cancel
        </button>
        <button
          type="button"
          onClick={handleSave}
          className={`${Styles.btnSave} ${
            isButtonEnabled && Styles.enabledBtn
          }`}
          disabled={!isButtonEnabled}
        >
          Save
        </button>
      </div>
      <SuccessModal
        isOpen={isModalOpen}
        isLoading={isLoading}
        message={"User Created Successfully"}
      />
    </div>
  );
};

export default CreateProfilePage;


