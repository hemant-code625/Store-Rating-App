import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const SignUpForm = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    address: "",
    role: "user",
  });

  const [errors, setErrors] = useState({});
  const [notify, setNotify] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const validate = () => {
    const newErrors = {};

    // Name: 20-60 chars
    if (!form.name) newErrors.name = "Name is required";
    else if (form.name.length < 20 || form.name.length > 60)
      newErrors.name = "Name must be 20-60 characters long";

    // Email: standard regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!form.email) newErrors.email = "Email is required";
    else if (!emailRegex.test(form.email))
      newErrors.email = "Please enter a valid email";

    // Password: 8-16 chars, 1 uppercase, 1 special char
    const passwordRegex =
      /^(?=.*[A-Z])(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,16}$/;
    if (!form.password) newErrors.password = "Password is required";
    else if (!passwordRegex.test(form.password))
      newErrors.password =
        "Password must be 8-16 chars, include 1 uppercase and 1 special character";

    // Confirm password
    if (form.password !== form.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";

    // Address: max 400 chars
    if (!form.address) newErrors.address = "Address is required";
    else if (form.address.length > 400)
      newErrors.address = "Address cannot exceed 400 characters";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const response = await fetch(
        "http://localhost:8080/api/auth/user/signup",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(form),
        }
      );

      const result = await response.json();
      if (!response.ok) {
        setNotify("" + (result.message || "Unknown error"));
        return;
      }

      setNotify("User added successfully");
      setForm({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        address: "",
        role: "user",
      });
      setErrors({});
    } catch (err) {
      console.error(err);
      setNotify("An error occurred. Please try again.");
    }
  };

  useEffect(() => {
    if (notify) {
      const timer = setTimeout(() => setNotify(""), 8000);
      return () => clearTimeout(timer);
    }
  }, [notify]);

  // Common input classes
  const inputClasses =
    "mb-3 w-full px-3 py-2 rounded bg-gray-800 text-white border border-gray-600 focus:border-blue-500 focus:outline-none";

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4 py-12">
      <div className="w-full max-w-md bg-gray-800 rounded-lg shadow-lg p-8">
        <h2 className="text-3xl font-bold text-white mb-6 text-center">
          Sign Up
        </h2>
        <form onSubmit={handleSubmit} className="p-4 max-w-md">
          {/* Name */}
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={form.name}
            onChange={handleChange}
            className={inputClasses}
            required
          />
          {errors.name && (
            <p className="text-red-500 text-sm mb-2">{errors.name}</p>
          )}

          {/* Email */}
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className={inputClasses}
            required
          />
          {errors.email && (
            <p className="text-red-500 text-sm mb-2">{errors.email}</p>
          )}

          {/* Password */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              className={inputClasses + " pr-10"}
              required
              onCopy={(e) => e.preventDefault()}
              onPaste={(e) => e.preventDefault()}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400"
            >
              {showPassword ? "🙈" : "👁️"}
            </button>
          </div>
          {errors.password && (
            <p className="text-red-500 text-sm mb-2">{errors.password}</p>
          )}

          {/* Confirm Password */}
          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              placeholder="Confirm Password"
              value={form.confirmPassword}
              onChange={handleChange}
              className={inputClasses + " pr-10"}
              required
              onCopy={(e) => e.preventDefault()}
              onPaste={(e) => e.preventDefault()}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400"
            >
              {showConfirmPassword ? "🙈" : "👁️"}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="text-red-500 text-sm mb-2">
              {errors.confirmPassword}
            </p>
          )}

          {/* Address */}
          <input
            type="text"
            name="address"
            placeholder="Address"
            value={form.address}
            onChange={handleChange}
            className={inputClasses}
            required
          />
          {errors.address && (
            <p className="text-red-500 text-sm mb-2">{errors.address}</p>
          )}

          {/* Submit */}
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded w-full mt-2"
          >
            Sign Up
          </button>

          {/* Notification */}
          {notify && <p className="mt-2 text-blue-400">{notify}</p>}
        </form>
        <p className="text-gray-400 text-center mt-6">
          Already have an account?
          <Link to="/login" className="text-blue-500 hover:underline ml-1">
            Log In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignUpForm;
