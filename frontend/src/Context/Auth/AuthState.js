import { useState } from "react";
import AuthContext from "./AuthContext";

const host = process.env.REACT_APP_HOST ;

const AuthState = ({ children }) => {
  const [user, setUser] = useState(null);
  const [stars, setStars] = useState(0);
  const token = localStorage.getItem("token");

  // Fetch current user data
  const fetchCurrentUser = async () => {
    try {
      if (!token) return;

      const response = await fetch(`${host}/api/auth/me`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "auth-token": token,
        },
      });

      const json = await response.json();
      if (response.ok) {
        setUser(json);
      }
    } catch (error) {
      console.error("Failed to fetch user:", error);
    }
  };

  // Add stars
  const addStars = async (starsToAdd) => {
    try {
      const res = await fetch(`${host}/api/auth/addstars`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "auth-token": token,
        },
        body: JSON.stringify({ starsToAdd }),
      });

      const data = await res.json();
      if (res.ok) setStars(data.stars);
      return data;
    } catch (err) {
      console.error("Failed to add stars:", err);
    }
  };

  // Get stars (fresh fetch)
  const fetchStars = async () => {
    try {
      const res = await fetch(`${host}/api/auth/getstars`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "auth-token": token,
        },
      });
      const data = await res.json();
      if (res.ok) setStars(data.stars);
      return data;
    } catch (err) {
      console.error("Failed to fetch stars:", err);
    }
  };

  // Update profile fields (name, profession, institution)
  const updateUserProfile = async (updatedFields) => {
    try {
      const res = await fetch(`${host}/api/auth/updateuser`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "auth-token": token,
        },
        body: JSON.stringify(updatedFields),
      });

      const data = await res.json();
      if (res.ok) {
        setUser(data.user);
        return { success: true };
      } else {
        return { success: false, error: data };
      }
    } catch (error) {
      console.error("Failed to update profile:", error);
      return { success: false, error: "Something went wrong" };
    }
  };

  // Update password
  const updatePassword = async (currentPassword, newPassword) => {
    try {
      const res = await fetch(`${host}/api/auth/updatepassword`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "auth-token": token,
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const data = await res.json();
      return data;
    } catch (error) {
      console.error("Failed to update password:", error);
      return { success: false, error: "Something went wrong" };
    }
  };

 

  return (
    <AuthContext.Provider
      value={{
        user,
        stars,
        fetchCurrentUser,
        fetchStars,
        addStars,
        updateUserProfile,
        updatePassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthState;
