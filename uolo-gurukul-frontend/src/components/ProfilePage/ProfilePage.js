import UserList from "./UserList";
import "./ProfilePage.css";
import { useState, useEffect } from "react";
import Pagination from "../Pagination/Pagination";
import Error from "../ErrorPage/Error";
import UserNotFound from "../ErrorPage/UserNotFound";
import Loader from "../Loader/Loader";
import SuccessModal from "../Modal/SuccessModal";
import SearchBar from "../SearchBar/SearchBar";
import { Navigate } from "react-router-dom";
import { useAuth } from "../Auth/authContext";
import toast from "react-hot-toast";

const MainPage = () => {
  const [users, setUsers] = useState([]);
  const { setIsAuthenticated, setCurrentUser } = useAuth()
  const [currentPageNumber, setCurrentPageNumber] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isloading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchInput, setSearchInput] = useState("");

  const BASE_URL = process.env.REACT_APP_API_BASE_URL;

  useEffect(() => {
    console.log("feting details...");
    if (searchInput) getUsers(searchInput, currentPageNumber);
    else getUsers("*", currentPageNumber);
  }, [currentPageNumber]);

  const handlePagination = (pageNumber, paginationLength) => {
    if (pageNumber >= 1 && pageNumber <= paginationLength) {
      setCurrentPageNumber(pageNumber);
    }
  };

  const getUsers = (query = "*", currPageNum = currentPageNumber) => {

    setLoading(true);
    return fetch(`${BASE_URL}/v1/users?query=${query}&page=${currPageNum}`, {
      method: "GET",
      credentials: "include",
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        console.log("🚀 Fetched Users: ", data);
        if (data.status !== 200) {
          if (data.status === 401) {
            console.log("Token invalid/expired!");
            toast.error("Session expired! Please login again.");
            setLoading(false);
            setIsAuthenticated(false);
            setCurrentUser(false);
            <Navigate to={"/login"} />;
          } else {
            console.log("fgh")
            throw new Error("token invalid/expired");
          }
        }

        if (data.data.length === 0) {
          console.log("No user found with given search query!");
          setUsers(data.data);
          setTotalPages(0);
          setLoading(false);
          //Empty Users at current page
          if (currentPageNumber !== 1) {
            setCurrentPageNumber(currentPageNumber - 1);
          }
          return;
        }

        setUsers(data.data);
        setTotalPages(data.meta.totalPages);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Server Error in fetching users: ", err);
        setError("Server Error in fetching users.");
        setLoading(false);
      });
  };

  if (error) return <Error message={error} />;
  if (!users) return <Error message={"Something Went Wrong!!"} />;

  return (
    <div className="main-page">
      <h1>Our Team</h1>
      <div className="profile-container">
        {isloading ? (
          <Loader />
        ) : (
          <>
            <SuccessModal
              isOpen={isModalOpen}
              message={"User deleted successfully"}
            />
            {!isloading && users.length === 0 ? (
              <>
                <SearchBar
                  getSearchUser={getUsers}
                  searchInput={searchInput}
                  setSearchInput={setSearchInput}
                />
                <UserNotFound />
              </>
            ) : (
              <>
                <UserList
                  users={users}
                  setIsModalOpen={setIsModalOpen}
                  getSearchUser={getUsers}
                  setSearchInput={setSearchInput}
                  searchInput={searchInput}
                />
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
