import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { userAPI } from "../services/api";

export default function SelectRole() {
  const [selectedRole, setSelectedRole] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get user data from registration
  const userData = location.state?.userData;

  const handleRoleSelect = async (role) => {
    setSelectedRole(role);
    setLoading(true);

    try {
      // Update user profile with selected role
      await userAPI.updateProfile({ role });
      
      alert(`Welcome! You can now ${role === 'POSTER' ? 'post tasks' : 'bid on tasks'}`);
      
      // Redirect based on role
      if (role === 'POSTER') {
        navigate('/post-task');
      } else {
        navigate('/');
      }
    } catch (err) {
      console.error("Error setting role:", err);
      alert("Failed to set role. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-blue-600 mb-2">
            Welcome to AirTasker!
          </h1>
          <p className="text-gray-600 text-lg">
            How would you like to get started?
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Task Poster Card */}
          <div 
            onClick={() => !loading && handleRoleSelect('POSTER')}
            className={`bg-white rounded-2xl shadow-xl p-8 cursor-pointer transform transition-all hover:scale-105 hover:shadow-2xl ${
              selectedRole === 'POSTER' ? 'ring-4 ring-blue-500' : ''
            }`}
          >
            <div className="text-center">
              <div className="text-6xl mb-4">📋</div>
              <h2 className="text-2xl font-bold text-gray-800 mb-3">
                I Need Help
              </h2>
              <p className="text-gray-600 mb-6">
                Post tasks and get them done by skilled taskers
              </p>
              
              <div className="bg-blue-50 rounded-lg p-4 mb-6">
                <p className="text-sm text-gray-700 font-semibold mb-2">
                  As a Task Poster, you can:
                </p>
                <ul className="text-sm text-gray-600 space-y-2 text-left">
                  <li>✓ Post unlimited tasks</li>
                  <li>✓ Receive bids from taskers</li>
                  <li>✓ Choose the best tasker</li>
                  <li>✓ Review completed work</li>
                </ul>
              </div>

              <button
                disabled={loading}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50"
              >
                {loading && selectedRole === 'POSTER' ? 'Setting up...' : 'Post Tasks'}
              </button>
            </div>
          </div>

          {/* Tasker Card */}
          <div 
            onClick={() => !loading && handleRoleSelect('TASKER')}
            className={`bg-white rounded-2xl shadow-xl p-8 cursor-pointer transform transition-all hover:scale-105 hover:shadow-2xl ${
              selectedRole === 'TASKER' ? 'ring-4 ring-green-500' : ''
            }`}
          >
            <div className="text-center">
              <div className="text-6xl mb-4">💼</div>
              <h2 className="text-2xl font-bold text-gray-800 mb-3">
                I Want to Work
              </h2>
              <p className="text-gray-600 mb-6">
                Earn money by completing tasks in your area
              </p>
              
              <div className="bg-green-50 rounded-lg p-4 mb-6">
                <p className="text-sm text-gray-700 font-semibold mb-2">
                  As a Tasker, you can:
                </p>
                <ul className="text-sm text-gray-600 space-y-2 text-left">
                  <li>✓ Browse available tasks</li>
                  <li>✓ Place competitive bids</li>
                  <li>✓ Build your reputation</li>
                  <li>✓ Earn money flexibly</li>
                </ul>
              </div>

              <button
                disabled={loading}
                className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 disabled:opacity-50"
              >
                {loading && selectedRole === 'TASKER' ? 'Setting up...' : 'Find Tasks'}
              </button>
            </div>
          </div>
        </div>

        <div className="text-center mt-8">
          <button
            onClick={() => handleRoleSelect('BOTH')}
            disabled={loading}
            className="text-blue-600 hover:text-blue-700 font-medium underline"
          >
            I want to do both
          </button>
        </div>
      </div>
    </div>
  );
}