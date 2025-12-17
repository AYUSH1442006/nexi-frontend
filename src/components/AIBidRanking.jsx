import { useEffect, useState } from "react";
import { aiAPI } from "../services/api";

export default function AIBidRanking({ taskId }) {
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRankedBids();
  }, []);

  const fetchRankedBids = async () => {
    try {
      const data = await aiAPI.rankBids(taskId);
      setBids(data);
    } catch (err) {
      console.error("AI ranking failed", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p>🤖 AI is analyzing bids...</p>;

  if (bids.length === 0) return <p>No bids to analyze</p>;

  return (
    <div className="mt-6 bg-white p-4 rounded-xl shadow">
      <h3 className="text-xl font-bold mb-4 text-purple-600">
        🧠 AI Recommended Bids
      </h3>

      {bids.map((bid, index) => (
        <div
          key={bid.bidId}
          className={`p-4 mb-3 rounded-lg border ${
            index === 0
              ? "border-green-500 bg-green-50"
              : "border-gray-200"
          }`}
        >
          {index === 0 && (
            <span className="text-sm font-bold text-green-700">
              🏆 Best Match
            </span>
          )}

          <p className="font-semibold">
            {bid.bidderName} ⭐ {bid.bidderRating}
          </p>

          <p>Bid Amount: ₹{bid.amount}</p>

          <p className="text-purple-600 font-semibold">
            AI Score: {bid.aiScore.toFixed(2)}
          </p>

          <p className="text-sm text-gray-700 mt-2">
            🤖 <b>AI Reason:</b> {bid.aiReason}
          </p>
        </div>
      ))}
    </div>
  );
}
