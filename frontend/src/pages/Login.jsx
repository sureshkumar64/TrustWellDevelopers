import React, { useState, useEffect, useRef } from 'react';
import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';
import { auth } from '../firebase/firebase';
import axios from 'axios';

const Login = () => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);

  const inputRefs = useRef([]);

  useEffect(() => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(
        'recaptcha',
        {
          size: 'invisible',
          callback: () => console.log('reCAPTCHA solved'),
          'expired-callback': () => console.log('reCAPTCHA expired'),
        },
        auth
      );
      window.recaptchaVerifier.render();
    }
  }, []);

  useEffect(() => {
    let interval;
    if (step === 2 && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0) {
      setCanResend(true);
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [step, timer]);

  const formatPhone = (num) => (num.startsWith('+') ? num : '+91' + num);

  const sendOtp = async () => {
    if (!name.trim()) {
      setMessage('Please enter your name.');
      return;
    }

    setLoading(true);
    setMessage('');
    try {
      const appVerifier = window.recaptchaVerifier;
      const confirmation = await signInWithPhoneNumber(auth, formatPhone(phone), appVerifier);
      window.confirmationResult = confirmation;
      setStep(2);
      setMessage('OTP sent successfully');
      setTimer(60);
      setCanResend(false);
    } catch (err) {
      console.error(err);
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (e, index) => {
    const value = e.target.value.replace(/\D/g, '');
    const newOtp = [...otp];

    if (value.length > 1) {
      const chars = value.split('');
      for (let i = index; i < 6 && chars.length; i++) {
        newOtp[i] = chars.shift();
      }
      setOtp(newOtp);
      const nextIndex = Math.min(index + value.length, 5);
      inputRefs.current[nextIndex]?.focus();
    } else {
      newOtp[index] = value;
      setOtp(newOtp);
      if (value && index < 5) inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const verifyOtp = async () => {
    const fullOtp = otp.join('');
    if (fullOtp.length !== 6) {
      return setMessage('Please enter all 6 digits');
    }

    setLoading(true);
    setMessage('');
    try {
      const result = await window.confirmationResult.confirm(fullOtp);
      const token = await result.user.getIdToken();

      const res = await axios.post('/api/auth/login', { token, name });

      // ✅ Save user and loginTime for 12hr logout mechanism
      localStorage.setItem('user', JSON.stringify(res.data));
      localStorage.setItem('loginTime', Date.now().toString());

      // Redirect based on role
      window.location.href = res.data.role === 'admin' ? '/admin' : '/';
    } catch (err) {
      console.error(err);
      setMessage(err.message || 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-50 pb-30 flex items-center justify-center bg-gradient-to-r from-white via-pink-50 p-4 min-h-screen">
      <div className="w-full max-w-4xl bg-white rounded-xl overflow-hidden shadow-lg grid grid-cols-1 md:grid-cols-2">
        {/* Left Side */}
        <div className="bg-gradient-to-br from-pink-500 to-red-400 text-white p-8 flex flex-col items-center justify-center">
          <h2 className="text-3xl font-bold mb-4">Hello, Friend!</h2>
          <p className="mb-6 text-center">Welcome to Visit-Us!</p>
        </div>

        {/* Right Side - Form */}
        <div className="p-8">
          <h2 className="text-3xl font-bold text-center mb-6">Please, Login!</h2>

          {step === 1 && (
            <>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your Name"
                className="w-full px-4 py-2 border border-gray-300 rounded mb-4"
              />
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Phone Number"
                className="w-full px-4 py-2 border border-gray-300 rounded mb-4"
              />
              <button
                onClick={sendOtp}
                disabled={loading || phone.length !== 10}
                className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
              >
                {loading ? 'Sending...' : 'Send OTP'}
              </button>
            </>
          )}

          {step === 2 && (
            <>
              <div className="flex justify-between mb-4">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => (inputRefs.current[index] = el)}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    className="w-12 h-12 text-center border border-gray-300 rounded text-lg"
                    value={digit}
                    onChange={(e) => handleOtpChange(e, index)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                  />
                ))}
              </div>

              <div className="text-center text-sm text-gray-600 mb-4">
                {canResend ? (
                  <button onClick={sendOtp} className="text-blue-600 hover:underline" disabled={loading}>
                    Resend OTP
                  </button>
                ) : (
                  <>Resend OTP in {timer}s</>
                )}
              </div>

              <button
                onClick={verifyOtp}
                disabled={loading}
                className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
              >
                {loading ? 'Verifying...' : 'Verify OTP'}
              </button>
            </>
          )}

          {message && <p className="text-center text-red-500 mt-4 text-sm">{message}</p>}
          <div id="recaptcha" />
        </div>
      </div>
    </div>
  );
};

export default Login;
