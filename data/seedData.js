// seedData.js - Default data for LCart Locality Service Provider
module.exports = {
  categories: [
    {
      id: "cat-electrician",
      name: "Electrician",
      slug: "electrician",
      icon: "⚡",
      badge: "Fast 30 Min",
      description: "Switchboards, house wiring, appliance setup & emergency electrical fixes."
    },
    {
      id: "cat-painter",
      name: "Painter",
      slug: "painter",
      icon: "🎨",
      badge: "Eco Paints",
      description: "Interior & exterior wall painting, waterproof putty, and designer textures."
    },
    {
      id: "cat-tutor",
      name: "Tuition Teacher",
      slug: "tutor",
      icon: "📚",
      badge: "Verified Tutors",
      description: "CBSE/ICSE home tutors, STEM specialists & spoken language coaching."
    },
    {
      id: "cat-cleaner",
      name: "Cleaner",
      slug: "cleaner",
      icon: "✨",
      badge: "Deep Sanitized",
      description: "Full home deep cleaning, bathroom scrub, kitchen degreasing & sofa wash."
    },
    {
      id: "cat-plumber",
      name: "Plumber",
      slug: "plumber",
      icon: "🔧",
      badge: "No Leak Guarantee",
      description: "Pipe repairs, tap leaks, toilet fitting, water tank & pump installation."
    },
    {
      id: "cat-ac-repair",
      name: "AC & Appliance Repair",
      slug: "ac-repair",
      icon: "❄️",
      badge: "Warranty Covered",
      description: "AC jet service, gas refill, fridge, washing machine & geyser repairs."
    },
    {
      id: "cat-carpenter",
      name: "Carpenter",
      slug: "carpenter",
      icon: "🪚",
      badge: "Master Craftsmen",
      description: "Door locks, furniture repair, modular kitchens, drill & mount fixtures."
    },
    {
      id: "cat-pest-control",
      name: "Pest Control",
      slug: "pest-control",
      icon: "🛡️",
      badge: "Safe for Kids & Pets",
      description: "Cockroach gel treatment, termite control, bed bugs & mosquito fogging."
    }
  ],

  services: [
    // Electrician
    {
      id: "srv-elec-1",
      category_id: "cat-electrician",
      title: "Fan & Ceiling Light Installation / Repair",
      description: "Quick installation or repair of ceiling fans, chandeliers, spotlights, LED downlights.",
      price: 199,
      duration: "45 mins",
      rating: 4.9,
      reviews_count: 320,
      image_url: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=600&q=80",
      features: ["All tools included", "Post-service testing", "30-day rework warranty"],
      popular: true
    },
    {
      id: "srv-elec-2",
      category_id: "cat-electrician",
      title: "Switchboard & MCB Fuse Repair",
      description: "Diagnose short circuits, replace burnt switches, sockets, and tripping MCBs safely.",
      price: 249,
      duration: "30 mins",
      rating: 4.8,
      reviews_count: 184,
      image_url: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80",
      features: ["Certified electrician", "Safety insulated gears", "Genuine spare parts"],
      popular: false
    },
    {
      id: "srv-elec-3",
      category_id: "cat-electrician",
      title: "Complete Home Electrical Wiring & Audit",
      description: "Full apartment electrical health checkup, earthing verification, and wiring overhaul.",
      price: 1299,
      duration: "3 hours",
      rating: 4.9,
      reviews_count: 98,
      image_url: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80",
      features: ["Detailed health report", "Earthing resistance check", "Load balance analysis"],
      popular: true
    },

    // Painter
    {
      id: "srv-paint-1",
      category_id: "cat-painter",
      title: "Complete Full Home Wall Painting (Interior)",
      description: "Premium smooth finish with 2 coats of paint, wall putty, and primer. Zero dust cleanup.",
      price: 4999,
      duration: "1-2 days",
      rating: 4.9,
      reviews_count: 245,
      image_url: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=600&q=80",
      features: ["Asian Paints / Nerolac Royale", "Furniture masking included", "1 Year warranty"],
      popular: true
    },
    {
      id: "srv-paint-2",
      category_id: "cat-painter",
      title: "Accent Feature Wall & Texture Design",
      description: "Designer metallic stencil and textured wall art for living rooms and master bedrooms.",
      price: 1899,
      duration: "4 hours",
      rating: 4.7,
      reviews_count: 112,
      image_url: "https://images.unsplash.com/photo-1562259949-e8e7689d7828?auto=format&fit=crop&w=600&q=80",
      features: ["Catalog of 50+ patterns", "High-durability gloss", "Expert artisan"],
      popular: false
    },
    {
      id: "srv-paint-3",
      category_id: "cat-painter",
      title: "Waterproofing & Damp Wall Putty Treatment",
      description: "Treat moisture seepage, peeling flakes, and mold before repainting for long-term health.",
      price: 2199,
      duration: "5 hours",
      rating: 4.8,
      reviews_count: 87,
      image_url: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=600&q=80",
      features: ["Moisture meter scan", "Dr. Fixit polymer coating", "3-Year anti-seepage guarantee"],
      popular: false
    },

    // Tuition Teacher
    {
      id: "srv-tut-1",
      category_id: "cat-tutor",
      title: "Primary School All-Subjects Home Tutor (Class 1-5)",
      description: "Dedicated 1-on-1 personalized tutoring covering English, Math, Science, and Homework Help.",
      price: 2499,
      duration: "1 Month (12 sessions)",
      rating: 5.0,
      reviews_count: 310,
      image_url: "https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=600&q=80",
      features: ["Background verified tutors", "Weekly progress reports", "Free 1-hour demo session"],
      popular: true
    },
    {
      id: "srv-tut-2",
      category_id: "cat-tutor",
      title: "Secondary Math & Science Specialist (Class 6-10)",
      description: "Concept mastery, board exam preparations, problem-solving techniques for CBSE & ICSE.",
      price: 3499,
      duration: "1 Month (16 sessions)",
      rating: 4.9,
      reviews_count: 220,
      image_url: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=600&q=80",
      features: ["IIT/NIT graduate tutors", "Chapter mock test papers", "Doubt clearing on WhatsApp"],
      popular: true
    },
    {
      id: "srv-tut-3",
      category_id: "cat-tutor",
      title: "Spoken English & Communication Skills Coaching",
      description: "Interactive conversational practice, vocabulary building, and interview readiness.",
      price: 1999,
      duration: "1 Month (10 sessions)",
      rating: 4.8,
      reviews_count: 75,
      image_url: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=600&q=80",
      features: ["Phonetics & accent clarity", "Public speaking drills", "Personalized feedback"],
      popular: false
    },

    // Cleaner
    {
      id: "srv-clean-1",
      category_id: "cat-cleaner",
      title: "Full Home Deep Cleaning (2 BHK / 3 BHK)",
      description: "Intensive 360-degree cleaning of bedrooms, balconies, floors, cobwebs, and windows.",
      price: 1899,
      duration: "4 hours",
      rating: 4.9,
      reviews_count: 420,
      image_url: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=600&q=80",
      features: ["Industrial vacuuming", "Eco-friendly chemicals", "3 Cleaners deployed"],
      popular: true
    },
    {
      id: "srv-clean-2",
      category_id: "cat-cleaner",
      title: "Kitchen Deep Degreasing & Appliance Sanitization",
      description: "Exhaustive oil removal from chimney, gas stove, tile backsplashes, and cabinets.",
      price: 999,
      duration: "2 hours",
      rating: 4.8,
      reviews_count: 195,
      image_url: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=600&q=80",
      features: ["Steam grease removal", "Disinfected countertops", "Sink pipe descaling"],
      popular: false
    },
    {
      id: "srv-clean-3",
      category_id: "cat-cleaner",
      title: "Sofa & Upholstery Deep Shampoo Wash",
      description: "Injection-extraction foam machine washing for 3-5 seater fabric and leather sofas.",
      price: 799,
      duration: "90 mins",
      rating: 4.9,
      reviews_count: 140,
      image_url: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=600&q=80",
      features: ["Stain extraction", "Fragrance infusion", "Dry in 2-3 hours"],
      popular: false
    },

    // Plumber
    {
      id: "srv-plumb-1",
      category_id: "cat-plumber",
      title: "Tap, Shower & Pipe Leakage Instant Repair",
      description: "Fix dripping faucets, concealed pipeline leaks, flush tanks, and broken valve washers.",
      price: 199,
      duration: "30 mins",
      rating: 4.8,
      reviews_count: 360,
      image_url: "https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?auto=format&fit=crop&w=600&q=80",
      features: ["Quick 30 min arrival", "No drip guarantee", "Standard fittings stocked"],
      popular: true
    },
    {
      id: "srv-plumb-2",
      category_id: "cat-plumber",
      title: "Water Tank Cleaning & Motor Pump Overhaul",
      description: "Rotary high-pressure jet wash, UV sanitization, sludge extraction for overhead & sump tanks.",
      price: 899,
      duration: "2 hours",
      rating: 4.9,
      reviews_count: 165,
      image_url: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=600&q=80",
      features: ["Anti-bacterial sludge removal", "Pump priming check", "Clean certified water"],
      popular: false
    },

    // AC & Appliance Repair
    {
      id: "srv-ac-1",
      category_id: "cat-ac-repair",
      title: "AC Deep Foam Jet Cleaning & Gas Top-up",
      description: "High-pressure indoor coil cleaning, outdoor unit water wash, cooling gas level test.",
      price: 599,
      duration: "60 mins",
      rating: 4.9,
      reviews_count: 530,
      image_url: "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&w=600&q=80",
      features: ["Boosts cooling by 40%", "Saves electricity", "Antibacterial coat"],
      popular: true
    },
    {
      id: "srv-ac-2",
      category_id: "cat-ac-repair",
      title: "Washing Machine & Refrigerator Repair",
      description: "Fix spinning errors, water drainage, compressor cooling issues, and motor sounds.",
      price: 349,
      duration: "45 mins",
      rating: 4.7,
      reviews_count: 178,
      image_url: "https://images.unsplash.com/photo-1582735689369-4fe89db7114c?auto=format&fit=crop&w=600&q=80",
      features: ["OEM spare parts", "90-day parts guarantee", "Same day resolution"],
      popular: false
    },

    // Carpenter
    {
      id: "srv-carp-1",
      category_id: "cat-carpenter",
      title: "Furniture Repair, Door Locks & Hinges Fitting",
      description: "Align stuck doors, repair squeaky beds, install Godrej security locks, replace cabinet hinges.",
      price: 299,
      duration: "45 mins",
      rating: 4.8,
      reviews_count: 210,
      image_url: "https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?auto=format&fit=crop&w=600&q=80",
      features: ["Precision woodwork", "High-grade brass hardware", "Smooth alignments"],
      popular: false
    },
    {
      id: "srv-carp-2",
      category_id: "cat-carpenter",
      title: "Drill, Hang & Wall Fixtures (TV Mount, Curtains, Art)",
      description: "Laser-leveled wall drilling for heavy LED TVs, curtain rods, mirrors, and shelving units.",
      price: 249,
      duration: "30 mins",
      rating: 4.9,
      reviews_count: 285,
      image_url: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=600&q=80",
      features: ["Concealed cable routing", "Heavy anchor grip", "Spotless dust collection"],
      popular: true
    },

    // Pest Control
    {
      id: "srv-pest-1",
      category_id: "cat-pest-control",
      title: "Herbal Cockroach & Ant Gel Control",
      description: "100% odorless herbal gel application in corners and drawers. No need to empty kitchens.",
      price: 699,
      duration: "45 mins",
      rating: 4.9,
      reviews_count: 310,
      image_url: "https://images.unsplash.com/photo-1628177142898-93e36e4e3a50?auto=format&fit=crop&w=600&q=80",
      features: ["Odor-free & chemical safe", "Kids & pets friendly", "90-day re-service guarantee"],
      popular: true
    },
    {
      id: "srv-pest-2",
      category_id: "cat-pest-control",
      title: "Comprehensive Termite (Deemak) Eradication",
      description: "Chemical barrier drill-and-fill treatment along skirting and wooden structures.",
      price: 1499,
      duration: "3 hours",
      rating: 4.8,
      reviews_count: 110,
      image_url: "https://images.unsplash.com/photo-1584622781564-1d987f7333c1?auto=format&fit=crop&w=600&q=80",
      features: ["Drill-hole wall protection", "Bayer approved solution", "2-Year warranty card"],
      popular: false
    }
  ],

  providers: [
    {
      id: "pro-1",
      name: "Rajesh Kumar Sharma",
      profession: "Senior Electrician",
      category_id: "cat-electrician",
      phone: "+91 98765 43210",
      rating: 4.95,
      jobs_completed: 680,
      experience: "9 Years",
      locality: "Civil Lines & Model Town",
      verified: true,
      avatar_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80"
    },
    {
      id: "pro-2",
      name: "Sunita Verma, M.Sc.",
      profession: "Senior Mathematics & Science Tutor",
      category_id: "cat-tutor",
      phone: "+91 98112 34567",
      rating: 5.0,
      jobs_completed: 420,
      experience: "7 Years",
      locality: "Sector 14 & University Enclave",
      verified: true,
      avatar_url: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80"
    },
    {
      id: "pro-3",
      name: "Amit 'Artisan' Mondal",
      profession: "Master Texture Painter",
      category_id: "cat-painter",
      phone: "+91 97654 32109",
      rating: 4.9,
      jobs_completed: 510,
      experience: "11 Years",
      locality: "Green Park & South Extension",
      verified: true,
      avatar_url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80"
    },
    {
      id: "pro-4",
      name: "Priya Devi & Team",
      profession: "Deep Cleaning Specialist",
      category_id: "cat-cleaner",
      phone: "+91 99234 56781",
      rating: 4.92,
      jobs_completed: 890,
      experience: "6 Years",
      locality: "Indira Nagar & Gomti Sector",
      verified: true,
      avatar_url: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80"
    },
    {
      id: "pro-5",
      name: "Mohammed Farooq",
      profession: "Lead Plumber & Leakage Auditor",
      category_id: "cat-plumber",
      phone: "+91 98451 98765",
      rating: 4.88,
      jobs_completed: 740,
      experience: "12 Years",
      locality: "Koramangala & HSR Layout",
      verified: true,
      avatar_url: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80"
    },
    {
      id: "pro-6",
      name: "Vikram Chauhan",
      profession: "Certified HVAC & AC Technician",
      category_id: "cat-ac-repair",
      phone: "+91 98101 23456",
      rating: 4.94,
      jobs_completed: 910,
      experience: "8 Years",
      locality: "Viman Nagar & Kalyani Nagar",
      verified: true,
      avatar_url: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=200&q=80"
    }
  ],

  sampleReviews: [
    {
      id: "rev-1",
      service_id: "srv-elec-1",
      user_name: "Ananya Deshmukh",
      rating: 5,
      comment: "Rajesh arrived in 25 minutes! Fixed our bedroom fan regulator and replaced the broken MCB switch effortlessly. Very professional and polite.",
      created_at: "2026-10-05T14:30:00Z"
    },
    {
      id: "rev-2",
      service_id: "srv-tut-2",
      user_name: "Dr. Alok Sen",
      rating: 5,
      comment: "Sunita Ma'am has been an exceptional tutor for my Class 9 daughter. Her score in math jumped from 68% to 92% in the midterm exams!",
      created_at: "2026-10-07T11:15:00Z"
    },
    {
      id: "rev-3",
      service_id: "srv-paint-1",
      user_name: "Rohan Kapoor",
      rating: 5,
      comment: "Amazing paint finish! The painters covered all our furniture with plastic sheets, repaired hairline cracks, and left the home sparkling clean.",
      created_at: "2026-10-08T18:00:00Z"
    },
    {
      id: "rev-4",
      service_id: "srv-clean-1",
      user_name: "Meera Nair",
      rating: 5,
      comment: "Priya Devi and her team made our 3 BHK look brand new before Diwali. The kitchen chimney and bathroom stains are completely gone!",
      created_at: "2026-10-09T09:40:00Z"
    }
  ]
};
