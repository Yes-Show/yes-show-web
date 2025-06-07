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
    const now = new Date()
    const year = now.getFullYear()
    const month = (now.getMonth() + 1).toString().padStart(2, "0")
    const day = now.getDate().toString().padStart(2, "0")
    const hours = now.getHours().toString().padStart(2, "0")
    const minutes = now.getMinutes().toString().padStart(2, "0")
    const seconds = now.getSeconds().toString().padStart(2, "0")

    const appointmentDate = `${year}-${month}-${day}`
    const appointmentTime = `${hours}:${minutes}:${seconds}`

    const newAppointmentData = {
        patientId,
        memo: "",
        script: "",
        summary: "",
        noShow: false,
        appointmentDate,
        appointmentTime,
    }

    try {
        const response = await api.post<AppointmentType>("/appointment", newAppointmentData)
        return response.data
    } catch (error) {
        if (error instanceof Error) {
            throw new Error("새 진료를 추가하는데 실패했습니다.")
        }
        throw error
    }
}

export const getScriptByAppointmentId = async (appointmentId: number): Promise<string> => {
    const res = await api.get<string>(`/appointment/${appointmentId}/script`) // TODO: 백엔드 API 뚫리면 수정
    return res.data
}

export const getSummaryByAppointmentId = async (appointmentId: number): Promise<string> => {
    const res = await api.get<string>(`/appointment/${appointmentId}/summary`) // TODO: 백엔드 API 뚫리면 수정
    return res.data
}

export const addMemo = async (appointmentId: number, memo: string): Promise<void> => {
    try {
        await api.post(`/appointment/${appointmentId}/memo`, { memo })
    } catch (error) {
        if (error instanceof Error) {
            throw new Error("메모 저장에 실패했습니다.")
        }
        throw error
    }
}

export const addRecording = async (
    appointmentId: number,
    audioFile: Blob,
    onUploadProgress: (progressEvent: any) => void
): Promise<void> => {
    try {
        const formData = new FormData()
        formData.append("audio_file", audioFile)
        formData.append("appointment_id", String(appointmentId))

        await api.post("/recording/upload-with-ai", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
            onUploadProgress,
        })
    } catch (error) {
        if (error instanceof Error) {
            throw new Error("녹음 파일 업로드에 실패했습니다.")
        }
        throw error
    }
}
