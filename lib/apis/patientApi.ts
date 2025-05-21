import { PatientType } from "@/types/patientType"
import { api } from "./apiConfig"

export const getPatientInfoByName = async (name: string): Promise<PatientType> => {
    const res = await api.get<PatientType>(`/patient/name/${name}`) // TODO: 백엔드 API 뚫리면 수정
    return res.data
}
