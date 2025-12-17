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
        skills: form.skills
          ? form.skills.split(",").map((s) => s.trim())
          : [],
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
        <p className="text-xl text-gray-300">Loading profile...</p>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat relative"
      style={{
        backgroundImage:
          "url('https://chatgpt.com/backend-api/estuary/content?id=file_000000000ddc720884d7550fb6362ff3&ts=490542&p=fs&cid=1&sig=359bf4032726550995b7b43bf3f81d83f32ab8869a5689db02f9067a314d75ea&v=0')",
      }}
    >
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/60"></div>

      {/* Content */}
      <div className="relative z-10 p-8 min-h-screen">
        <div className="max-w-2xl mx-auto bg-white/95 p-8 rounded-xl shadow-2xl">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-blue-600">My Profile</h1>
            <button
              onClick={() => setEditing(!editing)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg
                         transition-all duration-300
                         hover:bg-orange-500 hover:scale-105
                         active:scale-95"
            >
              {editing ? "Cancel" : "Edit Profile"}
            </button>
          </div>

          {!editing ? (
            <div className="space-y-4">
              <ProfileItem label="Name" value={user.name} />
              <ProfileItem label="Email" value={user.email} />
              <ProfileItem label="Phone" value={user.phone || "Not set"} />
              <ProfileItem label="Location" value={user.location || "Not set"} />
              <ProfileItem label="Bio" value={user.bio || "No bio yet"} />

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
                        className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full
                                   transition-transform duration-300
                                   hover:scale-110"
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
                <Stat label="Tasks Posted" value={user.tasksPosted} color="blue" />
                <Stat
                  label="Tasks Completed"
                  value={user.tasksCompleted}
                  color="green"
                />
                <Stat
                  label="Rating"
                  value={`⭐ ${user.rating.toFixed(1)}`}
                  color="yellow"
                />
              </div>
            </div>
          ) : (
            <form onSubmit={handleUpdate} className="space-y-4">
              <Input
                label="Name"
                value={form.name}
                onChange={(v) => setForm({ ...form, name: v })}
              />
              <Input
                label="Phone"
                value={form.phone}
                onChange={(v) => setForm({ ...form, phone: v })}
              />
              <Input
                label="Location"
                value={form.location}
                onChange={(v) => setForm({ ...form, location: v })}
              />

              <div>
                <label className="block text-gray-700 mb-2">Bio</label>
                <textarea
                  value={form.bio}
                  onChange={(e) =>
                    setForm({ ...form, bio: e.target.value })
                  }
                  rows="4"
                  className="w-full border p-2 rounded
                             focus:outline-none focus:ring-2
                             focus:ring-orange-500"
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Role</label>
                <select
                  value={form.role || ""}
                  onChange={(e) =>
                    setForm({ ...form, role: e.target.value })
                  }
                  className="w-full border p-2 rounded
                             focus:outline-none focus:ring-2
                             focus:ring-orange-500"
                >
                  <option value="">Select Role</option>
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
                className="w-full bg-blue-600 text-white py-2 rounded-lg
                           transition-all duration-300
                           hover:bg-orange-500 hover:scale-105
                           active:scale-95"
              >
                Save Changes
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

/* Helper Components */

function ProfileItem({ label, value }) {
  return (
    <div>
      <p className="text-gray-600">{label}</p>
      <p className="text-xl font-semibold">{value}</p>
    </div>
  );
}

function Input({ label, value, onChange }) {
  return (
    <div>
      <label className="block text-gray-700 mb-2">{label}</label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border p-2 rounded
                   focus:outline-none focus:ring-2
                   focus:ring-orange-500"
      />
    </div>
  );
}

function Stat({ label, value, color }) {
  return (
    <div className="text-center">
      <p className={`text-2xl font-bold text-${color}-600`}>{value}</p>
      <p className="text-gray-600">{label}</p>
    </div>
  );
}