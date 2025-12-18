import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { taskAPI, bidAPI, userAPI } from "../services/api";

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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-100 to-indigo-200 flex justify-center items-center">
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <div className="flex flex-col items-center">
            <svg className="animate-spin h-12 w-12 text-blue-600 mb-4" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="text-xl font-semibold text-gray-700">Loading dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-100 to-indigo-200 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Dashboard</h1>
              <p className="text-gray-600 text-lg">Welcome back, {userProfile?.name || 'User'}!</p>
            </div>
            <div className="hidden md:flex items-center space-x-4">
              <div className="bg-white rounded-2xl px-6 py-3 shadow-lg">
                <p className="text-sm text-gray-600">Account Type</p>
                <p className="text-lg font-bold text-blue-600">{userProfile?.role || 'USER'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Posted Tasks */}
          <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium mb-1">Posted Tasks</p>
                <p className="text-3xl font-bold text-blue-600">{stats.postedTasks}</p>
              </div>
              <div className="bg-blue-100 rounded-xl p-3">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Active Tasks */}
          <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium mb-1">Active Tasks</p>
                <p className="text-3xl font-bold text-green-600">{stats.activeTasks}</p>
              </div>
              <div className="bg-green-100 rounded-xl p-3">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
            </div>
          </div>

          {/* My Bids */}
          <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium mb-1">My Bids</p>
                <p className="text-3xl font-bold text-yellow-600">{stats.myBids}</p>
              </div>
              <div className="bg-yellow-100 rounded-xl p-3">
                <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Rating */}
          <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium mb-1">Rating</p>
                <p className="text-3xl font-bold text-purple-600">{stats.rating.toFixed(1)} ⭐</p>
              </div>
              <div className="bg-purple-100 rounded-xl p-3">
                <svg className="w-8 h-8 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* My Posted Tasks Section */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <h2 className="text-2xl font-semibold text-white">My Posted Tasks</h2>
              </div>
              <span className="bg-white/20 text-white px-4 py-1 rounded-full text-sm font-medium">
                {myTasks.length} Total
              </span>
            </div>
          </div>

          <div className="p-6">
            {myTasks.length === 0 ? (
              <div className="text-center py-12">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <p className="text-gray-500 text-lg">You haven't posted any tasks yet.</p>
                <button
                  onClick={() => navigate('/post-task')}
                  className="mt-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all"
                >
                  Post Your First Task
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {myTasks.map((task) => (
                  <div
                    key={task.id}
                    className="border-2 border-gray-100 rounded-2xl p-5 hover:border-blue-200 hover:shadow-lg transition-all"
                  >
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                      <div className="flex-1 mb-4 md:mb-0">
                        <h3 className="font-bold text-xl text-gray-900 mb-2">{task.title}</h3>
                        <div className="flex flex-wrap gap-3 mb-3">
                          <div className="flex items-center text-gray-600">
                            <svg className="w-5 h-5 mr-1 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span className="font-semibold">₹{task.budget}</span>
                          </div>
                          <div className="flex items-center text-gray-600">
                            <svg className="w-5 h-5 mr-1 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                            <span className="font-semibold">{task.bidCount} bids</span>
                          </div>
                        </div>
                        <div>
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${
                            task.status === 'OPEN' ? 'bg-green-100 text-green-800' :
                            task.status === 'ASSIGNED' ? 'bg-blue-100 text-blue-800' :
                            task.status === 'IN_PROGRESS' ? 'bg-yellow-100 text-yellow-800' :
                            task.status === 'COMPLETED' ? 'bg-purple-100 text-purple-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            <span className={`w-2 h-2 rounded-full mr-2 ${
                              task.status === 'OPEN' ? 'bg-green-500' :
                              task.status === 'ASSIGNED' ? 'bg-blue-500' :
                              task.status === 'IN_PROGRESS' ? 'bg-yellow-500' :
                              task.status === 'COMPLETED' ? 'bg-purple-500' :
                              'bg-gray-500'
                            }`}></span>
                            {task.status}
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() => navigate(`/`)}
                        className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
                      >
                        View All Tasks
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Bids I Have Placed Section */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
                <h2 className="text-2xl font-semibold text-white">Bids I Have Placed</h2>
              </div>
              <span className="bg-white/20 text-white px-4 py-1 rounded-full text-sm font-medium">
                {myBids.length} Total
              </span>
            </div>
          </div>

          <div className="p-6">
            {myBids.length === 0 ? (
              <div className="text-center py-12">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="text-gray-500 text-lg">You haven't placed any bids yet.</p>
                <button
                  onClick={() => navigate('/')}
                  className="mt-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all"
                >
                  Browse Tasks
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {myBids.map((bid) => (
                  <div
                    key={bid.id}
                    className="border-2 border-gray-100 rounded-2xl p-5 hover:border-purple-200 hover:shadow-lg transition-all"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
                      <div className="flex-1 mb-4 lg:mb-0">
                        <h3 className="font-bold text-xl text-gray-900 mb-2">{bid.taskTitle}</h3>
                        
                        <div className="flex flex-wrap gap-3 mb-3">
                          <div className="flex items-center text-gray-600">
                            <svg className="w-5 h-5 mr-1 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span className="font-semibold">My Bid: ₹{bid.bidAmount}</span>
                          </div>
                          <div className="flex items-center text-gray-600">
                            <svg className="w-5 h-5 mr-1 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span className="font-semibold">{bid.estimatedTime}</span>
                          </div>
                        </div>

                        {bid.message && (
                          <div className="bg-gray-50 rounded-xl p-3 mb-3">
                            <p className="text-sm text-gray-700 italic">"{bid.message}"</p>
                          </div>
                        )}

                        <div>
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${
                            bid.status === "ACCEPTED" ? "bg-green-100 text-green-800" :
                            bid.status === "REJECTED" ? "bg-red-100 text-red-800" :
                            bid.status === "PAID" ? "bg-blue-100 text-blue-800" :
                            "bg-yellow-100 text-yellow-800"
                          }`}>
                            <span className={`w-2 h-2 rounded-full mr-2 ${
                              bid.status === "ACCEPTED" ? "bg-green-500" :
                              bid.status === "REJECTED" ? "bg-red-500" :
                              bid.status === "PAID" ? "bg-blue-500" :
                              "bg-yellow-500"
                            }`}></span>
                            {bid.status}
                          </span>
                        </div>
                      </div>

                      {bid.status === "ACCEPTED" && (
                        <button
                          onClick={() => payFromWallet(bid)}
                          disabled={paymentLoading === bid.id}
                          className={`${
                            paymentLoading === bid.id
                              ? "bg-gray-400 cursor-not-allowed"
                              : "bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                          } text-white px-6 py-3 rounded-xl font-semibold whitespace-nowrap flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all`}
                        >
                          {paymentLoading === bid.id ? (
                            <>
                              <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              Processing...
                            </>
                          ) : (
                            <>
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                              </svg>
                              Pay with Razorpay
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}