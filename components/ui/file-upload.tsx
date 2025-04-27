"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"

interface FileUploadProps {
  onFileSelected: (file: File) => void
  accept?: string
  buttonText?: string
  className?: string
}

export function FileUpload({
  onFileSelected,
  accept = "image/*",
  buttonText = "Select File",
  className = "",
}: FileUploadProps) {
  const [fileName, setFileName] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFileName(file.name)
      onFileSelected(file)
    }
  }

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <input type="file" ref={fileInputRef} onChange={handleFileChange} accept={accept} className="hidden" />
      <Button
        type="button"
        variant="outline"
        onClick={handleClick}
        className="bg-gray-800 border-gray-700 hover:bg-gray-700"
      >
        {buttonText}
      </Button>
      {fileName && <p className="text-sm text-muted-foreground">Selected: {fileName}</p>}
    </div>
  )
}
