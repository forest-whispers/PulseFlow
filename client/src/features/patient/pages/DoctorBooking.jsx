import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import { ArrowLeft, Stethoscope, AlertCircle, RefreshCw, ChevronRight } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useDoctorDetails, useAvailableSlots, useBookAppointment } from "../hooks/useDoctorBooking"
import DoctorProfileCard from "../components/DoctorProfileCard"
import BookingCalendar from "../components/BookingCalendar"
import SlotPicker from "../components/SlotPicker"
import BookingDetailsForm from "../components/BookingDetailsForm"

export default function DoctorBooking() {
  const { id } = useParams()
  
  // Page states
  const [selectedDate, setSelectedDate] = useState("")
  const [selectedSlot, setSelectedSlot] = useState("")

  // Fetch doctor profile details
  const {
    data: detailsData,
    isLoading: isDoctorLoading,
    isError: isDoctorError,
    error: doctorError,
    refetch: refetchDoctor,
  } = useDoctorDetails(id)

  const doctor = detailsData?.data?.doctor
  const availability = detailsData?.data?.availability
  const availableDays = availability?.availableDays || []

  // Fetch available slots for selected date
  const {
    data: slotsData,
    isLoading: isSlotsLoading,
    isError: isSlotsError,
    refetch: refetchSlots,
  } = useAvailableSlots(id, selectedDate)

  const isBookable = slotsData?.data?.isBookable ?? true
  const blockedReason = slotsData?.data?.reason || ""
  const slots = slotsData?.data?.availableSlots || []

  // Booking mutation hook
  const bookMutation = useBookAppointment()

  // Reset selected slot if date changes to avoid stale selections
  const handleDateSelect = (dateStr) => {
    setSelectedDate(dateStr)
    setSelectedSlot("")
  }

  // Handle appointment submission
  const handleBookingSubmit = (formData) => {
    if (!selectedDate || !selectedSlot) return
    
    bookMutation.mutate({
      doctor: id, // The doctor user id from useParams
      appointmentDate: selectedDate,
      bookedSlot: selectedSlot,
      reason: formData.reason,
      notes: formData.notes,
    })
  }

  // Loading skeleton for the entire page
  if (isDoctorLoading) {
    return (
      <div className="space-y-6 max-w-6xl mx-auto p-4 sm:p-6 animate-pulse">
        {/* Navigation Breadcrumb Skeleton */}
        <div className="h-5 w-48 bg-muted/60 rounded-md" />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Card Skeleton */}
          <div className="lg:col-span-1 h-[450px] bg-card border rounded-2xl" />

          {/* Booking Panel Skeleton */}
          <div className="lg:col-span-2 h-[550px] bg-card border rounded-2xl p-6 space-y-6">
            <div className="h-7 w-56 bg-muted/60 rounded-md" />
            <div className="space-y-3">
              <div className="h-5 w-40 bg-muted/60 rounded-md" />
              <div className="flex gap-3 overflow-x-auto pb-2">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-20 w-16 bg-muted/60 rounded-xl shrink-0" />
                ))}
              </div>
            </div>
            <div className="space-y-3 pt-4 border-t border-dashed">
              <div className="h-5 w-32 bg-muted/60 rounded-md" />
              <div className="grid grid-cols-3 gap-3">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-11 bg-muted/60 rounded-xl" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Error state display
  if (isDoctorError) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center text-center p-6 space-y-4 max-w-md mx-auto">
        <div className="h-14 w-14 rounded-full bg-destructive/10 text-destructive flex items-center justify-center shadow-2xs">
          <AlertCircle className="h-7 w-7" />
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-bold text-foreground">Failed to Load Profile</h3>
          <p className="text-muted-foreground text-sm leading-relaxed">
            {doctorError?.response?.data?.message || doctorError?.message || "We encountered an error loading the doctor's details. Please try again."}
          </p>
        </div>
        <div className="flex gap-3 w-full">
          <Link to="/patient/doctors" className="flex-1">
            <Button variant="outline" className="w-full rounded-xl cursor-pointer">
              Back to Directory
            </Button>
          </Link>
          <Button onClick={() => refetchDoctor()} className="flex-1 gap-2 rounded-xl cursor-pointer">
            <RefreshCw className="h-4 w-4" /> Try Again
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto p-4 sm:p-6">
      {/* Navigation Breadcrumb Link */}
      <div className="flex items-center gap-2 text-xs sm:text-sm font-medium text-muted-foreground">
        <Link to="/patient/doctors" className="hover:text-primary transition-colors flex items-center gap-1">
          <ArrowLeft className="h-3.5 w-3.5" /> Doctor Search
        </Link>
        <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/50" />
        <span className="text-foreground font-semibold">Book Appointment</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left Column: Presentational Doctor Profile Card */}
        <div className="lg:col-span-1 lg:sticky lg:top-6">
          <DoctorProfileCard doctor={doctor} availability={availability} />
        </div>

        {/* Right Column: Interactive Booking Panels */}
        <div className="lg:col-span-2">
          <Card className="border shadow-2xs bg-card">
            <CardHeader className="p-6 border-b">
              <CardTitle className="text-lg sm:text-xl font-extrabold text-foreground flex items-center gap-2.5">
                <div className="h-8 w-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <Stethoscope className="h-4.5 w-4.5" />
                </div>
                Schedule Consultation
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              {/* Step 1: Calendar Date Selection */}
              <BookingCalendar
                availableDays={availableDays}
                selectedDate={selectedDate}
                onDateSelect={handleDateSelect}
              />

              {/* Step 2: Slot Selection (Visible only when date is chosen) */}
              {selectedDate && (
                <div className="pt-6 border-t border-dashed">
                  <SlotPicker
                    slots={slots}
                    isBookable={isBookable}
                    blockedReason={blockedReason}
                    selectedSlot={selectedSlot}
                    onSlotSelect={setSelectedSlot}
                    isLoading={isSlotsLoading}
                  />
                </div>
              )}

              {/* Step 3: Booking Details Form (Visible only when date & slot chosen) */}
              {selectedDate && selectedSlot && isBookable && (
                <BookingDetailsForm
                  onSubmit={handleBookingSubmit}
                  isLoading={bookMutation.isPending}
                />
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
