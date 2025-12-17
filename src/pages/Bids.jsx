import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { taskAPI, bidAPI } from "../services/api";
import { aiAPI } from "../services/api";


export default function Bids() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);
  const [bids, setBids] = useState([]);
  const [bidForm, setBidForm] = useState({
    bidAmount: "",
    message: "",
    estimatedTime: "",
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [aiRankedBids, setAiRankedBids] = useState([]);
  const [aiLoading, setAiLoading] = useState(false);


  useEffect(() => {
    fetchTaskDetails();
    fetchBids();
  }, [id]);

  const fetchTaskDetails = async () => {
    try {
      const data = await taskAPI.getTaskById(id);
      setTask(data);
    } catch (err) {
      setError("Failed to load task details");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  const runAiRanking = async () => {
  try {
    setAiLoading(true);
    const data = await aiAPI.rankBids(id); // taskId must already exist
    setAiRankedBids(data);
  } catch (err) {
    console.error("AI ranking failed", err);
    alert("AI ranking failed");
  } finally {
    setAiLoading(false);
  }
};


  const fetchBids = async () => {
    try {
      const data = await bidAPI.getBidsForTask(id);
      setBids(data);
    } catch (err) {
      console.error("Failed to load bids", err);
    }
  };

  const handleBidSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const bidData = {
        taskId: id,
        bidAmount: parseFloat(bidForm.bidAmount),
        message: bidForm.message,
        estimatedTime: bidForm.estimatedTime,
      };

      await bidAPI.placeBid(bidData);
      alert("Bid placed successfully!");
      setBidForm({ bidAmount: "", message: "", estimatedTime: "" });
      fetchBids(); // Refresh bids
    } catch (err) {
      setError(err.message || "Failed to place bid");
    } finally {
      setSubmitting(false);
    }
  };

  const handleAcceptBid = async (bidId) => {
    if (!window.confirm("Are you sure you want to accept this bid?")) return;

    try {
      await bidAPI.acceptBid(bidId);
      alert("Bid accepted! Task has been assigned.");
      fetchTaskDetails();
      fetchBids();
    } catch (err) {
      alert(err.message || "Failed to accept bid");
    }
  };

  const handleRejectBid = async (bidId) => {
    if (!window.confirm("Are you sure you want to reject this bid?")) return;

    try {
      await bidAPI.rejectBid(bidId);
      alert("Bid rejected.");
      fetchBids();
    } catch (err) {
      alert(err.message || "Failed to reject bid");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-xl text-gray-600">Loading...</p>
      </div>
    );
  }

  if (!task) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-xl text-red-600">Task not found</p>
      </div>
    );
  }

  const userEmail = localStorage.getItem("userEmail");
  const isMyTask = task.posterEmail === userEmail;
  const canBid = task.status === "OPEN" && !isMyTask;

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <button
        onClick={() => navigate(-1)}
        className="mb-4 text-blue-600 hover:underline"
      >
        ← Back
      </button>

      {isMyTask && (
  <button
    onClick={runAiRanking}
    className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
  >
    {aiLoading ? "Ranking..." : "🤖 AI Rank Bids"}
  </button>
)}

    {aiRankedBids.length > 0 && (
  <div className="bg-white p-6 rounded-xl shadow-md mb-6 mt-4">
    <h2 className="text-xl font-bold mb-4 text-purple-600">
      🤖 AI Ranked Bids
    </h2>

    {aiRankedBids.map((bid, index) => (
      
      <div
        key={bid.bidId}
        className={`p-4 mb-3 rounded ${
          index === 0 ? "bg-green-100" : "bg-gray-100"
        }`}
      >
        <p className="font-bold">
          #{index + 1} {bid.bidderName}
        </p>
        <p>Bid Amount: ₹{bid.amount}</p>
        <p>Rating: {bid.bidderRating}</p>
        <p className="font-semibold">
          AI Score: {bid.aiScore.toFixed(2)}
        </p>
        {bid.aiReason && (
  <p className="mt-2 text-sm text-gray-700 italic">
    🤖 {bid.aiReason}
  </p>
)}

      </div>
    ))}
  </div>
)}



      {/* Task Details */}
      <div className="bg-white p-6 rounded-xl shadow-md mb-6">
        <h1 className="text-3xl font-bold text-blue-600 mb-4">{task.title}</h1>
        <p className="text-gray-700 mb-4">{task.description}</p>
        
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-600">Budget:</p>
            <p className="font-bold text-green-600 text-xl">₹{task.budget}</p>
          </div>
          <p>
  📍 {task.location
    ? `${task.location.lat.toFixed(4)}, ${task.location.lng.toFixed(4)}`
    : "Location not available"}
</p>

          <div>
            <p className="text-gray-600">Category:</p>
            <p className="font-semibold">{task.category}</p>
          </div>
          <div>
            <p className="text-gray-600">Deadline:</p>
            <p className="font-semibold">{task.deadline}</p>
          </div>
          <div>
            <p className="text-gray-600">Status:</p>
            <p className="font-semibold text-blue-600">{task.status}</p>
          </div>
          <div>
            <p className="text-gray-600">Posted by:</p>
            <p className="font-semibold">{task.posterName}</p>
          </div>
        </div>

        {task.requiredSkills && task.requiredSkills.length > 0 && (
          <div className="mt-4">
            <p className="text-gray-600 mb-2">Required Skills:</p>
            <div className="flex gap-2 flex-wrap">
              {task.requiredSkills.map((skill, idx) => (
                <span
                  key={idx}
                  className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Place Bid Form */}
      {canBid && (
        <div className="bg-white p-6 rounded-xl shadow-md mb-6">
          <h2 className="text-xl font-bold mb-4">Place Your Bid</h2>

          {error && (
            <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleBidSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Your Bid Amount (₹)</label>
              <input
                type="number"
                value={bidForm.bidAmount}
                onChange={(e) =>
                  setBidForm({ ...bidForm, bidAmount: e.target.value })
                }
                className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                min="0"
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Estimated Time</label>
              <input
                type="text"
                placeholder="e.g., 2 days, 1 week"
                value={bidForm.estimatedTime}
                onChange={(e) =>
                  setBidForm({ ...bidForm, estimatedTime: e.target.value })
                }
                className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Message to Task Poster</label>
              <textarea
                value={bidForm.message}
                onChange={(e) =>
                  setBidForm({ ...bidForm, message: e.target.value })
                }
                className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="4"
                placeholder="Explain why you're the best fit for this task..."
                required
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {submitting ? "Submitting..." : "Submit Bid"}
            </button>
          </form>
        </div>
      )}

      {/* All Bids */}
      <div className="bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-xl font-bold mb-4">
          All Bids ({bids.length})
        </h2>

        {bids.length === 0 ? (
          <p className="text-gray-500">No bids yet. Be the first to bid!</p>
        ) : (
          <div className="space-y-4">
            {bids.map((bid) => (
              <div
                key={bid.id}
                className="border p-4 rounded-lg hover:bg-gray-50"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-bold text-lg">{bid.bidderName}</p>
                    <p className="text-green-600 font-semibold text-xl">
                      ₹{bid.bidAmount}
                    </p>
                    <p className="text-sm text-gray-600">
                      Estimated Time: {bid.estimatedTime}
                    </p>
                    <p className="text-gray-700 mt-2">{bid.message}</p>
                    <p className="text-xs text-gray-500 mt-2">
                      Status:{" "}
                      <span
                        className={`font-semibold ${
                          bid.status === "ACCEPTED"
                            ? "text-green-600"
                            : bid.status === "REJECTED"
                            ? "text-red-600"
                            : "text-yellow-600"
                        }`}
                      >
                        {bid.status}
                      </span>
                    </p>
                  </div>

                  {isMyTask && bid.status === "PENDING" && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleAcceptBid(bid.id)}
                        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => handleRejectBid(bid.id)}
                        className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                      >
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}