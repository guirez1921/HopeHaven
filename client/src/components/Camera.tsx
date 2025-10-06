import React, { useRef, useState, useEffect } from 'react';
import { X, Camera, Video, RotateCcw, Check } from 'lucide-react';

interface CameraModalProps {
    isOpen: boolean;
    onClose: () => void;
    onCapture: (data: string) => void;
    isSelfie?: boolean;
    mode: 'photo' | 'video';
}

const CameraModal: React.FC<CameraModalProps> = ({ 
    isOpen, 
    onClose, 
    onCapture, 
    isSelfie = false, 
    mode = 'photo' 
}) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const streamRef = useRef<MediaStream | null>(null);

    const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
    const [selectedDeviceId, setSelectedDeviceId] = useState<string>('');
    const [isRecording, setIsRecording] = useState(false);
    const [recordedChunks, setRecordedChunks] = useState<Blob[]>([]);
    const [countdown, setCountdown] = useState(10);
    const [preview, setPreview] = useState<string | null>(null);
    const [cameraStarted, setCameraStarted] = useState(false);

    useEffect(() => {
        if (isOpen) {
            getDevices();
        } else {
            stopCamera();
            setPreview(null);
            setCountdown(10);
        }

        return () => {
            stopCamera();
        };
    }, [isOpen]);

    useEffect(() => {
        if (selectedDeviceId && isOpen) {
            startCamera();
        }
    }, [selectedDeviceId, isOpen]);

    useEffect(() => {
        if (mode === 'video' && isRecording && countdown > 0) {
            const timer = setTimeout(() => setCountdown(prev => prev - 1), 1000);
            return () => clearTimeout(timer);
        }
        if (countdown === 0 && isRecording) {
            stopRecording();
        }
    }, [countdown, isRecording, mode]);

    const getDevices = async () => {
        try {
            const devices = await navigator.mediaDevices.enumerateDevices();
            const videoDevices = devices.filter(device => device.kind === 'videoinput');
            setDevices(videoDevices);
            
            // Prefer front camera for selfies
            if (isSelfie) {
                const frontCamera = videoDevices.find(device => 
                    device.label.toLowerCase().includes('front') || 
                    device.label.toLowerCase().includes('user')
                );
                setSelectedDeviceId(frontCamera?.deviceId || videoDevices[0]?.deviceId || '');
            } else {
                setSelectedDeviceId(videoDevices[0]?.deviceId || '');
            }
        } catch (error) {
            console.error('Error getting devices:', error);
        }
    };

    const startCamera = async () => {
        try {
            const constraints = {
                video: {
                    deviceId: selectedDeviceId ? { exact: selectedDeviceId } : undefined,
                    width: { ideal: 640 },
                    height: { ideal: 480 }
                },
                audio: mode === 'video'
            };

            const stream = await navigator.mediaDevices.getUserMedia(constraints);
            streamRef.current = stream;

            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                videoRef.current.play();
                setCameraStarted(true);
            }
        } catch (error) {
            console.error('Error starting camera:', error);
            alert('Unable to access camera. Please check permissions.');
        }
    };

    const stopCamera = () => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
            streamRef.current = null;
        }
        setCameraStarted(false);
    };

    const capturePhoto = () => {
        if (!videoRef.current || !canvasRef.current) return;

        const canvas = canvasRef.current;
        const video = videoRef.current;
        
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
        setPreview(dataUrl);
    };

    const startRecording = () => {
        if (!streamRef.current) return;

        setRecordedChunks([]);
        const options = { mimeType: 'video/webm; codecs=vp9' };
        
        try {
            const mediaRecorder = new MediaRecorder(streamRef.current, options);
            mediaRecorderRef.current = mediaRecorder;

            mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    setRecordedChunks(prev => [...prev, event.data]);
                }
            };

            mediaRecorder.onstop = () => {
                const blob = new Blob(recordedChunks, { type: 'video/webm' });
                const url = URL.createObjectURL(blob);
                setPreview(url);
            };

            mediaRecorder.start();
            setIsRecording(true);
            setCountdown(10);
        } catch (error) {
            console.error('Error starting recording:', error);
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
        }
    };

    const handleAccept = () => {
        if (preview) {
            onCapture(preview);
            setPreview(null);
        }
    };

    const handleReject = () => {
        setPreview(null);
        setCountdown(10);
        if (mode === 'video') {
            setRecordedChunks([]);
        }
    };

    const handleClose = () => {
        if (isRecording) {
            stopRecording();
        }
        setPreview(null);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
            <div className="relative w-full max-w-4xl mx-4 bg-white rounded-lg shadow-xl">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b">
                    <h3 className="text-lg font-semibold text-gray-900">
                        {mode === 'video' ? 'Record Selfie Video' : 'Take Photo'}
                    </h3>
                    <button
                        onClick={handleClose}
                        className="p-1 text-gray-400 hover:text-gray-600"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Camera View */}
                <div className="p-6">
                    <div className="relative overflow-hidden bg-black rounded-lg aspect-video">
                        <video
                            ref={videoRef}
                            autoPlay
                            playsInline
                            muted
                            className="object-cover w-full h-full"
                        />
                        <canvas
                            ref={canvasRef}
                            className="hidden"
                        />
                        
                        {/* Recording indicator */}
                        {isRecording && (
                            <div className="absolute flex items-center space-x-2 top-4 left-4">
                                <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                                <span className="font-medium text-white">REC</span>
                            </div>
                        )}

                        {/* Countdown */}
                        {isRecording && countdown > 0 && (
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="flex items-center justify-center w-24 h-24 text-6xl font-bold text-white bg-black bg-opacity-50 rounded-full">
                                    {countdown}
                                </div>
                            </div>
                        )}

                        {/* Instructions */}
                        {!isRecording && !preview && cameraStarted && (
                            <div className="absolute bottom-4 left-4 right-4">
                                <div className="p-3 text-sm text-white bg-black bg-opacity-50 rounded-lg">
                                    {mode === 'video' && isSelfie ? (
                                        'Look directly at the camera. Recording will start automatically and last for 10 seconds.'
                                    ) : mode === 'video' ? (
                                        'Position your camera and click record to start a 10-second video.'
                                    ) : (
                                        'Position yourself and click capture when ready.'
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Controls */}
                    <div className="flex items-center justify-between mt-6">
                        {/* Camera Selection */}
                        <div className="flex items-center space-x-4">
                            <label className="text-sm font-medium text-gray-700">Camera:</label>
                            <select
                                value={selectedDeviceId}
                                onChange={(e) => setSelectedDeviceId(e.target.value)}
                                className="px-3 py-1 text-sm border border-gray-300 rounded-md"
                                disabled={isRecording}
                            >
                                {devices.map(device => (
                                    <option key={device.deviceId} value={device.deviceId}>
                                        {device.label || `Camera ${devices.indexOf(device) + 1}`}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center space-x-3">
                            {!preview && (
                                <>
                                    {mode === 'photo' && (
                                        <button
                                            onClick={capturePhoto}
                                            disabled={!cameraStarted}
                                            className="flex items-center px-6 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                                        >
                                            <Camera className="w-5 h-5 mr-2" />
                                            Capture
                                        </button>
                                    )}
                                    
                                    {mode === 'video' && !isRecording && (
                                        <button
                                            onClick={startRecording}
                                            disabled={!cameraStarted}
                                            className="flex items-center px-6 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                                        >
                                            <Video className="w-5 h-5 mr-2" />
                                            Record
                                        </button>
                                    )}

                                    {mode === 'video' && isRecording && (
                                        <button
                                            onClick={stopRecording}
                                            className="flex items-center px-6 py-2 text-white bg-gray-600 rounded-lg hover:bg-gray-700"
                                        >
                                            Stop Recording
                                        </button>
                                    )}
                                </>
                            )}
                        </div>
                    </div>

                    {/* Preview */}
                    {preview && (
                        <div className="mt-6">
                            <h4 className="mb-3 text-lg font-semibold">Preview</h4>
                            <div className="relative overflow-hidden bg-gray-100 rounded-lg">
                                {mode === 'photo' ? (
                                    <img
                                        src={preview}
                                        alt="Preview"
                                        className="object-contain w-full h-auto max-h-96"
                                    />
                                ) : (
                                    <video
                                        src={preview}
                                        controls
                                        className="w-full h-auto max-h-96"
                                    />
                                )}
                            </div>
                            
                            <div className="flex justify-center mt-4 space-x-4">
                                <button
                                    onClick={handleReject}
                                    className="flex items-center px-6 py-2 text-white bg-gray-500 rounded-lg hover:bg-gray-600"
                                >
                                    <RotateCcw className="w-5 h-5 mr-2" />
                                    Retake
                                </button>
                                <button
                                    onClick={handleAccept}
                                    className="flex items-center px-6 py-2 text-white bg-green-600 rounded-lg hover:bg-green-700"
                                >
                                    <Check className="w-5 h-5 mr-2" />
                                    Accept
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CameraModal;