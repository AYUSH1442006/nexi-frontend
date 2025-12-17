import { useNavigate } from "react-router-dom";

export default function TaskCard({ task }) {
  const navigate = useNavigate();

  if (!task) {
    return null;
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-shadow cursor-pointer">
      <h3 className="font-bold text-xl mb-2 text-gray-800">{task.title}</h3>
      
      <p className="text-gray-600 mt-2 mb-3 line-clamp-2">
        {task.description}
      </p>
      
      <div className="space-y-2 mb-4">
        <p className="text-green-600 font-bold text-2xl">
          ₹{task.budget}
        </p>
        
        <p className="text-sm text-gray-500">
  📍 {task.location
    ? `${task.location.lat.toFixed(4)}, ${task.location.lng.toFixed(4)}`
    : "Location not available"}
</p>

        
        <p className="text-sm text-gray-500">
          👤 {task.posterName}
        </p>
        
        {task.deadline && (
          <p className="text-sm text-gray-500">
            📅 Deadline: {task.deadline}
          </p>
        )}
        
        <p className="text-sm text-blue-600 font-medium">
          💼 {task.bidCount || 0} bids
        </p>
      </div>

      {task.requiredSkills && task.requiredSkills.length > 0 && (
        <div className="mb-4">
          <p className="text-xs text-gray-500 mb-1">Required Skills:</p>
          <div className="flex gap-1 flex-wrap">
            {task.requiredSkills.slice(0, 3).map((skill, idx) => (
              <span
                key={idx}
                className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded"
              >
                {skill}
              </span>
            ))}
            {task.requiredSkills.length > 3 && (
              <span className="text-xs text-gray-500">
                +{task.requiredSkills.length - 3} more
              </span>
            )}
          </div>
        </div>
      )}

      <button
        onClick={() => navigate(`/task/${task.id}`)}
        className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
      >
        View Details & Bid
      </button>
    </div>
  );
}