import './Error.css';
import ThreatImg from '../../assets/threat.png';

const Error = ({ message }) => {
  return (
    <div className="error-container">
      <img id='threat-img' src={ThreatImg}></img>
      <h1>{message}</h1>
    </div>
  );
};

export default Error;
