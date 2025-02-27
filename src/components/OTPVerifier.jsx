import { useState } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function OTPVerifier({ email, onClose, otpVerified }) {
    const [otp, setOtp] = useState("");

    const verifyOtp = async () => {
        try {
            const res = await fetch("/api/otp-approval/otp-verification", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, enteredOTP: Number(otp) }),
            });

            const data = await res.json();
            if (data.success) {
                toast.success("OTP verified successfully!");
                otpVerified(); // Ensure function works correctly
                onClose();
            } else {
                toast.error(data.error);
            }
        } catch (error) {
            toast.error("Something went wrong!");
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
           <div className='p-6 mx-auto rounded-lg shadow-lg bg-white'>
           <h2 className="text-xl font-bold mb-4">Verify OTP</h2>
            <input
                type="number"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full p-2 border rounded-md mb-2"
            />
            <div className='flex justify-center gap-6'>
            <button onClick={verifyOtp} className="w-1/2 bg-green-500 text-white p-2 rounded-md">
                Verify OTP
            </button>
            <button onClick={onClose} className="w-1/2 bg-red-500 text-white p-2 rounded-md">
                Cancel
            </button>
            </div>
           </div>
        </div>
    );
}

export default OTPVerifier;
