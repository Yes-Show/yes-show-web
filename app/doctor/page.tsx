"use client"

import { useState } from "react"
import { AppointmentDashboard } from "@/components/appointment-dashboard"
import { getPatientInfoByName } from "@/lib/apis/patientApi"
import { PatientType } from "@/types/patientType"
import { toast } from "sonner"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"

export default function DoctorPage() {
    const [name, setName] = useState("")
    const [loading, setLoading] = useState(false)
    const [patient, setPatient] = useState<PatientType | null>(null)

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!name.trim()) {
            toast.error("환자 이름을 입력해주세요.")
            return
        }

        setLoading(true)
        try {
            const data = await getPatientInfoByName(name)
            setPatient(data)
            toast.success("환자 정보를 찾았습니다.")
        } catch (error) {
            toast.error(
                error instanceof Error ? error.message : "환자 정보를 가져오는데 실패했습니다."
            )
            setPatient(null)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex h-screen flex-col">
            <header className="border-b px-6 py-4">
                <div className="relative mx-auto max-w-4xl">
                    <form onSubmit={handleSearch} className="relative">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="환자 이름으로 검색..."
                            className="w-full rounded-md border pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            disabled={loading}
                        />
                    </form>
                </div>
            </header>
            {patient && <AppointmentDashboard patient={patient} />}
        </div>
    )
}
