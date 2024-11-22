import "./App.css";
import axios from "axios";
import { useState, useEffect } from "react";

function App() {
  const [users, setUsers] = useState([]);
  const [filterUsers, setFilterUsers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userData, setUserData] = useState({
    id: null,
    name: "",
    email: "",
    website: "",
  });

  // Fetch all users from API
  const getAllUsers = async () => {
    try {
      const res = await axios.get("http://localhost:8000/users");
      setUsers(res.data);
      setFilterUsers(res.data);
    } catch (error) {
      console.error("Error fetching users:", error.message);
    }
  };

  useEffect(() => {
    getAllUsers();
  }, []);

  // Handle search functionality
  const handleSearchChange = (e) => {
    const searchText = e.target.value.toLowerCase();
    const filteredUsers = users.filter((user) =>
      user.name?.toLowerCase().includes(searchText)
    );
    setFilterUsers(filteredUsers);
  };

  // Handle user deletion
  const handleDelete = async (id) => {
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this user?"
    );
    if (isConfirmed) {
      try {
        await axios.delete(`http://localhost:8000/users/${id}`);
        setUsers(users.filter((user) => user.id !== id));
        setFilterUsers(filterUsers.filter((user) => user.id !== id));
      } catch (error) {
        console.error("Error deleting user:", error.message);
      }
    }
  };

  // Open modal to add a user
  const handleAddUser = () => {
    setUserData({ id: null, name: "", email: "", website: "" });
    setIsModalOpen(true);
  };

  // Close modal
  const closeModal = () => {
    setIsModalOpen(false);
  };

  // Handle input changes in the modal
  const handleData = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  // Add or Edit a user
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (userData.id) {
        await axios.patch(
          `http://localhost:8000/users/${userData.id}`,
          userData
        );
      } else {
        await axios.post("http://localhost:8000/users", userData);
      }
      getAllUsers(); // Refresh user list
      closeModal(); // Close modal after submission
      setUserData({ name: "", email: "", website: "" }); // Reset form
    } catch (error) {
      console.error("Error submitting user data:", error.message);
      alert("Failed to save user data. Please try again.");
    }
  };

  // Edit user
  const handleEdit = (user) => {
    setUserData(user);
    setIsModalOpen(true);
  };

  return (
    <div className="container">
      <h1>User Management Dashboard</h1>
      <div className="input-search">
        <input
          type="search"
          placeholder="Search Text Here"
          onChange={handleSearchChange}
        />
        <button className="btn green" onClick={handleAddUser}>
          Add User
        </button>
      </div>
      <table className="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Email</th>
            <th>Department</th>
            <th>Edit</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {filterUsers.map((user, index) => (
            <tr key={user.id || index}>
              <td>{index + 1}</td>
              <td>{user.name?.split(" ")[0] || "Unknown"}</td>
              <td>{user.name?.split(" ")[1] || ""}</td>
              <td>{user.email || "No Email"}</td>
              <td>{user.website || "No Website"}</td>
              <td>
                <button className="btn green" onClick={() => handleEdit(user)}>
                  Edit
                </button>
              </td>
              <td>
                <button
                  className="btn red"
                  onClick={() => handleDelete(user.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={closeModal}>
              &times;
            </span>
            <h2>{userData.id ? "Update User" : "Add User"}</h2>
            <form onSubmit={handleSubmit} className="addOrEditInputs">
              <div className="input-group">
                <label htmlFor="name">Full Name:</label>
                <input
                  type="text"
                  value={userData.name}
                  name="name"
                  id="name"
                  onChange={handleData}
                  required
                />
              </div>
              <div className="input-group">
                <label htmlFor="email">Email ID:</label>
                <input
                  type="email"
                  value={userData.email}
                  name="email"
                  id="email"
                  onChange={handleData}
                  required
                />
              </div>
              <div className="input-group">
                <label htmlFor="department">Department:</label>
                <input
                  type="text"
                  value={userData.website}
                  name="website"
                  id="department"
                  onChange={handleData}
                  required
                />
              </div>
              <button type="submit" className="btn green">
                {userData.id ? "Update User" : "Add User"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
