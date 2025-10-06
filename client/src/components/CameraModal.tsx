import React, { useRef, useState, useEffect } from 'react';
import Webcam from 'react-webcam';
import { FaceDetection } from '@mediapipe/face_detection';
import { Camera } from '@mediapipe/camera_utils';

interface CameraModalProps {
    isOpen: boolean;
    onClose: () => void;
    onCapture: (data: string) => void;
    isSelfie?: boolean;
    mode: 'photo' | 'video';
}

const CameraModal: React.FC<CameraModalProps> = ({ isOpen, onClose, onCapture, isSelfie = false, mode='photo' }) => {
    const webcamRef = useRef<Webcam>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
    const [selectedDeviceId, setSelectedDeviceId] = useState<string | null>(null);
    const [isRecording, setIsRecording] = useState(false);
    const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
    const [recordedChunks, setRecordedChunks] = useState<Blob[]>([]);
    const [faceFound, setFaceFound] = useState(false);
    const [countdown, setCountdown] = useState(10);
    // const [mode, setMode] = useState<'photo' | 'video'>('photo');
    const [preview, setPreview] = useState<string | null>(null);

    // useEffect(() => {
    //     navigator.mediaDevices.enumerateDevices().then(devices => {
    //         const videoDevices = devices.filter(device => device.kind === 'videoinput');
    //         setDevices(videoDevices);
    //         if (videoDevices[0]) setSelectedDeviceId(videoDevices[0].deviceId);
    //     });
    // }, []);

    // src/components/cameramodal.tsx:27
    useEffect(() => {
        if (
            typeof navigator !== 'undefined' &&
            navigator.mediaDevices &&
            typeof navigator.mediaDevices.enumerateDevices === 'function'
        ) {
            navigator.mediaDevices.enumerateDevices().then(devices => {
                const videoDevices = devices.filter(device => device.kind === 'videoinput');
                setDevices(videoDevices);
                if (videoDevices[0]) setSelectedDeviceId(videoDevices[0].deviceId);
            });
        } else {
            // Handle unsupported environment
            setDevices([]);
            setSelectedDeviceId(null);
            // Optionally show a user-facing error message
        }
    }, []);

    useEffect(() => {
        if (!webcamRef.current?.video || !isOpen) return;

        const faceDetection = new FaceDetection({
            locateFile: file => `https://cdn.jsdelivr.net/npm/@mediapipe/face_detection/${file}`,
        });

        faceDetection.setOptions({
            model: 'short',
            minDetectionConfidence: 0.5,
        });

        faceDetection.onResults(results => {
            const canvas = canvasRef.current;
            if (!canvas) return;
            const ctx = canvas.getContext('2d');
            if (!ctx) return;
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            if (results.detections.length > 0) {
                setFaceFound(true);
                const box = results.detections[0].boundingBox;
                ctx.strokeStyle = 'lime';
                ctx.lineWidth = 3;
                ctx.beginPath();
                ctx.roundRect(
                    box.xCenter - box.width / 2,
                    box.yCenter - box.height / 2,
                    box.width,
                    box.height,
                    10
                );
                ctx.stroke();
            } else {
                setFaceFound(false);
            }
        });

        const camera = new Camera(webcamRef.current.video, {
            onFrame: async () => {
                await faceDetection.send({ image: webcamRef.current!.video! });
            },
            width: 640,
            height: 480,
        });

        camera.start();
        return () => {
            camera.stop();
        };
    }, [isOpen]);

    useEffect(() => {
        if (mode === 'video' && isRecording && faceFound && countdown > 0) {
            const timer = setTimeout(() => setCountdown(prev => prev - 1), 1000);
            return () => clearTimeout(timer);
        }
        if (countdown === 0 && isRecording) {
            stopRecording();
        }
    }, [countdown, faceFound, isRecording]);

    const startRecording = () => {
        setRecordedChunks([]);
        const stream = webcamRef.current?.stream;
        if (!stream) return;

        const recorder = new MediaRecorder(stream);
        recorder.ondataavailable = e => {
            if (e.data.size > 0) setRecordedChunks(prev => [...prev, e.data]);
        };
        recorder.onstop = () => {
            const blob = new Blob(recordedChunks, { type: 'video/webm' });
            setPreview(URL.createObjectURL(blob));
        };
        recorder.start();
        setMediaRecorder(recorder);
        setIsRecording(true);
        setCountdown(10);
    };

    const stopRecording = () => {
        mediaRecorder?.stop();
        setIsRecording(false);
    };

    const capturePhoto = () => {
        if (isSelfie && !faceFound) return;
        const imageSrc = webcamRef.current?.getScreenshot();
        if (imageSrc) setPreview(imageSrc);
    };

    const handleAccept = () => {
        if (preview) onCapture(preview);
        setPreview(null);
        onClose();
    };

    const handleReject = () => {
        setPreview(null);
        setCountdown(10);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
            <div className="relative w-full max-w-3xl p-4 bg-white rounded-lg shadow-lg">
                <button onClick={onClose} className="absolute text-xl text-gray-600 top-2 right-2 hover:text-red-500">✖</button>

                <div className="relative w-full aspect-video">
                    <Webcam
                        audio={mode === 'video'}
                        ref={webcamRef}
                        screenshotFormat="image/jpeg"
                        videoConstraints={{ deviceId: selectedDeviceId || undefined }}
                        className="object-cover w-full h-full rounded-md"
                    />
                    <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full pointer-events-none" />
                </div>

                <div className="flex flex-wrap items-center justify-between gap-4 mt-4">
                    <select
                        className="px-2 py-1 text-sm border rounded"
                        onChange={e => setSelectedDeviceId(e.target.value)}
                        value={selectedDeviceId || ''}
                    >
                        {devices.map(device => (
                            <option key={device.deviceId} value={device.deviceId}>
                                {device.label || 'Camera'}
                            </option>
                        ))}
                    </select>

                    {/* <button
                        className="px-3 py-1 text-sm text-white bg-blue-600 rounded hover:bg-blue-700"
                        onClick={() => setMode(mode === 'photo' ? 'video' : 'photo')}
                    >
                        {mode === 'photo' ? 'Switch to Video' : 'Switch to Photo'}
                    </button> */}

                    {mode === 'photo' ? (
                        <button
                            className={`px-3 py-1 rounded text-sm ${isSelfie && !faceFound ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700 text-white'}`}
                            onClick={capturePhoto}
                            disabled={isSelfie && !faceFound}
                        >
                            📸 Capture
                        </button>
                    ) : (
                        <button
                            className={`px-3 py-1 rounded text-sm ${isRecording || !faceFound ? 'bg-gray-400 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700 text-white'}`}
                            onClick={startRecording}
                            disabled={isRecording || !faceFound}
                        >
                            🎥 Record
                        </button>
                    )}
                </div>

                {isRecording && (
                    <div className="mt-2 text-lg font-bold text-center text-red-600">
                        ⏱ {countdown}s
                    </div>
                )}

                {preview && (
                    <div className="mt-4 text-center">
                        {mode === 'photo' ? (
                            <img src={preview} alt="Preview" className="mx-auto rounded-md max-h-64" />
                        ) : (
                            <video src={preview} controls className="mx-auto rounded-md max-h-64" />
                        )}
                        <div className="flex justify-center gap-4 mt-2">
                            <button onClick={handleReject} className="text-2xl text-red-500 hover:text-red-700">❌</button>
                            <button onClick={handleAccept} className="text-2xl text-green-500 hover:text-green-700">✅</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CameraModal;