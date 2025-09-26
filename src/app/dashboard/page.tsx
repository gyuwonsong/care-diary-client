"use client";

import { useState } from "react";
import { PatientSidebar } from "@/components/dashboard/patient-sidebar";
import { PatientContent } from "@/components/dashboard/patient-content";
import { Navbar } from "@/components/navbar";

const mockPatients = [
  {
    id: "1",
    patientId: "P001",
    name: "김XX",
    diagnosis: "우울증",
    age: 14,
    gender: "M" as const,
    recordDate: "2024-05-23",
    lastUpdated: "2024-05-23",
    lastDiaryDate: "2024-05-20",
  },
  {
    id: "2",
    patientId: "P002",
    name: "이XX",
    diagnosis: "불안장애",
    age: 12,
    gender: "M" as const,
    recordDate: "2024-05-22",
    lastUpdated: "2024-05-22",
    lastDiaryDate: "2024-05-21",
  },
  {
    id: "3",
    patientId: "P003",
    name: "김XX",
    diagnosis: "ADHD",
    age: 10,
    gender: "F" as const,
    recordDate: "2024-05-22",
    lastUpdated: "2024-05-22",
  },
  {
    id: "4",
    patientId: "P004",
    name: "박XX",
    diagnosis: "조울증",
    age: 18,
    gender: "F" as const,
    recordDate: "2024-05-20",
    lastUpdated: "2024-05-20",
    lastDiaryDate: "2024-05-18",
  },
  {
    id: "5",
    patientId: "P005",
    name: "신XX",
    diagnosis: "자폐스펙트럼장애",
    age: 8,
    gender: "M" as const,
    recordDate: "2024-05-20",
    lastUpdated: "2024-05-20",
  },
];

export default function DashboardPage() {
  const [selectedPatient, setSelectedPatient] = useState(mockPatients[0]);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredPatients = mockPatients.filter((patient) =>
    patient.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="max-h-screen bg-background w-full overflow-auto">
      <div className="flex h-[calc(100vh-64px)] overflow-hidden">
        <PatientSidebar
          patients={filteredPatients}
          selectedPatient={selectedPatient}
          onSelectPatient={setSelectedPatient}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />
        <div className="flex-1 h-full overflow-hidden">
          <PatientContent patient={selectedPatient} />
        </div>
      </div>
    </div>
  );
}
