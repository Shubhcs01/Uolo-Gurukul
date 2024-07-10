import "./UserNotFound.css";
import NoUserFound from '../../assets/noUserFound.png';

const UserNotFound = () => {
  return (
    <div className="UserNotFoundContainer">
      <div className="UserNotFoundMessageBox">
        <img id="userNotFoundImg" src={NoUserFound} alt="userNotFound"/>
      </div>
    </div>
  );
};

export default UserNotFound;
