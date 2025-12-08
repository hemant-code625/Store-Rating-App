import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { fetchAPI } from "../config/api";

const UserProfile = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    email: user?.email || "",
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handlePasswordInputChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError("");
  };

  const validatePasswordForm = () => {
    const newErrors = [];

    if (!passwordForm.oldPassword) {
      newErrors.push("Old password is required");
    }

    if (!passwordForm.newPassword) {
      newErrors.push("New password is required");
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      newErrors.push("Passwords do not match");
    }

    if (passwordForm.newPassword && passwordForm.newPassword.length < 8) {
      newErrors.push("Password must be at least 8 characters long");
    }

    if (passwordForm.newPassword && passwordForm.newPassword.length > 16) {
      newErrors.push("Password must not exceed 16 characters");
    }

    if (passwordForm.newPassword && !/[A-Z]/.test(passwordForm.newPassword)) {
      newErrors.push("Password must include at least one uppercase letter");
    }

    if (
      passwordForm.newPassword &&
      !/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(passwordForm.newPassword)
    ) {
      newErrors.push("Password must include at least one special character");
    }

    return newErrors;
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    const validationErrors = validatePasswordForm();
    if (validationErrors.length > 0) {
      setError(validationErrors.join(". "));
      return;
    }

    setLoading(true);
    try {
      const response = await fetchAPI("/api/auth/update-password", {
        method: "POST",
        body: JSON.stringify({
          email: passwordForm.email,
          oldPassword: passwordForm.oldPassword,
          newPassword: passwordForm.newPassword,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("Password changed successfully!");
        setPasswordForm({
          email: user?.email || "",
          oldPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
        setShowChangePassword(false);
        setTimeout(() => {
          setMessage("");
        }, 3000);
      } else {
        setError(data.message || "Failed to change password");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
      console.error("Error changing password:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-gray-800 rounded-lg p-6 w-96 max-h-4/5 overflow-y-auto shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-white">User Profile</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-3xl leading-none cursor-pointer"
          >
            ×
          </button>
        </div>

        {message && (
          <div className="mb-4 p-3 bg-green-600 text-white rounded text-sm">
            {message}
          </div>
        )}

        {error && (
          <div className="mb-4 p-3 bg-red-600 text-white rounded text-sm">
            {error}
          </div>
        )}

        {!showChangePassword ? (
          <div className="space-y-4">
            <div className="border-b border-gray-600 pb-4">
              <p className="text-gray-400 text-sm">Name</p>
              <p className="text-white font-semibold">{user?.name || "N/A"}</p>
            </div>

            <div className="border-b border-gray-600 pb-4">
              <p className="text-gray-400 text-sm">Email</p>
              <p className="text-white font-semibold">{user?.email || "N/A"}</p>
            </div>

            <div className="border-b border-gray-600 pb-4">
              <p className="text-gray-400 text-sm">Role</p>
              <p className="text-white font-semibold">
                {user?.role ? user.role.toUpperCase() : "N/A"}
              </p>
            </div>

            {user?.address && (
              <div className="border-b border-gray-600 pb-4">
                <p className="text-gray-400 text-sm">Address</p>
                <p className="text-white font-semibold">{user.address}</p>
              </div>
            )}

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowChangePassword(true)}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded transition cursor-pointer"
              >
                Change Password
              </button>
              <button
                onClick={handleLogout}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded transition cursor-pointer"
              >
                Logout
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleChangePassword} className="space-y-4">
            <div>
              <label className="text-gray-400 text-sm block mb-1">
                Email (Confirmation)
              </label>
              <input
                type="email"
                value={passwordForm.email}
                disabled
                className="w-full px-3 py-2 bg-gray-700 text-gray-400 rounded border border-gray-600 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="text-gray-400 text-sm block mb-1">
                Old Password
              </label>
              <div className="relative">
                <input
                  type={showOldPassword ? "text" : "password"}
                  name="oldPassword"
                  value={passwordForm.oldPassword}
                  onChange={handlePasswordInputChange}
                  placeholder="Enter old password"
                  onCopy={(e) => e.preventDefault()}
                  onPaste={(e) => e.preventDefault()}
                  className="w-full px-3 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:border-blue-500 focus:outline-none pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowOldPassword(!showOldPassword)}
                  className="absolute right-3 top-2 text-gray-400 hover:text-white cursor-pointer"
                >
                  {showOldPassword ? "🙈" : "👁️"}
                </button>
              </div>
            </div>

            <div>
              <label className="text-gray-400 text-sm block mb-1">
                New Password
              </label>
              <div className="relative">
                <input
                  type={showNewPassword ? "text" : "password"}
                  name="newPassword"
                  value={passwordForm.newPassword}
                  onChange={handlePasswordInputChange}
                  placeholder="Enter new password"
                  onCopy={(e) => e.preventDefault()}
                  onPaste={(e) => e.preventDefault()}
                  className="w-full px-3 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:border-blue-500 focus:outline-none pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-2 text-gray-400 hover:text-white cursor-pointer"
                >
                  {showNewPassword ? "🙈" : "👁️"}
                </button>
              </div>
              <p className="text-xs text-gray-400 mt-1">
                8-16 characters, 1 uppercase, 1 special character
              </p>
            </div>

            <div>
              <label className="text-gray-400 text-sm block mb-1">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={passwordForm.confirmPassword}
                  onChange={handlePasswordInputChange}
                  placeholder="Confirm new password"
                  onCopy={(e) => e.preventDefault()}
                  onPaste={(e) => e.preventDefault()}
                  className="w-full px-3 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:border-blue-500 focus:outline-none pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-2 text-gray-400 hover:text-white cursor-pointer"
                >
                  {showConfirmPassword ? "🙈" : "👁️"}
                </button>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                type="button"
                onClick={() => {
                  setShowChangePassword(false);
                  setPasswordForm({
                    email: user?.email || "",
                    oldPassword: "",
                    newPassword: "",
                    confirmPassword: "",
                  });
                  setError("");
                  setShowOldPassword(false);
                  setShowNewPassword(false);
                  setShowConfirmPassword(false);
                }}
                className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-900 text-white font-semibold py-2 px-4 rounded transition cursor-pointer disabled:cursor-not-allowed"
              >
                {loading ? "Updating..." : "Update Password"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
