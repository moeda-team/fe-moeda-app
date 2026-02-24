import { axiosClient } from "../axios-client"

export type FileItem = {
  id: string
  category: string
  fileUrl: string
}
export type CreateFileInput = {
  category: string
  file: string
}
export type FileResponse = {
  message: unknown
  data: FileItem
  status: string
}

export type FileQueryParams = {
  search?: string
  category?: string
  best?: string
}

export async function createFile(formData: FormData): Promise<FileResponse> {
  const res = await axiosClient.post("/files", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  })

  if (!res) {
    throw new Error("Failed to create file")
  }

  return res.data
}