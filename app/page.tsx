import { Search } from "lucide-react"
import { AppointmentDashboard } from "@/components/appointment-dashboard"
import { Input } from "@/components/ui/input"

export default function Home() {
    return (
        <div className="flex h-screen flex-col">
            <header className="border-b px-6 py-4">
                <div className="relative mx-auto max-w-4xl">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        className="w-full rounded-md border pl-10 pr-4 py-2"
                        placeholder="환자 검색..."
                        type="search"
                    />
                </div>
            </header>
            <AppointmentDashboard />
        </div>
    )
}
