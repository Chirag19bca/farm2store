import { createContext, useState, useEffect, useMemo } from "react";

const AuthContext = createContext({  //set the default value to an object
    user: null,
    login: () => { },
    logout: () => { },
    updateUser: () => { }, // Add updateUser function to context
});

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        try {
            const storedUser = localStorage.getItem("auth_user");
            return storedUser ? JSON.parse(storedUser) : null;
        } catch (error) {
            console.error("Error parsing user data:", error);
            localStorage.removeItem("auth_user");
            return null;
        }
    });

    useEffect(() => {
        //   Sync logout across tabs
        const handleStorageChange = (event) => {
            if (event.key === "auth_user") {
                setUser(event.newValue ? JSON.parse(event.newValue) : null);
            }
        };

        window.addEventListener("storage", handleStorageChange);
        return () => window.removeEventListener("storage", handleStorageChange);
    }, []);

    const login = (userData) => {
        if (!userData || !userData.id || !userData.role) {
            console.error("Invalid user data:", userData);
            return;
        }
        localStorage.setItem("auth_user", JSON.stringify(userData));
        setUser(userData);
    };

    const logout = () => {
        localStorage.removeItem("auth_user");
        setUser(null);
    };

    const updateUser = (newUserData) => {
        localStorage.setItem('auth_user', JSON.stringify(newUserData));
        setUser(newUserData);
    };

    //   Prevent unnecessary re-renders
    const authContextValue = useMemo(() => ({ user, login, logout, updateUser }), [user]);  //add the updateUser

    return (
        <AuthContext.Provider value={authContextValue}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
