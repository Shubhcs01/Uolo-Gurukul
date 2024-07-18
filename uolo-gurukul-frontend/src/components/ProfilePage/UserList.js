import UserCard from "./UserCard";
import "./UserList.css";
import SearchBar from "../SearchBar/SearchBar";
import Error from "../ErrorPage/Error";

const UserList = ({ users, setIsModalOpen, getSearchUser, setSearchInput, searchInput }) => {

  const BASE_URL = process.env.REACT_APP_API_BASE_URL;
  const token = localStorage.getItem("token");

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`${BASE_URL}/v1/users/${id}`, {
        method: "DELETE",
        credentials: 'include', // Include credentials (cookies)
      });
      if (response.ok) {
        setIsModalOpen(true);
        setTimeout(() => {
          setIsModalOpen(false);
        }, 2000);
        setTimeout(() => {
          getSearchUser(searchInput);
        }, 2000);
      } else {
        console.error(`Failed to delete user with ID ${id}`);
        return <Error message={"Oops... Failed to delete!"} />; // TODO : change image for failure
      }
    } catch (error) {
      console.error(`Error: ${error}`);
      return <Error message={error} />;
    }
  };

  return (
    <div className="user-list-container">
      <SearchBar
        getSearchUser={getSearchUser}
        searchInput={searchInput}
        setSearchInput={setSearchInput}
      />
      {users.map((user) => (
        <UserCard key={user._id} user={user} handleDelete={handleDelete} />
      ))}
    </div>
  );
};

export default UserList;
