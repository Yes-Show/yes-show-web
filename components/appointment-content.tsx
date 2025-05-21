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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface AppointmentContentProps {
    appointment: {
        id: string
        date: string
        content: string
        summary: Record<string, string>
    }
}

export function AppointmentContent({ appointment }: AppointmentContentProps) {
    const [isEditing, setIsEditing] = useState(false)
    const [content, setContent] = useState(appointment.content)
    const [activeTab, setActiveTab] = useState("transcript")

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

    return (
        <div className="p-6 w-full">
            <div className="mx-auto max-w-4xl">
                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">진료 기록</h1>
                        <p className="text-muted-foreground">
                            날짜: {formatDate(appointment.date)}
                        </p>
                    </div>
                    <div>
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
                    </div>
                </div>

                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="mb-4">
                        <TabsTrigger value="transcript">대화록</TabsTrigger>
                        <TabsTrigger value="summary">요약</TabsTrigger>
                    </TabsList>

                    <TabsContent value="transcript">
                        {isEditing ? (
                            <Textarea
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                className="min-h-[300px] w-full"
                            />
                        ) : (
                            <Card>
                                <CardHeader>
                                    <CardTitle>진료 대화록</CardTitle>
                                    <CardDescription>의사의 녹음에서 전사된 내용</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <p className="whitespace-pre-wrap">{content}</p>
                                </CardContent>
                                <CardFooter>
                                    <Button
                                        variant="outline"
                                        onClick={() => setActiveTab("summary")}
                                        className="ml-auto"
                                    >
                                        요약 보기
                                    </Button>
                                </CardFooter>
                            </Card>
                        )}
                    </TabsContent>

                    <TabsContent value="summary">
                        <Card>
                            <CardHeader>
                                <CardTitle>진료 요약</CardTitle>
                                <CardDescription>AI가 생성한 진료 요약</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <dl className="space-y-4">
                                    {Object.entries(appointment.summary).map(([key, value]) => (
                                        <div key={key} className="grid grid-cols-4 gap-4">
                                            <dt className="col-span-1 font-medium">{key}:</dt>
                                            <dd className="col-span-3">{value}</dd>
                                        </div>
                                    ))}
                                </dl>
                            </CardContent>
                            <CardFooter>
                                <Button
                                    variant="outline"
                                    onClick={() => setActiveTab("transcript")}
                                    className="ml-auto"
                                >
                                    전체 대화 보기
                                </Button>
                            </CardFooter>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    )
}
