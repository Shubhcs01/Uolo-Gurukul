import UserList from "./UserList";
import "./ProfilePage.css";
import { useState, useEffect } from "react";
import SearchBar from "../SearchBar/SearchBar";
import Pagination from "../Pagination/Pagination";
import Error from "../ErrorPage/Error";
import UserNotFound from "../ErrorPage/UserNotFound";
import Loader from "../Loader/Loader";

const MainPage = () => {
  const [users, setUsers] = useState([]);
  const [currentPageNumber, setCurrentPageNumber] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isloading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const BASE_URL = process.env.REACT_APP_API_BASE_URL;

  useEffect(() => {
    console.log("feting details...");
    getAllUsers(currentPageNumber);
  }, [currentPageNumber]);

  const handlePagination = (pageNumber, paginationLength) => {
    if (pageNumber >= 1 && pageNumber <= paginationLength) {
      setCurrentPageNumber(pageNumber);
    }
  };

  const getAllUsers = (currentPageNumber) => {
    return fetch(`${BASE_URL}/v1/users?page=${currentPageNumber}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Something Went Wrong!");
        }
        return response.json();
      })
      .then((data) => {
        if (data.data.length === 0 && currentPageNumber !== 1) {
          setCurrentPageNumber(currentPageNumber - 1);
        }
        console.log("Users Data: ", data.data);
        setUsers(data.data);
        setTotalPages(data.meta.totalPages);
        setLoading(false);
      })
      .catch((error) => {
        setError(error);
        setLoading(false);
      });
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`${BASE_URL}/v1/users/${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        getAllUsers(currentPageNumber);
      } else {
        console.error(`Failed to delete user with ID ${id}`);
      }
    } catch (error) {
      console.error(`Error: ${error}`);
      return <Error message={error} />;
    }
  };

  if (error) return <Error message={error.message} />;
  if (!users) return <Error message={"Something Went Wrong!!"} />;
  if (!isloading && users.length === 0) return <UserNotFound />; // Todo: fix this

  return (
    <div className="main-page">
      <h1>Our Team</h1>
      <div className="profile-container">
        {isloading ? (
          <Loader />
        ) : (
          <>
            <SearchBar />
            <UserList users={users} handleDelete={handleDelete} />
            <Pagination
              totalPages={totalPages}
              handlePagination={handlePagination}
              currentPageNumber={currentPageNumber}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default MainPage;
