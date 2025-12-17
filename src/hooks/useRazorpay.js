import { paymentAPI } from '../services/api';

export const useRazorpay = () => {
  const handlePayment = async (bidId, amount, taskTitle, onSuccess, onError) => {
    try {
      // Step 1: Create Razorpay order from backend
      const orderData = await paymentAPI.createRazorpayOrder(bidId, amount);
      
      // Step 2: Configure Razorpay options
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,  // Replace with your Razorpay Key ID
        amount: orderData.amount, // Amount in paise
        currency: "INR",
        name: "AirTasker",
        description: `Payment for: ${taskTitle}`,
        order_id: orderData.orderId,
        handler: async function (response) {
          try {
            // Step 3: Verify payment on backend
            const verifyData = {
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
              bidId: bidId,
            };
            
            const result = await paymentAPI.verifyPayment(verifyData);
            
            if (result.success) {
              onSuccess(result);
            } else {
              onError("Payment verification failed");
            }
          } catch (error) {
            onError(error.message);
          }
        },
        prefill: {
          name: localStorage.getItem("userName") || "",
          email: localStorage.getItem("userEmail") || "",
        },
        theme: {
          color: "#3399cc",
        },
        modal: {
          ondismiss: function() {
            onError("Payment cancelled");
          }
        }
      };

      // Step 4: Open Razorpay checkout
      const rzp = new window.Razorpay(options);
      rzp.open();
      
    } catch (error) {
      onError(error.message || "Failed to initiate payment");
    }
  };

  return { handlePayment };
};