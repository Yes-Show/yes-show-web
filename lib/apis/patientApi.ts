import { PatientType } from "@/types/patientType"
import { api } from "./apiConfig"

export const getPatientInfoByName = async (name: string): Promise<PatientType> => {
    try {
        const response = await api.get<PatientType>(`/patient/name/${name}`)
        return response.data
    } catch (error) {
        if (error instanceof Error) {
            throw new Error("환자 정보를 가져오는데 실패했습니다.")
        }
        throw error
    }
}
