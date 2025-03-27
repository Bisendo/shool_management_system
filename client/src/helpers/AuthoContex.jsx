import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState({
    accessToken: localStorage.getItem("accessToken") || "",
    teacherName: localStorage.getItem("teacherName") || "",
    teacherId: localStorage.getItem("teacherId") || "",
    role: localStorage.getItem("userRole") || "",  // Retrieve role
    schoolName: localStorage.getItem("schoolName") || "",  // Retrieve role
    authenticated: !!localStorage.getItem("accessToken"),
  });

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    const storedRole = localStorage.getItem("userRole");  // Get role from localStorage
    const storeSchoolName = localStorage.getItem("schoolName");  // Get role from localStorage

    if (token && storedRole) {
      setAuthState((prev) => ({
        ...prev,
        accessToken: token,
        authenticated: true,
        role: storedRole,  // Set role
        schoolName:storeSchoolName,
      }));
    }
  }, []);

  return (
    <AuthContext.Provider value={{ authState, setAuthState }}>
      {children}
    </AuthContext.Provider>
  );
};
