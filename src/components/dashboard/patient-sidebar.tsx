"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Search, Plus, MoreVertical, Edit, Trash2, Eye } from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface Patient {
  id: string;
  patientId: string;
  name: string;
  diagnosis: string;
  age: number;
  gender: "M" | "F";
  recordDate: string;
  lastUpdated: string;
  lastDiaryDate?: string;
}

interface PatientSidebarProps {
  patients: Patient[];
  selectedPatient: Patient;
  onSelectPatient: (patient: Patient) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export function PatientSidebar({
  patients,
  selectedPatient,
  onSelectPatient,
  searchQuery,
  onSearchChange,
}: PatientSidebarProps) {
  const [showAddPatientModal, setShowAddPatientModal] = useState(false);
  const [showEditPatientModal, setShowEditPatientModal] = useState(false);
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null);
  const [deletingPatient, setDeletingPatient] = useState<Patient | null>(null);
  const [newPatient, setNewPatient] = useState({
    patientId: "",
    name: "",
    diagnosis: "",
    age: "",
    gender: "M" as "M" | "F",
  });

  const getPatientSurname = (name: string) => {
    return name.charAt(0);
  };

  const handleAddPatient = () => {
    console.log("[v0] New patient registration:", newPatient);
    setShowAddPatientModal(false);
    setNewPatient({
      patientId: "",
      name: "",
      diagnosis: "",
      age: "",
      gender: "M",
    });
  };

  const handleEditPatient = (patient: Patient) => {
    setEditingPatient(patient);
    setNewPatient({
      patientId: patient.patientId,
      name: patient.name,
      diagnosis: patient.diagnosis,
      age: patient.age.toString(),
      gender: patient.gender,
    });
    setShowEditPatientModal(true);
  };

  const handleDeletePatient = (patient: Patient) => {
    setDeletingPatient(patient);
    setShowDeleteConfirmModal(true);
  };

  const confirmDeletePatient = () => {
    console.log("[v0] Deleting patient:", deletingPatient);
    setShowDeleteConfirmModal(false);
    setDeletingPatient(null);
  };

  const handleUpdatePatient = () => {
    console.log(
      "[v0] Updating patient:",
      editingPatient,
      "with data:",
      newPatient,
    );
    setShowEditPatientModal(false);
    setEditingPatient(null);
    setNewPatient({
      patientId: "",
      name: "",
      diagnosis: "",
      age: "",
      gender: "M",
    });
  };

  return (
    <>
      <div className="w-90 min-w-90 bg-muted border-r border-sidebar-border flex flex-col h-full">
        <div className="p-6 pt-5 border-b border-sidebar-border">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-sidebar-foreground">
              환자 목록
            </h2>
            <Button onClick={() => setShowAddPatientModal(true)}>
              <Plus className="h-4 w-4 mr-1" />
              환자 등록
            </Button>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="환자 이름 검색"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10 bg-background border-border rounded-sm text-sm"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="p-4">
            <div className="space-y-3">
              {patients.map((patient) => (
                <Card
                  key={patient.id}
                  className={cn(
                    "p-4 cursor-pointer transition-all duration-200 hover:shadow-md bg-white rounded-sm",
                    selectedPatient.id === patient.id
                      ? "border border-primary shadow-sm bg-primary/5"
                      : "border border-transparent hover:border-border",
                  )}
                  onClick={() => onSelectPatient(patient)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-1">
                      <Avatar className="h-8 w-8 ring-1 ring-primary/50">
                        <AvatarFallback className="font-semilight text-xs bg-primary/10 text-primary">
                          {getPatientSurname(patient.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col flex-1 gap-1">
                        <div className="font-semibold text-sm text-foreground">
                          {patient.name} ({patient.patientId})
                        </div>
                        <div className="text-xs text-gray-400">
                          나이: {patient.age}, 성별:{" "}
                          {patient.gender === "M" ? "남성" : "여성"}
                        </div>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 hover:bg-gray-100"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectPatient(patient);
                          }}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          환자 정보 보기
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditPatient(patient);
                          }}
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          환자 정보 수정
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          variant="destructive"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeletePatient(patient);
                          }}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          환자 정보 삭제
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>

      <Dialog open={showAddPatientModal} onOpenChange={setShowAddPatientModal}>
        <DialogContent className="sm:max-w-[500px] bg-white rounded-sm">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-foreground">
              새 환자 등록
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-semibold mb-2 block">
                  환자 ID
                </Label>
                <Input
                  value={newPatient.patientId}
                  onChange={(e) =>
                    setNewPatient((prev) => ({
                      ...prev,
                      patientId: e.target.value,
                    }))
                  }
                  placeholder="환자 식별번호"
                  className="rounded-sm"
                />
              </div>
              <div>
                <Label className="text-sm font-semibold mb-2 block">
                  환자 이름
                </Label>
                <Input
                  value={newPatient.name}
                  onChange={(e) =>
                    setNewPatient((prev) => ({ ...prev, name: e.target.value }))
                  }
                  placeholder="환자 이름"
                  className="rounded-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-semibold mb-2 block">나이</Label>
                <Input
                  type="number"
                  value={newPatient.age}
                  onChange={(e) =>
                    setNewPatient((prev) => ({ ...prev, age: e.target.value }))
                  }
                  placeholder="나이"
                  className="rounded-sm"
                />
              </div>
              <div>
                <Label className="text-sm font-semibold mb-2 block">성별</Label>
                <Select
                  value={newPatient.gender}
                  onValueChange={(value) =>
                    setNewPatient((prev) => ({
                      ...prev,
                      gender: value as "M" | "F",
                    }))
                  }
                >
                  <SelectTrigger className="rounded-sm w-full">
                    <SelectValue placeholder="성별 선택" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="M">남성</SelectItem>
                    <SelectItem value="F">여성</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label className="text-sm font-semibold mb-2 block">진단명</Label>
              <Input
                value={newPatient.diagnosis}
                onChange={(e) =>
                  setNewPatient((prev) => ({
                    ...prev,
                    diagnosis: e.target.value,
                  }))
                }
                placeholder="진단명"
                className="rounded-sm"
              />
            </div>

            <div className="flex justify-end gap-3 mt-4">
              <Button
                variant="outline"
                onClick={() => setShowAddPatientModal(false)}
              >
                취소
              </Button>
              <Button
                onClick={handleAddPatient}
                disabled={
                  !newPatient.patientId ||
                  !newPatient.name ||
                  !newPatient.diagnosis ||
                  !newPatient.age
                }
              >
                등록
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog
        open={showEditPatientModal}
        onOpenChange={setShowEditPatientModal}
      >
        <DialogContent className="sm:max-w-[500px] bg-white rounded-sm">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-foreground">
              환자 정보 수정
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-semibold mb-2 block">
                  환자 ID
                </Label>
                <Input
                  value={newPatient.patientId}
                  onChange={(e) =>
                    setNewPatient((prev) => ({
                      ...prev,
                      patientId: e.target.value,
                    }))
                  }
                  placeholder="환자 식별번호"
                  className="rounded-sm"
                />
              </div>
              <div>
                <Label className="text-sm font-semibold mb-2 block">
                  환자 이름
                </Label>
                <Input
                  value={newPatient.name}
                  onChange={(e) =>
                    setNewPatient((prev) => ({ ...prev, name: e.target.value }))
                  }
                  placeholder="환자 이름"
                  className="rounded-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-semibold mb-2 block">나이</Label>
                <Input
                  type="number"
                  value={newPatient.age}
                  onChange={(e) =>
                    setNewPatient((prev) => ({ ...prev, age: e.target.value }))
                  }
                  placeholder="나이"
                  className="rounded-sm"
                />
              </div>
              <div>
                <Label className="text-sm font-semibold mb-2 block">성별</Label>
                <Select
                  value={newPatient.gender}
                  onValueChange={(value) =>
                    setNewPatient((prev) => ({
                      ...prev,
                      gender: value as "M" | "F",
                    }))
                  }
                >
                  <SelectTrigger className="rounded-sm w-full">
                    <SelectValue placeholder="성별 선택" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="M">남성</SelectItem>
                    <SelectItem value="F">여성</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label className="text-sm font-semibold mb-2 block">진단명</Label>
              <Input
                value={newPatient.diagnosis}
                onChange={(e) =>
                  setNewPatient((prev) => ({
                    ...prev,
                    diagnosis: e.target.value,
                  }))
                }
                placeholder="진단명"
                className="rounded-sm"
              />
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button
                variant="outline"
                onClick={() => setShowEditPatientModal(false)}
                className="rounded-sm"
              >
                취소
              </Button>
              <Button
                onClick={handleUpdatePatient}
                disabled={
                  !newPatient.patientId ||
                  !newPatient.name ||
                  !newPatient.diagnosis ||
                  !newPatient.age
                }
                className="rounded-sm"
              >
                수정하기
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog
        open={showDeleteConfirmModal}
        onOpenChange={setShowDeleteConfirmModal}
      >
        <DialogContent className="sm:max-w-[400px] bg-white rounded-sm">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-foreground">
              환자 정보 삭제
            </DialogTitle>
          </DialogHeader>

          <p className="text-sm text-muted-foreground">
            정말로{" "}
            <strong>
              {deletingPatient?.name} ({deletingPatient?.patientId})
            </strong>{" "}
            환자를 삭제하시겠습니까?
            <br />이 작업은 되돌릴 수 없으며, 환자의 모든 데이터가 영구적으로
            삭제됩니다.
          </p>

          <div className="flex justify-end gap-3 mt-4">
            <Button
              variant="outline"
              onClick={() => setShowDeleteConfirmModal(false)}
            >
              취소
            </Button>
            <Button variant="destructive" onClick={confirmDeletePatient}>
              삭제
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
