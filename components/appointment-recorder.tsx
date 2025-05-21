"use client"

import { useState, useRef, useEffect } from "react"
import { Mic, MicOff, Upload, FileEdit, Save } from "lucide-react"
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

// 임시로 최근 진료 데이터 사용
const lastAppointment: AppointmentType = {
    appointmentId: 1,
    patientId: 1,
    memo: "요추 4-5번 추간판탈출증. 좌측 하지 방사통. VAS 7/10. MRI 상 탈출증상. 신경차단술 시행. 물리치료 2주일. 진통제 처방.",
    script: "안녕하세요 어서오세요 네 안녕하세요 어디가 불편하신가요? 네 요즘 허리가 너무 아파서요 특히 왼쪽 다리가 쭉 내려가면서 아파요 얼마나 아프신가요? 10점 만점에 7점 정도요 일상생활에 지장이 있으신가요? 네 계단 오르내리기가 힘들고 장시간 앉아있기도 힘들어요 언제부터 아프셨나요? 2주일 전부터 시작됐어요 갑자기 시작됐나요? 네 그냥 갑자기 아파지기 시작했어요 이전에 비슷한 증상이 있었나요? 아니요 처음이에요 MRI를 찍어보니 요추 4-5번 추간판탈출증이 있네요 신경차단술을 시행하고 물리치료를 받으시는 게 좋을 것 같습니다 네 알겠습니다 진통제도 처방해드릴게요 2주일 후에 다시 한번 봐볼게요 네 감사합니다",
    summary: JSON.stringify({
        "주요 증상": "요추 4-5번 추간판탈출증, 좌측 하지 방사통",
        진단: "요추 4-5번 추간판탈출증",
        "처방 약물": "진통제",
        "생활 지침": "물리치료 2주일",
        "후속 조치": "신경차단술 시행, 2주일 후 재방문",
    }),
    noShow: false,
    appointmentDate: "2024-05-08",
}

export function AppointmentRecorder() {
    const [isRecording, setIsRecording] = useState(false)
    const [recordingTime, setRecordingTime] = useState(0)
    const [isUploading, setIsUploading] = useState(false)
    const [uploadProgress, setUploadProgress] = useState(0)
    const [isProcessing, setIsProcessing] = useState(false)
    const [uploadComplete, setUploadComplete] = useState(false)
    const [audioBlob, setAudioBlob] = useState<Blob | null>(null)
    const [memo, setMemo] = useState("")
    const [isEditingMemo, setIsEditingMemo] = useState(false)

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

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr)
        return date.toLocaleDateString("ko-KR", {
            year: "numeric",
            month: "long",
            day: "numeric",
            weekday: "short",
        })
    }

    const summary = JSON.parse(lastAppointment.summary)

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

                {/* 메모 작성 카드 */}
                <Card className="mb-6">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle>진료 메모</CardTitle>
                            <CardDescription>진료 중 작성할 메모</CardDescription>
                        </div>
                        {isEditingMemo ? (
                            <Button onClick={() => setIsEditingMemo(false)}>
                                <Save className="mr-2 h-4 w-4" />
                                저장
                            </Button>
                        ) : (
                            <Button variant="outline" onClick={() => setIsEditingMemo(true)}>
                                <FileEdit className="mr-2 h-4 w-4" />
                                수정
                            </Button>
                        )}
                    </CardHeader>
                    <CardContent>
                        {isEditingMemo ? (
                            <Textarea
                                value={memo}
                                onChange={(e) => setMemo(e.target.value)}
                                className="min-h-[200px] w-full"
                                placeholder="진료 중 작성할 메모를 입력하세요..."
                            />
                        ) : (
                            <p className="whitespace-pre-wrap">
                                {memo || "아직 작성된 메모가 없습니다."}
                            </p>
                        )}
                    </CardContent>
                </Card>

                {/* 최근 진료 보고서 카드 */}
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
