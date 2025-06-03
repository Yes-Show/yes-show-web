"use client"

import { useState, useEffect } from "react"
import { PatientSidebar } from "./patient-sidebar"
import { AppointmentContent } from "./appointment-content"
import { AppointmentRecorder } from "./appointment-recorder"
import { AppointmentType } from "@/types/appointmentType"
import { PatientType } from "@/types/patientType"
import { getAppointmentsInfoByPatientId } from "@/lib/apis/appointmentApi"
import { toast } from "sonner"

// 더미 데이터 (주석 처리)
/*
export const appointments: AppointmentType[] = [
    {
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
    },
    // ... 나머지 더미 데이터
]
*/

interface AppointmentDashboardProps {
    patient: PatientType
}

export function AppointmentDashboard({ patient }: AppointmentDashboardProps) {
    const [appointments, setAppointments] = useState<AppointmentType[]>([])
    const [selectedAppointment, setSelectedAppointment] = useState<AppointmentType | null>(null)
    const [isNewAppointment, setIsNewAppointment] = useState<boolean>(false)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchAppointments = async () => {
            try {
                const data = await getAppointmentsInfoByPatientId(patient.patientId)
                setAppointments(data)
                if (data.length > 0) {
                    setSelectedAppointment(data[0])
                }
            } catch (error) {
                toast.error(
                    error instanceof Error ? error.message : "진료 내역을 가져오는데 실패했습니다."
                )
            } finally {
                setLoading(false)
            }
        }

        fetchAppointments()
    }, [patient.patientId])

    const handleSelectAppointment = (id: number) => {
        const appointment = appointments.find((t) => t.appointmentId === id)
        if (appointment) {
            setSelectedAppointment(appointment)
            setIsNewAppointment(false)
        }
    }

    const handleNewAppointment = () => {
        setIsNewAppointment(true)
    }

    if (loading) {
        return (
            <div className="flex flex-1 items-center justify-center">
                <p className="text-gray-500">진료 내역을 불러오는 중...</p>
            </div>
        )
    }

    return (
        <div className="flex flex-1 overflow-hidden">
            <div className="flex h-full w-64 min-w-64 flex-shrink-0 border-r bg-white">
                <PatientSidebar
                    appointments={appointments}
                    patient={patient}
                    onSelectAppointment={handleSelectAppointment}
                    onNewAppointment={handleNewAppointment}
                    selectedAppointmentId={
                        isNewAppointment ? null : (selectedAppointment?.appointmentId ?? null)
                    }
                />
            </div>
            <main className="flex-1 overflow-auto bg-white">
                {isNewAppointment ? (
                    <AppointmentRecorder />
                ) : selectedAppointment ? (
                    <AppointmentContent {...selectedAppointment} />
                ) : (
                    <div className="flex h-full items-center justify-center">
                        <p className="text-gray-500">진료 내역이 없습니다.</p>
                    </div>
                )}
            </main>
        </div>
    )
}
