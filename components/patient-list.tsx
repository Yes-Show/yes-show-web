import { PatientType } from "@/types/patientType"

// 더미 데이터
const dummyPatients: PatientType[] = Array.from({ length: 20 }, (_, index) => ({
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
}))

export function PatientList() {
    // createdAt 기준으로 정렬
    const sortedPatients = [...dummyPatients].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )

    return (
        <div className="p-6">
            <div className="rounded-lg border bg-white shadow-sm">
                <div className="p-6">
                    <h2 className="text-lg font-semibold mb-4">최근 내원 환자 목록</h2>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b">
                                    <th className="text-left p-3 font-medium text-gray-500">ID</th>
                                    <th className="text-left p-3 font-medium text-gray-500">
                                        이름
                                    </th>
                                    <th className="text-left p-3 font-medium text-gray-500">
                                        성별
                                    </th>
                                    <th className="text-left p-3 font-medium text-gray-500">
                                        생년월일
                                    </th>
                                    <th className="text-left p-3 font-medium text-gray-500">
                                        첫 내원일
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {sortedPatients.map((patient) => (
                                    <tr
                                        key={patient.patientId}
                                        className="border-b hover:bg-gray-50"
                                    >
                                        <td className="p-3">{patient.patientId}</td>
                                        <td className="p-3">{patient.name}</td>
                                        <td className="p-3">
                                            {patient.gender === 0 ? "남성" : "여성"}
                                        </td>
                                        <td className="p-3">{patient.birthday}</td>
                                        <td className="p-3">
                                            {new Date(patient.createdAt).toLocaleDateString()}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    )
}
