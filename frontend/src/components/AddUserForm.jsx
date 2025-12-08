import { useEffect, useState } from "react";

const AddUserForm = ({ onAdd }) => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    address: "",
    role: "user",
  });
  const [notify, setNotify] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    onAdd(form);

    const response = await fetch("http://localhost:8080/api/auth/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(form),
    });

    const result = await response.json();
    if (!response.ok) {
      console.error("Error adding user:", result.message || "Unknown error");
      setNotify("Error adding user: " + (result.message || "Unknown error"));
      return;
    }
    setNotify("User added successfully");
    setForm({ name: "", email: "", password: "", address: "", role: "user" });
  };

  useEffect(() => {
    if (notify) {
      const timer = setTimeout(() => setNotify(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [notify]);

  return (
    <form onSubmit={handleSubmit} className="p-4 max-w-md">
      <input
        type="text"
        name="name"
        placeholder="Name"
        value={form.name}
        onChange={handleChange}
        className="mb-2 w-full px-3 py-2 rounded bg-gray-800 text-white"
        required
      />
      <input
        type="email"
        name="email"
        placeholder="Email"
        value={form.email}
        onChange={handleChange}
        className="mb-2 w-full px-3 py-2 rounded bg-gray-800 text-white"
        required
      />
      <input
        type="password"
        name="password"
        placeholder="Password"
        value={form.password}
        onChange={handleChange}
        className="mb-2 w-full px-3 py-2 rounded bg-gray-800 text-white"
        required
      />
      <input
        type="text"
        name="address"
        placeholder="Address"
        value={form.address}
        onChange={handleChange}
        className="mb-2 w-full px-3 py-2 rounded bg-gray-800 text-white"
        required
      />
      <select
        name="role"
        value={form.role}
        onChange={handleChange}
        className="mb-2 w-full px-3 py-2 rounded bg-gray-800 text-white"
      >
        <option value="user">User</option>
        <option value="admin">Owner</option>
      </select>
      <button
        type="submit"
        className="bg-blue-600 hover:bg-blue-700 px-3 py-2 rounded w-full"
      >
        Add User
      </button>
    </form>
  );
};

export default AddUserForm;
