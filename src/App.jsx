import React, { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [courseTypes, setCourseTypes] = useState([]);
  const [courses, setCourses] = useState([]);
  const [offerings, setOfferings] = useState([]);
  const [registrations, setRegistrations] = useState([]);

  const [newType, setNewType] = useState("");
  const [newCourse, setNewCourse] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [filterType, setFilterType] = useState("all");

  const [studentName, setStudentName] = useState("");
  const [studentEmail, setStudentEmail] = useState("");
  const [selectedOffering, setSelectedOffering] = useState("");

  // Edit states
  const [editingTypeId, setEditingTypeId] = useState(null);
  const [editingTypeName, setEditingTypeName] = useState("");
  const [editingCourseId, setEditingCourseId] = useState(null);
  const [editingCourseName, setEditingCourseName] = useState("");

  const [editingOfferingId, setEditingOfferingId] = useState(null);
  const [editingOfferingCourse, setEditingOfferingCourse] = useState("");
  const [editingOfferingType, setEditingOfferingType] = useState("");

  useEffect(() => {
    setCourseTypes(JSON.parse(localStorage.getItem("courseTypes")) || []);
    setCourses(JSON.parse(localStorage.getItem("courses")) || []);
    setOfferings(JSON.parse(localStorage.getItem("offerings")) || []);
    setRegistrations(JSON.parse(localStorage.getItem("registrations")) || []);
  }, []);

  useEffect(() => {
    localStorage.setItem("courseTypes", JSON.stringify(courseTypes));
    localStorage.setItem("courses", JSON.stringify(courses));
    localStorage.setItem("offerings", JSON.stringify(offerings));
    localStorage.setItem("registrations", JSON.stringify(registrations));
  }, [courseTypes, courses, offerings, registrations]);

  const offeringLabel = (o) => {
    const course = courses.find((c) => c.id === o.courseId);
    const type = courseTypes.find((t) => t.id === o.typeId);
    return `${type?.name || "?"} - ${course?.name || "?"}`;
  };

  const addCourseType = () => {
    if (!newType.trim()) return;
    if (courseTypes.some((t) => t.name.toLowerCase() === newType.toLowerCase()))
      return alert("Type already exists");
    setCourseTypes([...courseTypes, { id: Date.now().toString(), name: newType }]);
    setNewType("");
  };

  const addCourse = () => {
    if (!newCourse.trim()) return;
    if (courses.some((c) => c.name.toLowerCase() === newCourse.toLowerCase()))
      return alert("Course already exists");
    setCourses([...courses, { id: Date.now().toString(), name: newCourse }]);
    setNewCourse("");
  };

  const addOffering = () => {
    if (!selectedCourse || !selectedType) return;
    if (
      offerings.some(
        (o) => o.courseId === selectedCourse && o.typeId === selectedType
      )
    )
      return alert("Offering already exists");
    setOfferings([
      ...offerings,
      { id: Date.now().toString(), courseId: selectedCourse, typeId: selectedType },
    ]);
  };

  const registerStudent = () => {
    if (!selectedOffering || !studentName.trim() || !studentEmail.trim())
      return alert("Fill all fields");
    if (
      registrations.some(
        (r) =>
          r.offeringId === selectedOffering &&
          r.email.toLowerCase() === studentEmail.toLowerCase()
      )
    )
      return alert("Student already registered for this offering");

    setRegistrations([
      ...registrations,
      {
        id: Date.now().toString(),
        offeringId: selectedOffering,
        name: studentName,
        email: studentEmail,
      },
    ]);
    setStudentName("");
    setStudentEmail("");
  };

  const updateCourseType = (id) => {
    if (!editingTypeName.trim()) return;
    setCourseTypes(
      courseTypes.map((t) =>
        t.id === id ? { ...t, name: editingTypeName } : t
      )
    );
    setEditingTypeId(null);
    setEditingTypeName("");
  };

  const updateCourse = (id) => {
    if (!editingCourseName.trim()) return;
    setCourses(
      courses.map((c) =>
        c.id === id ? { ...c, name: editingCourseName } : c
      )
    );
    setEditingCourseId(null);
    setEditingCourseName("");
  };

  const updateOffering = (id) => {
    if (!editingOfferingCourse || !editingOfferingType)
      return alert("Select both course and type");

    if (
      offerings.some(
        (o) =>
          o.courseId === editingOfferingCourse &&
          o.typeId === editingOfferingType &&
          o.id !== id
      )
    )
      return alert("This offering already exists");

    setOfferings(
      offerings.map((o) =>
        o.id === id
          ? { ...o, courseId: editingOfferingCourse, typeId: editingOfferingType }
          : o
      )
    );
    setEditingOfferingId(null);
    setEditingOfferingCourse("");
    setEditingOfferingType("");
  };

  const filteredOfferings =
    filterType === "all"
      ? offerings
      : offerings.filter((o) => o.typeId === filterType);

  return (
    <div className="app">
      <h1>Student Registration System</h1>

      <div className="grid">
        {/* Course Types */}
        <div className="card">
          <h2>Course Types</h2>
          <input
            value={newType}
            onChange={(e) => setNewType(e.target.value)}
            placeholder="e.g. Individual"
          />
          <button onClick={addCourseType}>Add</button>
          <ul>
            {courseTypes.map((t) => (
              <li key={t.id}>
                {editingTypeId === t.id ? (
                  <>
                    <input
                      value={editingTypeName}
                      onChange={(e) => setEditingTypeName(e.target.value)}
                    />
                    <button onClick={() => updateCourseType(t.id)}>Save</button>
                    <button onClick={() => setEditingTypeId(null)}>Cancel</button>
                  </>
                ) : (
                  <>
                    {t.name}{" "}
                    <button
                      onClick={() => {
                        setEditingTypeId(t.id);
                        setEditingTypeName(t.name);
                      }}
                    >
                      Modify
                    </button>
                    <button
                      onClick={() =>
                        setCourseTypes(courseTypes.filter((x) => x.id !== t.id))
                      }
                    >
                      Delete
                    </button>
                  </>
                )}
              </li>
            ))}
          </ul>
        </div>

        {/* Courses */}
        <div className="card">
          <h2>Courses</h2>
          <input
            value={newCourse}
            onChange={(e) => setNewCourse(e.target.value)}
            placeholder="e.g. English"
          />
          <button onClick={addCourse}>Add</button>
          <ul>
            {courses.map((c) => (
              <li key={c.id}>
                {editingCourseId === c.id ? (
                  <>
                    <input
                      value={editingCourseName}
                      onChange={(e) => setEditingCourseName(e.target.value)}
                    />
                    <button onClick={() => updateCourse(c.id)}>Save</button>
                    <button onClick={() => setEditingCourseId(null)}>Cancel</button>
                  </>
                ) : (
                  <>
                    {c.name}{" "}
                    <button
                      onClick={() => {
                        setEditingCourseId(c.id);
                        setEditingCourseName(c.name);
                      }}
                    >
                      Modify
                    </button>
                    <button
                      onClick={() =>
                        setCourses(courses.filter((x) => x.id !== c.id))
                      }
                    >
                      Delete
                    </button>
                  </>
                )}
              </li>
            ))}
          </ul>
        </div>

        {/* Offerings */}
        <div className="card">
          <h2>Course Offerings</h2>
          <select onChange={(e) => setSelectedCourse(e.target.value)} value={selectedCourse}>
            <option value="">Select Course</option>
            {courses.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          <select onChange={(e) => setSelectedType(e.target.value)} value={selectedType}>
            <option value="">Select Type</option>
            {courseTypes.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>
          <button onClick={addOffering}>Create Offering</button>

          <h3>Filter by Type</h3>
          <select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
            <option value="all">All</option>
            {courseTypes.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>

          <ul>
            {filteredOfferings.map((o) => (
              <li key={o.id}>
                {editingOfferingId === o.id ? (
                  <>
                    <select
                      value={editingOfferingCourse}
                      onChange={(e) => setEditingOfferingCourse(e.target.value)}
                    >
                      <option value="">Select Course</option>
                      {courses.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                    <select
                      value={editingOfferingType}
                      onChange={(e) => setEditingOfferingType(e.target.value)}
                    >
                      <option value="">Select Type</option>
                      {courseTypes.map((t) => (
                        <option key={t.id} value={t.id}>
                          {t.name}
                        </option>
                      ))}
                    </select>
                    <button onClick={() => updateOffering(o.id)}>Save</button>
                    <button onClick={() => setEditingOfferingId(null)}>Cancel</button>
                  </>
                ) : (
                  <>
                    {offeringLabel(o)}{" "}
                    <button
                      onClick={() => {
                        setEditingOfferingId(o.id);
                        setEditingOfferingCourse(o.courseId);
                        setEditingOfferingType(o.typeId);
                      }}
                    >
                      Modify
                    </button>
                    <button
                      onClick={() =>
                        setOfferings(offerings.filter((x) => x.id !== o.id))
                      }
                    >
                      Delete
                    </button>
                  </>
                )}
              </li>
            ))}
          </ul>
        </div>

        {/* Registrations */}
        <div className="card">
          <h2>Student Registration</h2>
          <select
            value={selectedOffering}
            onChange={(e) => setSelectedOffering(e.target.value)}
          >
            <option value="">Select Offering</option>
            {filteredOfferings.map((o) => (
              <option key={o.id} value={o.id}>
                {offeringLabel(o)}
              </option>
            ))}
          </select>
          <input
            value={studentName}
            onChange={(e) => setStudentName(e.target.value)}
            placeholder="Student Name"
          />
          <input
            value={studentEmail}
            onChange={(e) => setStudentEmail(e.target.value)}
            placeholder="email@example.com"
          />
          <button onClick={registerStudent}>Register</button>

          <h3>Registrations</h3>
          <ul>
            {registrations
              .filter((r) => r.offeringId === selectedOffering)
              .map((r) => (
                <li key={r.id}>
                  {r.name} ({r.email}){" "}
                  <button
                    onClick={() =>
                      setRegistrations(registrations.filter((x) => x.id !== r.id))
                    }
                  >
                    ❌
                  </button>
                </li>
              ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default App;
