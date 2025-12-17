import { useEffect, useState } from "react";
import { userAPI } from "../services/api";
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
      {/* DARK OVERLAY */}
      <div className="absolute inset-0 bg-black/70"></div>

      {/* CONTENT */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-6">
        <div className="w-full max-w-5xl backdrop-blur-2xl bg-white/15 border border-white/30 rounded-3xl shadow-2xl p-12 animate-fadeIn">

          {/* HEADER */}
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-4">
              <img
                src="/logo.png"
                alt="NexiTaskers"
                className="h-20 drop-shadow-2xl animate-float"
              />
              <h1 className="text-4xl font-bold text-white tracking-wide">
                My Profile
              </h1>
            </div>

            <button
              onClick={() => setEditing(!editing)}
              className="px-6 py-2 rounded-full bg-orange-500 text-white font-semibold
                         hover:bg-orange-600 hover:scale-105 transition"
            >
              {editing ? "Cancel" : "Edit"}
            </button>
          </div>

          {/* BODY */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">

            {/* LEFT – AVATAR */}
            <div className="flex flex-col items-center text-center">
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-orange-400 to-yellow-400
                              flex items-center justify-center text-5xl font-bold text-white shadow-xl">
                {user.name.charAt(0).toUpperCase()}
              </div>

              <h2 className="mt-4 text-2xl font-semibold text-white">
                {user.name}
              </h2>
              <p className="text-gray-300">{user.email}</p>

              <div className="mt-6 space-y-2 text-gray-200 text-sm">
                <Stat label="Tasks Posted" value={user.tasksPosted} />
                <Stat label="Tasks Completed" value={user.tasksCompleted} />
                <Stat label="Rating" value={`⭐ ${user.rating.toFixed(1)}`} />
              </div>
            </div>

            {/* RIGHT – DETAILS */}
            <div className="md:col-span-2 space-y-6 text-white">
              {!editing ? (
                <>
                  <Info label="Phone" value={user.phone || "Not set"} />
                  <Info label="Location" value={user.location || "Not set"} />
                  <Info label="Bio" value={user.bio || "No bio yet"} />

                  <div>
                    <p className="text-gray-300 mb-2">Skills</p>
                    <div className="flex gap-2 flex-wrap">
                      {user.skills?.length > 0 ? (
                        user.skills.map((s, i) => (
                          <span
                            key={i}
                            className="px-3 py-1 rounded-full bg-white/20 border border-white/30
                                       text-sm hover:bg-orange-500 transition"
                          >
                            {s}
                          </span>
                        ))
                      ) : (
                        <span className="text-gray-400">No skills added</span>
                      )}
                    </div>
                  </div>
                </>
              ) : (
                <form className="space-y-4">
                  <Input label="Name" value={form.name} onChange={(v) => setForm({ ...form, name: v })} />
                  <Input label="Phone" value={form.phone} onChange={(v) => setForm({ ...form, phone: v })} />
                  <Input label="Location" value={form.location} onChange={(v) => setForm({ ...form, location: v })} />

                  <div>
                    <label className="block mb-1">Bio</label>
                    <textarea
                      rows="4"
                      value={form.bio}
                      onChange={(e) => setForm({ ...form, bio: e.target.value })}
                      className="w-full bg-white/20 border border-white/30 rounded p-2 text-white"
                    />
                  </div>

                  <button
                    onClick={async (e) => {
                      e.preventDefault();
                      await userAPI.updateProfile({
                        ...form,
                        skills: form.skills
                          ? form.skills.split(",").map(s => s.trim())
                          : [],
                      });
                      setEditing(false);
                      fetchProfile();
                    }}
                    className="w-full mt-4 bg-blue-600 py-2 rounded-lg hover:bg-orange-500 transition"
                  >
                    Save Changes
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ===== Components ===== */

function Info({ label, value }) {
  return (
    <div>
      <p className="text-gray-300">{label}</p>
      <p className="text-xl font-medium">{value}</p>
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
        className="w-full bg-white/20 border border-white/30 rounded p-2 text-white"
      />
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div className="flex justify-between text-sm">
      <span>{label}</span>
      <span className="font-semibold">{value}</span>
    </div>
  );
}
