import React, { createContext, useContext, useState } from 'react';
import { PLACES, VEHICLES, SAMPLE_CAPTAIN } from './data';

const AppContext = createContext();

export const useApp = () => useContext(AppContext);

export function AppProvider({ children }) {
  const [appMode, setAppMode] = useState('customer'); // 'customer' | 'captain'

  // Customer state
  const [customer, setCustomer] = useState({
    name: 'Aman Sharma',
    phone: '+91 98765 12345',
    email: 'aman@email.com',
    walletBalance: 1250,
    loyaltyPoints: 480,
    emergencyContacts: [
      { name: 'Mummy', phone: '+91 98765 00001' },
      { name: 'Sister (Pooja)', phone: '+91 98765 00002' },
    ],
    savedPlaces: [
      { id: 'home', label: 'Home', name: 'Connaught Place', icon: '🏠' },
      { id: 'work', label: 'Work', name: 'Cyber Hub, DLF Phase 2', icon: '💼' },
    ],
    transactions: [
      { id: 'tx1', title: 'Ride Refund', date: '16 Nov, 10:24 AM', amount: 50, type: 'credit' },
      { id: 'tx2', title: 'Ride Payment (Prime)', date: '15 Nov, 09:12 PM', amount: 234, type: 'debit' },
      { id: 'tx3', title: 'Wallet Top-up', date: '14 Nov, 06:30 PM', amount: 1000, type: 'credit' },
    ],
  });

  // Current Customer Ride State
  const [pickup, setPickup] = useState(PLACES[0]);
  const [drop, setDrop] = useState(PLACES[1]);
  const [selectedVehicle, setSelectedVehicle] = useState(VEHICLES[1]); // Ride Prime by default
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('Wallet'); // 'Wallet' | 'UPI' | 'Card' | 'Cash'
  const [rideStep, setRideStep] = useState('home'); 
  // 'home' | 'choose_ride' | 'fare_details' | 'finding_captain' | 'captain_assigned' | 'on_the_way' | 'trip_completed' | 'rating'
  const [otp] = useState(String(1000 + Math.floor(Math.random() * 9000)));
  const [activeCaptain, setActiveCaptain] = useState(SAMPLE_CAPTAIN);
  const [activeTab, setActiveTab] = useState('home'); // 'home' | 'activity' | 'wallet' | 'profile' | 'services'

  // Captain App State
  const [captainOnline, setCaptainOnline] = useState(true);
  const [captainTodayEarnings, setCaptainTodayEarnings] = useState(1850);
  const [captainTripsCount, setCaptainTripsCount] = useState(12);
  const [captainRideRequest, setCaptainRideRequest] = useState(null);
  const [captainTripStatus, setCaptainTripStatus] = useState('idle'); 
  // 'idle' | 'incoming' | 'accepted' | 'arrived' | 'in_trip' | 'completed'

  return (
    <AppContext.Provider
      value={{
        appMode,
        setAppMode,
        customer,
        setCustomer,
        pickup,
        setPickup,
        drop,
        setDrop,
        selectedVehicle,
        setSelectedVehicle,
        appliedCoupon,
        setAppliedCoupon,
        paymentMethod,
        setPaymentMethod,
        rideStep,
        setRideStep,
        otp,
        activeCaptain,
        setActiveCaptain,
        activeTab,
        setActiveTab,
        captainOnline,
        setCaptainOnline,
        captainTodayEarnings,
        setCaptainTodayEarnings,
        captainTripsCount,
        setCaptainTripsCount,
        captainRideRequest,
        setCaptainRideRequest,
        captainTripStatus,
        setCaptainTripStatus,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}
