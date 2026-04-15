"use client";

import { useState, useEffect } from "react";
import { CalendarDays, Clock, User, Phone, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ContactForm from "@/components/Contact/ContactForm";
import { toast } from "sonner";
import { useRouter, usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";

const TIME_SLOTS = [
  "09:00 AM",
  "09:30 AM",
  "10:00 AM",
  "10:30 AM",
  "11:00 AM",
  "11:30 AM",
  "12:00 PM",
  "12:30 PM",
  "02:00 PM",
  "02:30 PM",
  "03:00 PM",
  "03:30 PM",
  "04:00 PM",
  "04:30 PM",
  "05:00 PM",
  "05:30 PM",
];

const AppointmentPageClient = () => {
  const router = useRouter();
  const pathname = usePathname();
  const sessionHook = useSession();
  const session = sessionHook?.data ?? null;
  const isLoading = sessionHook?.status === "loading";

  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState("");
  const [patientName, setPatientName] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [bookedSlots, setBookedSlots] = useState<string[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Fetch booked slots when date changes
  useEffect(() => {
    if (!selectedDate) {
      setBookedSlots([]);
      setSelectedTime("");
      return;
    }
    
    const fetchBookedSlots = async () => {
      setLoadingSlots(true);
      setSelectedTime("");
      try {
        const dateStr = selectedDate.toISOString().split("T")[0];
        const res = await fetch(`/api/appointments?date=${dateStr}`);
        const data = await res.json();
        setBookedSlots(data.bookedSlots || []);
      } catch (err) {
        console.error("Failed to fetch booked slots:", err);
        setBookedSlots([]);
      } finally {
        setLoadingSlots(false);
      }
    };
    
    fetchBookedSlots();
  }, [selectedDate]);

  // Pre-fill from session
  useEffect(() => {
    if (session?.user) {
      setPatientName(session.user.name || "");
      // Don't pre-fill phone with email - leave it empty for user to enter phone
    }
  }, [session]);

  const handleChangeTime = () => {
    setSelectedTime("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isMounted) return;

    // Only redirect if session is done loading and user is not signed in
    if (!isLoading && !session?.user) {
      toast.error("Please sign in to book an appointment");
      router.push(`/auth?callbackUrl=${encodeURIComponent(pathname || '/appointment')}`);
      return;
    }

    if (!selectedDate) {
      toast.error("Please select an appointment date from the calendar");
      return;
    }

    if (!selectedTime || selectedTime === "none") {
      if (selectedDate) {
        toast.error("Date is already selected! Please only set the timing now.");
      } else {
        toast.error("Please select a time slot");
      }
      return;
    }

    if (!patientName.trim()) {
      toast.error("Please enter your name");
      return;
    }

    if (!phone.trim()) {
      toast.error("Please enter your phone number");
      return;
    }

    setIsSubmitting(true);

    try {
      console.log("Booking appointment:", {
        date: selectedDate,
        dateISO: selectedDate.toISOString(),
        time: selectedTime,
        patientName,
        phone,
        notes,
      });

      const res = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date: selectedDate.toISOString().split("T")[0],
          time: selectedTime,
          notes: notes || null,
          patientName: patientName.trim(),
          phone: phone.trim(),
        }),
      });

      if (!res.ok) throw new Error("Failed to book appointment");

      toast.success("Appointment booked successfully! We'll confirm shortly.");
      router.push("/");
    } catch (error: any) {
      toast.error(error.message || "Failed to book appointment");
    } finally {
      setIsSubmitting(false);
    }
  };

  const isDateDisabled = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Show loading while session is loading */}
      {isLoading && (
        <div className="flex items-center justify-center py-32">
          <div className="text-center">
            <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Loading...</p>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="bg-secondary/80 py-30 border-b border-border bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/assets/appointment.jpg')"}}
      >
        <div className="container mx-auto px-4 text-center">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
            <CalendarDays className="h-8 w-8 text-black" />
          </div>
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-4">
            Book an Appointment
          </h1>
          <p className="text-lg text-black max-w-2xl mx-auto mb-4 font-bold">
            Schedule a consultation with <span className="text-black  font-bold">Dr. Yumna Nasir (DHMS)</span> — All days available
          </p>
          <a
            href="tel:03123359106"
            className="inline-flex items-center gap-2 text-black hover:text-primary/110 transition-colors text-lg"
          >
            <Phone className="h-5 w-5" />
            Call for appointment: 0312-3359106
          </a>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Left: Calendar */}
            <div className="bg-secondary/30 rounded-2xl border border-border p-6">
              <div className="mb-6">
                <h2 className="font-heading text-xl font-semibold text-foreground flex items-center gap-2">
                  <CalendarDays className="h-5 w-5 text-black" />
                  Select Date
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  All days are available for appointments
                </p>
              </div>
              <div className="flex justify-center">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  disabled={isDateDisabled}
                  className="rounded-lg border border-border bg-card"
                  classNames={{
                    months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
                    month: "space-y-4",
                    caption: "flex justify-center pt-1 relative items-center",
                    caption_label: "text-sm font-medium text-foreground",
                    nav: "space-x-1 flex items-center",
                    nav_button:
                      "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 text-foreground",
                    nav_button_previous: "absolute left-1",
                    nav_button_next: "absolute right-1",
                    table: "w-full border-collapse space-y-1",
                    head_row: "flex",
                    head_cell:
                      "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]",
                    row: "flex w-full mt-2",
                    cell: "h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
                    day: "h-9 w-9 p-0 font-normal text-foreground aria-selected:opacity-100 hover:bg-accent hover:text-accent-foreground rounded-md",
                    day_range_end: "day-range-end",
                    day_selected:
                      "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
                    day_today: "bg-accent text-accent-foreground",
                    day_outside:
                      "day-outside text-muted-foreground opacity-50",
                    day_disabled: "text-muted-foreground opacity-20",
                    day_range_middle:
                      "aria-selected:bg-accent aria-selected:text-accent-foreground",
                    day_hidden: "invisible",
                  }}
                />
              </div>
              
              {/* Selected Date Info */}
              {selectedDate && (
                <div className="mt-4 space-y-2">
                  <div className="p-3 bg-primary/10 rounded-lg text-center">
                    <p className="text-sm text-primary font-medium">
                      📅 {selectedDate.toLocaleDateString("en-US", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                  {loadingSlots ? (
                    <div className="p-2 text-center text-sm text-muted-foreground">
                      <div className="inline-block w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin mr-2" />
                      Loading available slots...
                    </div>
                  ) : (
                    <div className="p-3 bg-secondary/50 rounded-lg text-center">
                      <p className="text-sm text-foreground">
                        {bookedSlots.length === 0 
                          ? "✅ All time slots are available!"
                          : `⚠️ ${bookedSlots.length} slot(s) already booked`
                        }
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Right: Form */}
            <div className="bg-secondary/30 rounded-2xl border border-border p-6">
              <div className="mb-6">
                <h2 className="font-heading text-xl font-semibold text-foreground flex items-center gap-2">
                  <Clock className="h-5 w-5 text-black" />
                  Appointment Details
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  {session?.user ? "Fill in your details to book" : "Select a time, then fill in your details"}
                </p>
              </div>

              {!isMounted || isLoading ? (
                <div className="w-full h-12 rounded-lg bg-muted animate-pulse" />
              ) : !selectedDate ? (
                // No date selected - show message
                <div className="p-8 border-2 border-dashed border-border rounded-xl text-center bg-secondary/10 min-h-[300px] flex flex-col items-center justify-center">
                  <CalendarDays className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-30" />
                  <p className="text-base text-muted-foreground font-medium">
                    Please select a date from the calendar
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Choose your preferred appointment date to continue
                  </p>
                </div>
              ) : !selectedTime ? (
                // Date selected, no time - show time slot selection
                <div className="space-y-6">
                  {/* Selected Date Display */}
                  <div className="p-4 bg-green-50 border border-green-200 rounded-xl">
                    <div className="flex items-center gap-2">
                      <CalendarDays className="h-5 w-5 text-green-600 flex-shrink-0" />
                      <p className="text-sm text-green-700 font-medium">
                        Selected Date: <span className="font-bold">{selectedDate.toLocaleDateString("en-US", {
                          weekday: "long",
                          month: "long",
                          day: "numeric",
                          year: "numeric"
                        })}</span>
                      </p>
                    </div>
                  </div>

                  {/* Time Slot Selection */}
                  <div>
                    <Label className="text-foreground mb-3 block font-semibold">
                      Select Time Slot <span className="text-red-500">*</span>
                    </Label>

                    {loadingSlots ? (
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                          <div key={i} className="h-10 rounded-lg bg-muted animate-pulse" />
                        ))}
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                          {TIME_SLOTS.map((slot) => {
                            const isBooked = bookedSlots.includes(slot);
                            const isSelected = selectedTime === slot;

                            return (
                              <button
                                key={slot}
                                type="button"
                                disabled={isBooked}
                                onClick={() => setSelectedTime(slot)}
                                className={`
                                  relative py-2.5 px-2 rounded-lg text-sm font-medium transition-all
                                  ${isBooked
                                    ? "bg-muted text-muted-foreground cursor-not-allowed opacity-50 border border-transparent"
                                    : isSelected
                                      ? "bg-primary text-primary-foreground shadow-md ring-2 ring-primary ring-offset-2 ring-offset-background border-transparent"
                                      : "bg-card border border-border text-foreground hover:border-primary hover:bg-primary/5"
                                  }
                                `}
                              >
                                {slot}
                                {isBooked && (
                                  <span className="absolute -top-1 -right-1 bg-red-500 text-[8px] text-white px-1 rounded-full uppercase font-bold">
                                    Booked
                                  </span>
                                )}
                              </button>
                            );
                          })}
                        </div>

                        {bookedSlots.length === TIME_SLOTS.length && (
                          <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-center">
                            <p className="text-sm text-red-600 font-semibold">
                              🚫 This date is fully booked. Please choose another date.
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                // Both date and time selected - show appropriate form
                !session?.user ? (
                  <ContactForm
                    selectedDate={selectedDate}
                    selectedTime={selectedTime}
                    onChangeTime={handleChangeTime}
                  />
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Date & Time Confirmation */}
                    <div className="p-4 bg-green-50 border border-green-200 rounded-xl space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <CalendarDays className="h-5 w-5 text-green-600 flex-shrink-0" />
                          <p className="text-sm text-green-700 font-medium">
                            Date: <span className="font-bold">{selectedDate.toLocaleDateString("en-US", {
                              weekday: "long",
                              month: "long",
                              day: "numeric",
                              year: "numeric"
                            })}</span>
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={handleChangeTime}
                          className="text-xs text-green-600 hover:text-green-700 underline font-medium"
                        >
                          Change
                        </button>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-5 w-5 text-green-600 flex-shrink-0" />
                        <p className="text-sm text-green-700 font-medium">
                          Time: <span className="font-bold">{selectedTime}</span>
                        </p>
                      </div>
                    </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    {/* Patient Name */}
                    <div>
                      <Label htmlFor="patientName" className="text-foreground mb-2 block font-medium">
                        Patient Name
                      </Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="patientName"
                          placeholder="Your full name"
                          value={patientName}
                          onChange={(e) => setPatientName(e.target.value)}
                          className="pl-10 bg-white border-border h-11 text-black focus:bg-gray-50 focus:border-primary transition-colors"
                          required
                        />
                      </div>
                    </div>

                    {/* Phone */}
                    <div>
                      <Label htmlFor="phone" className="text-foreground mb-2 block font-medium">
                        Phone Number
                      </Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="phone"
                          type="tel"
                          placeholder="03XX-XXXXXXX"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="pl-10 bg-white border-border h-11 text-black focus:bg-gray-50 focus:border-primary transition-colors"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Skin Concern */}
                  <div>
                    <Label htmlFor="notes" className="text-foreground mb-2 block font-medium">
                      Describe Your Skin Concern{" "}
                      <span className="text-muted-foreground font-normal">(Optional)</span>
                    </Label>
                    <div className="relative">
                      <MessageSquare className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Textarea
                        id="notes"
                        placeholder="Briefly describe your skin issue..."
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        className="pl-10 bg-white border-border min-h-[100px] resize-none text-black focus:bg-gray-50 focus:border-primary transition-colors"
                        rows={3}
                      />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    className="w-full h-12 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground text-base font-semibold shadow-lg transition-transform active:scale-[0.98]"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <span className="flex items-center gap-2">
                        <span className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                        Confirming Booking...
                      </span>
                    ) : (
                      "Confirm Appointment"
                    )}
                  </Button>
                  </form>
                )
              )}
            </div>
          </div>

          {/* Immediate Help Section */}
          <div className="mt-12 bg-secondary/50 rounded-2xl border border-border p-8 text-center">
            <h3 className="font-heading text-2xl font-semibold text-foreground mb-3">
              Need Immediate Help?
            </h3>
            <p className="text-muted-foreground mb-6 max-w-lg mx-auto">
              Contact Dr. Yumna Nasir directly for urgent consultations
            </p>
            <a
              href="tel:03123359106"
              className="inline-flex items-center gap-3 bg-card border border-border rounded-xl px-6 py-4 text-foreground hover:bg-accent/50 transition-colors"
            >
              <Phone className="h-5 w-5 text-primary" />
              <span className="font-medium">Call 0312-3359106</span>
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default AppointmentPageClient;
