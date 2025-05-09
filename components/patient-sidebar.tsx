"use client";

import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PatientSidebarProps {
    treatments: {
        id: string;
        date: string;
    }[];
    onSelectTreatment: (id: string) => void;
    onNewTreatment: () => void;
    selectedTreatmentId: string | null;
}

export function PatientSidebar({
    treatments,
    onSelectTreatment,
    onNewTreatment,
    selectedTreatmentId,
}: PatientSidebarProps) {
    // Format date for display
    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    return (
        <div className="flex h-full w-full flex-col">
            {/* Header */}
            <div className="border-b">
                <div className="px-4 py-2">
                    <h2 className="text-lg font-semibold">Patient: John Doe</h2>
                    <p className="text-sm text-muted-foreground">ID: #12345</p>
                </div>
                <div className="px-4 pb-2">
                    <Button
                        onClick={onNewTreatment}
                        variant="default"
                        className="w-full justify-start"
                    >
                        <Plus className="mr-2 h-4 w-4" />
                        New Treatment
                    </Button>
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto">
                <div className="px-4 py-2">
                    <h3 className="mb-2 text-sm font-medium">Treatment History</h3>
                    <ul className="space-y-1">
                        {treatments.map((treatment) => (
                            <li key={treatment.id}>
                                <button
                                    className={`flex w-full items-center rounded-md px-2 py-1.5 text-sm ${
                                        treatment.id === selectedTreatmentId
                                            ? "bg-primary text-primary-foreground"
                                            : "hover:bg-muted"
                                    }`}
                                    onClick={() => onSelectTreatment(treatment.id)}
                                >
                                    <span>{formatDate(treatment.date)}</span>
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
                        <p className="text-xs text-muted-foreground">Doctor:</p>
                        <p className="text-sm font-medium">Dr. Smith</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
