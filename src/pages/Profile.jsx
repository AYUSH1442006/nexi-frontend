import { useState, useEffect } from "react";
import { userAPI } from "../services/api";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    location: "",
    bio: "",
    role: "",
    skills: "",
  });
  
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const data = await userAPI.getProfile();
      setUser(data);
      setForm({
        name: data.name || "",
        phone: data.phone || "",
        location: data.location || "",
        bio: data.bio || "",
        role: data.role || "",
        skills: data.skills ? data.skills.join(", ") : "",
      });
    } catch (err) {
      console.error("Failed to load profile", err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      const updateData = {
        ...form,
        skills: form.skills ? form.skills.split(",").map((s) => s.trim()) : [],
      };

      await userAPI.updateProfile(updateData);
      alert("Profile updated successfully!");
      setEditing(false);
      fetchProfile();
    } catch (err) {
      alert(err.message || "Failed to update profile");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-xl text-gray-600">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-md">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-blue-600">My Profile</h1>
          <button
            onClick={() => setEditing(!editing)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            {editing ? "Cancel" : "Edit Profile"}
          </button>
        </div>

        {!editing ? (
          <div className="space-y-4">
            <div>
              <p className="text-gray-600">Name</p>
              <p className="text-xl font-semibold">{user.name}</p>
            </div>
            <div>
              <p className="text-gray-600">Email</p>
              <p className="text-xl font-semibold">{user.email}</p>
            </div>
            <div>
              <p className="text-gray-600">Phone</p>
              <p className="text-xl font-semibold">{user.phone || "Not set"}</p>
            </div>
            <div>
              <p className="text-gray-600">Location</p>
              <p className="text-xl font-semibold">{user.location || "Not set"}</p>
            </div>
            <div>
              <p className="text-gray-600">Bio</p>
              <p className="text-xl font-semibold">{user.bio || "No bio yet"}</p>
            </div>
            <div>
              <p className="text-gray-600">Role</p>
              <p className="text-xl font-semibold">
                {user.role === "POSTER" && "Task Poster"}
                {user.role === "TASKER" && "Tasker"}
                {user.role === "BOTH" && "Both (Poster & Tasker)"}
                {!user.role && "Not set"}
              </p>
            </div>
            <div>
              <p className="text-gray-600">Skills</p>
              <div className="flex gap-2 flex-wrap mt-2">
                {user.skills && user.skills.length > 0 ? (
                  user.skills.map((skill, idx) => (
                    <span
                      key={idx}
                      className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full"
                    >
                      {skill}
                    </span>
                  ))
                ) : (
                  <p className="text-gray-500">No skills added</p>
                )}
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t">
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">{user.tasksPosted}</p>
                <p className="text-gray-600">Tasks Posted</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">{user.tasksCompleted}</p>
                <p className="text-gray-600">Tasks Completed</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-yellow-600">⭐ {user.rating.toFixed(1)}</p>
                <p className="text-gray-600">Rating ({user.totalReviews} reviews)</p>
              </div>
            </div>
          </div>
        ) : (
          <form onSubmit={handleUpdate} className="space-y-4">
            <div>
              <label className="block text-gray-700 mb-2">Name</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-2">Phone</label>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-2">Location</label>
              <input
                type="text"
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
                className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-2">Bio</label>
              <textarea
                value={form.bio}
                onChange={(e) => setForm({ ...form, bio: e.target.value })}
                className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="4"
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-2">Role</label>
              <select
                value={form.role || ''}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
                className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Role</option>
                <option value="POSTER">Task Poster</option>
                <option value="TASKER">Tasker</option>
                <option value="BOTH">Both</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-700 mb-2">
                Skills (comma separated)
              </label>
              <input
                type="text"
                value={form.skills}
                onChange={(e) => setForm({ ...form, skills: e.target.value })}
                placeholder="e.g., Plumbing, Carpentry, Painting"
                className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
            >
              Save Changes
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

