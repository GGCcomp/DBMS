import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { toast } from 'react-toastify';
import OTPVerifier from './OTPVerifier';
import 'react-toastify/dist/ReactToastify.css';

export default function ApprovalCard({ approval, isOpen }) {
    const [otpModal, setOtpModal] = useState(false);
    const [otpVerified, setotpVerified] = useState(false);
    const {data : session} = useSession();
    const createdAt = new Date(approval.createdAt);
    const date = createdAt.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
    const time = createdAt.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
    });

    const titleParts = approval.title.split(' > ');
    const formattedTitle = `${titleParts[titleParts.length - 1]} in ${titleParts[0]}`;

    const optGenerator = async() => {
        try {
            const res = await fetch("/api/otp-approval", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: session.user.email }),
            });

            const data = await res.json();
            if (data.success) {
                toast.success("OTP sent successfully!");
                setOtpModal(!otpModal);
            } else {
                toast.error(data.error || "Failed to send OTP");
            }
        } catch (error) {
            setMessage("Something went wrong!");
        }
    }

    const approveHandler = async () => {
        try {
            let res = await fetch(approval.url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ content: approval.content, selectedTitle: approval.title }),
            });
            res = await res.json();
            if (res.success) {
                toast.success("Data Saved Successfully!");
                await fetch('/api/data_approval/' + approval._id, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ approval: "approved" }),
                });
            } else {
                toast.error("Something went wrong!")
            }
        } catch (err) {
            toast.error("something went wrong!", err.message)
        }
    }

    const rejectHandler = async () => {
        try {
            let res = await fetch('/api/data_approval/' + approval._id, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ approval: "rejected" }),
            });
            res = await res.json();
            if(res.success){
                toast.error("Rejected!");
            }
        } catch (err) {
            toast.error("Something went wrong!", err.message)
        }
    }

    return (
        <div className="bg-white shadow-lg rounded-lg p-6 border border-gray-300 flex flex-col items-center justify-center text-center space-y-4 hover:shadow-xl transition-shadow duration-300">
            {otpModal && <OTPVerifier email={session.user.email} onClose={() => setOtpModal(false)} otpVerified={() => setotpVerified(true)} />}
            {/* Name */}
            <h3 className="text-xl font-bold text-gray-800 flex items-center">{approval.name} <span className="text-sm text-gray-600 ml-2 uppercase tracking-wide">({approval.role})</span></h3>
            {/* Data on */}
            <div className="text-sm text-gray-700">
                <p className='font-semibold'>Data Entered in:</p>
                <span className="block font-bold uppercase">{formattedTitle}</span>
                <p className="mt-1">
                    <span className="block">{date}</span>
                    <span className="block">{time}</span>
                </p>
            </div>

            {/* Status */}
            <div className="text-sm">
                <strong>Status:</strong>
                <span
                    className={`ml-2 font-bold px-3 py-1 rounded ${approval.approval === 'approved'
                        ? 'bg-green-100 text-green-700'
                        : approval.approval === 'pending'
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-red-100 text-red-700'
                        }`}
                >
                    {approval.approval.toUpperCase()}
                </span>
            </div>
            {!otpVerified && (approval.approval === 'pending') && <button className='px-5 py-2 text-white bg-green-600 border-none hover:bg-green-500' onClick={optGenerator}>Generate OTP</button>}
            {otpVerified && approval && (approval.approval === 'pending') && !isOpen && (<div className='flex gap-5 py-3 text-white'>
                <button className='px-5 py-2 bg-green-700 border-none hover:bg-green-600' onClick={approveHandler}>Approve</button>
                <button className='px-5 py-2 bg-red-700 border-none hover:bg-red-600' onClick={rejectHandler}>Reject</button>
            </div>)}
        </div>
    );
}
