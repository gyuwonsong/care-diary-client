"use client";

import type React from "react";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Upload, X, FileSpreadsheet } from "lucide-react";
import { cn } from "@/lib/utils";

interface CareDiaryModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  interviewTitle?: string;
}

interface FileWithTitle {
  file: File;
  title: string;
}

export function CareDiaryModal({
  open,
  onOpenChange,
  interviewTitle = "",
}: CareDiaryModalProps) {
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<FileWithTitle[]>([]);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = Array.from(e.dataTransfer.files);
    const excelFiles = files.filter(
      (file) =>
        file.type ===
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
        file.type === "application/vnd.ms-excel" ||
        file.name.endsWith(".xlsx") ||
        file.name.endsWith(".xls"),
    );

    if (excelFiles.length > 0) {
      const filesWithTitles = excelFiles.map((file) => ({
        file,
        title: file.name.replace(/\.(xlsx|xls)$/i, ""),
      }));
      setUploadedFiles((prev) => [...prev, ...filesWithTitles]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const fileArray = Array.from(files);
      const filesWithTitles = fileArray.map((file) => ({
        file,
        title: file.name.replace(/\.(xlsx|xls)$/i, ""),
      }));
      setUploadedFiles((prev) => [...prev, ...filesWithTitles]);
    }
  };

  const removeFile = (index: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const updateFileTitle = (index: number, newTitle: string) => {
    setUploadedFiles((prev) =>
      prev.map((item, i) =>
        i === index ? { ...item, title: newTitle } : item,
      ),
    );
  };

  const handleSubmit = () => {
    const submissions = uploadedFiles.map(({ file, title }) => ({
      file,
      title: title.trim() || file.name.replace(/\.(xlsx|xls)$/i, ""),
    }));
    console.log("[v0] Care diary upload:", submissions);
    onOpenChange(false);
    // Reset form
    setUploadedFiles([]);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] bg-white rounded-sm">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-foreground">
            새로운 돌봄일기 등록
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* File Upload Area */}
          <div>
            <Label className="text-sm font-medium mb-2 block">
              엑셀 파일 업로드 (여러 파일 가능)
            </Label>

            {uploadedFiles.length === 0 ? (
              <div
                className={cn(
                  "border-2 border-dashed rounded-sm p-8 text-center transition-colors",
                  dragActive
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50",
                )}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-sm text-muted-foreground mb-2">
                  엑셀 파일을 드래그하여 업로드하거나 클릭하여 선택하세요
                </p>
                <p className="text-xs text-muted-foreground mb-4">
                  지원 형식: .xlsx, .xls (여러 파일 선택 가능)
                </p>
                <Button
                  variant="outline"
                  onClick={() => document.getElementById("file-input")?.click()}
                  className="rounded-sm"
                >
                  파일 선택
                </Button>
                <input
                  id="file-input"
                  type="file"
                  accept=".xlsx,.xls"
                  multiple
                  onChange={handleFileInput}
                  className="hidden"
                />
              </div>
            ) : (
              <div className="space-y-4">
                {uploadedFiles.map((fileWithTitle, index) => (
                  <div
                    key={index}
                    className="border border-border rounded-sm bg-muted/30"
                  >
                    <div className="p-4 border-b border-border bg-white rounded-sm">
                      <Label className="text-sm font-semibold mb-2 block">
                        인터뷰 제목
                      </Label>
                      <Input
                        value={fileWithTitle.title}
                        onChange={(e) => updateFileTitle(index, e.target.value)}
                        placeholder="인터뷰 제목을 입력하세요"
                        className="rounded-sm text-sm bg-white"
                      />
                    </div>

                    <div className="p-4">
                      <div className="flex items-center gap-3">
                        <FileSpreadsheet className="h-8 w-8 text-muted-foreground" />
                        <div className="flex-1">
                          <p className="font-medium text-sm">
                            {fileWithTitle.file.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {(fileWithTitle.file.size / 1024 / 1024).toFixed(2)}{" "}
                            MB
                          </p>
                        </div>
                        <Button
                          size="icon"
                          onClick={() => removeFile(index)}
                          className="rounded-sm hover:cursor-pointer"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}

                <div
                  className="border-2 border-dashed rounded-sm p-4 text-center transition-colors border-border hover:border-primary/50 cursor-pointer"
                  onClick={() =>
                    document.getElementById("file-input-additional")?.click()
                  }
                >
                  <Upload className="h-6 w-6 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">
                    추가 파일 업로드
                  </p>
                  <input
                    id="file-input-additional"
                    type="file"
                    accept=".xlsx,.xls"
                    multiple
                    onChange={handleFileInput}
                    className="hidden"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="rounded-sm"
            >
              취소
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={
                uploadedFiles.length === 0 ||
                uploadedFiles.some((item) => !item.title.trim())
              }
              className="rounded-sm"
            >
              등록하기 ({uploadedFiles.length}개 파일)
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
