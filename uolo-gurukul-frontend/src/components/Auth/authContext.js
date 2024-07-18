import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

const AuthContextProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [currentUser, setCurrentUser] = useState(null);

  return (
    <AuthContext.Provider value={{ isAuthenticated, currentUser, setIsAuthenticated,  setCurrentUser}}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;

export const useAuth = () => {
    return useContext(AuthContext);
};
