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
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await userAPI.updateProfile({
        ...form,
        skills: form.skills
          ? form.skills.split(",").map((s) => s.trim())
          : [],
      });
      setEditing(false);
      fetchProfile();
    } catch (err) {
      alert("Update failed");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-xl text-gray-500">
          Loading profile...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl p-8 transform transition-all duration-700 animate-[fadeIn_0.8s_ease]">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-blue-600">
            My Profile
          </h1>

          <button
            onClick={() => setEditing(!editing)}
            className="px-5 py-2 rounded-xl font-medium text-white bg-blue-600
                       transform transition-all duration-300
                       hover:scale-105 hover:bg-blue-700
                       active:scale-95 shadow-md hover:shadow-lg"
          >
            {editing ? "Cancel" : "Edit Profile"}
          </button>
        </div>

        {!editing ? (
          <div className="space-y-6">
            {[
              ["Name", user.name],
              ["Email", user.email],
              ["Phone", user.phone || "Not set"],
              ["Location", user.location || "Not set"],
              ["Bio", user.bio || "No bio yet"],
            ].map(([label, value]) => (
              <div key={label}>
                <p className="text-gray-500">{label}</p>
                <p className="text-lg font-semibold">{value}</p>
              </div>
            ))}

            <div>
              <p className="text-gray-500">Role</p>
              <p className="text-lg font-semibold">
                {user.role === "POSTER" && "Task Poster"}
                {user.role === "TASKER" && "Tasker"}
                {user.role === "BOTH" && "Poster & Tasker"}
              </p>
            </div>

            <div>
              <p className="text-gray-500 mb-2">Skills</p>
              <div className="flex flex-wrap gap-2">
                {user.skills?.length ? (
                  user.skills.map((skill, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 rounded-full bg-blue-100 text-blue-700
                                 transform transition-all duration-300
                                 hover:scale-110 hover:bg-blue-200 cursor-pointer"
                    >
                      {skill}
                    </span>
                  ))
                ) : (
                  <p className="text-gray-400">No skills added</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 pt-6 border-t">
              <Stat label="Tasks Posted" value={user.tasksPosted} color="blue" />
              <Stat label="Completed" value={user.tasksCompleted} color="green" />
              <Stat
                label="Rating"
                value={`⭐ ${user.rating.toFixed(1)}`}
                color="yellow"
              />
            </div>
          </div>
        ) : (
          <form onSubmit={handleUpdate} className="space-y-5">
            <Input label="Name" value={form.name} onChange={(v) => setForm({ ...form, name: v })} />
            <Input label="Phone" value={form.phone} onChange={(v) => setForm({ ...form, phone: v })} />
            <Input label="Location" value={form.location} onChange={(v) => setForm({ ...form, location: v })} />

            <div>
              <label className="text-gray-600">Bio</label>
              <textarea
                value={form.bio}
                onChange={(e) => setForm({ ...form, bio: e.target.value })}
                rows="4"
                className="w-full mt-1 border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 transition"
              />
            </div>

            <div>
              <label className="text-gray-600">Role</label>
              <select
                value={form.role || ""}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
                className="w-full mt-1 border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 transition"
              >
                <option value="">Select role</option>
                <option value="POSTER">Task Poster</option>
                <option value="TASKER">Tasker</option>
                <option value="BOTH">Both</option>
              </select>
            </div>

            <Input
              label="Skills (comma separated)"
              value={form.skills}
              onChange={(v) => setForm({ ...form, skills: v })}
            />

            <button
              type="submit"
              className="w-full py-3 rounded-xl text-white font-semibold
                         bg-gradient-to-r from-blue-600 to-indigo-600
                         transform transition-all duration-300
                         hover:scale-105 hover:shadow-xl
                         active:scale-95"
            >
              Save Changes
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

function Input({ label, value, onChange }) {
  return (
    <div>
      <label className="text-gray-600">{label}</label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full mt-1 border rounded-lg p-2
                   focus:ring-2 focus:ring-blue-500 transition"
      />
    </div>
  );
}

function Stat({ label, value, color }) {
  return (
    <div className="text-center transform transition-all duration-300 hover:scale-105">
      <p className={`text-2xl font-bold text-${color}-600`}>{value}</p>
      <p className="text-gray-500">{label}</p>
    </div>
  );
}