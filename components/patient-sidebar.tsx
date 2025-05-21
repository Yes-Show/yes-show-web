"use client"

import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"

interface PatientSidebarProps {
    appointments: {
        id: string
        date: string
    }[]
    onSelectAppointment: (id: string) => void
    onNewAppointment: () => void
    selectedAppointmentId: string | null
}

export function PatientSidebar({
    appointments,
    onSelectAppointment,
    onNewAppointment,
    selectedAppointmentId,
}: PatientSidebarProps) {
    // Format date for display
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
        <div className="flex h-full w-full flex-col">
            {/* Header */}
            <div className="border-b">
                <div className="px-4 py-2">
                    <h2 className="text-lg font-semibold">환자: 홍길동</h2>
                    <p className="text-sm text-muted-foreground">환자번호: #12345</p>
                </div>
                <div className="px-4 pb-2">
                    <Button
                        onClick={onNewAppointment}
                        variant="default"
                        className="w-full justify-start"
                    >
                        <Plus className="mr-2 h-4 w-4" />새 진료
                    </Button>
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto">
                <div className="px-4 py-2">
                    <h3 className="mb-2 text-sm font-medium">진료 내역</h3>
                    <ul className="space-y-1">
                        {appointments.map((appointment) => (
                            <li key={appointment.id}>
                                <button
                                    className={`flex w-full items-center rounded-md px-2 py-1.5 text-sm ${
                                        appointment.id === selectedAppointmentId
                                            ? "bg-primary text-primary-foreground"
                                            : "hover:bg-muted"
                                    }`}
                                    onClick={() => onSelectAppointment(appointment.id)}
                                >
                                    <span>{formatDate(appointment.date)}</span>
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* Footer */}
            <div className="border-t p-4 mt-auto">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-xs text-muted-foreground">담당의:</p>
                        <p className="text-sm font-medium">김의사</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
