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
    <div className="min-h-screen bg-white">
      {/* Hero Section - Inspired by Airtasker */}
      <section
  className="relative text-white overflow-hidden bg-cover bg-center"
  style={{
    backgroundImage: `linear-gradient(
      rgba(12,18,60,0.88),
      rgba(12,18,60,0.88)
    ), url(${heroPoster})`,
  }}
>

        {/* Diagonal Background Element */}
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-blue-800/20 to-transparent transform skew-x-12 translate-x-1/4"></div>
        
        <div className="relative max-w-7xl mx-auto px-6 py-28 md:py-36">
  <div className="max-w-2xl">

            {/* Main Heading */}
            <h1 className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight tracking-tight">
              GET ANYTHING
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                DONE
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl mb-10 opacity-90 font-light">
              Post any task. Pick the best person. Get it done.
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <button
                onClick={() => navigate('/post-task')}
                className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-4 rounded-full font-bold text-lg transition-all transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
              >
                Post your task for free
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
              
              <button
                onClick={() => navigate('/register')}
                className="bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white px-8 py-4 rounded-full font-bold text-lg transition-all border-2 border-white/30 hover:border-white/50"
              >
                Earn money as a Tasker
              </button>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap items-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <div className="bg-white/20 p-2 rounded-full">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                  </svg>
                </div>
            
              </div>
              
              <div className="flex items-center gap-2">
                <div className="bg-white/20 p-2 rounded-full">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                  </svg>
                </div>
                
              </div>
              
              <div className="flex items-center gap-2">
                <div className="bg-white/20 p-2 rounded-full">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </div>
                
              </div>
            </div>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-white to-transparent"></div>
      </section>

      {/* Search & Filter Section */}
      <section className="py-12 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg p-6 -mt-20 relative z-10">
            <div className="flex flex-col md:flex-row gap-4">
              <input
                className="flex-1 p-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                placeholder="What do you need done? (e.g., plumbing, painting...)"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <select
                className="md:w-64 p-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
              <button className="bg-blue-600 text-white px-8 py-4 rounded-xl hover:bg-blue-700 transition font-bold text-lg shadow-md hover:shadow-lg">
                Search Tasks
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Categories */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold mb-3 text-gray-900">Browse by category</h2>
          <p className="text-gray-600 mb-10 text-lg">Find the perfect task for your skills</p>
          
          {categories.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {categories.slice(0, 12).map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setCategory(cat.id)}
                  className={`group p-6 rounded-2xl transition-all hover:shadow-xl ${
                    category === cat.id 
                      ? 'bg-blue-600 text-white shadow-lg scale-105' 
                      : 'bg-gray-50 hover:bg-gray-100 border-2 border-transparent hover:border-blue-200'
                  }`}
                >
                  <div className="text-5xl mb-3 transform group-hover:scale-110 transition-transform">
                    {cat.icon}
                  </div>
                  <h3 className={`font-semibold text-sm ${category === cat.id ? 'text-white' : 'text-gray-900'}`}>
                    {cat.name}
                  </h3>
                </button>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {['🪑 Furniture', '🚚 Moving', '🌿 Gardening', '🎨 Painting', '🔧 Repairs', '🧹 Cleaning', '📦 Delivery', '💼 Admin', '🏠 Handyman', '🐕 Pet Care', '📸 Photo', '💻 Tech'].map((item, idx) => (
                <div key={idx} className="p-6 rounded-2xl bg-gray-50 border-2 border-gray-200 hover:border-blue-200 hover:shadow-lg transition-all cursor-pointer group">
                  <div className="text-5xl mb-3 transform group-hover:scale-110 transition-transform">
                    {item.split(' ')[0]}
                  </div>
                  <h3 className="font-semibold text-sm text-gray-900">
                    {item.split(' ').slice(1).join(' ')}
                  </h3>
                </div>
              ))}
            </div>
          )}
          
          {category && (
            <button
              onClick={() => setCategory("")}
              className="mt-8 text-blue-600 font-semibold hover:text-blue-700 flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Clear filter
            </button>
          )}
        </div>
      </section>

      {/* Available Tasks */}
      <section className="py-16 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-2">
                {category ? 'Filtered Tasks' : 'Available Tasks'}
              </h2>
              <p className="text-gray-600 text-lg">
                {filteredTasks.length} task{filteredTasks.length !== 1 ? 's' : ''} available
              </p>
            </div>
          </div>

          {loading && (
            <div className="text-center py-20">
              <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600"></div>
              <p className="text-gray-600 text-lg mt-4 font-semibold">Loading amazing tasks...</p>
            </div>
          )}

          {!loading && filteredTasks.length === 0 && (
            <div className="text-center py-20 bg-white rounded-2xl shadow-md">
              <div className="text-7xl mb-6">🔍</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">No tasks found</h3>
              <p className="text-gray-600 text-lg mb-8">
                {tasks.length === 0 
                  ? "Be the first to post a task!" 
                  : "Try adjusting your search or filters"}
              </p>
              {tasks.length === 0 && (
                <button
                  onClick={() => navigate('/post-task')}
                  className="bg-blue-600 text-white px-8 py-4 rounded-full hover:bg-blue-700 transition font-bold text-lg shadow-lg hover:shadow-xl"
                >
                  Post Your First Task
                </button>
              )}
            </div>
          )}

          {!loading && filteredTasks.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTasks.map((task) => (
                <TaskCard key={task.id} task={task} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">How it works</h2>
            <p className="text-gray-600 text-xl">Get your task done in 3 simple steps</p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center group">
              <div className="bg-blue-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-blue-600 group-hover:scale-110 transition-all">
                <span className="text-3xl font-bold text-blue-600 group-hover:text-white">1</span>
              </div>
              <h3 className="text-2xl font-bold mb-3 text-gray-900">Post your task</h3>
              <p className="text-gray-600 text-lg">Tell us what you need done and when</p>
            </div>

            <div className="text-center group">
              <div className="bg-purple-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-purple-600 group-hover:scale-110 transition-all">
                <span className="text-3xl font-bold text-purple-600 group-hover:text-white">2</span>
              </div>
              <h3 className="text-2xl font-bold mb-3 text-gray-900">Choose your Tasker</h3>
              <p className="text-gray-600 text-lg">Review offers and select the best person</p>
            </div>

            <div className="text-center group">
              <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-green-600 group-hover:scale-110 transition-all">
                <span className="text-3xl font-bold text-green-600 group-hover:text-white">3</span>
              </div>
              <h3 className="text-2xl font-bold mb-3 text-gray-900">Get it done</h3>
              <p className="text-gray-600 text-lg">Your task gets completed on time</p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to get things done?
          </h2>
          <p className="text-xl mb-10 opacity-90">
            Join thousands of people posting and completing tasks every day
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/post-task')}
              className="bg-white text-blue-600 px-10 py-5 rounded-full hover:bg-gray-100 transition font-bold text-xl shadow-xl hover:shadow-2xl transform hover:scale-105"
            >
              Post a Task
            </button>
            <button
              onClick={() => navigate('/register')}
              className="bg-transparent border-3 border-white text-white px-10 py-5 rounded-full hover:bg-white/10 transition font-bold text-xl"
            >
              Become a Tasker
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}