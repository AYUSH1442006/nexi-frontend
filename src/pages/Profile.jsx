import { useState, useEffect } from "react";
import { userAPI } from "../services/api";
import bgImage from "../assets/profile-bg.jpg";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({});
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
        skills: data.skills?.join(", ") || "",
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        Loading profile...
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-cover bg-center relative"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/70"></div>

      {/* Content */}
      <div className="relative z-10 flex justify-center items-center min-h-screen px-4">
        <div className="w-full max-w-3xl bg-white rounded-2xl shadow-2xl p-8">

          {/* Logo */}
          <div className="flex justify-center mb-6">
            <img src="/logo.png" alt="NexiTaskers" className="h-14" />
          </div>

          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-blue-600">My Profile</h1>
            <button
              onClick={() => setEditing(!editing)}
              className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-orange-500 transition"
            >
              {editing ? "Cancel" : "Edit Profile"}
            </button>
          </div>

          {!editing ? (
            <>
              <ProfileRow label="Name" value={user.name} />
              <ProfileRow label="Email" value={user.email} />
              <ProfileRow label="Phone" value={user.phone || "Not set"} />
              <ProfileRow label="Location" value={user.location || "Not set"} />
              <ProfileRow label="Bio" value={user.bio || "No bio"} />

              <div className="mt-4">
                <p className="text-gray-500">Skills</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {user.skills?.length ? (
                    user.skills.map((s, i) => (
                      <span
                        key={i}
                        className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm"
                      >
                        {s}
                      </span>
                    ))
                  ) : (
                    <span className="text-gray-400">No skills</span>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 mt-8 text-center">
                <Stat label="Tasks Posted" value={user.tasksPosted} />
                <Stat label="Completed" value={user.tasksCompleted} />
                <Stat label="Rating" value={`⭐ ${user.rating?.toFixed(1) || 0}`} />
              </div>
            </>
          ) : (
            <form className="space-y-4">
              <Input label="Name" value={form.name} />
              <Input label="Phone" value={form.phone} />
              <Input label="Location" value={form.location} />
              <Input label="Skills" value={form.skills} />

              <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-orange-500 transition">
                Save Changes
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

/* Helpers */
const ProfileRow = ({ label, value }) => (
  <div className="mb-3">
    <p className="text-gray-500">{label}</p>
    <p className="text-lg font-semibold">{value}</p>
  </div>
);

const Input = ({ label, value }) => (
  <div>
    <label className="block text-gray-600 mb-1">{label}</label>
    <input
      value={value}
      className="w-full border p-2 rounded focus:ring-2 focus:ring-orange-500"
    />
  </div>
);

const Stat = ({ label, value }) => (
  <div className="bg-gray-100 rounded-xl p-4">
    <p className="text-2xl font-bold text-blue-600">{value}</p>
    <p className="text-gray-500">{label}</p>
  </div>
);
