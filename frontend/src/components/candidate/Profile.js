import React, { useEffect,useState } from "react";
import { useNavigate } from "react-router-dom";
import unknown from "../../asset/unknown.jpg";
const host = process.env.REACT_APP_HOST;

const ProfilePage = () => {
  const navigate=useNavigate();
   const [profile, setProfile] = useState({
     name: "",
     email: "",
     profession: "",
     institution: "",
     stars:"",
   });

      const getprofile = async () => {
        try {
          const token = localStorage.getItem("token");
          if (!token) {
            return;
          }
          const response = await fetch(`${host}/api/auth/me`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "auth-token": token,
            },
          });
          const json = await response.json();
          setProfile(json);
        } catch (error) {
          console.error("Failed to fetch notes:", error);
        }
      };


      
      useEffect(() => {
        getprofile();
        // eslint-disable-next-line
      }, []);

  const token = localStorage.getItem("token");

  // 🔒 Unauthorized access
  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-purple-100">
        <h2 className="text-2xl font-bold text-red-600">Unauthorized Access</h2>
      </div>
    );
  }
 
  return (
    <div className="min-h-screen flex items-center justify-center bg-purple-100 px-4">
      <div className="bg-purple-50 shadow-2xl rounded-3xl w-full max-w-4xl p-10 flex flex-col md:flex-row gap-10 relative">
        {/* Total Stars at top-right */}
        <div className="absolute top-4 right-4 bg-yellow-400 text-white px-6 py-3 rounded-full text-xl font-bold shadow">
          ⭐ {profile.stars}
        </div>

        {/* Profile Image + Name */}
        <div className="flex flex-col items-center w-full md:w-1/3">
          <img
            src={unknown}
            alt="Profile"
            className="w-64 h-64 object-cover rounded-3xl border-4 border-white shadow-lg"
          />
          <h2 className="text-3xl font-bold text-gray-800 mt-6 text-center">
            {profile.name}
          </h2>
        </div>

        {/* Profile Info + Buttons */}
        <div className="w-full md:w-2/3 space-y-8 text-gray-800">
          <div>
            <p className="text-gray-500 text-lg mb-1">Email</p>
            <p className="text-2xl font-semibold">{profile.email}</p>
          </div>

          <div>
            <p className="text-gray-500 text-lg mb-1">Profession</p>
            <p className="text-2xl font-semibold">{profile.profession}</p>
          </div>

          <div>
            <p className="text-gray-500 text-lg mb-1">Institution</p>
            <p className="text-2xl font-semibold">{profile.institution}</p>
          </div>

          {/* Buttons in column */}
          <div className="flex flex-col items-start gap-4 pt-2">
            <button
              onClick={() => navigate("/updateprofile")}
              className="bg-purple-600 hover:bg-purple-700 text-white text-md px-6 py-2 rounded-xl font-semibold w-full"
            >
              Edit Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
