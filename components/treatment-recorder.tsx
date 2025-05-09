"use client";

import { useState } from "react";
import { Mic, MicOff, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";

export function TreatmentRecorder() {
    const [isRecording, setIsRecording] = useState(false);
    const [recordingTime, setRecordingTime] = useState(0);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [isProcessing, setIsProcessing] = useState(false);
    const [uploadComplete, setUploadComplete] = useState(false);

    const toggleRecording = () => {
        if (isRecording) {
            // End recording
            setIsRecording(false);
            setIsUploading(true);

            // Simulate uploading process
            const uploadInterval = setInterval(() => {
                setUploadProgress((prev) => {
                    if (prev >= 100) {
                        clearInterval(uploadInterval);
                        setIsUploading(false);
                        setIsProcessing(true);

                        // Simulate processing
                        setTimeout(() => {
                            setIsProcessing(false);
                            setUploadComplete(true);
                        }, 2000);
                        return 100;
                    }
                    return prev + 10;
                });
            }, 300);
        } else {
            // Start recording
            setIsRecording(true);
            setRecordingTime(0);

            // Simulate recording time
            const timerInterval = setInterval(() => {
                setRecordingTime((prev) => {
                    if (!isRecording) {
                        clearInterval(timerInterval);
                    }
                    return prev + 1;
                });
            }, 1000);
        }
    };

    const handleFileUpload = () => {
        setIsUploading(true);

        // Simulate uploading process
        const uploadInterval = setInterval(() => {
            setUploadProgress((prev) => {
                if (prev >= 100) {
                    clearInterval(uploadInterval);
                    setIsUploading(false);
                    setIsProcessing(true);

                    // Simulate processing
                    setTimeout(() => {
                        setIsProcessing(false);
                        setUploadComplete(true);
                    }, 2000);
                    return 100;
                }
                return prev + 10;
            });
        }, 300);
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    };

    return (
        <div className="p-6 w-full">
            <div className="mx-auto max-w-4xl">
                <h1 className="mb-6 text-2xl font-bold">New Treatment</h1>

                <Card className="mb-6">
                    <CardHeader>
                        <CardTitle>Record Treatment</CardTitle>
                        <CardDescription>
                            Record your session with the patient or upload an existing audio file
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {isRecording && (
                            <div className="flex items-center justify-center space-x-2 rounded-md bg-red-50 p-4 dark:bg-red-900/20">
                                <div className="h-3 w-3 animate-pulse rounded-full bg-red-500"></div>
                                <span className="font-medium">
                                    Recording: {formatTime(recordingTime)}
                                </span>
                            </div>
                        )}

                        {isUploading && (
                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <span>Uploading recording...</span>
                                    <span>{uploadProgress}%</span>
                                </div>
                                <Progress value={uploadProgress} className="w-full" />
                            </div>
                        )}

                        {isProcessing && (
                            <Alert>
                                <AlertDescription className="flex items-center justify-center">
                                    <svg className="mr-2 h-4 w-4 animate-spin" viewBox="0 0 24 24">
                                        <circle
                                            className="opacity-25"
                                            cx="12"
                                            cy="12"
                                            r="10"
                                            stroke="currentColor"
                                            strokeWidth="4"
                                            fill="none"
                                        ></circle>
                                        <path
                                            className="opacity-75"
                                            fill="currentColor"
                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                        ></path>
                                    </svg>
                                    Processing audio to text, please wait...
                                </AlertDescription>
                            </Alert>
                        )}

                        {uploadComplete && (
                            <Alert className="bg-green-50 dark:bg-green-900/20">
                                <AlertDescription className="text-green-800 dark:text-green-300">
                                    Upload complete! The treatment record has been processed
                                    successfully.
                                </AlertDescription>
                            </Alert>
                        )}
                    </CardContent>
                    <CardFooter className="flex justify-between space-x-4">
                        <Button
                            variant={isRecording ? "destructive" : "default"}
                            className="flex-1"
                            onClick={toggleRecording}
                            disabled={isUploading || isProcessing || uploadComplete}
                        >
                            {isRecording ? (
                                <>
                                    <MicOff className="mr-2 h-4 w-4" />
                                    End Treatment
                                </>
                            ) : (
                                <>
                                    <Mic className="mr-2 h-4 w-4" />
                                    Start Treatment
                                </>
                            )}
                        </Button>
                        <Button
                            variant="outline"
                            className="flex-1"
                            onClick={handleFileUpload}
                            disabled={isRecording || isUploading || isProcessing || uploadComplete}
                        >
                            <Upload className="mr-2 h-4 w-4" />
                            Upload Treatment Details
                        </Button>
                    </CardFooter>
                </Card>

                {uploadComplete && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Treatment Processed</CardTitle>
                            <CardDescription>
                                Your recording has been processed and is ready for review
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p>
                                The audio recording has been successfully converted to text and is
                                now available in the patient's treatment history. You can access it
                                by clicking on the most recent date in the sidebar.
                            </p>
                        </CardContent>
                        <CardFooter>
                            <Button variant="default" className="ml-auto">
                                View Treatment Record
                            </Button>
                        </CardFooter>
                    </Card>
                )}
            </div>
        </div>
    );
}
