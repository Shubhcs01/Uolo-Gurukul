import { useState } from "react";
import './SearchBar.css';
import SearchIcon from '../../assets/searchIcon.png';

const SearchBar = () => {
  // const [userName, setUsername] = useState(null);
  const [input, setInput] = useState("");

  const handleClick = () => {
    // setUsername(input);
    setInput("");
  };

  return (
    <div className="search-bar">
      <img className="search-icon" src={SearchIcon} alt="searchIcon"/>
      <input
        placeholder="Search by Name, or Email id"
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <button onClick={handleClick}>Search</button>
    </div>
  );
};

export default SearchBar;
