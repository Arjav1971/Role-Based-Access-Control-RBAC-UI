import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const AddUser = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    account: "",
    projects: "",
    accessExpires: "",
    role: "",
    expiration: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("New User Data:", formData);
    navigate("/"); // Redirect back to Users page
  };

  return (
    <div className="bg-[#F5F4FF] h-screen flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-md w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-6">Add New User</h2>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Account</label>
          <input
            type="text"
            name="account"
            value={formData.account}
            onChange={handleChange}
            className="w-full border rounded-lg p-2"
            placeholder="Enter account name"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Projects</label>
          <input
            type="number"
            name="projects"
            value={formData.projects}
            onChange={handleChange}
            className="w-full border rounded-lg p-2"
            placeholder="Number of projects"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Access Expires</label>
          <input
            type="date"
            name="accessExpires"
            value={formData.accessExpires}
            onChange={handleChange}
            className="w-full border rounded-lg p-2"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Role</label>
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="w-full border rounded-lg p-2"
          >
            <option value="">Select Role</option>
            <option value="Admin">Admin</option>
            <option value="Editor">Editor</option>
            <option value="Viewer">Viewer</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Expiration</label>
          <input
            type="date"
            name="expiration"
            value={formData.expiration}
            onChange={handleChange}
            className="w-full border rounded-lg p-2"
          />
        </div>
        <div className="flex justify-between items-center">
          <button
            type="button"
            onClick={() => navigate("/")}
            className="bg-gray-300 px-4 py-2 rounded-lg"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-[#907FCF] text-white px-4 py-2 rounded-lg shadow-md"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddUser;