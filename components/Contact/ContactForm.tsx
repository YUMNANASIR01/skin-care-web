"use client";

import { useState, useEffect } from "react";
import { Send, User, MessageSquare, Mail, Phone, CalendarDays, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import emailjs from "@emailjs/browser";

interface ContactFormProps {
  selectedDate?: Date;
  selectedTime?: string;
  onChangeTime?: () => void;
}

const ContactForm = ({ selectedDate, selectedTime, onChangeTime }: ContactFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  // Reset form when date/time changes (clear old submission)
  useEffect(() => {
    if (selectedDate && selectedTime) {
      // User has selected both date and time, form is ready to submit
    }
  }, [selectedDate, selectedTime]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error("Please enter your name");
      return;
    }
    if (!formData.email.trim()) {
      toast.error("Please enter your email");
      return;
    }
    if (!formData.phone.trim()) {
      toast.error("Please enter your phone number");
      return;
    }
    if (!formData.message.trim()) {
      toast.error("Please enter your message");
      return;
    }
    if (!selectedDate) {
      toast.error("Please select an appointment date from the calendar");
      return;
    }
    if (!selectedTime) {
      toast.error("Please select a time slot");
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. Save to Neon database
      const resp = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          appointmentDate: selectedDate.toISOString().split("T")[0],
          appointmentTime: selectedTime,
        }),
      });

      const data = await resp.json();

      if (!resp.ok) {
        throw new Error(data.error || "Failed to send message");
      }

      // 2. Send email to admin via EmailJS (client-side)
      try {
        const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!;
        const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!;
        const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!;

        const dateStr = selectedDate.toLocaleDateString("en-US", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        });

        emailjs.init(publicKey);
        await emailjs.send(serviceId, templateId, {
          name: formData.name.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim(),
          message: formData.message.trim(),
          appointment_date: dateStr,
          appointment_time: selectedTime,
          to_email: "yumna8178@gmail.com",
          to_name: "Admin",
        });

        console.log("✅ Email sent via EmailJS");
      } catch (emailErr) {
        console.error("Email send failed (non-blocking):", emailErr);
      }

      toast.success("Appointment request sent successfully! We'll contact you soon.");
      setFormData({ name: "", email: "", phone: "", message: "" });
    } catch (error: any) {
      console.error("Contact form error:", error);
      toast.error(error.message || "Failed to send message");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Date & Time Display */}
      {selectedDate && selectedTime && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-xl space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CalendarDays className="h-4 w-4 text-green-600 flex-shrink-0" />
              <span className="text-sm text-green-700 font-medium">
                {selectedDate.toLocaleDateString("en-US", {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
            </div>
            <button
              type="button"
              onClick={onChangeTime}
              className="text-xs text-green-600 hover:text-green-700 underline font-medium"
            >
              Change
            </button>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-green-600 flex-shrink-0" />
              <span className="text-sm text-green-700 font-medium">{selectedTime}</span>
            </div>
          </div>
        </div>
      )}

      {/* Name */}
      <div>
        <Label htmlFor="contact-name" className="text-foreground mb-2 block font-medium">
          Your Name
        </Label>
        <div className="relative">
          <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            id="contact-name"
            name="name"
            type="text"
            placeholder="Your full name"
            value={formData.name}
            onChange={handleChange}
            className="pl-10 bg-white border-border h-11 text-black focus:bg-gray-50 focus:border-primary transition-colors"
            required
          />
        </div>
      </div>

      {/* Email */}
      <div>
        <Label htmlFor="contact-email" className="text-foreground mb-2 block font-medium">
          Email Address
        </Label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            id="contact-email"
            name="email"
            type="email"
            placeholder="your@email.com"
            value={formData.email}
            onChange={handleChange}
            className="pl-10 bg-white border-border h-11 text-black focus:bg-gray-50 focus:border-primary transition-colors"
            required
          />
        </div>
      </div>

      {/* Phone */}
      <div>
        <Label htmlFor="contact-phone" className="text-foreground mb-2 block font-medium">
          Phone Number
        </Label>
        <div className="relative">
          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            id="contact-phone"
            name="phone"
            type="tel"
            placeholder="03XX-XXXXXXX"
            value={formData.phone}
            onChange={handleChange}
            className="pl-10 bg-white border-border h-11 text-black focus:bg-gray-50 focus:border-primary transition-colors"
            required
          />
        </div>
      </div>

      {/* Message */}
      <div>
        <Label htmlFor="contact-message" className="text-foreground mb-2 block font-medium">
          Your Message / Skin Concern
        </Label>
        <div className="relative">
          <MessageSquare className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Textarea
            id="contact-message"
            name="message"
            placeholder="Describe your skin concern or any questions..."
            value={formData.message}
            onChange={handleChange}
            className="pl-10 bg-white border-border min-h-[120px] text-black focus:bg-gray-50 focus:border-primary transition-colors"
            rows={4}
            required
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
            Sending Request...
          </span>
        ) : (
          <span className="flex items-center gap-2">
            <Send className="h-4 w-4" />
            Request Appointment
          </span>
        )}
      </Button>
    </form>
  );
};

export default ContactForm;
