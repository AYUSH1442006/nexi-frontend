import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { bidAPI } from "../services/api";



export default function MyBids() {
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchMyBids();
  }, []);

  const fetchMyBids = async () => {
    try {
      const data = await bidAPI.getMyBids();
      setBids(data);
    } catch (err) {
      console.error("Failed to load bids", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-xl text-gray-600">Loading your bids...</p>
      </div>
    );
  }

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-blue-600">My Bids</h1>

      {bids.length === 0 ? (
        <div className="bg-white p-8 rounded-xl shadow-md text-center">
          <p className="text-gray-600 text-lg">You haven't placed any bids yet.</p>
          <button
            onClick={() => navigate("/")}
            className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Browse Tasks
          </button>
        </div>
      ) : (
        <div className="grid gap-4">
          {bids.map((bid) => (
            <div
              key={bid.id}
              className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition"
            >
              <h3 className="font-bold text-xl mb-2">{bid.taskTitle}</h3>
              <p className="text-green-600 font-semibold text-lg">
                My Bid: ₹{bid.bidAmount}
              </p>
              <p className="text-sm text-gray-600">
                Estimated Time: {bid.estimatedTime}
              </p>
              <p
                className={`text-sm font-medium mt-2 ${
                  bid.status === "ACCEPTED"
                    ? "text-green-600"
                    : bid.status === "REJECTED"
                    ? "text-red-600"
                    : "text-yellow-600"
                }`}
              >
                Status: {bid.status}
              </p>
              <button
                onClick={() => navigate(`/task/${bid.taskId}`)}
                className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                View Task
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}