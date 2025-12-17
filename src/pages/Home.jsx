import TaskCard from "../components/TaskCard";
import { useState, useEffect } from "react";
import { taskAPI, categoryAPI } from "../services/api";
import { useNavigate } from "react-router-dom";
import heroPoster from "../assets/airtasker-hero.png";

export default function Home() {
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchTasks();
    fetchCategories();
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const data = await taskAPI.getOpenTasks();
      setTasks(data);
      setFilteredTasks(data);
    } catch (err) {
      console.error("Failed to load tasks:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const data = await categoryAPI.getCategories();
      setCategories(data);
    } catch (err) {
      console.error("Failed to load categories", err);
    }
  };

  useEffect(() => {
    let filtered = tasks;
    if (search) {
      filtered = filtered.filter((task) =>
        task.title.toLowerCase().includes(search.toLowerCase())
      );
    }
    if (category) {
      filtered = filtered.filter((task) => task.category === category);
    }
    setFilteredTasks(filtered);
  }, [search, category, tasks]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* HERO SECTION - ABSOLUTE MASTERPIECE */}
      <section
        className="relative text-white overflow-hidden bg-cover bg-center min-h-screen flex items-center"
        style={{
          backgroundImage: `linear-gradient(rgba(10,15,50,0.05), rgba(15,20,60,0.10)), url(${heroPoster})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {/* Animated Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-pink-600/20 animate-pulse"></div>
        
        {/* Floating Particles Effect */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-white/30 rounded-full animate-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${5 + Math.random() * 10}s`,
              }}
            />
          ))}
        </div>

        <div className="relative max-w-7xl mx-auto px-6 py-20 z-10 w-full">
          <div className="max-w-4xl mx-auto text-center">
            {/* Main Heading with Animation */}
            <div className="mb-8 animate-fade-in-up">
              <h1 className="text-6xl md:text-8xl font-black mb-4 leading-tight tracking-tight">
                <span className="block text-white drop-shadow-2xl">GET ANYTHING</span>
                <span className="block mt-2 text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-500 animate-gradient">
                  DONE
                </span>
              </h1>
            </div>
            
            <p className="text-2xl md:text-3xl mb-12 opacity-95 font-light tracking-wide animate-fade-in-up animation-delay-200">
              Post any task. Pick the best person. Get it done.
            </p>
            
            {/* CTA Buttons with Glow Effect */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16 animate-fade-in-up animation-delay-400">
              <button
                onClick={() => navigate('/post-task')}
                className="group relative bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-12 py-5 rounded-full font-bold text-xl transition-all transform hover:scale-110 shadow-2xl hover:shadow-purple-500/50 flex items-center justify-center gap-3 overflow-hidden"
              >
                <span className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform"></span>
                <span className="relative">Post your task for free</span>
                <svg className="w-6 h-6 relative group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </button>
              
              <button
                onClick={() => navigate('/register')}
                className="bg-white/10 hover:bg-white/20 backdrop-blur-lg text-white px-12 py-5 rounded-full font-bold text-xl transition-all border-3 border-white/40 hover:border-white/80 shadow-2xl hover:shadow-white/50 transform hover:scale-105"
              >
                Earn money as a Tasker
              </button>
            </div>

            {/* Stats with Glass Morphism */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto animate-fade-in-up animation-delay-600">
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all transform hover:scale-105 hover:shadow-2xl">
                <div className="flex items-center justify-center gap-3 mb-2">
                  <div className="bg-gradient-to-r from-blue-400 to-purple-500 p-3 rounded-full">
                    <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                    </svg>
                  </div>
                </div>
                <p className="text-3xl font-black mb-1"></p>
                <p className="text-sm opacity-90 font-medium"></p>
              </div>
              
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all transform hover:scale-105 hover:shadow-2xl">
                <div className="flex items-center justify-center gap-3 mb-2">
                  <div className="bg-gradient-to-r from-green-400 to-blue-500 p-3 rounded-full">
                    <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
                <p className="text-3xl font-black mb-1"></p>
                <p className="text-sm opacity-90 font-medium"></p>
              </div>
              
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all transform hover:scale-105 hover:shadow-2xl">
                <div className="flex items-center justify-center gap-3 mb-2">
                  <div className="bg-gradient-to-r from-yellow-400 to-orange-500 p-3 rounded-full">
                    <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </div>
                </div>
                <p className="text-3xl font-black mb-1"></p>
                <p className="text-sm opacity-90 font-medium"></p>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
          <svg className="w-8 h-8 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </section>

      {/* SEARCH SECTION - FLOATING CARD */}
      <section className="relative -mt-24 px-6 pb-12 z-20">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100 transform hover:scale-105 transition-all duration-300">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  className="w-full pl-14 pr-4 py-5 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 text-lg transition-all"
                  placeholder="What do you need done? (e.g., plumbing, cleaning...)"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <select
                className="md:w-72 px-6 py-5 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 text-lg font-medium transition-all cursor-pointer"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
              <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-10 py-5 rounded-2xl hover:from-blue-700 hover:to-purple-700 transition-all font-bold text-lg shadow-xl hover:shadow-2xl transform hover:scale-105">
                Search
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* CATEGORIES SECTION - MODERN GRID */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-5xl font-black text-gray-900 mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Browse by category
            </h2>
            <p className="text-gray-600 text-xl">Find the perfect task for your skills</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {(categories.length > 0 ? categories.slice(0, 12) : 
              ['🪑 Furniture', '🚚 Moving', '🌿 Gardening', '🎨 Painting', '🔧 Repairs', '🧹 Cleaning', 
               '📦 Delivery', '💼 Admin', '🏠 Handyman', '🐕 Pet Care', '📸 Photography', '💻 Tech Help']
            ).map((item, idx) => {
              const cat = categories[idx];
              const icon = cat?.icon || item.split(' ')[0];
              const name = cat?.name || item.split(' ').slice(1).join(' ');
              
              return (
                <button
                  key={idx}
                  onClick={() => cat && setCategory(cat.id)}
                  className={`group relative p-8 rounded-3xl transition-all duration-300 transform hover:scale-110 hover:-translate-y-2 ${
                    category === cat?.id
                      ? 'bg-gradient-to-br from-blue-600 to-purple-600 text-white shadow-2xl shadow-blue-500/50 scale-105'
                      : 'bg-white hover:bg-gradient-to-br hover:from-blue-50 hover:to-purple-50 border-2 border-gray-100 hover:border-blue-200 shadow-lg hover:shadow-2xl'
                  }`}
                >
                  <div className="text-6xl mb-4 transform group-hover:scale-125 group-hover:rotate-12 transition-all duration-300">
                    {icon}
                  </div>
                  <h3 className={`font-bold text-base ${category === cat?.id ? 'text-white' : 'text-gray-900'}`}>
                    {name}
                  </h3>
                  {category === cat?.id && (
                    <div className="absolute inset-0 bg-white/20 rounded-3xl animate-pulse"></div>
                  )}
                </button>
              );
            })}
          </div>
          
          {category && (
            <div className="text-center mt-10">
              <button
                onClick={() => setCategory("")}
                className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-bold text-lg hover:gap-4 transition-all"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Clear filter
              </button>
            </div>
          )}
        </div>
      </section>

      {/* TASKS SECTION */}
      <section className="py-20 px-6 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-5xl font-black text-gray-900 mb-3">
                {category ? '🎯 Filtered Tasks' : '✨ Available Tasks'}
              </h2>
              <p className="text-gray-600 text-xl font-medium">
                {filteredTasks.length} amazing task{filteredTasks.length !== 1 ? 's' : ''} waiting for you
              </p>
            </div>
          </div>

          {loading && (
            <div className="text-center py-32">
              <div className="inline-block relative">
                <div className="w-20 h-20 border-8 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                <div className="absolute inset-0 w-20 h-20 border-8 border-transparent border-t-purple-600 rounded-full animate-spin animation-delay-150"></div>
              </div>
              <p className="text-gray-600 text-xl mt-6 font-bold animate-pulse">Loading amazing tasks...</p>
            </div>
          )}

          {!loading && filteredTasks.length === 0 && (
            <div className="text-center py-32 bg-gradient-to-br from-blue-50 to-purple-50 rounded-3xl border-2 border-dashed border-blue-300">
              <div className="text-8xl mb-8 animate-bounce">🔍</div>
              <h3 className="text-3xl font-black text-gray-900 mb-4">No tasks found</h3>
              <p className="text-gray-600 text-xl mb-10">
                {tasks.length === 0 ? "Be the first to post a task!" : "Try adjusting your search"}
              </p>
              {tasks.length === 0 && (
                <button
                  onClick={() => navigate('/post-task')}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-12 py-5 rounded-full hover:from-blue-700 hover:to-purple-700 transition-all font-bold text-xl shadow-2xl hover:shadow-purple-500/50 transform hover:scale-110"
                >
                  Post Your First Task
                </button>
              )}
            </div>
          )}

          {!loading && filteredTasks.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredTasks.map((task) => (
                <TaskCard key={task.id} task={task} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-black text-gray-900 mb-4">How it works</h2>
            <p className="text-gray-600 text-2xl">Get your task done in 3 simple steps</p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            {[
              { num: 1, title: 'Post your task', desc: 'Tell us what you need done', color: 'from-blue-500 to-blue-600', icon: '📝' },
              { num: 2, title: 'Choose your Tasker', desc: 'Review offers and select the best', color: 'from-purple-500 to-purple-600', icon: '👥' },
              { num: 3, title: 'Get it done', desc: 'Your task gets completed on time', color: 'from-green-500 to-green-600', icon: '✅' }
            ].map((step) => (
              <div key={step.num} className="text-center group transform hover:scale-105 transition-all duration-300">
                <div className={`relative w-32 h-32 bg-gradient-to-br ${step.color} rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl group-hover:shadow-3xl group-hover:rotate-12 transition-all`}>
                  <span className="text-5xl">{step.icon}</span>
                  <div className="absolute -top-2 -right-2 w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-xl font-black text-2xl text-gray-900 border-4 border-gray-100">
                    {step.num}
                  </div>
                </div>
                <h3 className="text-3xl font-black mb-4 text-gray-900">{step.title}</h3>
                <p className="text-gray-600 text-lg">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="relative py-32 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjEiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-30"></div>
        
        <div className="relative max-w-5xl mx-auto text-center text-white z-10">
          <h2 className="text-5xl md:text-7xl font-black mb-8 leading-tight">
            Ready to get things done?
          </h2>
          <p className="text-2xl mb-12 opacity-95 font-light">
            Join thousands of people posting and completing tasks every day
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <button
              onClick={() => navigate('/post-task')}
              className="group bg-white text-blue-600 px-14 py-6 rounded-full hover:bg-gray-100 transition-all font-black text-2xl shadow-2xl hover:shadow-3xl transform hover:scale-110 relative overflow-hidden"
            >
              <span className="relative z-10">Post a Task</span>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-100 to-purple-100 translate-y-full group-hover:translate-y-0 transition-transform"></div>
            </button>
            <button
              onClick={() => navigate('/register')}
              className="bg-transparent border-4 border-white text-white px-14 py-6 rounded-full hover:bg-white hover:text-blue-600 transition-all font-black text-2xl shadow-2xl transform hover:scale-110"
            >
              Become a Tasker
            </button>
          </div>
        </div>
      </section>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) translateX(0); opacity: 0.3; }
          50% { transform: translateY(-20px) translateX(10px); opacity: 0.6; }
        }
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-float { animation: float ease-in-out infinite; }
        .animate-gradient { background-size: 200% 200%; animation: gradient 3s ease infinite; }
        .animate-fade-in-up { animation: fade-in-up 0.6s ease-out; }
        .animation-delay-200 { animation-delay: 0.2s; }
        .animation-delay-400 { animation-delay: 0.4s; }
        .animation-delay-600 { animation-delay: 0.6s; }
        .animation-delay-150 { animation-delay: 150ms; }
      `}</style>
    </div>
  );
}