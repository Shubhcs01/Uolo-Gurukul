import UserList from "./UserList";
import "./ProfilePage.css";
import { useState, useEffect } from "react";
import SearchBar from "../SearchBar/SearchBar";
import Pagination from "../Pagination/Pagination";
import Error from "../ErrorPage/Error";
import UserNotFound from "../ErrorPage/UserNotFound";
import Loader from "../Loader/Loader";
import SuccessModal from "../Modal/SuccessModal";

const MainPage = () => {
  const [users, setUsers] = useState([]);
  const [currentPageNumber, setCurrentPageNumber] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isloading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchInput, setSearchInput] = useState("");

  const BASE_URL = process.env.REACT_APP_API_BASE_URL;

  useEffect(() => {
    console.log("feting details...");
    if (!searchInput) getAllUsers(currentPageNumber);
    else getSearchUser(searchInput);
  }, [currentPageNumber]);

  const handlePagination = (pageNumber, paginationLength) => {
    if (pageNumber >= 1 && pageNumber <= paginationLength) {
      setCurrentPageNumber(pageNumber);
    }
  };

  const getAllUsers = (currentPageNumber) => {
    return fetch(`${BASE_URL}/v1/users?page=${currentPageNumber}`)
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        console.log("🚀 ~ .then ~ data:", data);

        if (data.status !== 200) {
          setError(data.error);
          return <Error message={data.error} />;
        }

        if (data.data.length !== 0) {
          console.log("Users Data: ", data.data);
          setUsers(data.data);
          setTotalPages(data.meta.totalPages);
          setLoading(false);
          return;
        }

        //Empty Users at current page
        if (currentPageNumber !== 1) {
          setCurrentPageNumber(currentPageNumber - 1);
        }
      })
      .catch((error) => {
        console.log("Error in fetching users:", error);
        setError(error);
        setLoading(false);
      });
  };

  //TODO: Try-catch lagao
  const getSearchUser = async (query) => {
    setLoading(true);

    const response = await fetch(
      `${BASE_URL}/v1/users/search?query=${query}&page=${currentPageNumber}`
    );

    if (!response.ok) {
      setLoading(false);
      console.log("🚀 Search User Response not OK: ", response.status);
      // setError(data.error);
      // return <Error message={data.error} />;
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const result = await response.json();
    console.log("Search User Result: ", result);

    if (result.data.length === 0) {
      console.log("No user found with given search query!");
      setUsers(result.data);
      setTotalPages(0);
      setLoading(false);
      //Empty Users at current page
      if (currentPageNumber !== 1) {
        setCurrentPageNumber(currentPageNumber - 1);
      }
      return;
    }

    setUsers(result.data);
    setTotalPages(result.meta.totalPages);
    setLoading(false);
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`${BASE_URL}/v1/users/${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        setIsModalOpen(true);
        setInterval(() => {
          setIsModalOpen(false);
        }, 2000);
        if (!searchInput) getAllUsers(currentPageNumber);
        else getSearchUser(searchInput);
      } else {
        console.error(`Failed to delete user with ID ${id}`);
        return <Error message={"Oops... Failed to delete!"} />; // TODO : change image for failure
      }
    } catch (error) {
      console.error(`Error: ${error}`);
      return <Error message={error} />;
    }
  };

  if (error) return <Error message={error.message} />;
  if (!users) return <Error message={"Something Went Wrong!!"} />;
  
  return (
    <div className="main-page">
      <h1>Our Team</h1>
      <div className="profile-container">
        {isloading ? (
          <Loader />
        ) : (
          <>
            <SearchBar
              getSearchUser={getSearchUser}
              searchInput={searchInput}
              setSearchInput={setSearchInput}
            />
            <SuccessModal
              isOpen={isModalOpen}
              message={"User deleted successfully"}
            />
            {!isloading && users.length === 0 ? (
              <UserNotFound />
            ) : (
              <>
                <UserList users={users} handleDelete={handleDelete} />
                <Pagination
                  totalPages={totalPages}
                  handlePagination={handlePagination}
                  currentPageNumber={currentPageNumber}
                />
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default MainPage;
