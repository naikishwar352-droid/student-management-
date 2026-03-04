import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

// 🔴 REPLACE THIS WITH YOUR REAL RENDER BACKEND URL
const API = "https://YOUR-REAL-BACKEND.onrender.com/users";

const SITE_PASSWORD = "srushti9611";

function App() {
  // 🔐 Password Lock State
  const [isUnlocked, setIsUnlocked] = useState(
    localStorage.getItem("siteUnlocked") === "true"
  );
  const [passwordInput, setPasswordInput] = useState("");

  // 🎓 Student App State
  const [students, setStudents] = useState([]);
  const [form, setForm] = useState({
    name: "",
    email: "",
    department: "",
    cgpa: "",
  });
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (isUnlocked) {
      fetchStudents();
    }
  }, [isUnlocked]);

  const fetchStudents = async () => {
    try {
      const res = await axios.get(API);
      setStudents(res.data);
    } catch (error) {
      console.error("Error fetching students:", error);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.email || !form.department || !form.cgpa) {
      alert("Please fill all fields");
      return;
    }

    try {
      if (editingId) {
        await axios.put(${API}/${editingId}, form);
        setMessage("Student Updated Successfully ✅");
        setEditingId(null);
      } else {
        await axios.post(API, form);
        setMessage("Student Added Successfully 🎉");
      }

      setForm({ name: "", email: "", department: "", cgpa: "" });
      fetchStudents();
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      console.error("Error saving student:", error);
    }
  };

  const deleteStudent = async (id) => {
    try {
      await axios.delete(${API}/${id});
      fetchStudents();
    } catch (error) {
      console.error("Error deleting student:", error);
    }
  };

  const editStudent = (student) => {
    setForm({
      name: student.name,
      email: student.email,
      department: student.department,
      cgpa: student.cgpa,
    });
    setEditingId(student._id);
  };

  const filteredStudents = students.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase())
  );

  // 🔒 PASSWORD LOCK SCREEN
  if (!isUnlocked) {
    return (
      <div style={lockStyles.container}>
        <div style={lockStyles.card}>
          <h2>🔒 Private Hackathon Project</h2>
          <p>Enter access password to continue</p>

          <input
            type="password"
            placeholder="Enter Password"
            value={passwordInput}
            onChange={(e) => setPasswordInput(e.target.value)}
            style={lockStyles.input}
          />

          <button
            style={lockStyles.button}
            onClick={() => {
              if (passwordInput === SITE_PASSWORD) {
                localStorage.setItem("siteUnlocked", "true");
                setIsUnlocked(true);
              } else {
                alert("Incorrect Password ❌");
              }
            }}
          >
            Unlock
          </button>
        </div>
      </div>
    );
  }

  // 🎓 MAIN APP UI
  return (
    <div className="container">
      <h1 className="title">🎓 Student Management System</h1>

      {message && <div className="alert">{message}</div>}

      <div className="card">
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Name"
            />
            <input
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Email"
            />
            <input
              name="department"
              value={form.department}
              onChange={handleChange}
              placeholder="Department"
            />
            <input
              name="cgpa"
              value={form.cgpa}
              onChange={handleChange}
              placeholder="CGPA"
              type="number"
            />
            <button type="submit">
              {editingId ? "Update" : "Add"}
            </button>
          </div>
        </form>
      </div>

      <div className="search-bar">
        <input
          placeholder="🔍 Search by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <h2>All Students ({filteredStudents.length})</h2>

      <div className="card">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Department</th>
              <th>CGPA</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.map((s) => (
              <tr key={s._id}>
                <td>{s.name}</td>
                <td>{s.email}</td>
                <td>{s.department}</td>
                <td>{s.cgpa}</td>
                <td>
                  <button
                    className="edit"
                    type="button"
                    onClick={() => editStudent(s)}
                  >
                    Edit
                  </button>
                  <button
                    className="delete"
                    type="button"
                    onClick={() => deleteStudent(s._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// 🔐 Lock Screen Styles
const lockStyles = {
  container: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(135deg, #4e73df, #1cc88a)",
  },
  card: {
    background: "#fff",
    padding: "40px",
    borderRadius: "12px",
    textAlign: "center",
    width: "350px",
    boxShadow: "0 15px 35px rgba(0,0,0,0.2)",
  },
  input: {
    width: "100%",
    padding: "10px",
    marginTop: "15px",
    marginBottom: "15px",
    borderRadius: "6px",
    border: "1px solid #ccc",
  },
  button: {
    padding: "10px 20px",
    border: "none",
    borderRadius: "6px",
    background: "#4e73df",
    color: "white",
    cursor: "pointer",
  },
};

export default App;