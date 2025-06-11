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
    {
        appointmentId: 3,
        patientId: 3,
        patientName: "박지민",
        memo: "요추 추간판 탈출증 의심. MRI 촬영 필요. 통증 부위: L4-L5, 우측 방사통. VAS 6-7/10. 신경학적 검사에서 우측 SLR test 양성.",
        script: "안녕하세요 어서오세요 네 안녕하세요 어디가 불편하신가요? 네 요즘 허리가 너무 아파서요 특히 오른쪽 다리가 쭉 내려가면서 아파요 얼마나 아프신가요? 10점 만점에 6-7점 정도요 일상생활에 지장이 있으신가요? 네 계단 오르내리기가 힘들고 장시간 앉아있기도 힘들어요 언제부터 아프셨나요? 2주일 전부터 시작됐어요 갑자기 시작됐나요? 네 그냥 갑자기 아파지기 시작했어요 이전에 비슷한 증상이 있었나요? 아니요 처음이에요 MRI를 찍어보니 요추 4-5번 추간판탈출증이 의심됩니다. MRI 촬영을 통해 정확한 진단을 내릴 예정입니다.",
        summary:
            "- 증상: 허리 통증으로 인해 활동에 제한이 있으며, 특히 오른쪽 다리로 방사되는 통증이 심합니다. VAS 6-7/10 정도의 통증이 있으며, 움직임 시 8-9/10까지 증가합니다.\n- 진단: 요추 추간판 탈출증이 의심되며, MRI 촬영을 통해 정확한 진단이 필요합니다.\n- 치료: MRI 결과에 따라 신경차단술 및 물리치료를 고려할 예정입니다.\n- 특이사항: 우측 SLR test가 양성이며, 신경학적 검사에서 이상 소견이 있습니다.\n- 환자 반응: 환자는 통증 완화를 위해 적극적인 치료를 원하고 있습니다.",
        noShow: false,
        appointmentDate: "2025-06-12",
        appointmentTime: "09:00",
        reminderCount: 1,
        lastReminderReceived: true,
    },
    {
        appointmentId: 4,
        patientId: 4,
        patientName: "최수진",
        memo: "경추 추간판 탈출증 의심. 경추 MRI 촬영 필요. 통증 부위: C5-C6, 우측 방사통. VAS 5-6/10. 신경학적 검사에서 우측 Spurling test 양성.",
        script: "안녕하세요 어서오세요 네 안녕하세요 어디가 불편하신가요? 네 목이 너무 아파서 고개를 돌리기도 힘들어요 얼마나 아프신가요? 10점 만점에 5-6점 정도요 일상생활에 지장이 있으신가요? 네 고개를 돌리기가 힘들고 팔이 저려요 언제부터 아프셨나요? 일주일 전부터 시작됐어요 갑자기 시작됐나요? 네 아침에 일어나니 목이 뻐근하고 아파서 고개를 돌릴 수가 없었어요 이전에 비슷한 증상이 있었나요? 아니요 처음이에요 경추 MRI를 찍어보니 경추 5-6번 추간판탈출증이 의심됩니다. 경추 MRI 촬영을 통해 정확한 진단을 내릴 예정입니다.",
        summary:
            "- 증상: 경부 통증으로 인해 활동에 제한이 있으며, 특히 우측 상지로 방사되는 통증이 심합니다. VAS 5-6/10 정도의 통증이 있으며, 경부 회전 시 7-8/10까지 증가합니다.\n- 진단: 경추 추간판 탈출증이 의심되며, 경추 MRI 촬영을 통해 정확한 진단이 필요합니다.\n- 치료: MRI 결과에 따라 신경차단술 및 물리치료를 고려할 예정입니다.\n- 특이사항: 우측 Spurling test가 양성이며, 신경학적 검사에서 이상 소견이 있습니다.\n- 환자 반응: 환자는 통증 완화를 위해 적극적인 치료를 원하고 있습니다.",
        noShow: false,
        appointmentDate: "2025-06-12",
        appointmentTime: "10:00",
        reminderCount: 1,
        lastReminderReceived: true,
    },
    {
        appointmentId: 5,
        patientId: 5,
        patientName: "정민수",
        memo: "오십견 의심. 초음파 검사 필요. 통증 부위: 우측 견관절, 야간통 동반. VAS 7-8/10. 신체검사에서 우측 견관절 외전 제한, 내회전 제한.",
        script: "안녕하세요 어서오세요 네 안녕하세요 어디가 불편하신가요? 네 오른쪽 어깨가 너무 아파서 팔을 들 수가 없어요 얼마나 아프신가요? 10점 만점에 7-8점 정도요 일상생활에 지장이 있으신가요? 네 팔을 들 수가 없고 야간에 통증이 심해요 언제부터 아프셨나요? 3주일 전부터 시작됐어요 갑자기 시작됐나요? 네 처음에는 그냥 조금 불편한 정도였는데 점점 심해졌어요 이전에 비슷한 증상이 있었나요? 아니요 처음이에요 초음파 검사를 해보니 오십견이 의심됩니다. 초음파 검사를 통해 정확한 진단을 내릴 예정입니다.",
        summary:
            "- 증상: 우측 견관절 통증으로 인해 활동에 제한이 있으며, 특히 야간통이 심합니다. VAS 7-8/10 정도의 통증이 있으며, 상지 거상 시 9-10/10까지 증가합니다.\n- 진단: 오십견이 의심되며, 초음파 검사를 통해 정확한 진단이 필요합니다.\n- 치료: 초음파 결과에 따라 관절 내 주사 및 물리치료를 고려할 예정입니다.\n- 특이사항: 우측 견관절의 외전 및 내회전 제한이 있으며, 야간통을 동반합니다.\n- 환자 반응: 환자는 통증 완화를 위해 적극적인 치료를 원하고 있습니다.",
        noShow: false,
        appointmentDate: "2025-06-12",
        appointmentTime: "11:00",
        reminderCount: 1,
        lastReminderReceived: true,
    },
    {
        appointmentId: 6,
        patientId: 6,
        patientName: "강지원",
        memo: "퇴행성 관절염 의심. X-ray 촬영 필요. 통증 부위: 우측 슬관절, 계단 보행 시 통증 악화. VAS 6-7/10. 신체검사에서 우측 슬관절 압통, 관절음 동반.",
        script: "안녕하세요 어서오세요 네 안녕하세요 어디가 불편하신가요? 네 오른쪽 무릎이 너무 아파서 계단을 오르내리기가 힘들어요 얼마나 아프신가요? 10점 만점에 6-7점 정도요 일상생활에 지장이 있으신가요? 네 계단을 오르내리기가 힘들고 무릎에서 소리가 나요 언제부터 아프셨나요? 1달 전부터 시작됐어요 갑자기 시작됐나요? 네 처음에는 그냥 조금 불편한 정도였는데 점점 심해졌어요 이전에 비슷한 증상이 있었나요? 아니요 처음이에요 X-ray를 찍어보니 퇴행성 관절염이 의심됩니다. X-ray 촬영을 통해 정확한 진단을 내릴 예정입니다.",
        summary:
            "- 증상: 우측 슬관절 통증으로 인해 활동에 제한이 있으며, 특히 계단 보행 시 통증이 악화됩니다. VAS 6-7/10 정도의 통증이 있으며, 계단 보행 시 8-9/10까지 증가합니다.\n- 진단: 퇴행성 관절염이 의심되며, X-ray 촬영을 통해 정확한 진단이 필요합니다.\n- 치료: X-ray 결과에 따라 관절 내 주사 및 물리치료를 고려할 예정입니다.\n- 특이사항: 우측 슬관절의 압통이 있으며, 관절음이 동반됩니다.\n- 환자 반응: 환자는 통증 완화를 위해 적극적인 치료를 원하고 있습니다.",
        noShow: false,
        appointmentDate: "2025-06-12",
        appointmentTime: "14:00",
        reminderCount: 1,
        lastReminderReceived: true,
    },
    {
        appointmentId: 7,
        patientId: 7,
        patientName: "윤서연",
        memo: "외측 인대 손상 의심. 초음파 검사 필요. 통증 부위: 좌측 발목 외측, 부종 동반. VAS 5-6/10. 신체검사에서 좌측 발목 외측 압통, 전방 전위 검사 양성.",
        script: "안녕하세요 어서오세요 네 안녕하세요 어디가 불편하신가요? 네 왼쪽 발목이 너무 아파서 걷기가 힘들어요 얼마나 아프신가요? 10점 만점에 5-6점 정도요 일상생활에 지장이 있으신가요? 네 걷기가 힘들고 발목이 부어있어요 언제부터 아프셨나요? 2주일 전에 농구하다가 발목을 접질렸어요 갑자기 시작됐나요? 네 농구하다가 갑자기 발목을 접질렸어요 이전에 비슷한 증상이 있었나요? 아니요 처음이에요 초음파 검사를 해보니 외측 인대 손상이 의심됩니다. 초음파 검사를 통해 정확한 진단을 내릴 예정입니다.",
        summary:
            "- 증상: 좌측 발목 통증으로 인해 활동에 제한이 있으며, 특히 부종이 동반됩니다. VAS 5-6/10 정도의 통증이 있으며, 보행 시 7-8/10까지 증가합니다.\n- 진단: 외측 인대 손상이 의심되며, 초음파 검사를 통해 정확한 진단이 필요합니다.\n- 치료: 초음파 결과에 따라 보조기 착용 및 물리치료를 고려할 예정입니다.\n- 특이사항: 좌측 발목 외측의 압통이 있으며, 전방 전위 검사가 양성입니다.\n- 환자 반응: 환자는 통증 완화를 위해 적극적인 치료를 원하고 있습니다.",
        noShow: false,
        appointmentDate: "2025-06-12",
        appointmentTime: "15:00",
        reminderCount: 1,
        lastReminderReceived: true,
    },
    {
        appointmentId: 8,
        patientId: 8,
        patientName: "한지훈",
        memo: "수근관 증후군 의심. 신경전도 검사 필요. 통증 부위: 우측 손목, 야간통 동반. VAS 6-7/10. 신체검사에서 우측 Phalen test 양성, Tinel sign 양성.",
        script: "안녕하세요 어서오세요 네 안녕하세요 어디가 불편하신가요? 네 오른쪽 손목이 너무 아파서 물건을 잡기가 힘들어요 얼마나 아프신가요? 10점 만점에 6-7점 정도요 일상생활에 지장이 있으신가요? 네 물건을 잡기가 힘들고 손가락이 저려요 언제부터 아프셨나요? 1달 전부터 시작됐어요 갑자기 시작됐나요? 네 처음에는 그냥 조금 불편한 정도였는데 점점 심해졌어요 이전에 비슷한 증상이 있었나요? 아니요 처음이에요 신경전도 검사를 해보니 수근관 증후군이 의심됩니다. 신경전도 검사를 통해 정확한 진단을 내릴 예정입니다.",
        summary:
            "- 증상: 우측 손목 통증으로 인해 활동에 제한이 있으며, 특히 야간통이 심합니다. VAS 6-7/10 정도의 통증이 있으며, 물건을 잡을 때 8-9/10까지 증가합니다.\n- 진단: 수근관 증후군이 의심되며, 신경전도 검사를 통해 정확한 진단이 필요합니다.\n- 치료: 신경전도 검사 결과에 따라 수근관 주사 및 물리치료를 고려할 예정입니다.\n- 특이사항: 우측 Phalen test와 Tinel sign이 양성이며, 야간통을 동반합니다.\n- 환자 반응: 환자는 통증 완화를 위해 적극적인 치료를 원하고 있습니다.",
        noShow: false,
        appointmentDate: "2025-06-12",
        appointmentTime: "16:00",
        reminderCount: 1,
        lastReminderReceived: true,
    },
    {
        appointmentId: 9,
        patientId: 9,
        patientName: "송미나",
        memo: "오십견 의심. 초음파 검사 필요. 통증 부위: 좌측 견관절, 야간통 동반. VAS 7-8/10. 신체검사에서 좌측 견관절 외전 제한, 내회전 제한.",
        script: "안녕하세요 어서오세요 네 안녕하세요 어디가 불편하신가요? 네 왼쪽 어깨가 너무 아파서 팔을 들 수가 없어요 얼마나 아프신가요? 10점 만점에 7-8점 정도요 일상생활에 지장이 있으신가요? 네 팔을 들 수가 없고 야간에 통증이 심해요 언제부터 아프셨나요? 1달 전부터 시작됐어요 갑자기 시작됐나요? 네 처음에는 그냥 조금 불편한 정도였는데 점점 심해졌어요 이전에 비슷한 증상이 있었나요? 아니요 처음이에요 초음파 검사를 해보니 오십견이 의심됩니다. 초음파 검사를 통해 정확한 진단을 내릴 예정입니다.",
        summary:
            "- 증상: 좌측 견관절 통증으로 인해 활동에 제한이 있으며, 특히 야간통이 심합니다. VAS 7-8/10 정도의 통증이 있으며, 상지 거상 시 9-10/10까지 증가합니다.\n- 진단: 오십견이 의심되며, 초음파 검사를 통해 정확한 진단이 필요합니다.\n- 치료: 초음파 결과에 따라 관절 내 주사 및 물리치료를 고려할 예정입니다.\n- 특이사항: 좌측 견관절의 외전 및 내회전 제한이 있으며, 야간통을 동반합니다.\n- 환자 반응: 환자는 통증 완화를 위해 적극적인 치료를 원하고 있습니다.",
        noShow: false,
        appointmentDate: "2025-06-12",
        appointmentTime: "17:00",
        reminderCount: 1,
        lastReminderReceived: true,
    },
    {
        appointmentId: 10,
        patientId: 10,
        patientName: "임재현",
        memo: "족부 건막염 의심. X-ray 촬영 필요. 통증 부위: 우측 제1족지, 부종 동반. VAS 6-7/10. 신체검사에서 우측 제1족지 압통, 신전 시 통증 악화.",
        script: "안녕하세요 어서오세요 네 안녕하세요 어디가 불편하신가요? 네 오른쪽 발가락이 너무 아파서 걷기가 힘들어요 얼마나 아프신가요? 10점 만점에 6-7점 정도요 일상생활에 지장이 있으신가요? 네 걷기가 힘들고 발가락이 부어있어요 언제부터 아프셨나요? 2주일 전부터 시작됐어요 갑자기 시작됐나요? 네 처음에는 그냥 조금 불편한 정도였는데 점점 심해졌어요 이전에 비슷한 증상이 있었나요? 아니요 처음이에요 X-ray를 찍어보니 족부 건막염이 의심됩니다. X-ray 촬영을 통해 정확한 진단을 내릴 예정입니다.",
        summary:
            "- 증상: 우측 제1족지 통증으로 인해 활동에 제한이 있으며, 특히 부종이 동반됩니다. VAS 6-7/10 정도의 통증이 있으며, 보행 시 8-9/10까지 증가합니다.\n- 진단: 족부 건막염이 의심되며, X-ray 촬영을 통해 정확한 진단이 필요합니다.\n- 치료: X-ray 결과에 따라 보조기 착용 및 물리치료를 고려할 예정입니다.\n- 특이사항: 우측 제1족지의 압통이 있으며, 신전 시 통증이 악화됩니다.\n- 환자 반응: 환자는 통증 완화를 위해 적극적인 치료를 원하고 있습니다.",
        noShow: false,
        appointmentDate: "2025-06-12",
        appointmentTime: "18:00",
        reminderCount: 1,
        lastReminderReceived: true,
    },
]

function AppointmentTable({ appointments }: { appointments: typeof mockAppointments }) {
    const [selectedAppointment, setSelectedAppointment] = useState<
        (typeof mockAppointments)[0] | null
    >(null)
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [appointmentList, setAppointmentList] = useState(appointments)
    const [riskValues, setRiskValues] = useState<Record<number, number>>(() => {
        // 초기 위험도 값 설정
        const initialRisks: Record<number, number> = {}
        appointments.forEach((appointment) => {
            const random = Math.random()
            let risk: number

            if (random < 0.8) {
                risk = Math.floor(Math.random() * 20) + 10 // 10-30%
            } else if (random < 0.95) {
                risk = Math.floor(Math.random() * 39) + 31 // 31-69%
            } else {
                risk = Math.floor(Math.random() * 31) + 70 // 70-100%
            }

            initialRisks[appointment.appointmentId] = risk
        })
        return initialRisks
    })

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
        const risk = riskValues[appointment.appointmentId]
        return {
            value: risk,
            level: risk > 70 ? "high" : risk > 40 ? "medium" : "low",
        }
    }

    const handleReminder = (appointment: (typeof mockAppointments)[0]) => {
        // 리마인더 발송 시 해당 환자의 위험도 감소
        setRiskValues((prev) => ({
            ...prev,
            [appointment.appointmentId]: Math.max(10, prev[appointment.appointmentId] - 15), // 최소 10%까지 감소
        }))

        // 리마인더 카운트 증가 및 수신 상태 변경
        setAppointmentList((prevList) =>
            prevList.map((item) =>
                item.appointmentId === appointment.appointmentId
                    ? {
                          ...item,
                          reminderCount: item.reminderCount + 1,
                          lastReminderReceived: false,
                      }
                    : item
            )
        )
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
                {appointmentList.map((appointment) => {
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
