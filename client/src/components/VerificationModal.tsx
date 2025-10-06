import React, { useState, useEffect, useRef } from 'react';
import { X, MessageSquare, Check, RefreshCw } from 'lucide-react';

interface VerificationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onVerificationComplete: () => void;
    phoneNumber: string;
}

const VerificationModal: React.FC<VerificationModalProps> = ({
    isOpen,
    onClose,
    onVerificationComplete,
    phoneNumber
}) => {
    const [verificationCode, setVerificationCode] = useState(['', '', '', '', '', '']);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
    const [canResend, setCanResend] = useState(false);
    const [isVerifying, setIsVerifying] = useState(false);
    const [smsSent, setSmsSent] = useState(false);
    
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    useEffect(() => {
        if (isOpen && !smsSent) {
            sendSMS();
        }
        if (isOpen) {
            const timer = setInterval(() => {
                setTimeLeft((prev) => {
                    if (prev <= 1) {
                        setCanResend(true);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);

            return () => clearInterval(timer);
        }
    }, [isOpen, smsSent]);

    useEffect(() => {
        // Auto-focus first input when modal opens
        if (isOpen && inputRefs.current[0]) {
            inputRefs.current[0]?.focus();
        }
    }, [isOpen]);

    const sendSMS = async () => {
        setIsLoading(true);
        setError('');
        
        try {
            // Simulate SMS sending - replace with actual API call
            await new Promise(resolve => setTimeout(resolve, 2000));
            setSmsSent(true);
            setTimeLeft(300);
            setCanResend(false);
        } catch (err) {
            setError('Failed to send verification code. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleInputChange = (index: number, value: string) => {
        if (value.length > 1) return; // Only allow single digits
        
        const newCode = [...verificationCode];
        newCode[index] = value;
        setVerificationCode(newCode);
        setError('');

        // Auto-focus next input
        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }

        // Auto-verify when all digits are entered
        if (newCode.every(digit => digit !== '') && !isVerifying) {
            handleVerify(newCode.join(''));
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
        if (e.key === 'Backspace' && !verificationCode[index] && index > 0) {
            // Focus previous input on backspace if current is empty
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handlePaste = (e: React.ClipboardEvent) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData('text').replace(/\D/g, '');
        
        if (pastedData.length === 6) {
            const newCode = pastedData.split('');
            setVerificationCode(newCode);
            handleVerify(pastedData);
        }
    };

    const handleVerify = async (code: string) => {
        setIsVerifying(true);
        setError('');

        try {
            // Simulate verification - replace with actual API call
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // For demo purposes, accept any 6-digit code
            if (code.length === 6) {
                onVerificationComplete();
            } else {
                throw new Error('Invalid code');
            }
        } catch (err) {
            setError('Invalid verification code. Please try again.');
            setVerificationCode(['', '', '', '', '', '']);
            inputRefs.current[0]?.focus();
        } finally {
            setIsVerifying(false);
        }
    };

    const handleResend = () => {
        setVerificationCode(['', '', '', '', '', '']);
        setSmsSent(false);
        setError('');
        sendSMS();
    };

    const formatTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    const formatPhoneNumber = (phone: string) => {
        const digits = phone.replace(/\D/g, '');
        if (digits.length === 10) {
            return `***-***-${digits.slice(-4)}`;
        }
        return phone;
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="relative w-full max-w-md mx-4 bg-white rounded-lg shadow-xl">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b">
                    <div className="flex items-center">
                        <MessageSquare className="w-6 h-6 mr-2 text-blue-600" />
                        <h3 className="text-lg font-semibold text-gray-900">
                            SMS Verification
                        </h3>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1 text-gray-400 hover:text-gray-600"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6">
                    {isLoading ? (
                        <div className="py-8 text-center">
                            <RefreshCw className="w-8 h-8 mx-auto mb-4 text-blue-600 animate-spin" />
                            <p className="text-gray-600">Sending verification code...</p>
                        </div>
                    ) : (
                        <>
                            <div className="mb-6 text-center">
                                <p className="mb-2 text-gray-600">
                                    We've sent a 6-digit verification code to
                                </p>
                                <p className="font-semibold text-gray-900">
                                    {formatPhoneNumber(phoneNumber)}
                                </p>
                                <p className="mt-2 text-sm text-gray-500">
                                    Enter the code below to complete your application
                                </p>
                            </div>

                            {/* Code Input */}
                            <div className="flex justify-center mb-6 space-x-3">
                                {verificationCode.map((digit, index) => (
                                    <input
                                        key={index}
                                        ref={el => inputRefs.current[index] = el}
                                        type="text"
                                        inputMode="numeric"
                                        maxLength={1}
                                        value={digit}
                                        onChange={(e) => handleInputChange(index, e.target.value)}
                                        onKeyDown={(e) => handleKeyDown(index, e)}
                                        onPaste={handlePaste}
                                        className="w-12 h-12 text-lg font-semibold text-center border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                                        disabled={isVerifying}
                                    />
                                ))}
                            </div>

                            {/* Error Message */}
                            {error && (
                                <div className="mb-4 text-center">
                                    <p className="text-sm text-red-600">{error}</p>
                                </div>
                            )}

                            {/* Loading State */}
                            {isVerifying && (
                                <div className="mb-4 text-center">
                                    <div className="flex items-center justify-center">
                                        <RefreshCw className="w-4 h-4 mr-2 text-blue-600 animate-spin" />
                                        <p className="text-sm text-gray-600">Verifying...</p>
                                    </div>
                                </div>
                            )}

                            {/* Timer and Resend */}
                            <div className="text-center">
                                {timeLeft > 0 ? (
                                    <p className="text-sm text-gray-500">
                                        Didn't receive the code? Resend in {formatTime(timeLeft)}
                                    </p>
                                ) : (
                                    <button
                                        onClick={handleResend}
                                        disabled={isLoading}
                                        className="text-sm font-medium text-blue-600 hover:text-blue-800 disabled:text-gray-400"
                                    >
                                        Resend verification code
                                    </button>
                                )}
                            </div>

                            {/* Instructions */}
                            <div className="p-4 mt-6 rounded-lg bg-blue-50">
                                <div className="flex items-start">
                                    <Check className="w-5 h-5 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                                    <div>
                                        <h4 className="mb-1 text-sm font-medium text-blue-900">
                                            Tips for receiving SMS
                                        </h4>
                                        <ul className="space-y-1 text-sm text-blue-800">
                                            <li>• Check your phone for the message</li>
                                            <li>• Make sure you have cellular signal</li>
                                            <li>• The code will arrive within 1-2 minutes</li>
                                            <li>• Check your spam/blocked messages if needed</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default VerificationModal;