"use client"

import { useState } from "react"
import { PatientSidebar } from "./patient-sidebar"
import { AppointmentContent } from "./appointment-content"
import { AppointmentRecorder } from "./appointment-recorder"
import { AppointmentType } from "@/types/appointmentType"

// Dummy data for appointments
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
    {
        appointmentId: 2,
        patientId: 1,
        memo: "만성요통. VAS 5/10. 척추관협착증 의심. 보존적 치료 중. 운동요법 교육. 진통제 조정.",
        script: "안녕하세요 지난번 신경차단술 후에는 어떠셨나요? 네 처음에는 많이 좋아졌는데 요즘 다시 아파지기 시작했어요 어느 정도로 아프신가요? 5점 정도요 지난번보다는 덜 아파요 어떤 자세에서 특히 아프신가요? 오래 서있거나 걷다보면 아파요 그리고 허리를 굽히면 더 아파요 MRI를 다시 한번 찍어볼까요? 네 좋습니다 MRI 결과를 보니 척추관협착증이 의심되네요 지금은 보존적 치료를 계속하고 운동요법을 배워보시죠 네 알겠습니다 허리 강화 운동을 매일 30분씩 해주시면 좋을 것 같아요 진통제도 조금 더 강한 걸로 바꿔드릴게요 2주일 후에 다시 봐볼게요 네 감사합니다",
        summary: JSON.stringify({
            "주요 증상": "만성요통, 보행시 통증",
            진단: "척추관협착증 의심",
            "처방 약물": "진통제 조정",
            "생활 지침": "허리 강화 운동 30분/일",
            "후속 조치": "보존적 치료 유지, 2주일 후 재방문",
        }),
        noShow: false,
        appointmentDate: "2024-04-25",
    },
    {
        appointmentId: 3,
        patientId: 1,
        memo: "척추관협착증 확진. VAS 6/10. 보행거리 100m. 신경성파행. 수술 권고. 수술 전 검사 진행.",
        script: "안녕하세요 오늘은 어떠신가요? 네 요즘은 걸을 때마다 다리가 저리고 아파요 얼마나 걸으실 수 있으신가요? 100m 정도 걸으면 다리가 저리고 아파서 쉬어야 해요 그 전에는 얼마나 걸으셨나요? 1km는 걸었는데 요즘은 많이 줄었어요 MRI 결과를 보니 척추관협착증이 확실하네요 수술을 고려해보시는 게 어떨까요? 수술이 꼭 필요한가요? 네 현재 증상이 계속 진행되고 있고 보행거리도 줄어들고 있어서 수술을 권고드립니다 수술 전에 필요한 검사들을 진행해볼게요 네 알겠습니다 심장기능검사와 폐기능검사를 먼저 해보시죠 수술은 2주 후에 진행하면 될 것 같아요 네 감사합니다",
        summary: JSON.stringify({
            "주요 증상": "보행시 하지 통증, 신경성파행",
            진단: "척추관협착증",
            "처방 약물": "수술 전 검사 진행",
            "생활 지침": "수술 전 준비",
            "후속 조치": "심장/폐기능검사, 2주 후 수술 예정",
        }),
        noShow: false,
        appointmentDate: "2024-04-10",
    },
]

export function AppointmentDashboard() {
    const [selectedAppointment, setSelectedAppointment] = useState<AppointmentType>(appointments[0])
    const [isNewAppointment, setIsNewAppointment] = useState<boolean>(false)

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

    return (
        <div className="flex flex-1 overflow-hidden">
            <div className="flex h-full w-64 min-w-64 flex-shrink-0 border-r bg-white">
                <PatientSidebar
                    appointments={appointments}
                    patient={{
                        patientId: 1,
                        name: "홍길동",
                        gender: 1,
                        birthday: "1990-01-01",
                        neighbourhood: "서울",
                        phone: "010-1234-5678",
                        email: "hong@example.com",
                        emergencyContact: "홍부모",
                        emergencyPhone: "010-8765-4321",
                        bloodType: "A",
                        createdAt: "2024-01-01",
                    }}
                    onSelectAppointment={handleSelectAppointment}
                    onNewAppointment={handleNewAppointment}
                    selectedAppointmentId={
                        isNewAppointment ? null : selectedAppointment?.appointmentId
                    }
                />
            </div>
            <main className="flex-1 overflow-auto bg-white">
                {isNewAppointment ? (
                    <AppointmentRecorder />
                ) : (
                    <AppointmentContent {...selectedAppointment} />
                )}
            </main>
        </div>
    )
}
