import "./SearchBar.css";
import SearchIcon from "../../assets/searchIcon.png";
import { MdClear } from "react-icons/md";

const SearchBar = ({ getSearchUser, searchInput, setSearchInput }) => {
  const handleClick = () => {
    getSearchUser(searchInput);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleClick();
    }
  };

  const handleClear = () => {
    setSearchInput("");
  };

  return (
    <div className="search-bar">
      <img className="search-icon" src={SearchIcon} alt="searchIcon" />
      <input
        placeholder="Search by Name, or Email id"
        type="text"
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      {searchInput.length > 0 && (
        <MdClear onClick={handleClear} id="searchClearBtn" size="30px" />
      )}
      <button onClick={handleClick}>Search</button>
    </div>
  );
};

export default SearchBar;
