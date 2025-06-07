"use client"

import { useState, useRef, useEffect } from "react"
import { Mic, Upload, FileEdit } from "lucide-react"
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
import { Textarea } from "@/components/ui/textarea"
import { AppointmentType } from "@/types/appointmentType"
import { parseSummary } from "@/lib/utils/summaryParser"
import { addMemo, addRecording } from "@/lib/apis/appointmentApi"
import { toast } from "sonner"

interface AppointmentRecorderProps {
    newAppointment: AppointmentType
    previousAppointments: AppointmentType[]
    onUploadComplete: () => void
}

export function AppointmentRecorder({
    newAppointment,
    previousAppointments,
    onUploadComplete,
}: AppointmentRecorderProps) {
    const [isRecording, setIsRecording] = useState(false)
    const [recordingTime, setRecordingTime] = useState(0)
    const [isUploading, setIsUploading] = useState(false)
    const [uploadProgress, setUploadProgress] = useState(0)
    const [isProcessing, setIsProcessing] = useState(false)
    const [uploadComplete, setUploadComplete] = useState(false)
    const [audioBlob, setAudioBlob] = useState<Blob | null>(null)
    const [memo, setMemo] = useState("")
    const [isEditingMemo, setIsEditingMemo] = useState(false)
    const [isSaving, setIsSaving] = useState(false)

    const mediaRecorderRef = useRef<MediaRecorder | null>(null)
    const audioChunksRef = useRef<Blob[]>([])
    const timerIntervalRef = useRef<NodeJS.Timeout | null>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const lastAppointment =
        previousAppointments.length > 0
            ? [...previousAppointments].sort(
                  (a, b) =>
                      new Date(b.appointmentDate).getTime() - new Date(a.appointmentDate).getTime()
              )[0]
            : null

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

    const handleFileUpload = async () => {
        if (!audioBlob) {
            toast.error("업로드할 오디오 파일이 없습니다.")
            return
        }
        if (!newAppointment) {
            toast.error("진료 정보가 없습니다.")
            return
        }

        setIsUploading(true)
        setUploadProgress(0)

        try {
            const onUploadProgress = (progressEvent: any) => {
                const percentCompleted = Math.round(
                    (progressEvent.loaded * 100) / progressEvent.total
                )
                setUploadProgress(percentCompleted)
            }

            await addRecording(newAppointment.appointmentId, audioBlob, onUploadProgress)

            setIsUploading(false)
            setIsProcessing(true)

            // 서버 측 처리 시뮬레이션을 위한 지연
            setTimeout(() => {
                setIsProcessing(false)
                setUploadComplete(true)
                toast.success("파일 업로드 및 처리가 완료되었습니다.")
                onUploadComplete()
            }, 2000) // 2초 지연
        } catch (error) {
            setIsUploading(false)
            setUploadProgress(0)
            toast.error(error instanceof Error ? error.message : "파일 업로드에 실패했습니다.")
        }
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
        const minutes = Math.floor(seconds / 60)
        const remainingSeconds = seconds % 60
        return `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`
    }

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr)
        return date.toLocaleDateString("ko-KR", {
            year: "numeric",
            month: "long",
            day: "numeric",
            weekday: "short",
        })
    }

    const summary = lastAppointment ? parseSummary(lastAppointment.summary) : null

    const handleSaveMemo = async () => {
        if (!memo.trim()) {
            toast.error("메모를 입력해주세요.")
            return
        }

        setIsSaving(true)
        try {
            await addMemo(newAppointment.appointmentId, memo)
            toast.success("메모가 저장되었습니다.")
            setIsEditingMemo(false)
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "메모 저장에 실패했습니다.")
        } finally {
            setIsSaving(false)
        }
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
                                <AlertDescription>
                                    오디오 파일을 처리 중입니다. 잠시만 기다려주세요...
                                </AlertDescription>
                            </Alert>
                        )}

                        {uploadComplete && (
                            <Alert variant="default" className="bg-green-100">
                                <AlertDescription>
                                    업로드 및 처리가 완료되었습니다.
                                </AlertDescription>
                            </Alert>
                        )}
                    </CardContent>
                    <CardFooter className="flex justify-center gap-4">
                        <Button
                            size="lg"
                            className="w-40"
                            onClick={startRecording}
                            disabled={isRecording}
                        >
                            <Mic className="mr-2 h-5 w-5" />
                            녹음 시작
                        </Button>
                        <Button
                            size="lg"
                            className="w-40"
                            onClick={triggerFileSelect}
                            variant="secondary"
                        >
                            <Upload className="mr-2 h-5 w-5" />
                            파일 업로드
                        </Button>
                    </CardFooter>
                </Card>

                <Card className="mb-6">
                    <CardHeader>
                        <CardTitle>의사 메모</CardTitle>
                        <CardDescription>진료 중 작성된 메모</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {isEditingMemo ? (
                            <div className="space-y-4">
                                <Textarea
                                    value={memo}
                                    onChange={(e) => setMemo(e.target.value)}
                                    placeholder="메모를 입력하세요..."
                                    className="min-h-[200px]"
                                />
                                <div className="flex justify-end space-x-2">
                                    <Button
                                        variant="outline"
                                        onClick={() => setIsEditingMemo(false)}
                                        disabled={isSaving}
                                    >
                                        취소
                                    </Button>
                                    <Button onClick={handleSaveMemo} disabled={isSaving}>
                                        {isSaving ? "저장 중..." : "저장"}
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <p className="whitespace-pre-wrap">{memo || "메모가 없습니다."}</p>
                                <Button variant="outline" onClick={() => setIsEditingMemo(true)}>
                                    <FileEdit className="mr-2 h-4 w-4" />
                                    메모 작성
                                </Button>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {summary && lastAppointment && (
                    <Card>
                        <CardHeader>
                            <CardTitle>최근 진료 보고서</CardTitle>
                            <CardDescription>
                                {formatDate(lastAppointment.appointmentDate)}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <dl className="space-y-4">
                                {Object.entries(summary).map(([key, value]) => (
                                    <div key={key} className="grid grid-cols-4 gap-4">
                                        <dt className="col-span-1 font-medium">{key}:</dt>
                                        <dd className="col-span-3">{String(value)}</dd>
                                    </div>
                                ))}
                            </dl>
                        </CardContent>
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
