export interface AppointmentType {
    appointmentId: number
    patientId: number
    memo: string
    script: string
    summary: string
    noShow: boolean
    appointmentDate: string
}
