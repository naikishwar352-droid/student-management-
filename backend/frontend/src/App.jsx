import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

const API = "https://student-backend-repq.onrender.com/students";
const SITE_PASSWORD = "srushti9611";

function App() {

  const [isUnlocked, setIsUnlocked] = useState(
    localStorage.getItem("siteUnlocked") === "true"
  );
  const [passwordInput, setPasswordInput] = useState("");

  const [students, setStudents] = useState([]);
  const [form, setForm] = useState({
    name: "",
    email: "",
    department: "",
    cgpa: ""
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
    } catch (err) {
      console.log(err);
    }
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.email || !form.department || !form.cgpa) {
      alert("Please fill all fields");
      return;
    }

    try {

      const studentData = {
        ...form,
        cgpa: Number(form.cgpa)
      };

      if (editingId) {

        await axios.put(`${API}/${editingId}`, studentData);
        setMessage("Student Updated Successfully ✅");
        setEditingId(null);

      } else {

        await axios.post(API, studentData);
        setMessage("Student Added Successfully 🎉");

      }

      setForm({
        name: "",
        email: "",
        department: "",
        cgpa: ""
      });

      fetchStudents();
      setTimeout(() => setMessage(""), 3000);

    } catch (err) {
      console.log(err);
      alert("Error saving student");
    }
  };

  const deleteStudent = async (id) => {
    try {
      await axios.delete(`${API}/${id}`);
      fetchStudents();
    } catch (err) {
      console.log(err);
    }
  };

  const editStudent = (student) => {
    setForm({
      name: student.name,
      email: student.email,
      department: student.department,
      cgpa: student.cgpa
    });

    setEditingId(student._id);
  };

  const filteredStudents = students.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase())
  );

  if (!isUnlocked) {
    return (
      <div style={lockStyles.container}>
        <div style={lockStyles.card}>
          <h2>🔒 Private Hackathon Project</h2>

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
                alert("Incorrect Password");
              }
            }}
          >
            Unlock
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container">

      <h1>🎓 Student Management System</h1>

      {message && <div className="alert">{message}</div>}

      <form onSubmit={handleSubmit}>

        <input
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
        />

        <input
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
        />

        <input
          name="department"
          placeholder="Department"
          value={form.department}
          onChange={handleChange}
        />

        <input
          name="cgpa"
          type="number"
          placeholder="CGPA"
          value={form.cgpa}
          onChange={handleChange}
        />

        <button type="submit">
          {editingId ? "Update" : "Add"}
        </button>

      </form>

      <br />

      <input
        placeholder="Search student..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <h3>All Students ({filteredStudents.length})</h3>

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

                <button onClick={() => editStudent(s)}>
                  Edit
                </button>

                <button onClick={() => deleteStudent(s._id)}>
                  Delete
                </button>

              </td>

            </tr>

          ))}
        </tbody>

      </table>

    </div>
  );
}

const lockStyles = {
  container: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(135deg,#4e73df,#1cc88a)"
  },

  card: {
    background: "#fff",
    padding: "40px",
    borderRadius: "12px",
    textAlign: "center"
  },

  input: {
    width: "100%",
    padding: "10px",
    margin: "10px 0"
  },

  button: {
    padding: "10px 20px",
    background: "#4e73df",
    color: "#fff",
    border: "none"
  }
};

export default App;