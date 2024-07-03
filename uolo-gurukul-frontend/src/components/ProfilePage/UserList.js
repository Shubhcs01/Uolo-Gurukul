import UserCard from "./UserCard";
import "./UserList.css";
import { useState } from "react";

const UserList = ({ users, handleDelete }) => {

  return (
    <div className="user-list-container">
      {users.map((user) => (
        <UserCard key={user._id} user={user} handleDelete={handleDelete} />
      ))}
    </div>
  );
};

export default UserList;
