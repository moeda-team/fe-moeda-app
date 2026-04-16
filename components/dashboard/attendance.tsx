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
import { checkSession, closeSession, openSession } from "@/lib/api/report/req-api"
import { formatDateTime } from "@/lib/helpers"

export function Attendance() {
  const queryClient = useQueryClient()
  const webcamRef = React.useRef<Webcam>(null)
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  const [mounted, setMounted] = React.useState(false)
  const [open, setOpen] = React.useState(false)
  const [detailOpen, setDetailOpen] = React.useState(false)
  const [imageSrc, setImageSrc] = React.useState<string | null>(null)
  const [useFallback, setUseFallback] = React.useState(false)

  // Detect WebView environment
  React.useEffect(() => {
    setMounted(true)
    
    // Check if running in WebView
    const userAgent = navigator.userAgent.toLowerCase()
    const isWebView = (
      /wv/.test(userAgent) || // Android WebView
      /iphone|ipad|ipod/.test(userAgent) && /safari/.test(userAgent) === false || // iOS WebView
      /android/.test(userAgent) && !/chrome/.test(userAgent) || // Android non-Chrome (likely WebView)
      /webview/i.test(userAgent) || // Explicit WebView
      /version\/[\d.]+.*mobile/.test(userAgent) && !/safari/.test(userAgent) // iOS WebView alternative
    )
    
    // Debug logging
    console.log('User Agent:', userAgent)
    console.log('Is WebView:', isWebView)
    console.log('Use Fallback:', isWebView)
    
    setUseFallback(isWebView)
  }, [])

  const { data, isLoading } = useQuery({
    queryKey: ["check-attendance"],
    queryFn: checkAttendance,
  })

  // Check session
  const { data: sessionStore } = useQuery({
    queryKey: ["check-session"],
    queryFn: checkSession,
  })
  // Mutation check session
  const openSessionMut = useMutation({mutationFn: openSession})
  const closeSessionMut = useMutation({mutationFn: closeSession})
  const alreadyOpen = sessionStore?.data ?? false

  const [openStore, setOpenStore] = React.useState(false)

  // Mutation upload file
  const uploadFileMut = useMutation({
    mutationFn: createFile,
  })

  // Mutation create attendance
  const attendanceMut = useMutation({
    mutationFn: createAttendance,
    onSuccess: () => {
      toast.success("Check-in berhasil")
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

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log('File input triggered')
    const file = event.target.files?.[0]
    console.log('Selected file:', file)
    
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        console.log('File reader completed')
        setImageSrc(reader.result as string)
      }
      reader.onerror = () => {
        console.error('File reader error')
      }
      reader.readAsDataURL(file)
    } else {
      console.log('No file selected')
    }
  }

  const handleSubmit = async () => {
    try {
      if (!imageSrc) {
        toast.error("Ambil foto dulu")
        return
      }

      // Convert base64 -> File
      const blob = await fetch(imageSrc).then((res) => res.blob())
      const file = new File([blob], "attendance.jpg", {
        type: "image/jpeg",
      })

      const formData = new FormData()
      formData.append("file", file)
      formData.append("category", "attendance")

      // Upload ke /files
      const fileRes = await uploadFileMut.mutateAsync(formData)

      // Ambil fileUrl dari response
      const fileUrl = fileRes?.data.fileUrl
      if (!fileUrl) throw new Error("File URL tidak ditemukan")

      // Kirim ke attendances
      await attendanceMut.mutateAsync({ fileUrl })
      setTimeout(() => {
        window.location.reload()
      }, 500)

    } catch (err) {
      toast.error("Upload gagal")
    }
  }
  
  const handleStoreSubmit = async () => {
    try {
      if (alreadyOpen) {
        await closeSessionMut.mutateAsync();
        toast.success("Open Store closed successfully");
      } else {
        await openSessionMut.mutateAsync();
        toast.success("Open Store opened successfully");
      }

      setTimeout(() => {
        window.location.reload();
      }, 500);
    } catch {
      toast.error("Failed to update session");
    }
  };

  const isSubmitting = uploadFileMut.isPending || attendanceMut.isPending

  return (
    <>
      <Button
        variant={alreadyOpen ? "secondary" : "default"}
        size="sm"
        disabled={isLoading }
        className={alreadyOpen ? "bg-green-300 text-green-500 border border-green-500" : "}
        onClick={() => {
            setOpenStore(true)
        }}
      >
        {isLoading ? (
          <>
            <Clock className="h-4 w-4 animate-spin" />
            Checking...
          </>
        ) : alreadyOpen ? (
          <>
            <CheckCircle className="h-4 w-4 text-green-500" />
            Close Store
          </>
        ) : (
          <>
            <Clock className="h-4 w-4" />
            Open Store
          </>
        )}
      </Button>

      <Button
        variant={alreadyCheckIn ? "secondary" : "default"}
        size="sm"
        disabled={isLoading }
        className={alreadyCheckIn ? "bg-green-300 text-green-500 border border-green-500 hidden lg:block" : "hidden lg:block"}
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
              useFallback ? (
                // WebView Fallback - Multiple Approaches
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <Camera className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <p className="text-sm text-gray-600 mb-2">
                    WebView Mode - Multiple Options
                  </p>
                  <p className="text-xs text-gray-500 mb-4">
                    Debug: Fallback = {useFallback ? 'ON' : 'OFF'}
                  </p>
                  
                  {/* Hidden file input with capture */}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    capture="environment"
                    onChange={handleFileSelect}
                    className="hidden"
                    id="webview-file-input"
                  />
                  
                  {/* Primary button - tries camera first */}
                  <Button 
                    onClick={() => fileInputRef.current?.click()} 
                    className="w-full gap-2 mb-2"
                  >
                    <Camera className="h-4 w-4" />
                    📷 Ambil dari Kamera
                  </Button>
                  
                  {/* Fallback button - no capture attribute */}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                    id="webview-file-input-gallery"
                  />
                  <Button 
                    variant="outline"
                    onClick={() => document.getElementById('webview-file-input-gallery')?.click()} 
                    className="w-full gap-2"
                  >
                    📁 Pilih dari Gallery
                  </Button>
                </div>
              ) : (
                // Normal Browser - React Webcam
                <Webcam
                  ref={webcamRef}
                  screenshotFormat="image/jpeg"
                  videoConstraints={{ facingMode: "user" }}
                  className="rounded-lg w-full"
                />
              )
            ) : (
              <img
                src={imageSrc}
                alt="Preview"
                className="rounded-lg border w-full"
              />
            )}

            {!imageSrc ? (
              useFallback ? (
                // WebView fallback - no capture button needed (handled by file input)
                null
              ) : (
                // Normal Browser - capture button
                <Button onClick={capture} className="w-full gap-2">
                  <Camera className="h-4 w-4" />
                  Ambil Foto
                </Button>
              )
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
      
      <Dialog open={openStore} onOpenChange={setOpenStore}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Information</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {
              alreadyOpen ? (
                <div>
                  Close store at {formatDateTime(new Date(), "DD MMMM yyyy HH:mm")}
                </div>
              ) : (
                <div>
                  Open store at {formatDateTime(new Date(), "DD MMMM yyyy HH:mm")}
                </div>
              )
            }
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setOpenStore(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              onClick={handleStoreSubmit}
              disabled={isSubmitting}
              className="gap-2"
            >
              {isSubmitting && (
                <Clock className="h-4 w-4 animate-spin" />
              )}
              {alreadyOpen ? "Close Order" : "Open"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
