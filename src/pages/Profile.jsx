import { useEffect, useState } from "react";
import { userAPI } from "../services/api";

// ✅ IMPORT BACKGROUND FROM ASSETS
import bgImage from "../assets/airtasker-hero.png";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    location: "",
    bio: "",
    role: "",
    skills: "",
  });

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
      console.error("Profile fetch failed", err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    await userAPI.updateProfile({
      ...form,
      skills: form.skills
        ? form.skills.split(",").map((s) => s.trim())
        : [],
    });
    setEditing(false);
    fetchProfile();
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
      style={{ backgroundImage: `url(${bgImage})` }}   // ✅ CORRECT
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/70"></div>

      <div className="relative z-10 min-h-screen flex items-center justify-center px-4">
        <div className="w-full max-w-3xl backdrop-blur-2xl bg-white/15 border border-white/30 rounded-3xl shadow-2xl p-10 animate-fadeIn">

          {/* Logo (public folder is correct) */}
          <div className="flex justify-center mb-6">
            <img
              src="/logo.png"
              alt="NexiTaskers"
              className="h-16 animate-float drop-shadow-xl"
            />
          </div>

          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-white">My Profile</h1>
            <button
              onClick={() => setEditing(!editing)}
              className="px-4 py-2 rounded-lg bg-orange-500 text-white hover:scale-105 transition"
            >
              {editing ? "Cancel" : "Edit"}
            </button>
          </div>

          {!editing ? (
            <div className="space-y-4 text-white">
              <Item label="Name" value={user.name} />
              <Item label="Email" value={user.email} />
              <Item label="Phone" value={user.phone || "Not set"} />
              <Item label="Location" value={user.location || "Not set"} />
              <Item label="Bio" value={user.bio || "No bio yet"} />
            </div>
          ) : (
            <form onSubmit={handleUpdate} className="space-y-4 text-white">
              <Input label="Name" value={form.name} onChange={(v) => setForm({ ...form, name: v })} />
              <Input label="Phone" value={form.phone} onChange={(v) => setForm({ ...form, phone: v })} />
              <Input label="Location" value={form.location} onChange={(v) => setForm({ ...form, location: v })} />

              <div>
                <label className="block mb-1">Bio</label>
                <textarea
                  rows="4"
                  value={form.bio}
                  onChange={(e) => setForm({ ...form, bio: e.target.value })}
                  className="w-full bg-white/30 backdrop-blur-md border border-white/40 rounded p-2 text-white"
                />
              </div>

              <Input
                label="Skills (comma separated)"
                value={form.skills}
                onChange={(v) => setForm({ ...form, skills: v })}
              />

              <button className="w-full bg-blue-600 py-2 rounded-lg hover:bg-orange-500 transition">
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

function Item({ label, value }) {
  return (
    <div>
      <p className="text-gray-300">{label}</p>
      <p className="text-xl font-semibold">{value}</p>
    </div>
  );
}

function Input({ label, value, onChange }) {
  return (
    <div>
      <label className="block mb-1">{label}</label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-white/30 backdrop-blur-md border border-white/40 rounded p-2 text-white"
      />
    </div>
  );
}
