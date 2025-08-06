import React, { useState, useEffect, useContext } from "react";
import AuthContext from "../../Context/Auth/AuthContext";
import { useNavigate } from "react-router-dom";

const UpdateProfile = () => {
  const { user, fetchCurrentUser, updateUserProfile, updatePassword } =
    useContext(AuthContext);
  const navigate = useNavigate();

  const [profile, setProfile] = useState({
    name: "",
    institution: "",
    profession: "",
  });

  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  useEffect(() => {
    if (user) {
      setProfile({
        name: user.name || "",
        institution: user.institution || "",
        profession: user.profession || "",
      });
    }
  }, [user]);

  const handleProfileChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    const confirm = window.confirm(
      "Are you sure you want to update your profile?"
    );
    if (!confirm) return;

    const res = await updateUserProfile(profile);
    if (res?.success) {
      navigate("/profile");
    } else {
      alert(res?.error || "Failed to update profile");
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwords.newPassword !== passwords.confirmPassword) {
      return alert("New passwords do not match");
    }

    const confirm = window.confirm(
      "Are you sure you want to change your password?"
    );
    if (!confirm) return;

    const res = await updatePassword(
      passwords.currentPassword,
      passwords.newPassword
    );
    if (res?.success) {
      navigate("/profile");
    } else {
      alert(res?.error || "Failed to change password");
    }
  };

  return (
    <div className="min-h-screen bg-purple-100 p-8">
      <div className="max-w-4xl mt-14 mx-auto bg-purple-50 rounded-xl shadow-md p-8 space-y-8">
        <h2 className="text-2xl font-bold text-center text-purple-900">
          Update Profile
        </h2>

        {/* Profile Form */}
        <form onSubmit={handleProfileSubmit} className="space-y-4">
          <h3 className="text-xl font-semibold text-gray-700">Basic Info</h3>
          <input
            type="text"
            name="name"
            value={profile.name}
            onChange={handleProfileChange}
            placeholder="Your Name"
            className="w-full border rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <input
            type="text"
            name="institution"
            value={profile.institution}
            onChange={handleProfileChange}
            placeholder="Institution"
            className="w-full border rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <input
            type="text"
            name="profession"
            value={profile.profession}
            onChange={handleProfileChange}
            placeholder="Profession"
            className="w-full border rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Update Profile
          </button>
        </form>

        {/* Password Form */}
        <form
          onSubmit={handlePasswordSubmit}
          className="space-y-4 border-t pt-6"
        >
          <h3 className="text-xl font-semibold text-gray-700">
            Change Password
          </h3>
          <input
            type="password"
            name="currentPassword"
            value={passwords.currentPassword}
            onChange={handlePasswordChange}
            placeholder="Current Password"
            className="w-full border rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <input
            type="password"
            name="newPassword"
            value={passwords.newPassword}
            onChange={handlePasswordChange}
            placeholder="New Password"
            className="w-full border rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <input
            type="password"
            name="confirmPassword"
            value={passwords.confirmPassword}
            onChange={handlePasswordChange}
            placeholder="Confirm New Password"
            className="w-full border rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <button
            type="submit"
            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
          >
            Change Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdateProfile;
