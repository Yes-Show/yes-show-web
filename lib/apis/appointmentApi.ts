import { AppointmentType } from "@/types/appointmentType"
import { api } from "./apiConfig"

export const getAppointmentsInfoByPatientId = async (
    patientId: number
): Promise<AppointmentType[]> => {
    try {
        const response = await api.get<AppointmentType[]>(`/appointment/patient/${patientId}`)
        return response.data
    } catch (error) {
        if (error instanceof Error) {
            throw new Error("진료 내역을 가져오는데 실패했습니다.")
        }
        throw error
    }
}

export const addAppointment = async (patientId: number): Promise<AppointmentType> => {
    const appointment: Omit<AppointmentType, "appointmentId"> = {
        patientId,
        memo: "",
        script: "",
        summary: "",
        noShow: false,
        appointmentDate: new Date().toISOString(),
    }
    const res = await api.post<AppointmentType>("/appointment", appointment) // TODO: 백엔드 API 뚫리면 수정
    return res.data
}

export const getScriptByAppointmentId = async (appointmentId: number): Promise<string> => {
    const res = await api.get<string>(`/appointment/${appointmentId}/script`) // TODO: 백엔드 API 뚫리면 수정
    return res.data
}

export const getSummaryByAppointmentId = async (appointmentId: number): Promise<string> => {
    const res = await api.get<string>(`/appointment/${appointmentId}/summary`) // TODO: 백엔드 API 뚫리면 수정
    return res.data
}
