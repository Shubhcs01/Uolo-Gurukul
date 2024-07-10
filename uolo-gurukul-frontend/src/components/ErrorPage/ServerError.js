import "./ServerError.css";
import ServerErrorImg from '../../assets/serverError.jpg';

const ServerError = () => {
  return (
    <div className="ServiceDownContainer">
      <div className="ServiceDownMessageBox">
        <img id="serviceDownImg" src={ServerErrorImg} alt="ServerUnavailable"/>
      </div>
    </div>
  );
};

export default ServerError;
