"use client";

import { useState } from "react";
import { PatientSidebar } from "./patient-sidebar";
import { TreatmentContent } from "./treatment-content";
import { TreatmentRecorder } from "./treatment-recorder";

interface Treatment {
    id: string;
    date: string;
    content: string;
    summary: Record<string, string>;
}

// Dummy data for treatments
export const treatments: Treatment[] = [
    {
        id: "1",
        date: "2024-05-08",
        content:
            "Patient presented with mild fever and cough for 3 days. Prescribed antibiotics and recommended rest for the week. Follow-up in 5 days if symptoms persist.",
        summary: {
            Symptoms: "Mild fever and cough for 3 days",
            Diagnosis: "Upper respiratory infection",
            Treatment: "Prescribed antibiotics",
            Recommendations: "Rest for the week, follow-up in 5 days if symptoms persist",
        },
    },
    {
        id: "2",
        date: "2024-04-25",
        content:
            "Follow-up for hypertension. Blood pressure readings within normal range (130/85). Current medication seems effective. Recommend continuing same dosage and scheduling a follow-up in 3 months.",
        summary: {
            Purpose: "Follow-up for hypertension",
            Vitals: "Blood pressure 130/85 (within normal range)",
            Assessment: "Current medication is effective",
            Plan: "Continue same dosage, follow-up in 3 months",
        },
    },
    {
        id: "3",
        date: "2024-04-10",
        content:
            "Annual checkup. All vital signs normal. Blood work showed slightly elevated cholesterol. Recommended dietary changes and increased physical activity. No medications prescribed at this time.",
        summary: {
            Purpose: "Annual checkup",
            Findings: "All vital signs normal, slightly elevated cholesterol",
            Recommendations: "Dietary changes and increased physical activity",
            Medications: "None prescribed",
        },
    },
];

export function TreatmentDashboard() {
    const [selectedTreatment, setSelectedTreatment] = useState<Treatment>(treatments[0]);
    const [isNewTreatment, setIsNewTreatment] = useState<boolean>(false);

    const handleSelectTreatment = (id: string) => {
        const treatment = treatments.find((t) => t.id === id);
        if (treatment) {
            setSelectedTreatment(treatment);
            setIsNewTreatment(false);
        }
    };

    const handleNewTreatment = () => {
        setIsNewTreatment(true);
    };

    return (
        <div className="flex flex-1 overflow-hidden">
            <div className="flex h-full w-64 min-w-64 flex-shrink-0 border-r bg-white">
                <PatientSidebar
                    treatments={treatments}
                    onSelectTreatment={handleSelectTreatment}
                    onNewTreatment={handleNewTreatment}
                    selectedTreatmentId={isNewTreatment ? null : selectedTreatment?.id}
                />
            </div>
            <main className="flex-1 overflow-auto bg-white">
                {isNewTreatment ? (
                    <TreatmentRecorder />
                ) : (
                    <TreatmentContent treatment={selectedTreatment} />
                )}
            </main>
        </div>
    );
}
