import "./UserNotFound.css";
import NoUserFound from '../../assets/noUserFound.png';

const UserNotFound = () => {
  return (
    <div className="container">
      <div className="message-box">
        <img src={NoUserFound} alt="userNotFound"/>
      </div>
    </div>
  );
};

export default UserNotFound;
