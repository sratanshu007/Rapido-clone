export const PLACES = [
  { id: '1', name: 'Connaught Place', area: 'Central Delhi', distKm: 0, lat: 28.6315, lng: 77.2167 },
  { id: '2', name: 'Cyber Hub, DLF Phase 2', area: 'Gurugram', distKm: 24.5, lat: 28.4952, lng: 77.0891 },
  { id: '3', name: 'IGI Airport Terminal 3', area: 'New Delhi', distKm: 16.2, lat: 28.5562, lng: 77.1000 },
  { id: '4', name: 'Sector 18 Market', area: 'Noida', distKm: 18.0, lat: 28.5708, lng: 77.3260 },
  { id: '5', name: 'Hauz Khas Village', area: 'South Delhi', distKm: 12.8, lat: 28.5494, lng: 77.1932 },
  { id: '6', name: 'MG Road Metro Station', area: 'Gurugram', distKm: 26.0, lat: 28.4795, lng: 77.0801 },
  { id: '7', name: 'Select CITYWALK Mall', area: 'Saket, New Delhi', distKm: 14.5, lat: 28.5283, lng: 77.2185 },
];

export const VEHICLES = [
  {
    id: 'ride_go',
    name: 'Ride Go',
    tagline: 'Affordable Everyday Rides',
    category: 'Cab',
    icon: '🚗',
    base: 79,
    perKm: 11,
    timeMin: 3,
    capacity: 4,
    badge: null,
    carModel: 'Maruti WagonR / Celerio',
  },
  {
    id: 'ride_prime',
    name: 'Ride Prime',
    tagline: 'Premium Comfort Sedan',
    category: 'Prime',
    icon: '🚘',
    base: 129,
    perKm: 15,
    timeMin: 2,
    capacity: 4,
    badge: 'Popular',
    carModel: 'Maruti Swift Dzire / Honda Amaze',
  },
  {
    id: 'bike',
    name: 'Bike',
    tagline: 'Quick & Economical',
    category: 'TwoWheeler',
    icon: '🏍️',
    base: 49,
    perKm: 6.5,
    timeMin: 1,
    capacity: 1,
    badge: 'Fastest',
    carModel: 'Hero Splendor / Pulsar',
  },
  {
    id: 'auto',
    name: 'Auto',
    tagline: 'Affordable Local Travel',
    category: 'Auto',
    icon: '🛺',
    base: 39,
    perKm: 8.5,
    timeMin: 1,
    capacity: 3,
    badge: null,
    carModel: 'Bajaj RE Auto',
  },
  {
    id: 'xl_suv',
    name: 'XL SUV',
    tagline: 'Group & Family Travel',
    category: 'SUV',
    icon: '🚙',
    base: 199,
    perKm: 19,
    timeMin: 4,
    capacity: 6,
    badge: '6 Seats',
    carModel: 'Toyota Innova Crysta / Ertiga',
  },
  {
    id: 'ev_green',
    name: 'EV Green',
    tagline: 'Zero Emission Mobility',
    category: 'Electric',
    icon: '⚡',
    base: 89,
    perKm: 12,
    timeMin: 3,
    capacity: 4,
    badge: 'Eco Friendly',
    carModel: 'Tata Nexon EV / Tigor EV',
  },
];

export const SERVICES = [
  { id: 'parcel', title: 'Parcel Delivery', icon: '📦', desc: 'Instant door-to-door courier', color: '#713CF5' },
  { id: 'corporate', title: 'Corporate Rides', icon: '🏢', desc: 'Seamless company travel billing', color: '#24105C' },
  { id: 'airport', title: 'Airport Transfers', icon: '✈️', desc: 'Guaranteed on-time flight pickup', color: '#17B890' },
  { id: 'sharing', title: 'Ride Sharing', icon: '👥', desc: 'Split commute fare with coworkers', color: '#A78BFA' },
  { id: 'ev_rental', title: 'EV Rentals', icon: '⚡', desc: 'Hourly self-drive electric fleet', color: '#FFB547' },
  { id: 'accessible', title: 'Accessible Rides', icon: '♿', desc: 'Wheelchair assisted vehicles', color: '#F05252' },
];

export const COUPONS = [
  { code: 'RIDENOVA50', discount: 50, title: 'Flat ₹50 OFF on first 3 Prime rides', minRide: 150 },
  { code: 'GOGREEN', discount: 30, title: 'Save ₹30 on any EV Green ride', minRide: 100 },
  { code: 'COMMUTEPASS', discount: 20, title: '20% Daily Commute Discount', minRide: 80 },
];

export const calculateFare = (vehicle, pickup, drop) => {
  const d = Math.abs((pickup.lat - drop.lat) * 111) + Math.abs((pickup.lng - drop.lng) * 85);
  const distanceKm = Math.max(3.2, Number(d.toFixed(1)));
  const baseFare = vehicle.base;
  const distanceFare = Math.round(distanceKm * vehicle.perKm);
  const surgeMultiplier = 1.0;
  const surgeCharge = 0;
  const gst = Math.round((baseFare + distanceFare) * 0.05);
  const total = baseFare + distanceFare + surgeCharge + gst;
  const durationMin = Math.round(distanceKm * 2.5) + vehicle.timeMin;

  return {
    distanceKm,
    durationMin,
    baseFare,
    distanceFare,
    surgeCharge,
    gst,
    total,
  };
};

export const SAMPLE_CAPTAIN = {
  name: 'Rohit Kumar',
  rating: 4.9,
  rides: 12348,
  vehicleModel: 'Maruti Swift',
  plate: 'DL 8C 1940',
  photo: '👨🏽‍✈️',
  phone: '+91 98765 43210',
  tripsToday: 12,
  todayEarnings: 1850,
};
