import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { taskAPI, bidAPI, userAPI } from "../services/api";

// ✅ ADD THIS - Get API base URL from environment
const API_BASE_URL = "https://nexi-backend.onrender.com";

export default function Dashboard() {
  const [myTasks, setMyTasks] = useState([]);
  const [myBids, setMyBids] = useState([]);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paymentLoading, setPaymentLoading] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboardData();
    loadRazorpayScript();
  }, []);

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }

      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      let tasksData = [];
      try {
        tasksData = await taskAPI.getMyTasks();
        console.log("✅ Tasks loaded:", tasksData);
      } catch (err) {
        console.error("❌ Failed to load tasks:", err);
      }

      let bidsData = [];
      try {
        bidsData = await bidAPI.getMyBids();
        console.log("✅ Bids loaded:", bidsData);
      } catch (err) {
        console.error("❌ Failed to load bids:", err);
      }

      let profileData = null;
      try {
        profileData = await userAPI.getProfile();
        console.log("✅ Profile loaded:", profileData);
      } catch (err) {
        console.error("❌ Failed to load profile:", err);
      }

      setMyTasks(Array.isArray(tasksData) ? tasksData : []);
      setMyBids(Array.isArray(bidsData) ? bidsData : []);
      setUserProfile(profileData);
    } catch (err) {
      console.error("❌ Dashboard error:", err);
    } finally {
      setLoading(false);
    }
  };

  const payFromWallet = async (bid) => {
    setPaymentLoading(bid.id);

    try {
      const token = localStorage.getItem("token");
      
      // ✅ FIXED: Use API_BASE_URL instead of hardcoded localhost
      const orderRes = await fetch(`${API_BASE_URL}/api/payment/create-order`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          bidId: bid.id,
          amount: bid.bidAmount,
        }),
      });

      if (!orderRes.ok) {
        const errorData = await orderRes.json();
        throw new Error(errorData.error || "Failed to create order");
      }

      const orderData = await orderRes.json();
      console.log("✅ Razorpay order created:", orderData);

      const options = {
        key: "rzp_test_Rs8dO4g4KefKPC",
        amount: orderData.amount,
        currency: orderData.currency,
        name: "NexiTasker",
        description: `Payment for: ${bid.taskTitle}`,
        order_id: orderData.orderId,
        handler: async function (response) {
          console.log("✅ Payment successful:", response);
          
          try {
            // ✅ FIXED: Use API_BASE_URL instead of hardcoded localhost
            const verifyRes = await fetch(`${API_BASE_URL}/api/payment/verify`, {
              method: "POST",
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
                bidId: bid.id,
              }),
            });

            const verifyData = await verifyRes.json();

            if (verifyRes.ok && verifyData.success) {
              alert(`✅ Payment successful!\n💰 Remaining balance: ₹${verifyData.remainingBalance || 'N/A'}`);
              fetchDashboardData();
            } else {
              alert("❌ Payment verification failed: " + (verifyData.message || "Unknown error"));
            }
          } catch (err) {
            console.error("❌ Verification error:", err);
            alert("❌ Payment verification failed: " + err.message);
          } finally {
            setPaymentLoading(null);
          }
        },
        prefill: {
          name: userProfile?.name || localStorage.getItem("userName") || "",
          email: userProfile?.email || localStorage.getItem("userEmail") || "",
        },
        theme: {
          color: "#3399cc",
        },
        modal: {
          ondismiss: function() {
            console.log("Payment cancelled by user");
            setPaymentLoading(null);
          },
          escape: true,
          backdropclose: false,
        },
      };

      const rzp = new window.Razorpay(options);
      
      rzp.on('payment.failed', function (response) {
        console.error("❌ Payment failed:", response.error);
        alert(`❌ Payment failed: ${response.error.description}`);
        setPaymentLoading(null);
      });

      rzp.open();
      
    } catch (err) {
      console.error("🔥 Payment error:", err);
      alert("❌ Error processing payment: " + err.message);
      setPaymentLoading(null);
    }
  };

  const stats = {
    postedTasks: myTasks.length,
    activeTasks: myTasks.filter(t => t.status === 'OPEN' || t.status === 'ASSIGNED' || t.status === 'IN_PROGRESS').length,
    myBids: myBids.length,
    rating: userProfile?.rating || 0,
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-xl text-gray-600">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-blue-600">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-gray-600 text-sm">Posted Tasks</h3>
          <p className="text-2xl font-bold text-blue-600">{stats.postedTasks}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-gray-600 text-sm">Active Tasks</h3>
          <p className="text-2xl font-bold text-green-600">{stats.activeTasks}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-gray-600 text-sm">My Bids</h3>
          <p className="text-2xl font-bold text-yellow-600">{stats.myBids}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-gray-600 text-sm">Rating</h3>
          <p className="text-2xl font-bold text-purple-600">
            ⭐ {stats.rating.toFixed(1)}
          </p>
        </div>
      </div>

      <section className="bg-white p-6 rounded-xl shadow-md mb-8">
        <h2 className="text-xl font-semibold mb-4">My Posted Tasks</h2>

        {myTasks.length === 0 ? (
          <p className="text-gray-500">You haven't posted any tasks yet.</p>
        ) : (
          myTasks.map((task) => (
            <div
              key={task.id}
              className="border p-4 rounded-lg mb-3 flex justify-between items-center hover:bg-gray-50"
            >
              <div>
                <h3 className="font-bold text-lg">{task.title}</h3>
                <p className="text-gray-600">Budget: ₹{task.budget}</p>
                <p className="text-sm text-blue-600 font-medium">
                  Status: {task.status} • {task.bidCount} bids
                </p>
              </div>

              <button
                onClick={() => navigate(`/`)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                View All Tasks
              </button>
            </div>
          ))
        )}
      </section>

      <section className="bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-xl font-semibold mb-4">Bids I Have Placed</h2>

        {myBids.length === 0 ? (
          <p className="text-gray-500">You haven't placed any bids yet.</p>
        ) : (
          myBids.map((bid) => (
            <div
              key={bid.id}
              className="border p-4 rounded-lg mb-3 hover:bg-gray-50"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="font-bold text-lg">{bid.taskTitle}</h3>
                  <p className="text-gray-600">My Bid: ₹{bid.bidAmount}</p>
                  <p className="text-sm text-gray-500 mt-1">
                    Estimated Time: {bid.estimatedTime}
                  </p>
                  {bid.message && (
                    <p className="text-sm text-gray-600 mt-2 italic">"{bid.message}"</p>
                  )}
                  <div className="mt-2">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                        bid.status === "ACCEPTED"
                          ? "bg-green-100 text-green-800"
                          : bid.status === "REJECTED"
                          ? "bg-red-100 text-red-800"
                          : bid.status === "PAID"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {bid.status}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col gap-2 ml-4">
                  {bid.status === "ACCEPTED" && (
                    <button
                      onClick={() => payFromWallet(bid)}
                      disabled={paymentLoading === bid.id}
                      className={`${
                        paymentLoading === bid.id
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-green-600 hover:bg-green-700"
                      } text-white px-4 py-2 rounded-lg font-semibold whitespace-nowrap flex items-center justify-center gap-2`}
                    >
                      {paymentLoading === bid.id ? (
                        <>
                          <span className="animate-spin">⏳</span>
                          Processing...
                        </>
                      ) : (
                        <>
                          💳 Pay with Razorpay
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </section>
    </div>
  );
}