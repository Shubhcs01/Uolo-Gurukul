import "./CreateProfilePage.css";
import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import SuccessModal from "../Modal/SuccessModal";
import DefaultImage from "../../assets/profilePic.png";

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
    isButtonEnabled(false);
    setFile(null);
  };

  const validatePassword = (password) => {
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasDigit = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const minValiLength = password.length >= 8;
    const maxValidLength = password.length <=15;

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

    if(!validateEmail(email)) {
      setIsButtonEnabled(true);
      setLoading(false);
      setErrorMessage(["Wrong Email Format!"])
      setTimeout(() => {
        setErrorMessage([]);
      }, 5000);
      return;
    }
    //Todo: validate dp
    // Todo: Hash password before saving

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

    const formData = new FormData();
    formData.append('name', name);
    formData.append('email', email);
    formData.append('password', password);

    if (file) {
      formData.append('avatar', file);
    }

    try {
      const response = await fetch(`${BASE_URL}/v1/users`, {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        setIsButtonEnabled(true);
        setLoading(false);
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      if (data.status !== 201) {
        setIsButtonEnabled(true);
        setLoading(false);
        setErrorMessage([data.error]);
        setTimeout(() => {
          setErrorMessage([]);
        }, 5000);
      } else {
        console.log('Profile created successfully:', data.newUser);
        setIsButtonEnabled(true);
        setLoading(false);
        setIsModalOpen(true);
        setTimeout(() => {
          setIsModalOpen(false);
          navigate('/');
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
      console.error('Error creating profile:', error);
    }
  };

  const handleImageChange = (e) => {
    const file1 = e.target.files[0];
    // console.log("file1: ",file1);

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

  return (
    <div className="create-profile-container">
      <h1>Create Profile</h1>
      <div className="create-profile">
        <div className="form">
          {errorMessage.length !== 0 &&
            errorMessage.map((msg) => <p className="form-error">*{msg}*</p>)}
          <div className="upload-photo">
            <p>
              Upload Photo<span>*</span>
            </p>
            <p>Upload passport size photo</p>
            <img
              id="profile-pic"
              src={imageSrc}
              alt="profilePhoto"
              onClick={handleImageClick}
              style={{ borderRadius: borderRadius }}
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
            onChange={(e) => setName(e.target.value)}
          />
          <label>
            Email-ID<span>*</span>
          </label>
          <input
            value={email}
            placeholder="Enter your email"
            onChange={(e) => setEmail(e.target.value)}
          />
          <label>
            Password<span>*</span>
          </label>
          <input
            type="password"
            value={password}
            placeholder="Enter password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <label>
            Confirm Password<span>*</span>
          </label>
          <input
            type="password"
            value={confirmPassword}
            placeholder="Re-enter password"
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>
      </div>
      <div className="form-footer">
        <button onClick={handleCancel} className="btn-cancel">
          Cancel
        </button>
        <button
          type="button"
          onClick={handleSave}
          className={`btn-save ${isButtonEnabled ? "enabled-btn" : ""}`}
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
