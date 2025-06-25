import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import { useAuthService } from '../../services/authService/AuthService';
import { getData } from '../../utils/userDataUtil';

const VerifyPhoneNumberPage = () => {
  const [otp, setOtp] = useState('');
  const [timer, setTimer] = useState(0);
  const navigate = useNavigate();
  const { authDataState } = useAuth();
  const { verifyPhoneNumber, resendCode } = useAuthService(); // Add resendOTP if available

  const userDTO  = getData();
  const phoneNumber = userDTO?.phoneNumber;

  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleVerify = async () => {
    try {
      const verified = await verifyPhoneNumber(otp, phoneNumber);
      if (verified) {
        toast.success('Phone number verified!');
        navigate('/admin/dashboard');
      } else {
        toast.error('Invalid or expired code.');
      }
    } catch (error) {
      console.log("calling error: "+error)
      toast.error('Verification failed.');
    }
  };

  const handleResendCode = async () => {
    try {
       await resendCode(phoneNumber); // Uncomment and use your resend method
      toast.success('OTP resent!');
      setTimer(60);
    } catch (error) {
      toast.error('Failed to resend code.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-sm">
        <h2 className="text-xl font-bold mb-4 text-center">Verify Your Phone</h2>
        <input
          type="text"
          maxLength="4"
          placeholder="Enter OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          className="w-full p-2 mb-4 border border-gray-300 rounded"
        />
        <button
          onClick={handleVerify}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition mb-3"
        >
          Verify
        </button>

        <button
          onClick={handleResendCode}
          disabled={timer > 0}
          className={`w-full py-2 rounded transition ${
            timer > 0 ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700 text-white'
          }`}
        >
          {timer > 0 ? `Resend code in ${timer}s` : 'Resend Code'}
        </button>
      </div>
    </div>
  );
};

export default VerifyPhoneNumberPage;
