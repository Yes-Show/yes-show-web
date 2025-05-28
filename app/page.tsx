import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { UserRound, Stethoscope } from "lucide-react"
import Link from "next/link"

export default function Home() {
    return (
        <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-gray-50">
            <div className="max-w-4xl w-full space-y-8">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold mb-4">의료진 포털</h1>
                    <p className="text-gray-600">역할을 선택해주세요</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <Link href="/doctor" className="w-full">
                        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Stethoscope className="h-6 w-6" />
                                    의사
                                </CardTitle>
                                <CardDescription>환자 진료 및 상담 기록 관리</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-gray-600">
                                    진료 기록, 상담 내용 관리, 처방 관리
                                </p>
                            </CardContent>
                        </Card>
                    </Link>

                    <Link href="/nurse" className="w-full">
                        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <UserRound className="h-6 w-6" />
                                    간호사
                                </CardTitle>
                                <CardDescription>환자 예약 및 관리</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-gray-600">
                                    예약 관리, 리마인더 발송, 환자 정보 관리
                                </p>
                            </CardContent>
                        </Card>
                    </Link>
                </div>
            </div>
        </main>
    )
}
