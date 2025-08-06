import React, { useState } from "react";
import { useNavigate ,Link} from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";

const host = process.env.REACT_APP_HOST;

const Signup = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    profession: "",
    institution: "",
  });
  console.log(host);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    const { name, email, profession, institution, password } = formData;

    try {
      const response = await fetch(`${host}/api/auth/createuser`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
          institution,
          profession,
        }),
      });

      const json = await response.json();

      if (json.success) {
        localStorage.setItem("token", json.authtoken);
        localStorage.setItem("user", JSON.stringify(json.user));
        alert("Signup successful!");
        navigate("/");
      } else {
        const errorMessage =
          json.error ||
          (json.errors && json.errors[0]?.msg) ||
          "Signup failed.";
        alert(errorMessage);
      }
    } catch (error) {
      console.error("Signup error:", error);
      alert("An error occurred. Please try again.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-purple-100 px-4">
      <div className="bg-purple-50 mt-14 shadow-xl rounded-2xl px-10 py-6 w-full max-w-3xl">
        <h1 className="text-3xl font-bold text-purple-900 text-center mb-4">
          Sign Up
        </h1>
        <form onSubmit={handleSubmit} className="space-y-3">
          {/* Name */}
          <div>
            <label className="block text-gray-700 font-semibold mb-1">
              Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full border rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-gray-700 font-semibold mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full border rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {/* Profession */}
          <div>
            <label className="block text-gray-700 font-semibold mb-1">
              Profession
            </label>
            <input
              type="text"
              name="profession"
              value={formData.profession}
              onChange={handleChange}
              required
              placeholder="e.g., Teacher, Student"
              className="w-full border rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {/* Institution */}
          <div>
            <label className="block text-gray-700 font-semibold mb-1">
              Institution
            </label>
            <input
              type="text"
              name="institution"
              value={formData.institution}
              onChange={handleChange}
              required
              placeholder="e.g., IIT Bombay"
              className="w-full border rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-gray-700 font-semibold mb-1">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full border rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-gray-700 font-semibold mb-1">
              Confirm Password
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                className="w-full border rounded-xl p-3 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-3 flex items-center text-gray-500"
                title={showConfirmPassword ? "Hide" : "Show"}
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <p className="text-red-500 text-sm text-center font-medium">
              {error}
            </p>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 text-sm rounded-xl transition duration-200"
          >
            Create Account
          </button>
        </form>

        <p className="text-sm text-center mt-4 text-gray-600">
          Already have an account?{" "}
          <Link to="/Login" className="text-blue-600 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
