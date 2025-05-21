"use client"

import { useState } from "react"
import { FileEdit, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { AppointmentType } from "@/types/appointmentType"

export function AppointmentContent(appointment: AppointmentType) {
    const [isEditing, setIsEditing] = useState(false)
    const [content, setContent] = useState(appointment.memo)
    const [showFullTranscript, setShowFullTranscript] = useState(false)

    const handleSave = () => {
        setIsEditing(false)
        // In a real app, you would save the changes to the server here
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

    const summary = appointment.summary ? JSON.parse(appointment.summary) : {}

    return (
        <div className="p-6 w-full">
            <div className="mx-auto max-w-4xl">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold">진료 기록</h1>
                    <p className="text-muted-foreground">
                        날짜: {formatDate(appointment.appointmentDate)}
                    </p>
                </div>

                <div className="space-y-6">
                    {/* 의사 메모 카드 */}
                    <Card>
                        <CardHeader>
                            <CardTitle>의사 메모</CardTitle>
                            <CardDescription>진료 중 작성된 메모</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="whitespace-pre-wrap">{appointment.memo}</p>
                        </CardContent>
                    </Card>

                    {/* 진찰 보고서 카드 */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle>진찰 보고서</CardTitle>
                                <CardDescription>AI가 생성한 진료 요약</CardDescription>
                            </div>
                            {isEditing ? (
                                <Button onClick={handleSave}>
                                    <Save className="mr-2 h-4 w-4" />
                                    저장
                                </Button>
                            ) : (
                                <Button variant="outline" onClick={() => setIsEditing(true)}>
                                    <FileEdit className="mr-2 h-4 w-4" />
                                    수정
                                </Button>
                            )}
                        </CardHeader>
                        <CardContent>
                            {isEditing ? (
                                <Textarea
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                    className="min-h-[200px] w-full"
                                />
                            ) : (
                                <dl className="space-y-4">
                                    {Object.entries(summary).map(([key, value]) => (
                                        <div key={key} className="grid grid-cols-4 gap-4">
                                            <dt className="col-span-1 font-medium">{key}:</dt>
                                            <dd className="col-span-3">{String(value)}</dd>
                                        </div>
                                    ))}
                                </dl>
                            )}
                        </CardContent>
                        <CardFooter>
                            <Button
                                variant="outline"
                                onClick={() => setShowFullTranscript(true)}
                                className="ml-auto"
                            >
                                전체 대화 보기
                            </Button>
                        </CardFooter>
                    </Card>
                </div>
            </div>

            {/* 전체 대화록 모달 */}
            {showFullTranscript && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg w-full max-w-4xl max-h-[80vh] flex flex-col">
                        <div className="p-6 border-b flex justify-between items-center">
                            <h2 className="text-xl font-bold">진료 대화록</h2>
                            <Button
                                variant="ghost"
                                onClick={() => setShowFullTranscript(false)}
                                className="h-8 w-8 p-0"
                            >
                                ✕
                            </Button>
                        </div>
                        <div className="p-6 overflow-y-auto flex-1">
                            <p className="whitespace-pre-wrap">{appointment.script}</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
