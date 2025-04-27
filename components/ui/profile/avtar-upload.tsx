"use client"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { FileUpload } from "@/components/ui/file-upload"
import { useToast } from "@/hooks/use-toast"

interface AvatarUploadProps {
  initialAvatarUrl: string
  userName: string
  onAvatarChange: (url: string) => void
}

export function AvatarUpload({ initialAvatarUrl, userName, onAvatarChange }: AvatarUploadProps) {
  const [avatarUrl, setAvatarUrl] = useState(initialAvatarUrl)
  const [isUploading, setIsUploading] = useState(false)
  const { toast } = useToast()

  const handleFileSelected = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast({
        title: "Invalid file type",
        description: "Please select an image file.",
        variant: "destructive",
      })
      return
    }

    setIsUploading(true)

    try {
      // In a real app, you would upload the file to your server or a storage service
      // For now, we'll create a local URL for the image
      const localUrl = URL.createObjectURL(file)

      // Simulate upload delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      setAvatarUrl(localUrl)
      onAvatarChange(localUrl)

      toast({
        title: "Avatar updated",
        description: "Your profile picture has been updated successfully.",
      })
    } catch (error) {
      toast({
        title: "Upload failed",
        description: "Failed to upload avatar. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
      <Avatar className="h-24 w-24">
        <AvatarImage src={avatarUrl || "/placeholder.svg"} alt={userName} />
        <AvatarFallback className="text-2xl">{userName.substring(0, 2).toUpperCase()}</AvatarFallback>
      </Avatar>
      <FileUpload
        onFileSelected={handleFileSelected}
        accept="image/*"
        buttonText={isUploading ? "Uploading..." : "Change Avatar"}
        className="w-full sm:w-auto"
      />
    </div>
  )
}
