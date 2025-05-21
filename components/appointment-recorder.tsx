"use client"

import { useState, useRef, useEffect } from "react"
import { Mic, MicOff, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"

export function AppointmentRecorder() {
    const [isRecording, setIsRecording] = useState(false)
    const [recordingTime, setRecordingTime] = useState(0)
    const [isUploading, setIsUploading] = useState(false)
    const [uploadProgress, setUploadProgress] = useState(0)
    const [isProcessing, setIsProcessing] = useState(false)
    const [uploadComplete, setUploadComplete] = useState(false)
    const [audioBlob, setAudioBlob] = useState<Blob | null>(null)

    const mediaRecorderRef = useRef<MediaRecorder | null>(null)
    const audioChunksRef = useRef<Blob[]>([])
    const timerIntervalRef = useRef<NodeJS.Timeout | null>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
            const mediaRecorder = new MediaRecorder(stream)
            mediaRecorderRef.current = mediaRecorder
            audioChunksRef.current = []

            mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    audioChunksRef.current.push(event.data)
                }
            }

            mediaRecorder.onstop = () => {
                const audioBlob = new Blob(audioChunksRef.current, { type: "audio/wav" })
                setAudioBlob(audioBlob)

                // 녹음된 스트림의 모든 트랙 중지
                stream.getTracks().forEach((track) => track.stop())
            }

            mediaRecorder.start()
            setIsRecording(true)
            setRecordingTime(0)

            // 녹음 시간 타이머 시작
            timerIntervalRef.current = setInterval(() => {
                setRecordingTime((prev) => prev + 1)
            }, 1000)
        } catch (error) {
            console.error("녹음을 시작할 수 없습니다:", error)
            alert("마이크 접근 권한이 필요합니다.")
        }
    }

    const stopRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop()
            setIsRecording(false)

            if (timerIntervalRef.current) {
                clearInterval(timerIntervalRef.current)
            }
        }
    }

    // TODO: 서버에 업로드 하는 로직 추가
    const handleFileUpload = () => {
        if (!audioBlob) {
            alert("녹음된 파일이 없습니다.")
            return
        }

        setIsUploading(true)

        // 실제 서버 업로드 대신 시뮬레이션
        const uploadInterval = setInterval(() => {
            setUploadProgress((prev) => {
                if (prev >= 100) {
                    clearInterval(uploadInterval)
                    setIsUploading(false)
                    setIsProcessing(true)

                    // 처리 시뮬레이션
                    setTimeout(() => {
                        setIsProcessing(false)
                        setUploadComplete(true)
                    }, 2000)
                    return 100
                }
                return prev + 10
            })
        }, 300)
    }

    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (file) {
            // 오디오 파일인지 확인
            if (!file.type.startsWith("audio/")) {
                alert("오디오 파일만 업로드 가능합니다.")
                return
            }
            setAudioBlob(file)
        }
    }

    useEffect(() => {
        if (audioBlob) {
            handleFileUpload()
        }
    }, [audioBlob])

    const triggerFileSelect = () => {
        fileInputRef.current?.click()
    }

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60)
        const secs = seconds % 60
        return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
    }

    return (
        <div className="p-6 w-full">
            <div className="mx-auto max-w-4xl">
                <h1 className="mb-6 text-2xl font-bold">새 진료</h1>

                <Card className="mb-6">
                    <CardHeader>
                        <CardTitle>진료 녹음</CardTitle>
                        <CardDescription>
                            환자와의 상담을 녹음하거나 기존 오디오 파일을 업로드하세요
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {isRecording && (
                            <div className="flex items-center justify-center space-x-2 rounded-md bg-red-50 p-4 dark:bg-red-900/20">
                                <div className="h-3 w-3 animate-pulse rounded-full bg-red-500"></div>
                                <span className="font-medium">
                                    녹음 중: {formatTime(recordingTime)}
                                </span>
                            </div>
                        )}

                        {isUploading && (
                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <span>녹음 파일 업로드 중...</span>
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
                                    오디오를 텍스트로 변환 중입니다. 잠시만 기다려주세요...
                                </AlertDescription>
                            </Alert>
                        )}

                        {uploadComplete && (
                            <Alert className="bg-green-50 dark:bg-green-900/20">
                                <AlertDescription className="text-green-800 dark:text-green-300">
                                    업로드 완료! 진료 기록이 성공적으로 처리되었습니다.
                                </AlertDescription>
                            </Alert>
                        )}
                    </CardContent>
                    <CardFooter className="flex justify-between space-x-4">
                        <Button
                            variant={isRecording ? "destructive" : "default"}
                            className="flex-1"
                            onClick={isRecording ? stopRecording : startRecording}
                            disabled={isUploading || isProcessing || uploadComplete}
                        >
                            {isRecording ? (
                                <>
                                    <MicOff className="mr-2 h-4 w-4" />
                                    녹음 종료
                                </>
                            ) : (
                                <>
                                    <Mic className="mr-2 h-4 w-4" />
                                    녹음 시작
                                </>
                            )}
                        </Button>
                        <Button
                            variant="outline"
                            className="flex-1"
                            onClick={triggerFileSelect}
                            disabled={isRecording || isUploading || isProcessing || uploadComplete}
                        >
                            <Upload className="mr-2 h-4 w-4" />
                            녹음 업로드
                        </Button>
                    </CardFooter>
                </Card>

                {uploadComplete && (
                    <Card>
                        <CardHeader>
                            <CardTitle>진료 처리 완료</CardTitle>
                            <CardDescription>
                                녹음이 처리되어 검토할 준비가 되었습니다
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p>
                                오디오 녹음이 성공적으로 텍스트로 변환되어 환자의 진료 기록에
                                저장되었습니다. 사이드바에서 가장 최근 날짜를 클릭하여 확인하실 수
                                있습니다.
                            </p>
                        </CardContent>
                        <CardFooter>
                            <Button variant="default" className="ml-auto">
                                진료 기록 보기
                            </Button>
                        </CardFooter>
                    </Card>
                )}

                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileSelect}
                    accept="audio/*"
                    className="hidden"
                />
            </div>
        </div>
    )
}
