"use client"

import { useEffect, useState, useRef } from "react"
import { useForm } from "react-hook-form"
import { useSession, signOut } from "next-auth/react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { useUserQuery, useUpdateUser } from "./hooks/use"
import { LogOut, ArrowLeft, Store, User, Upload } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { PhoneInputGroup } from "@/components/input/PhoneInputGroup"
import { toast } from "sonner"
import { LoadingOverlay } from "@/components/ui/loading"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { OutletItem } from "@/lib/api/outlet/req-api"
import { createFile } from "@/lib/api/file/req-api"
import { updateOutlet } from "@/lib/api/outlet/req-api"

type ProfileForm = {
  name: string
  position: string
  email: string
  address: string
  gender: string
  phoneNumber: string
  image?: string
}

type OutletForm = {
  name: string
  address: string
  number: string
  province: string
  city: string
  postalCode: string
  color: string
  img?: string
}

export default function ProfilePage() {
  const { data: session, update: updateSession } = useSession()
  const router = useRouter()
  const userId = session?.user?.id || ""
  const { data: user, isLoading: isLoadingUser } = useUserQuery(userId)
  const updateUserMutation = useUpdateUser(userId)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmittingOutlet, setIsSubmittingOutlet] = useState(false)
  const [uploadingImg, setUploadingImg] = useState(false)
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  
  const userRole = session?.user?.role || "USER"
  const isOwner = userRole === "OWNER"
  const outletData = session?.outlet as OutletItem | undefined
  
  // Outlet form
  const {
    register: registerOutlet,
    handleSubmit: handleSubmitOutlet,
    reset: resetOutlet,
    setValue: setOutletValue,
    watch: watchOutlet,
    formState: { errors: outletErrors },
  } = useForm<OutletForm>({
    defaultValues: {
      name: "",
      address: "",
      number: "",
      province: "",
      city: "",
      postalCode: "",
      color: "",
      img: "",
    },
  })
  
  // Watch outlet image value
  const outletImgValue = watchOutlet("img")
  
  // Reset outlet form when session outlet data is loaded
  useEffect(() => {
    if (outletData) {
      resetOutlet({
        name: outletData.name || "",
        address: outletData.address || "",
        number: outletData.number || "",
        province: outletData.province || "",
        city: outletData.city || "",
        postalCode: outletData.postalCode || "",
        color: outletData.color || "",
        img: outletData.img || "",
      })
    }
  }, [outletData, resetOutlet])
  
  // Handle image upload
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      setUploadingImg(true)

      const formData = new FormData()
      formData.append("file", file)
      formData.append("category", "menu")

      const res = await createFile(formData)
      const uploaded = res.data

      if (uploaded?.fileUrl) {
        setOutletValue("img", uploaded.fileUrl, { shouldValidate: true })
        toast.success("Image uploaded successfully")
      }
    } catch (error) {
      toast.error("Failed to upload image")
      console.error(error)
    } finally {
      setUploadingImg(false)
    }
  }

  const onSubmitOutlet = async (data: OutletForm) => {
    if (!outletData?.id) {
      toast.error("Outlet ID not found")
      return
    }

    setIsSubmittingOutlet(true)
    try {
      await updateOutlet(outletData.id, {
        outletType: outletData.outletType || "",
        name: data.name,
        address: data.address,
        number: data.number,
        province: data.province,
        city: data.city,
        postalCode: data.postalCode,
        color: data.color,
        img: data.img,
        status: outletData.status || "ACTIVE",
      })
      toast.success("Outlet updated successfully")
    } catch (error) {
      toast.error("Failed to update outlet")
      console.error(error)
    } finally {
      setIsSubmittingOutlet(false)
    }
  }

  const handleLogout = async () => {
    // Clear local storage
    if (typeof window !== "undefined") {
      localStorage.clear()
      sessionStorage.clear()
    }
    
    // Sign out dan redirect ke login
    await signOut({ redirect: false })
    router.replace("/login")
    router.refresh()
  }

  const handleBackToLogin = () => {
    router.push("/login")
  }

  // Get default values from user API data (priority) then session
  const getSessionDefaults = (): ProfileForm => ({
    name: user?.data?.name || session?.user?.name || "",
    email: user?.data?.email || session?.user?.email || "",
    image: user?.data?.image || session?.user?.image || "",
    position: user?.data?.position || "",
    address: user?.data?.address || "",
    gender: user?.data?.gender || "",
    phoneNumber: user?.data?.phoneNumber || "",
  })

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<ProfileForm>({
    defaultValues: getSessionDefaults(),
  })

  // Reset form when user data is loaded (merge session + API data)
  useEffect(() => {
    if (user) {
      reset({
        name: user.data.name || session?.user?.name || "",
        position: user.data.position || "",
        email: user.data.email || session?.user?.email || "",
        address: user.data.address || "",
        gender: user.data.gender || "",
        phoneNumber: user.data.phoneNumber || "",
        image: user.data.image || session?.user?.image || "",
      })
    }
  }, [user, session, reset])

  const onSubmit = async (data: ProfileForm) => {
    setIsSubmitting(true)
    try {
      await updateUserMutation.mutateAsync(data)
      
      // Update session with new user data
      await updateSession({
        ...session,
        user: {
          ...session?.user,
          name: data.name,
          email: data.email,
          image: data.image,
        },
      })
      
      toast.success("Profile updated successfully")
    } catch (error) {
      toast.error("Failed to update profile")
      console.error(error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const userName = session?.user?.name || "User"
  const userEmail = session?.user?.email || ""
  const userImage = session?.user?.image || ""

  return (
    <div className="container mx-auto py-6 max-w-2xl">
      <LoadingOverlay show={isLoadingUser || isSubmitting} label="Loading..." />
      
      {/* Header dengan Buttons */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">My Profile</h1>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleBackToLogin}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back 
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={handleLogout}
            className="gap-2"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>
      </div>

      {/* Profile Header Card */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <Avatar className="h-20 w-20">
              {userImage ? (
                <AvatarImage src={userImage} alt={userName} />
              ) : (
                <AvatarFallback className="text-2xl">
                  {userName.slice(0, 1).toUpperCase()}
                </AvatarFallback>
              )}
            </Avatar>
            <div>
              <h2 className="text-xl font-semibold">{userName}</h2>
              <p className="text-muted-foreground">{userEmail}</p>
              <span className="inline-flex items-center rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary mt-2">
                {userRole}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs untuk Profile dan Outlet */}
      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="profile" className="gap-2">
            <User className="h-4 w-4" />
            Edit Profile
          </TabsTrigger>
          {isOwner && (
            <TabsTrigger value="outlet" className="gap-2">
              <Store className="h-4 w-4" />
              Edit Outlet
            </TabsTrigger>
          )}
        </TabsList>

        {/* Profile Tab Content */}
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Edit Profile</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {/* Name */}
                <div className="grid gap-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    {...register("name", { required: "Name is required" })}
                    placeholder="Enter your name"
                  />
                  {errors.name && (
                    <span className="text-sm text-red-500">{errors.name.message}</span>
                  )}
                </div>

                {/* Email */}
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    readOnly
                    {...register("email", { required: "Email is required" })}
                    placeholder="Enter your email"
                  />
                  {errors.email && (
                    <span className="text-sm text-red-500">{errors.email.message}</span>
                  )}
                </div>

                {/* Phone Number */}
                <div className="grid gap-2">
                  <PhoneInputGroup
                    {...register("phoneNumber")}
                    control={control}
                  />
                </div>

                {/* Position */}
                <div className="grid gap-2">
                  <Label htmlFor="position">Position</Label>
                  <Input
                    id="position"
                    {...register("position")}
                    placeholder="Enter your position"
                  />
                </div>

                {/* Gender */}
                <div className="grid gap-2">
                  <Label htmlFor="gender">Gender</Label>
                  <select
                    id="gender"
                    {...register("gender")}
                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="">Select gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                </div>

                {/* Address */}
                <div className="grid gap-2">
                  <Label htmlFor="address">Address</Label>
                  <textarea
                    id="address"
                    {...register("address")}
                    placeholder="Enter your address"
                    rows={3}
                    className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 resize-none"
                  />
                </div>

                {/* Submit Button */}
                <div className="pt-4">
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isSubmitting || isLoadingUser}
                  >
                    {isSubmitting ? "Saving..." : "Save Changes"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Outlet Tab Content - Hanya untuk OWNER */}
        {isOwner && (
          <TabsContent value="outlet">
            <Card>
              <CardHeader>
                <CardTitle>Edit Outlet</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmitOutlet(onSubmitOutlet)} className="space-y-4">
                  {/* Outlet Name */}
                  <div className="grid gap-2">
                    <Label htmlFor="outletName">Outlet Name</Label>
                    <Input
                      id="outletName"
                      {...registerOutlet("name", { required: "Outlet name is required" })}
                      placeholder="Enter outlet name"
                    />
                    {outletErrors.name && (
                      <span className="text-sm text-red-500">{outletErrors.name.message}</span>
                    )}
                  </div>

                  {/* Outlet Address */}
                  <div className="grid gap-2">
                    <Label htmlFor="outletAddress">Address</Label>
                    <textarea
                      id="outletAddress"
                      {...registerOutlet("address")}
                      placeholder="Enter outlet address"
                      rows={2}
                      className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 resize-none"
                    />
                  </div>

                  {/* Phone Number */}
                  <div className="grid gap-2">
                    <Label htmlFor="outletNumber">Phone Number</Label>
                    <Input
                      id="outletNumber"
                      {...registerOutlet("number")}
                      placeholder="Enter phone number"
                    />
                  </div>

                  {/* Province */}
                  <div className="grid gap-2">
                    <Label htmlFor="province">Province</Label>
                    <Input
                      id="province"
                      {...registerOutlet("province")}
                      placeholder="Enter province"
                    />
                  </div>

                  {/* City */}
                  <div className="grid gap-2">
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      {...registerOutlet("city")}
                      placeholder="Enter city"
                    />
                  </div>

                  {/* Postal Code */}
                  <div className="grid gap-2">
                    <Label htmlFor="postalCode">Postal Code</Label>
                    <Input
                      id="postalCode"
                      {...registerOutlet("postalCode")}
                      placeholder="Enter postal code"
                    />
                  </div>

                  {/* Outlet Image Upload */}
                  <div className="grid gap-2">
                    <Label>Outlet Logo/Image</Label>
                    <div className="flex items-start gap-4">
                      {/* Image Preview */}
                      <div className="relative h-24 w-full rounded-lg border bg-muted overflow-hidden">
                        {outletImgValue ? (
                          <Image
                            src={outletImgValue}
                            alt="Outlet Logo"
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                            <Store className="h-8 w-8" />
                          </div>
                        )}
                      </div>
                      
                      <div className="flex flex-col gap-2">
                        <Input
                          type="file"
                          accept="image/*"
                          ref={fileInputRef}
                          onChange={handleImageUpload}
                          className="hidden"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => fileInputRef.current?.click()}
                          disabled={uploadingImg}
                          className="gap-2"
                        >
                          <Upload className="h-4 w-4" />
                          {uploadingImg ? "Uploading..." : "Upload Image"}
                        </Button>
                        {uploadingImg && (
                          <span className="text-xs text-muted-foreground">
                            Uploading image...
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Theme Color */}
                  <div className="grid gap-2">
                    <Label htmlFor="color">Theme Color</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        id="color"
                        type="color"
                        {...registerOutlet("color")}
                        className="w-16 h-10 p-1 cursor-pointer"
                      />
                      <span className="text-sm text-muted-foreground">
                        Choose outlet theme color
                      </span>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-4">
                    <Button
                      type="submit"
                      className="w-full"
                      disabled={isSubmittingOutlet}
                    >
                      {isSubmittingOutlet ? "Saving..." : "Save Outlet Changes"}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>
    </div>
  )
}
