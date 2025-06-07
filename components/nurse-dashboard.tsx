"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Bell, CheckCircle, XCircle, Info } from "lucide-react"
import { AppointmentType } from "@/types/appointmentType"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { toast, Toaster } from "sonner"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { parseSummary } from "@/lib/utils/summaryParser"

// 임시 데이터
const mockAppointments: (AppointmentType & {
    patientName: string
    appointmentTime: string
    reminderCount: number
    lastReminderReceived: boolean
})[] = [
    {
        appointmentId: 1,
        patientId: 1,
        patientName: "김철수",
        memo: "요추 4-5번 추간판탈출증. 좌측 하지 방사통. VAS 7/10. MRI 상 탈출증상. 신경차단술 시행. 물리치료 2주일. 진통제 처방.",
        script: "안녕하세요 어서오세요 네 안녕하세요 어디가 불편하신가요? 네 요즘 허리가 너무 아파서요 특히 왼쪽 다리가 쭉 내려가면서 아파요 얼마나 아프신가요? 10점 만점에 7점 정도요 일상생활에 지장이 있으신가요? 네 계단 오르내리기가 힘들고 장시간 앉아있기도 힘들어요 언제부터 아프셨나요? 2주일 전부터 시작됐어요 갑자기 시작됐나요? 네 그냥 갑자기 아파지기 시작했어요 이전에 비슷한 증상이 있었나요? 아니요 처음이에요 MRI를 찍어보니 요추 4-5번 추간판탈출증이 있네요 신경차단술을 시행하고 물리치료를 받으시는 게 좋을 것 같습니다 네 알겠습니다 진통제도 처방해드릴게요 2주일 후에 다시 한번 봐볼게요 네 감사합니다",
        summary:
            "- 증상: 허리 통증으로 인해 활동에 제한이 있으며, 특히 아침에 시작되는 통증이 심합니다. 엉덩이와 허벅지까지 당기는 느낌과 쑤시는 듯한 통증이 있으며, 앉아 있을 때 허리가 뻐근하고 불편함을 느낍니다. 최근 활동량이 줄면서 체중이 증가하여 허리 통증이 심해졌습니다.\n- 진단: 허리 통증의 원인은 근육 및 신경계의 불균형으로 추정되며, 디스크 탈출이 아닌 다른 원인(관절염, 근막통증증후군 등)이 의심됩니다.\n- 치료: 도수치료, 근막 유착 해소, 신경 재교육 운동, 체형 교정, 스트레칭, 생활 습관 개선을 통해 통증을 완화하고 기능적 움직임을 회복합니다.\n- 특이사항: 환자는 척추측만증, 관절질환 오십견, 소아청소년 대상 맞춤 솔루션의 필요성을 인지하고 있습니다.\n- 환자 반응: 환자는 통증 완화와 기능 회복에 대한 기대감을 가지고 있으며, 치료 과정에 대한 적극적인 참여를 보여주고 있습니다.",
        noShow: false,
        appointmentDate: "2024-03-20",
        appointmentTime: "14:30",
        reminderCount: 2,
        lastReminderReceived: true,
    },
    {
        appointmentId: 2,
        patientId: 2,
        patientName: "이영희",
        memo: "고혈압 정기 검진",
        script: "",
        summary: JSON.stringify({
            "주요 증상": "고혈압",
            진단: "본태성 고혈압",
            "처방 약물": "고혈압 약",
            "생활 지침": "소금 섭취 제한",
            "후속 조치": "1개월 후 재방문",
        }),
        noShow: true,
        appointmentDate: "2024-03-19",
        appointmentTime: "10:00",
        reminderCount: 1,
        lastReminderReceived: false,
    },
    // 더 많은 임시 데이터 추가 가능
]

function AppointmentTable({ appointments }: { appointments: typeof mockAppointments }) {
    const [selectedAppointment, setSelectedAppointment] = useState<
        (typeof mockAppointments)[0] | null
    >(null)
    const [isDialogOpen, setIsDialogOpen] = useState(false)

    const getStatusBadge = (appointment: (typeof mockAppointments)[0]) => {
        if (appointment.noShow) {
            return (
                <Badge variant="outline" className="bg-red-100">
                    노쇼
                </Badge>
            )
        }
        return (
            <Badge variant="outline" className="bg-green-100">
                예정
            </Badge>
        )
    }

    const getNoShowRisk = (appointment: (typeof mockAppointments)[0]) => {
        // 실제로는 이전 예약 기록 등을 기반으로 계산
        const risk = Math.random() * 100
        return {
            value: risk,
            level: risk > 70 ? "high" : risk > 40 ? "medium" : "low",
        }
    }

    const handleReminder = (appointment: (typeof mockAppointments)[0]) => {
        toast.success("맞춤 리마인더를 발송 완료했습니다")
    }

    const handleViewDetails = (appointment: (typeof mockAppointments)[0]) => {
        setSelectedAppointment(appointment)
        setIsDialogOpen(true)
    }

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>환자 정보</TableHead>
                    <TableHead>예약일시</TableHead>
                    <TableHead>노쇼 위험도</TableHead>
                    <TableHead>상태</TableHead>
                    <TableHead>리마인더</TableHead>
                    <TableHead>작업</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {appointments.map((appointment) => {
                    const risk = getNoShowRisk(appointment)
                    return (
                        <TableRow key={appointment.appointmentId}>
                            <TableCell className="font-medium">
                                {appointment.patientName} (ID: {appointment.patientId})
                            </TableCell>
                            <TableCell>
                                {appointment.appointmentDate} {appointment.appointmentTime}
                            </TableCell>
                            <TableCell>
                                <Badge
                                    variant="outline"
                                    className={
                                        risk.level === "high"
                                            ? "bg-red-100"
                                            : risk.level === "medium"
                                              ? "bg-yellow-100"
                                              : "bg-green-100"
                                    }
                                >
                                    {risk.value.toFixed(1)}%
                                </Badge>
                            </TableCell>
                            <TableCell>{getStatusBadge(appointment)}</TableCell>
                            <TableCell>
                                <div className="space-y-1">
                                    <div>발송: {appointment.reminderCount}회</div>
                                    <div>
                                        수신: {appointment.lastReminderReceived ? "확인" : "미확인"}
                                    </div>
                                </div>
                            </TableCell>
                            <TableCell>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="mr-2"
                                    onClick={() => handleReminder(appointment)}
                                >
                                    <Bell className="h-4 w-4 mr-1" />
                                    리마인더
                                </Button>
                                <Dialog>
                                    <DialogTrigger asChild>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleViewDetails(appointment)}
                                        >
                                            <Info className="h-4 w-4 mr-1" />
                                            상세정보
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent className="max-w-2xl">
                                        <DialogHeader>
                                            <DialogTitle>환자 상세 정보</DialogTitle>
                                        </DialogHeader>
                                        {selectedAppointment && (
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <h3 className="font-semibold mb-2">
                                                        기본 정보
                                                    </h3>
                                                    <div className="space-y-2">
                                                        <p>
                                                            이름: {selectedAppointment.patientName}
                                                        </p>
                                                        <p>
                                                            환자 ID: {selectedAppointment.patientId}
                                                        </p>
                                                        <p>
                                                            예약일시:{" "}
                                                            {selectedAppointment.appointmentDate}{" "}
                                                            {selectedAppointment.appointmentTime}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div>
                                                    <h3 className="font-semibold mb-2">
                                                        진료 정보
                                                    </h3>
                                                    <div className="space-y-2">
                                                        {Object.entries(
                                                            parseSummary(
                                                                selectedAppointment.summary
                                                            )
                                                        ).map(([key, value]) => (
                                                            <p key={key}>
                                                                {key}: {value}
                                                            </p>
                                                        ))}
                                                    </div>
                                                </div>
                                                <div className="col-span-2">
                                                    <h3 className="font-semibold mb-2">메모</h3>
                                                    <p className="text-sm text-gray-600">
                                                        {selectedAppointment.memo}
                                                    </p>
                                                </div>
                                            </div>
                                        )}
                                    </DialogContent>
                                </Dialog>
                            </TableCell>
                        </TableRow>
                    )
                })}
            </TableBody>
        </Table>
    )
}

export function NurseDashboard() {
    const [selectedAppointment, setSelectedAppointment] = useState<
        (typeof mockAppointments)[0] | null
    >(null)
    const [isDialogOpen, setIsDialogOpen] = useState(false)

    // 오늘 날짜 기준으로 예약 분리
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const todayAppointments = mockAppointments
        .filter((appointment) => {
            const appointmentDate = new Date(appointment.appointmentDate)
            appointmentDate.setHours(0, 0, 0, 0)
            return appointmentDate.getTime() === today.getTime()
        })
        .sort(
            (a, b) => new Date(b.appointmentDate).getTime() - new Date(a.appointmentDate).getTime()
        )

    const pastAppointments = mockAppointments
        .filter((appointment) => {
            const appointmentDate = new Date(appointment.appointmentDate)
            appointmentDate.setHours(0, 0, 0, 0)
            return appointmentDate.getTime() < today.getTime()
        })
        .sort(
            (a, b) => new Date(b.appointmentDate).getTime() - new Date(a.appointmentDate).getTime()
        )

    const handleSendReminder = (appointment: (typeof mockAppointments)[0]) => {
        // 실제 구현에서는 API 호출 등을 통해 리마인더를 전송
        toast.success(`${appointment.patientName}님께 리마인더가 전송되었습니다.`)
    }

    const handleViewDetails = (appointment: (typeof mockAppointments)[0]) => {
        setSelectedAppointment(appointment)
        setIsDialogOpen(true)
    }

    return (
        <div className="p-6">
            <div className="mx-auto max-w-7xl">
                <h1 className="text-2xl font-bold mb-6">환자 관리 대시보드</h1>

                <div className="grid gap-6">
                    <Tabs defaultValue="today" className="w-full">
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="today">오늘의 예약</TabsTrigger>
                            <TabsTrigger value="past">과거 예약 기록</TabsTrigger>
                        </TabsList>
                        <TabsContent value="today">
                            <Card>
                                <CardHeader>
                                    <CardTitle>오늘의 예약 현황</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <AppointmentTable appointments={todayAppointments} />
                                </CardContent>
                            </Card>
                        </TabsContent>
                        <TabsContent value="past">
                            <Card>
                                <CardHeader>
                                    <CardTitle>과거 예약 기록</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <AppointmentTable appointments={pastAppointments} />
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
            <Toaster />

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>환자 상세 정보</DialogTitle>
                    </DialogHeader>
                    {selectedAppointment && (
                        <div className="space-y-4">
                            <div>
                                <h3 className="font-semibold">기본 정보</h3>
                                <p>환자 ID: {selectedAppointment.patientId}</p>
                                <p>환자명: {selectedAppointment.patientName}</p>
                                <p>
                                    예약 일시:{" "}
                                    {new Date(
                                        selectedAppointment.appointmentDate
                                    ).toLocaleDateString()}{" "}
                                    {selectedAppointment.appointmentTime}
                                </p>
                            </div>
                            <div>
                                <h3 className="font-semibold">진료 정보</h3>
                                <div className="space-y-2">
                                    {Object.entries(parseSummary(selectedAppointment.summary)).map(
                                        ([key, value]) => (
                                            <p key={key}>
                                                {key}: {value}
                                            </p>
                                        )
                                    )}
                                </div>
                            </div>
                            <div>
                                <h3 className="font-semibold">리마인더 정보</h3>
                                <p>전송 횟수: {selectedAppointment.reminderCount}회</p>
                                <p>
                                    마지막 수신:{" "}
                                    {selectedAppointment.lastReminderReceived ? "확인" : "미확인"}
                                </p>
                            </div>
                            <div>
                                <h3 className="font-semibold">메모</h3>
                                <p>{selectedAppointment.memo}</p>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    )
}
