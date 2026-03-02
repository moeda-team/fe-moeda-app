"use client"

import * as React from "react"
import Webcam from "react-webcam"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { CheckCircle, Clock, Camera } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  checkAttendance,
  createAttendance,
} from "@/lib/api/users/req-api"
import { createFile } from "@/lib/api/file/req-api"
import { toast } from "sonner"

export function Attendance() {
  const queryClient = useQueryClient()
  const webcamRef = React.useRef<Webcam>(null)

  const [mounted, setMounted] = React.useState(false)
  const [open, setOpen] = React.useState(false)
  const [detailOpen, setDetailOpen] = React.useState(false)
  const [imageSrc, setImageSrc] = React.useState<string | null>(null)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  const { data, isLoading } = useQuery({
    queryKey: ["check-attendance"],
    queryFn: checkAttendance,
  })

  // 🔥 Mutation upload file
  const uploadFileMut = useMutation({
    mutationFn: createFile,
  })

  // 🔥 Mutation create attendance
  const attendanceMut = useMutation({
    mutationFn: createAttendance,
    onSuccess: () => {
      toast.success("Check-in berhasil 🎉")
      setOpen(false)
      setImageSrc(null)
      queryClient.invalidateQueries({ queryKey: ["check-attendance"] })
    },
    onError: () => {
      toast.error("Gagal check-in")
    },
  })

  if (!mounted) return null

  const alreadyCheckIn = data?.data?.hasAttendanceToday ?? false
  const attendance = data?.data?.attendance

  const capture = () => {
    const image = webcamRef.current?.getScreenshot()
    if (image) setImageSrc(image)
  }

  const handleSubmit = async () => {
    try {
      if (!imageSrc) {
        toast.error("Ambil foto dulu")
        return
      }

      // 1️⃣ Convert base64 → File
      const blob = await fetch(imageSrc).then((res) => res.blob())
      const file = new File([blob], "attendance.jpg", {
        type: "image/jpeg",
      })

      const formData = new FormData()
      formData.append("file", file)
      formData.append("category", "attendance")

      // 2️⃣ Upload ke /files
      const fileRes = await uploadFileMut.mutateAsync(formData)

      // 3️⃣ Ambil fileUrl dari response
      const fileUrl = fileRes?.data.fileUrl
      if (!fileUrl) throw new Error("File URL tidak ditemukan")

      // 4️⃣ Kirim ke attendances
      await attendanceMut.mutateAsync({ fileUrl })
      setTimeout(() => {
        window.location.reload()
      }, 500)

    } catch (err) {
      toast.error("Upload gagal")
    }
  }

  const isSubmitting =
    uploadFileMut.isPending || attendanceMut.isPending

  return (
    <>
      <Button
        variant={alreadyCheckIn ? "secondary" : "default"}
        size="sm"
        disabled={isLoading }
        className={alreadyCheckIn ? "bg-green-300 text-green-500 border border-green-500" : ""}
        onClick={() => {
          if (!alreadyCheckIn) {
            setOpen(true)
          } else {
            setDetailOpen(true)
          }
        }}
      >
        {isLoading ? (
          <>
            <Clock className="h-4 w-4 animate-spin" />
            Checking...
          </>
        ) : alreadyCheckIn ? (
          <>
            <CheckCircle className="h-4 w-4 text-green-500" />
            Sudah Check In
          </>
        ) : (
          <>
            <Clock className="h-4 w-4" />
            Check In
          </>
        )}
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Ambil Foto Attendance</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {!imageSrc ? (
              <Webcam
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                videoConstraints={{ facingMode: "user" }}
                className="rounded-lg w-full"
              />
            ) : (
              <img
                src={imageSrc}
                alt="Preview"
                className="rounded-lg border w-full"
              />
            )}

            {!imageSrc ? (
              <Button onClick={capture} className="w-full gap-2">
                <Camera className="h-4 w-4" />
                Ambil Foto
              </Button>
            ) : (
              <Button
                variant="outline"
                onClick={() => setImageSrc(null)}
                className="w-full"
              >
                Ulangi Foto
              </Button>
            )}
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!imageSrc || isSubmitting}
              className="gap-2"
            >
              {isSubmitting && (
                <Clock className="h-4 w-4 animate-spin" />
              )}
              Submit
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Detail Attendance</DialogTitle>
          </DialogHeader>

          {attendance && (
            <div className="space-y-4">
              <img
                src={attendance.fileUrl}
                alt="Attendance"
                className="rounded-lg border w-full"
              />

              <div className="space-y-2 text-sm">
                <div>
                  <span className="font-medium">Nama:</span>{" "}
                  {attendance.user?.name}
                </div>

                <div>
                  <span className="font-medium">Status:</span>{" "}
                  <span
                    className={
                      attendance.status === "approved"
                        ? "text-green-600"
                        : attendance.status === "rejected"
                        ? "text-red-600"
                        : "text-amber-600"
                    }
                  >
                    {attendance.status}
                  </span>
                </div>

                <div>
                  <span className="font-medium">Tanggal:</span>{" "}
                  {new Date(attendance.createdAt).toLocaleString()}
                </div>

                {attendance.note && (
                  <div>
                    <span className="font-medium">Note:</span>{" "}
                    {attendance.note}
                  </div>
                )}
              </div>
            </div>
          )}

          <DialogFooter>
            <Button onClick={() => setDetailOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}