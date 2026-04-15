"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { conditions } from "@/lib/data/conditions";

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

const ConditionCards = ({ showAll = false }: { showAll?: boolean }) => {
  const displayConditions = showAll ? conditions : conditions.slice(0, 4);

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-4">
            {showAll ? "All Skin Conditions" : "Common Skin Conditions"}
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Learn about these conditions and discover natural homeopathic treatments with our step-by-step guides.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {displayConditions.map((condition, index) => (
            <Link
              key={condition.id}
              href={`/condition/${condition.id}`}
              className="group rounded-xl overflow-hidden bg-card border border-border hover:border-primary/30 hover:shadow-lg transition-all duration-300"
            >
              <div className="aspect-[4/3] overflow-hidden bg-secondary/50 flex items-center justify-center">
                {imageMap[condition.image] ? (
                  <img
                    src={imageMap[condition.image]}
                    alt={condition.name}
                    loading="lazy"
                    width={800}
                    height={600}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <span className="text-4xl font-heading font-bold text-primary/30">{condition.name.charAt(0)}</span>
                )}
              </div>
              <div className="p-5">
                <h3 className="font-heading text-lg font-semibold text-foreground mb-2">{condition.name}</h3>
                <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{condition.description}</p>
                <span className="inline-flex items-center gap-1 text-sm font-medium text-primary group-hover:gap-2 transition-all">
                  View Treatment <ArrowRight className="h-4 w-4" />
                </span>
              </div>
            </Link>
          ))}
        </div>

        {!showAll && (
          <div className="text-center mt-12">
            <Link href="/conditions" className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground px-5 py-3 rounded-full font-small transition-all hover:shadow-lg hover:gap-3">
              View All Conditions <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};

export default ConditionCards;
