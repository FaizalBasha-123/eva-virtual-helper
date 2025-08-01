// Mock models data
export const carModels = {
  "Maruti Suzuki": ["Swift", "Baleno", "Dzire", "Alto", "WagonR"],
  "Hyundai": ["i20", "Creta", "Venue", "i10", "Verna"],
  "Tata": ["Nexon", "Harrier", "Tiago", "Altroz", "Safari"],
  "Honda": ["City", "Amaze", "Jazz", "WRV", "Civic"],
};

export const bikeModels = {
  "Hero": ["Splendor", "HF Deluxe", "Passion", "Glamour", "Xpulse"],
  "Honda": ["Activa", "Shine", "Unicorn", "CB", "Dio"],
  "TVS": ["Apache", "Jupiter", "XL100", "Ntorq", "Raider"],
  "Bajaj": ["Pulsar", "Platina", "CT", "Avenger", "Dominar"],
};

// Enhanced variants data with fuel type and transmission
export const variants = {
  "Swift": [
    { name: "VXI", fuelType: "Petrol", transmission: "Manual" },
    { name: "ZXI", fuelType: "Petrol", transmission: "Manual" },
    { name: "VXI AMT", fuelType: "Petrol", transmission: "Automatic" },
    { name: "ZXI AMT", fuelType: "Petrol", transmission: "Automatic" },
    { name: "VXI CNG", fuelType: "CNG", transmission: "Manual" },
    { name: "LXI", fuelType: "Petrol", transmission: "Manual" }
  ],
  "Creta": [
    { name: "E", fuelType: "Petrol", transmission: "Manual" },
    { name: "EX", fuelType: "Petrol", transmission: "Manual" },
    { name: "S", fuelType: "Petrol", transmission: "Automatic" },
    { name: "SX", fuelType: "Diesel", transmission: "Manual" },
    { name: "SX(O)", fuelType: "Diesel", transmission: "Automatic" }
  ],
  "Nexon": [
    { name: "XE", fuelType: "Petrol", transmission: "Manual" },
    { name: "XM", fuelType: "Petrol", transmission: "Manual" },
    { name: "XZ+", fuelType: "Petrol", transmission: "Automatic" },
    { name: "XZ+ Lux", fuelType: "Diesel", transmission: "Manual" },
    { name: "XZA+", fuelType: "Diesel", transmission: "Automatic" },
    { name: "EV XZ+", fuelType: "Electric", transmission: "Automatic" }
  ],
  "City": [
    { name: "V", fuelType: "Petrol", transmission: "Manual" },
    { name: "VX", fuelType: "Petrol", transmission: "Manual" },
    { name: "ZX", fuelType: "Petrol", transmission: "Automatic" },
    { name: "V Hybrid", fuelType: "Hybrid", transmission: "Automatic" }
  ],
  "Splendor": [
    { name: "Plus", fuelType: "Petrol", transmission: "Manual" },
    { name: "Pro", fuelType: "Petrol", transmission: "Manual" },
    { name: "iSmart", fuelType: "Petrol", transmission: "Manual" },
    { name: "Black and Accent", fuelType: "Petrol", transmission: "Manual" },
    { name: "Plus i3s", fuelType: "Petrol", transmission: "Manual" }
  ],
  // Add more model variants as needed
};
