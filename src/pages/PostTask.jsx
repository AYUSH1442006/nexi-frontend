import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { taskAPI, categoryAPI, userAPI } from "../services/api";
import LocationPicker from "../components/LocationPicker";


export default function PostTask() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    budget: "",
    deadline: "",
    requiredSkills: "",
  });

  const [categories, setCategories] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState(null);


  const navigate = useNavigate();

  useEffect(() => {
    checkUserRole();
    fetchCategories();
  }, []);

  // ✅ CHECK IF USER HAS PERMISSION TO POST TASKS
  const checkUserRole = async () => {
    try {
      const profile = await userAPI.getProfile();
      
      // If user is only a TASKER, redirect them
      if (profile.role === 'TASKER') {
        alert("Taskers cannot post tasks. Only Task Posters can create tasks.");
        navigate('/');
      }
    } catch (err) {
      console.error("Failed to check role:", err);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await categoryAPI.getCategories();

      if (Array.isArray(response)) {
        setCategories(response);
      } else if (Array.isArray(response?.data)) {
        setCategories(response.data);
      } else {
        setCategories([]);
      }
    } catch (err) {
      console.error("Failed to load categories", err);
      setCategories([]);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (!location) {
  setError("Please select a location on the map");
  setLoading(false);
  return;
}

const taskData = {
  title: form.title,
  description: form.description,
  category: form.category,
  budget: parseFloat(form.budget),
  location, // ✅ { lat, lng }
  deadline: form.deadline,
  requiredSkills: form.requiredSkills
    ? form.requiredSkills.split(",").map((s) => s.trim())
    : [],
};


      console.log("Submitting task:", taskData);
      
      const response = await taskAPI.createTask(taskData);
      
      console.log("Task created successfully:", response);
      
      alert("Task posted successfully!");
      navigate("/");
    } catch (err) {
      console.error("Post task error:", err);
      setError(err.message || "Failed to post task. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-5">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-xl shadow-lg w-full max-w-lg"
      >
        <h2 className="text-2xl font-bold mb-5 text-center text-blue-600">
          Post a New Task
        </h2>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <input
          name="title"
          type="text"
          placeholder="Task Title"
          className="w-full border p-2 mb-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={form.title}
          onChange={handleChange}
          required
        />

        <textarea
          name="description"
          placeholder="Describe your task in detail..."
          className="w-full border p-2 mb-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows="4"
          value={form.description}
          onChange={handleChange}
          required
        />

        <select
          name="category"
          value={form.category}
          onChange={handleChange}
          required
          className="w-full border p-2 mb-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select Category</option>

          {Array.isArray(categories) &&
            categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.icon} {cat.name}
              </option>
            ))}
        </select>

        <input
          name="budget"
          type="number"
          placeholder="Budget (₹)"
          className="w-full border p-2 mb-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={form.budget}
          onChange={handleChange}
          required
          min="0"
        />
        <div className="mb-4">
  <label className="block mb-2 font-semibold text-gray-700">
    Select Task Location on Map
  </label>

  <LocationPicker onSelect={setLocation} />

  {location && (
    <p className="text-sm text-gray-600 mt-2">
      📍 Selected: {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
    </p>
  )}
</div>


        <input
          name="deadline"
          type="date"
          className="w-full border p-2 mb-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={form.deadline}
          onChange={handleChange}
          required
        />

        <input
          name="requiredSkills"
          type="text"
          placeholder="Required Skills (comma separated: e.g., Painting, Design)"
          className="w-full border p-2 mb-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={form.requiredSkills}
          onChange={handleChange}
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Posting..." : "Submit Task"}
        </button>
      </form>
    </div>
  );
}