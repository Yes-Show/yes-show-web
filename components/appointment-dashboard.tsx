"use client"

import { useState, useEffect } from "react"
import { PatientSidebar } from "./patient-sidebar"
import { AppointmentContent } from "./appointment-content"
import { AppointmentRecorder } from "./appointment-recorder"
import { AppointmentType } from "@/types/appointmentType"
import { PatientType } from "@/types/patientType"
import { getAppointmentsInfoByPatientId, addAppointment } from "@/lib/apis/appointmentApi"
import { toast } from "sonner"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface AppointmentDashboardProps {
    patient: PatientType
}

export function AppointmentDashboard({ patient }: AppointmentDashboardProps) {
    const [appointments, setAppointments] = useState<AppointmentType[]>([])
    const [selectedAppointment, setSelectedAppointment] = useState<AppointmentType | null>(null)
    const [isNewAppointment, setIsNewAppointment] = useState<boolean>(false)
    const [loading, setLoading] = useState(true)
    const [showConfirmDialog, setShowConfirmDialog] = useState(false)

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
        setShowConfirmDialog(true)
    }

    const confirmNewAppointment = async () => {
        setShowConfirmDialog(false)
        try {
            const newAppointment = await addAppointment(patient.patientId)
            setAppointments((prev) => [newAppointment, ...prev])
            setSelectedAppointment(newAppointment)
            setIsNewAppointment(true)
            toast.success("새 진료가 추가되었습니다.")
        } catch (error) {
            toast.error(
                error instanceof Error ? error.message : "새 진료를 추가하는데 실패했습니다."
            )
        }
    }

    const handleUploadComplete = async () => {
        if (!selectedAppointment) return

        try {
            const updatedAppointments = await getAppointmentsInfoByPatientId(patient.patientId)
            setAppointments(updatedAppointments)

            const newlyAddedAppointment = updatedAppointments.find(
                (a) => a.appointmentId === selectedAppointment.appointmentId
            )

            if (newlyAddedAppointment) {
                setSelectedAppointment(newlyAddedAppointment)
            } else {
                // 만약 방금 추가한 진료가 목록에 없다면, 목록의 첫번째 항목을 선택
                setSelectedAppointment(updatedAppointments[0] || null)
            }

            setIsNewAppointment(false)
        } catch (error) {
            toast.error(
                error instanceof Error ? error.message : "진료 내역을 다시 불러오는데 실패했습니다."
            )
            // 에러가 발생하더라도 녹음 화면은 닫습니다.
            setIsNewAppointment(false)
        }
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
                {isNewAppointment && selectedAppointment ? (
                    <AppointmentRecorder
                        newAppointment={selectedAppointment}
                        previousAppointments={appointments.filter(
                            (a) => a.appointmentId !== selectedAppointment.appointmentId
                        )}
                        onUploadComplete={handleUploadComplete}
                    />
                ) : selectedAppointment ? (
                    <AppointmentContent {...selectedAppointment} />
                ) : (
                    <div className="flex h-full items-center justify-center">
                        <p className="text-gray-500">진료 내역이 없습니다.</p>
                    </div>
                )}
            </main>
            <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>새 진료 추가</AlertDialogTitle>
                        <AlertDialogDescription>새 진료를 추가하시겠습니까?</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>취소</AlertDialogCancel>
                        <AlertDialogAction onClick={confirmNewAppointment}>확인</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}
