"use client"

import { PatientType } from "@/types/patientType"
import { Card } from "@/components/ui/card"
import { Table } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { format } from "date-fns"
import { ko } from "date-fns/locale"

// PatientType을 확장한 타입 정의
type PatientWithSymptoms = PatientType & {
    mainSymptoms: string
}

// 더미 데이터
const dummyPatients: PatientWithSymptoms[] = Array.from({ length: 20 }, (_, index) => ({
    patientId: index + 1,
    name: `환자${index + 1}`,
    gender: index % 2,
    birthday: `199${index % 10}-${String((index % 12) + 1).padStart(2, "0")}-${String((index % 28) + 1).padStart(2, "0")}`,
    neighbourhood: `서울시 ${(index % 25) + 1}구`,
    phone: `010-${String(index).padStart(4, "0")}-${String(index + 1000).padStart(4, "0")}`,
    email: `patient${index + 1}@example.com`,
    emergencyContact: `비상연락처${index + 1}`,
    emergencyPhone: `010-${String(index + 1000).padStart(4, "0")}-${String(index).padStart(4, "0")}`,
    bloodType: ["A", "B", "O", "AB"][index % 4],
    createdAt: new Date(2024, index % 12, (index % 28) + 1).toISOString(),
    mainSymptoms: [
        "요추 추간판 탈출증",
        "척추관 협착증",
        "오십견",
        "퇴행성 관절염",
        "만성 요통",
        "척추 측만증",
        "근육 경련",
        "신경통",
        "수술 후 통증",
        "암성 통증",
        "근막 통증 증후군",
        "섬유근육통",
    ][index % 12],
}))

export function PatientList() {
    return (
        <Card className="p-6">
            <div className="overflow-x-auto">
                <Table>
                    <thead>
                        <tr className="border-b">
                            <th className="text-left py-3 px-4">환자 정보</th>
                            <th className="text-left py-3 px-4">주요 증상</th>
                            <th className="text-left py-3 px-4">연락처</th>
                            <th className="text-left py-3 px-4">주소</th>
                            <th className="text-left py-3 px-4">혈액형</th>
                            <th className="text-left py-3 px-4">최초 방문일</th>
                        </tr>
                    </thead>
                    <tbody>
                        {dummyPatients.map((patient) => (
                            <tr key={patient.patientId} className="border-b hover:bg-gray-50">
                                <td className="py-4 px-4">
                                    <div className="flex items-center gap-3">
                                        <Avatar>
                                            <AvatarFallback>
                                                {getInitials(patient.name)}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <div className="font-medium">{patient.name}</div>
                                            <div className="text-sm text-gray-500">
                                                ID: {patient.patientId} |{" "}
                                                {calculateAge(patient.birthday)}세 |{" "}
                                                {patient.gender === 0 ? "남성" : "여성"}
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td className="py-4 px-4">
                                    <Badge variant="secondary" className="text-sm">
                                        {patient.mainSymptoms}
                                    </Badge>
                                </td>
                                <td className="py-4 px-4">
                                    <div className="text-sm">
                                        <div>{patient.phone}</div>
                                        <div className="text-gray-500">{patient.email}</div>
                                    </div>
                                </td>
                                <td className="py-4 px-4">
                                    <div className="text-sm">{patient.neighbourhood}</div>
                                </td>
                                <td className="py-4 px-4">
                                    <Badge variant="outline">{patient.bloodType}형</Badge>
                                </td>
                                <td className="py-4 px-4">
                                    <div className="text-sm">
                                        {format(new Date(patient.createdAt), "yyyy년 MM월 dd일", {
                                            locale: ko,
                                        })}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </div>
        </Card>
    )
}

function getInitials(name: string) {
    return name.slice(0, 2)
}

function calculateAge(birthday: string) {
    const birthDate = new Date(birthday)
    const today = new Date()
    let age = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--
    }

    return age
}
