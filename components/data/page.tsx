export interface Treatment {
  step: number;
  title: string;
  description: string;
  remedy: string;
  dosage: string;
}

export interface Condition {
  id: string;
  name: string;
  description: string;
  symptoms: string[];
  image: string;
  treatments: Treatment[];
  dietaryTips: string[];
  lifestyleTips: string[];
}

export const conditions: Condition[] = [
  {
    id: "acne",
    name: "Acne",
    description: "Acne is a skin condition caused by clogged pores, excess oil, bacteria, and inflammation. Homeopathic remedies address the root cause by balancing hormones and detoxifying the body.",
    symptoms: ["Whiteheads & blackheads", "Pimples & pustules", "Oily skin", "Redness & inflammation", "Scarring"],
    image: "acne",
    treatments: [
      { step: 1, title: "Initial Assessment", description: "Identify the type of acne — whether it's hormonal, bacterial, or diet-related. Note the location and severity.", remedy: "Sulphur 30C", dosage: "3 pellets twice daily for 1 week" },
      { step: 2, title: "Detoxification", description: "Begin internal cleansing to remove toxins that contribute to skin breakouts.", remedy: "Berberis Vulgaris Q", dosage: "10 drops in water, twice daily for 2 weeks" },
      { step: 3, title: "Targeted Treatment", description: "Use specific remedies based on acne type. For pustular acne with pus formation.", remedy: "Hepar Sulph 30C", dosage: "3 pellets three times daily for 2 weeks" },
      { step: 4, title: "Hormonal Balance", description: "Address underlying hormonal imbalances that trigger acne.", remedy: "Pulsatilla 200C", dosage: "1 dose weekly for 4 weeks" },
      { step: 5, title: "Scar Healing", description: "Promote healing of acne scars and prevent new breakouts.", remedy: "Silicea 6X", dosage: "4 tablets twice daily for 1 month" },
    ],
    dietaryTips: ["Avoid dairy and sugary foods", "Increase zinc-rich foods like pumpkin seeds", "Drink 8-10 glasses of water daily", "Include fresh fruits and leafy greens"],
    lifestyleTips: ["Wash face twice daily with mild cleanser", "Avoid touching your face frequently", "Change pillowcases weekly", "Manage stress through yoga or meditation"],
  },
  {
    id: "eczema",
    name: "Eczema",
    description: "Eczema (atopic dermatitis) causes dry, itchy, and inflamed skin. Homeopathy treats eczema by strengthening the immune system and reducing hypersensitivity.",
    symptoms: ["Intense itching", "Dry, cracked skin", "Red or brownish patches", "Small raised bumps", "Thickened skin"],
    image: "eczema",
    treatments: [
      { step: 1, title: "Itch Relief", description: "Address the immediate itching and discomfort to improve quality of life.", remedy: "Graphites 30C", dosage: "3 pellets three times daily for 1 week" },
      { step: 2, title: "Skin Moisture Restoration", description: "Restore the skin's natural moisture barrier and reduce dryness.", remedy: "Petroleum 30C", dosage: "3 pellets twice daily for 2 weeks" },
      { step: 3, title: "Immune Modulation", description: "Strengthen the immune system to reduce allergic reactions.", remedy: "Arsenicum Album 200C", dosage: "1 dose weekly for 6 weeks" },
      { step: 4, title: "Deep Healing", description: "Address the constitutional tendency towards eczema.", remedy: "Sulphur 200C", dosage: "1 dose every 2 weeks for 2 months" },
    ],
    dietaryTips: ["Eliminate common allergens (eggs, nuts, dairy)", "Include omega-3 fatty acids", "Eat anti-inflammatory foods like turmeric", "Avoid processed and spicy foods"],
    lifestyleTips: ["Use fragrance-free moisturizers", "Wear soft cotton clothing", "Keep nails short to prevent scratching", "Use a humidifier in dry environments"],
  },
  {
    id: "psoriasis",
    name: "Psoriasis",
    description: "Psoriasis is an autoimmune condition causing rapid skin cell buildup, resulting in scales and red patches. Homeopathy aims to slow cell turnover and reduce inflammation.",
    symptoms: ["Red patches with silvery scales", "Dry, cracked skin that may bleed", "Itching & burning", "Thickened nails", "Stiff, swollen joints"],
    image: "psoriasis",
    treatments: [
      { step: 1, title: "Scale Reduction", description: "Reduce the thick, silvery scales and soothe the affected areas.", remedy: "Arsenicum Iodatum 30C", dosage: "3 pellets three times daily for 2 weeks" },
      { step: 2, title: "Inflammation Control", description: "Address the underlying inflammation and redness.", remedy: "Kali Arsenicicum 30C", dosage: "3 pellets twice daily for 3 weeks" },
      { step: 3, title: "Autoimmune Regulation", description: "Work on regulating the overactive immune response.", remedy: "Thyroidinum 200C", dosage: "1 dose weekly for 8 weeks" },
      { step: 4, title: "Constitutional Treatment", description: "Deep-acting remedy for long-term management.", remedy: "Lycopodium 200C", dosage: "1 dose every 2 weeks for 3 months" },
    ],
    dietaryTips: ["Follow an anti-inflammatory diet", "Include vitamin D-rich foods", "Eat plenty of colorful vegetables", "Limit alcohol and red meat"],
    lifestyleTips: ["Get moderate sun exposure", "Manage stress levels actively", "Keep skin moisturized always", "Avoid skin injuries and irritants"],
  },
  {
    id: "fungal-infections",
    name: "Fungal Infections",
    description: "Fungal skin infections like ringworm, athlete's foot, and candidiasis cause itching, redness, and scaling. Homeopathy builds the body's resistance against fungal organisms.",
    symptoms: ["Ring-shaped rash", "Intense itching", "Redness & scaling", "Cracking between toes", "White patches on skin"],
    image: "fungal",
    treatments: [
      { step: 1, title: "Antifungal Action", description: "Use remedies with strong antifungal properties to combat the infection.", remedy: "Tellurium 30C", dosage: "3 pellets three times daily for 1 week" },
      { step: 2, title: "Itch & Inflammation Relief", description: "Soothe the itching and reduce inflammation at the infection site.", remedy: "Sepia 30C", dosage: "3 pellets twice daily for 2 weeks" },
      { step: 3, title: "Immunity Boost", description: "Strengthen the body's natural defense against fungal organisms.", remedy: "Bacillinum 200C", dosage: "1 dose weekly for 4 weeks" },
      { step: 4, title: "Prevention & Maintenance", description: "Prevent recurrence and maintain healthy skin.", remedy: "Sulphur 200C", dosage: "1 dose every 2 weeks for 2 months" },
    ],
    dietaryTips: ["Reduce sugar and refined carbohydrates", "Include garlic and coconut oil in diet", "Eat probiotic-rich foods like yogurt", "Drink green tea for antifungal benefits"],
    lifestyleTips: ["Keep affected areas clean and dry", "Wear breathable cotton clothing", "Don't share personal items like towels", "Change socks and underwear daily"],
  },
  {
    id: "vitiligo",
    name: "Vitiligo",
    description: "Vitiligo causes loss of skin color in patches due to destruction of melanocytes. Homeopathy aims to stimulate melanin production and regulate the immune response.",
    symptoms: ["White patches on skin", "Premature graying of hair", "Loss of color in mouth tissues", "Color loss around eyes", "Patches spreading over time"],
    image: "vitiligo",
    treatments: [
      { step: 1, title: "Melanin Stimulation", description: "Stimulate melanocyte activity in affected areas.", remedy: "Arsenicum Sulph Flavum 30C", dosage: "3 pellets twice daily for 2 weeks" },
      { step: 2, title: "Immune Regulation", description: "Address autoimmune factors causing melanocyte destruction.", remedy: "Syphilinum 200C", dosage: "1 dose weekly for 6 weeks" },
      { step: 3, title: "Repigmentation Support", description: "Promote natural repigmentation of white patches.", remedy: "Psorinum 200C", dosage: "1 dose every 2 weeks for 3 months" },
      { step: 4, title: "Constitutional Treatment", description: "Deep-acting remedy for long-term management.", remedy: "Natrum Mur 200C", dosage: "1 dose monthly for 6 months" },
    ],
    dietaryTips: ["Include copper-rich foods like nuts and seeds", "Eat foods rich in vitamin B12 and folic acid", "Add leafy greens and carrots", "Avoid citrus fruits in excess"],
    lifestyleTips: ["Use sunscreen on affected areas", "Avoid skin trauma or friction", "Manage stress through relaxation techniques", "Get moderate morning sun exposure"],
  },
  {
    id: "rosacea",
    name: "Rosacea",
    description: "Rosacea causes facial redness, visible blood vessels, and sometimes small bumps. Homeopathy helps by reducing vascular sensitivity and inflammation.",
    symptoms: ["Facial redness & flushing", "Visible blood vessels", "Swollen red bumps", "Eye irritation", "Thickened skin on nose"],
    image: "rosacea",
    treatments: [
      { step: 1, title: "Redness Reduction", description: "Calm facial flushing and reduce redness.", remedy: "Belladonna 30C", dosage: "3 pellets three times daily for 1 week" },
      { step: 2, title: "Vascular Support", description: "Strengthen blood vessel walls to reduce visible veins.", remedy: "Carbo Veg 30C", dosage: "3 pellets twice daily for 2 weeks" },
      { step: 3, title: "Inflammation Control", description: "Address underlying inflammation and sensitivity.", remedy: "Lachesis 200C", dosage: "1 dose weekly for 4 weeks" },
      { step: 4, title: "Long-term Management", description: "Prevent flare-ups with constitutional treatment.", remedy: "Silicea 200C", dosage: "1 dose every 2 weeks for 3 months" },
    ],
    dietaryTips: ["Avoid spicy foods and hot beverages", "Limit alcohol consumption", "Eat anti-inflammatory foods", "Include probiotics in your diet"],
    lifestyleTips: ["Use gentle, fragrance-free skincare", "Protect face from sun and wind", "Avoid extreme temperatures", "Track and avoid personal triggers"],
  },
  {
    id: "urticaria",
    name: "Urticaria (Hives)",
    description: "Urticaria presents as itchy, raised welts on the skin triggered by allergens, stress, or infections. Homeopathy addresses the root allergic tendency.",
    symptoms: ["Raised red or skin-colored welts", "Intense itching", "Swelling of lips or eyelids", "Welts that change shape", "Burning sensation"],
    image: "urticaria",
    treatments: [
      { step: 1, title: "Acute Relief", description: "Provide immediate relief from itching and welts.", remedy: "Apis Mellifica 30C", dosage: "3 pellets every 2 hours during acute episode" },
      { step: 2, title: "Allergy Desensitization", description: "Reduce the body's hypersensitive response.", remedy: "Urtica Urens 30C", dosage: "3 pellets three times daily for 2 weeks" },
      { step: 3, title: "Chronic Management", description: "Address chronic recurring hives.", remedy: "Astacus Fluviatilis 200C", dosage: "1 dose weekly for 6 weeks" },
      { step: 4, title: "Constitutional Remedy", description: "Treat the underlying allergic constitution.", remedy: "Natrum Mur 200C", dosage: "1 dose every 2 weeks for 2 months" },
    ],
    dietaryTips: ["Identify and eliminate food triggers", "Avoid artificial additives and preservatives", "Include quercetin-rich foods like onions", "Stay well hydrated"],
    lifestyleTips: ["Wear loose-fitting clothing", "Avoid hot baths and showers", "Keep a symptom diary to identify triggers", "Practice stress management techniques"],
  },
  {
    id: "dermatitis",
    name: "Contact Dermatitis",
    description: "Contact dermatitis is an inflammatory skin reaction caused by direct contact with irritants or allergens. Homeopathy helps heal the skin and reduce sensitivity.",
    symptoms: ["Red rash at contact site", "Intense itching or burning", "Blisters that may weep", "Dry cracked skin", "Swelling and tenderness"],
    image: "dermatitis",
    treatments: [
      { step: 1, title: "Inflammation Relief", description: "Soothe the inflamed and irritated skin.", remedy: "Rhus Tox 30C", dosage: "3 pellets three times daily for 1 week" },
      { step: 2, title: "Blister Healing", description: "Promote healing of blisters and weeping lesions.", remedy: "Croton Tig 30C", dosage: "3 pellets twice daily for 2 weeks" },
      { step: 3, title: "Skin Barrier Repair", description: "Strengthen the skin's natural protective barrier.", remedy: "Graphites 200C", dosage: "1 dose weekly for 4 weeks" },
      { step: 4, title: "Sensitivity Reduction", description: "Reduce skin's overall sensitivity to irritants.", remedy: "Sulphur 200C", dosage: "1 dose every 2 weeks for 2 months" },
    ],
    dietaryTips: ["Eat foods rich in vitamin C and E", "Include anti-inflammatory omega-3 fats", "Avoid known dietary allergens", "Drink herbal teas like chamomile"],
    lifestyleTips: ["Identify and avoid the triggering substance", "Use hypoallergenic products", "Wear protective gloves when handling chemicals", "Moisturize skin regularly"],
  },
  {
    id: "scabies",
    name: "Scabies",
    description: "Scabies is a contagious skin infestation caused by tiny mites that burrow into the skin. Homeopathy treats the infestation and relieves intense itching.",
    symptoms: ["Intense itching worse at night", "Thin burrow tracks on skin", "Rash with tiny blisters", "Sores from scratching", "Crusty patches"],
    image: "scabies",
    treatments: [
      { step: 1, title: "Itch Control", description: "Control the intense itching, especially at night.", remedy: "Sulphur 30C", dosage: "3 pellets three times daily for 1 week" },
      { step: 2, title: "Anti-parasitic Action", description: "Address the mite infestation with anti-parasitic remedies.", remedy: "Psorinum 200C", dosage: "1 dose weekly for 3 weeks" },
      { step: 3, title: "Skin Healing", description: "Promote healing of scratched and damaged skin.", remedy: "Calendula 30C", dosage: "3 pellets twice daily for 2 weeks" },
      { step: 4, title: "Recurrence Prevention", description: "Strengthen skin immunity to prevent reinfestation.", remedy: "Sulphur 200C", dosage: "1 dose every 2 weeks for 2 months" },
    ],
    dietaryTips: ["Boost immunity with vitamin C-rich foods", "Eat garlic for its anti-parasitic properties", "Include turmeric in meals", "Avoid sugar which suppresses immunity"],
    lifestyleTips: ["Wash all bedding and clothing in hot water", "Treat all household members simultaneously", "Avoid close skin-to-skin contact until treated", "Vacuum carpets and furniture thoroughly"],
  },
  {
    id: "melasma",
    name: "Melasma",
    description: "Melasma causes dark, discolored patches on the face, often triggered by hormones or sun exposure. Homeopathy works to regulate pigmentation from within.",
    symptoms: ["Brown or gray-brown patches", "Patches on cheeks, forehead, chin", "Symmetrical discoloration", "Darkening with sun exposure", "Patches on upper lip"],
    image: "melasma",
    treatments: [
      { step: 1, title: "Pigmentation Control", description: "Begin reducing excess melanin production.", remedy: "Sepia 30C", dosage: "3 pellets twice daily for 2 weeks" },
      { step: 2, title: "Hormonal Balance", description: "Address hormonal factors contributing to pigmentation.", remedy: "Pulsatilla 200C", dosage: "1 dose weekly for 6 weeks" },
      { step: 3, title: "Skin Lightening", description: "Gradually lighten dark patches and even out skin tone.", remedy: "Berberis Aquifolium Q", dosage: "10 drops in water twice daily for 1 month" },
      { step: 4, title: "Maintenance", description: "Maintain even skin tone and prevent recurrence.", remedy: "Lycopodium 200C", dosage: "1 dose monthly for 3 months" },
    ],
    dietaryTips: ["Eat vitamin C-rich fruits daily", "Include foods with vitamin E", "Avoid excessive caffeine", "Eat tomatoes for lycopene benefits"],
    lifestyleTips: ["Apply broad-spectrum sunscreen daily", "Wear a wide-brimmed hat outdoors", "Avoid hormonal triggers if possible", "Use gentle skincare without harsh chemicals"],
  },
  {
    id: "warts",
    name: "Warts",
    description: "Warts are benign skin growths caused by HPV. Homeopathy treats warts by boosting the immune system to fight the virus from within.",
    symptoms: ["Rough, grainy bumps", "Flesh-colored or gray growths", "Black pinpoint dots", "Clusters of flat growths", "Pain when walking (plantar warts)"],
    image: "warts",
    treatments: [
      { step: 1, title: "Wart Softening", description: "Begin softening and reducing the wart tissue.", remedy: "Thuja 30C", dosage: "3 pellets three times daily for 2 weeks" },
      { step: 2, title: "Immune Activation", description: "Activate immune response against HPV virus.", remedy: "Causticum 200C", dosage: "1 dose weekly for 4 weeks" },
      { step: 3, title: "Deep Anti-viral", description: "Address the viral root cause at a deeper level.", remedy: "Nitric Acid 200C", dosage: "1 dose weekly for 6 weeks" },
      { step: 4, title: "Recurrence Prevention", description: "Prevent new warts from appearing.", remedy: "Medorrhinum 200C", dosage: "1 dose monthly for 3 months" },
    ],
    dietaryTips: ["Boost zinc intake with pumpkin seeds", "Eat immune-boosting foods rich in vitamin C", "Include mushrooms for immune support", "Avoid processed foods"],
    lifestyleTips: ["Don't pick or scratch warts", "Keep warts covered to prevent spreading", "Don't share towels or personal items", "Wear sandals in public showers"],
  },
  {
    id: "alopecia",
    name: "Alopecia (Hair Loss)",
    description: "Alopecia causes hair loss in patches or all over the scalp. Homeopathy stimulates hair follicles and addresses underlying causes like stress and autoimmunity.",
    symptoms: ["Patchy hair loss on scalp", "Smooth, round bald spots", "Sudden loosening of hair", "Thinning hair overall", "Nail changes"],
    image: "alopecia",
    treatments: [
      { step: 1, title: "Hair Fall Control", description: "Stop active hair shedding and stabilize hair loss.", remedy: "Phosphorus 30C", dosage: "3 pellets twice daily for 2 weeks" },
      { step: 2, title: "Follicle Stimulation", description: "Stimulate dormant hair follicles to promote regrowth.", remedy: "Acid Phos 200C", dosage: "1 dose weekly for 4 weeks" },
      { step: 3, title: "Scalp Nourishment", description: "Improve blood circulation and nourishment to the scalp.", remedy: "Jaborandi Q", dosage: "10 drops in water twice daily for 1 month" },
      { step: 4, title: "Constitutional Support", description: "Address underlying constitutional factors.", remedy: "Silicea 200C", dosage: "1 dose every 2 weeks for 3 months" },
    ],
    dietaryTips: ["Eat protein-rich foods like eggs and lentils", "Include biotin-rich foods like almonds", "Get enough iron from spinach and red meat", "Take vitamin D through diet or sunlight"],
    lifestyleTips: ["Avoid harsh chemical hair treatments", "Use a gentle, sulfate-free shampoo", "Manage stress through meditation", "Avoid tight hairstyles that pull hair"],
  },
  {
    id: "lichen-planus",
    name: "Lichen Planus",
    description: "Lichen planus is an inflammatory condition causing purplish, flat-topped bumps on skin and mucous membranes. Homeopathy reduces inflammation and promotes healing.",
    symptoms: ["Purplish flat-topped bumps", "Itching at affected site", "White lines on lesions", "Oral sores and ulcers", "Nail ridges and damage"],
    image: "lichen-planus",
    treatments: [
      { step: 1, title: "Itch & Burn Relief", description: "Address itching and burning sensations.", remedy: "Arsenicum Album 30C", dosage: "3 pellets three times daily for 1 week" },
      { step: 2, title: "Lesion Healing", description: "Promote healing and flattening of skin lesions.", remedy: "Sulphur Iodatum 30C", dosage: "3 pellets twice daily for 3 weeks" },
      { step: 3, title: "Immune Modulation", description: "Regulate the overactive immune response.", remedy: "Ignatia 200C", dosage: "1 dose weekly for 6 weeks" },
      { step: 4, title: "Long-term Resolution", description: "Deep-acting remedy for complete resolution.", remedy: "Kali Bichromicum 200C", dosage: "1 dose every 2 weeks for 3 months" },
    ],
    dietaryTips: ["Avoid spicy and acidic foods", "Eat soft, bland foods if mouth is affected", "Include anti-inflammatory turmeric and ginger", "Stay hydrated with water and herbal teas"],
    lifestyleTips: ["Avoid scratching affected areas", "Use mild soaps and moisturizers", "Reduce stress levels", "Avoid tobacco and alcohol"],
  },
  {
    id: "seborrheic-dermatitis",
    name: "Seborrheic Dermatitis",
    description: "Seborrheic dermatitis causes scaly patches, red skin, and stubborn dandruff on oily areas. Homeopathy balances oil production and reduces flaking.",
    symptoms: ["White or yellowish flakes", "Red, greasy skin patches", "Itchy scalp", "Crusty scales on scalp", "Rash on face or chest"],
    image: "seborrheic",
    treatments: [
      { step: 1, title: "Flake Reduction", description: "Reduce excessive flaking and dandruff.", remedy: "Kali Sulph 6X", dosage: "4 tablets three times daily for 2 weeks" },
      { step: 2, title: "Oil Balance", description: "Regulate sebum production on the scalp and face.", remedy: "Natrum Mur 30C", dosage: "3 pellets twice daily for 3 weeks" },
      { step: 3, title: "Fungal Control", description: "Address the fungal component of seborrheic dermatitis.", remedy: "Thuja 200C", dosage: "1 dose weekly for 4 weeks" },
      { step: 4, title: "Scalp Health Maintenance", description: "Maintain long-term scalp and skin health.", remedy: "Graphites 200C", dosage: "1 dose every 2 weeks for 2 months" },
    ],
    dietaryTips: ["Reduce sugar and yeast-containing foods", "Eat zinc-rich foods like shellfish", "Include biotin from eggs and nuts", "Add omega-3 fatty acids to your diet"],
    lifestyleTips: ["Wash affected areas regularly with gentle cleanser", "Avoid oily or heavy hair products", "Manage stress which triggers flare-ups", "Get regular sun exposure in moderation"],
  },
];