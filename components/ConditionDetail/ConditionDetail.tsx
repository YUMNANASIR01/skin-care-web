"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { conditions } from "@/lib/data/conditions";
import { ArrowLeft, Check, Pill, Utensils, Heart } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const imageMap: Record<string, string> = {
  acne: "/assets/acne.jpg",
  eczema: "/assets/eczema.jpg",
  psoriasis: "/assets/psoriasis.jpg",
  fungal: "/assets/fungal.jpg",
  vitiligo: "/assets/vitiligo.jpg",
  rosacea: "/assets/Rosacea.jpg",
  urticaria: "/assets/urticaria.jpg",
  dermatitis: "/assets/contact-dermatitis.jpg",
  scabies: "/assets/scabies.jpg",
  melasma: "/assets/melasma.jpg",
  warts: "/assets/warts.jpg",
  alopecia: "/assets/alopecia.jpg",
  "lichen-planus": "/assets/lichen-planus.jpg",
  seborrheic: "/assets/seborrheic-dermatitis.jpg",
};

const ConditionDetail = () => {
  const params = useParams();
  const id = params?.id as string;
  const condition = conditions.find((c) => c.id === id);

  if (!condition) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="font-heading text-3xl font-bold mb-4">Condition Not Found</h1>
          <Link href="/" className="text-primary hover:underline">Go back home</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="relative h-64 md:h-90 overflow-hidden bg-muted">
        {imageMap[condition.image] ? (
          <img src={imageMap[condition.image]} alt={condition.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
            <span className="text-6xl font-bold text-primary/30">{condition.name.charAt(0)}</span>
          </div>
        )}
        <div className="absolute inset-0 bg-foreground/60" />
        <div className="absolute inset-0 flex items-center">
          <div className="container mx-auto px-4">
            <Link href="/" className="inline-flex items-center gap-2 text-sm text-primary-foreground/80 hover:text-primary-foreground mb-4">
              <ArrowLeft className="h-4 w-4" /> Back to Home
            </Link>
            <h1 className="font-heading text-4xl md:text-5xl font-bold text-primary-foreground">{condition.name}</h1>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        {/* Description & Symptoms */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="md:col-span-2">
            <h2 className="font-heading text-2xl font-semibold text-foreground mb-4">About {condition.name}</h2>
            <p className="text-muted-foreground leading-relaxed">{condition.description}</p>
          </div>
          <div className="bg-card rounded-xl p-6 card-shadow">
            <h3 className="font-heading text-lg font-semibold text-foreground mb-4">Common Symptoms</h3>
            <ul className="space-y-3">
              {condition.symptoms.map((s) => (
                <li key={s} className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-muted-foreground">{s}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Treatment Steps */}
        <div className="mb-16">
          <div className="flex items-center gap-3 mb-8">
            <Pill className="h-6 w-6 text-primary" />
            <h2 className="font-heading text-2xl font-semibold text-foreground">Step-by-Step Homeopathic Treatment</h2>
          </div>
          <div className="space-y-6">
            {condition.treatments.map((t) => (
              <div key={t.step} className="bg-card rounded-xl p-6 card-shadow border-l-4 border-primary">
                <div className="flex items-center gap-3 mb-3">
                  <span className="bg-primary text-primary-foreground w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                    {t.step}
                  </span>
                  <h3 className="font-heading text-lg font-semibold text-foreground">{t.title}</h3>
                </div>
                <p className="text-muted-foreground mb-4 ml-11">{t.description}</p>
                <div className="ml-11 flex flex-wrap gap-4">
                  <div className="bg-secondary rounded-lg px-4 py-2">
                    <span className="text-xs text-muted-foreground">Remedy</span>
                    <p className="text-sm font-semibold text-secondary-foreground">{t.remedy}</p>
                  </div>
                  <div className="bg-secondary rounded-lg px-4 py-2">
                    <span className="text-xs text-muted-foreground">Dosage</span>
                    <p className="text-sm font-semibold text-secondary-foreground">{t.dosage}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tips */}
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-card rounded-xl p-6 card-shadow">
            <div className="flex items-center gap-2 mb-4">
              <Utensils className="h-5 w-5 text-primary" />
              <h3 className="font-heading text-lg font-semibold text-foreground">Dietary Tips</h3>
            </div>
            <ul className="space-y-3">
              {condition.dietaryTips.map((tip) => (
                <li key={tip} className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-muted-foreground">{tip}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-card rounded-xl p-6 card-shadow">
            <div className="flex items-center gap-2 mb-4">
              <Heart className="h-5 w-5 text-primary" />
              <h3 className="font-heading text-lg font-semibold text-foreground">Lifestyle Tips</h3>
            </div>
            <ul className="space-y-3">
              {condition.lifestyleTips.map((tip) => (
                <li key={tip} className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-muted-foreground">{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-12 bg-accent/50 rounded-xl p-6 text-center">
          <p className="text-sm text-muted-foreground">
            <strong>Disclaimer:</strong> This information is for educational purposes only and not a substitute for professional medical advice. 
            Always consult a qualified homeopathic practitioner before starting any treatment.
          </p>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ConditionDetail;
