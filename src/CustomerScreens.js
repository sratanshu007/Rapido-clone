import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Alert,
  Linking,
} from 'react-native';
import { Colors, Radius, Shadows } from './theme';
import { VEHICLES, PLACES, COUPONS, calculateFare } from './data';
import { useApp } from './Store';
import { PrimaryButton, SecondaryButton, Card, Badge, Header, SimulatedMap } from './ui';

export function HomeView() {
  const { customer, pickup, setPickup, drop, setDrop, setSelectedVehicle, setRideStep } = useApp();

  return (
    <ScrollView style={st.container} showsVerticalScrollIndicator={false}>
      {/* Top Greeting Bar */}
      <View style={st.topBar}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View style={st.userAvatar}>
            <Text style={{ fontSize: 20 }}>👨🏽‍💼</Text>
          </View>
          <View style={{ marginLeft: 10 }}>
            <Text style={st.topBarSub}>Welcome back,</Text>
            <Text style={st.topBarName}>{customer.name}</Text>
          </View>
        </View>
        <TouchableOpacity style={st.iconBtn} onPress={() => Alert.alert('Notifications', 'No new alerts.')}>
          <Text style={{ fontSize: 18 }}>🔔</Text>
        </TouchableOpacity>
      </View>

      {/* Live Map Area */}
      <View style={{ marginHorizontal: 16, marginTop: 12 }}>
        <SimulatedMap />
      </View>

      {/* Floating Search Card: Where to? */}
      <Card style={st.searchCard}>
        <TouchableOpacity
          style={st.searchBar}
          activeOpacity={0.8}
          onPress={() => setRideStep('choose_ride')}
        >
          <Text style={{ fontSize: 18, marginRight: 8 }}>🔍</Text>
          <Text style={st.searchPlaceholder}>Where to? Search destination</Text>
        </TouchableOpacity>

        {/* Quick Saved Place Chips */}
        <View style={st.chipsRow}>
          {customer.savedPlaces.map((sp) => (
            <TouchableOpacity
              key={sp.id}
              style={st.savedChip}
              onPress={() => {
                const target = PLACES.find((p) => p.name.includes(sp.name)) || PLACES[1];
                setDrop(target);
                setRideStep('choose_ride');
              }}
            >
              <Text style={{ marginRight: 6 }}>{sp.icon}</Text>
              <Text style={st.savedChipText}>{sp.label}</Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity
            style={st.savedChip}
            onPress={() => Alert.alert('Add Place', 'Save new home or work destination.')}
          >
            <Text style={{ marginRight: 6 }}>📍</Text>
            <Text style={st.savedChipText}>Saved</Text>
          </TouchableOpacity>
        </View>
      </Card>

      {/* Ride Category Quick Cards */}
      <View style={st.sectionHeader}>
        <Text style={st.sectionTitle}>Quick Ride Selection</Text>
        <TouchableOpacity onPress={() => setRideStep('choose_ride')}>
          <Text style={st.seeAllLink}>See all →</Text>
        </TouchableOpacity>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={st.categoriesScroll}>
        {VEHICLES.map((v) => (
          <TouchableOpacity
            key={v.id}
            activeOpacity={0.85}
            style={st.categoryCard}
            onPress={() => {
              setSelectedVehicle(v);
              setRideStep('choose_ride');
            }}
          >
            {v.badge ? (
              <View style={st.cardBadgeWrapper}>
                <Badge text={v.badge} />
              </View>
            ) : null}
            <Text style={st.categoryIcon}>{v.icon}</Text>
            <Text style={st.categoryName}>{v.name}</Text>
            <Text style={st.categoryEta}>{v.timeMin} min away</Text>
            <Text style={st.categoryPrice}>from ₹{v.base}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Promotional Banner: RideNova Prime & FareLock */}
      <View style={st.bannerCard}>
        <View style={{ flex: 1 }}>
          <Badge text="FareLock Guarantee" color={Colors.warningAmber} bg="rgba(255, 181, 71, 0.2)" />
          <Text style={st.bannerTitle}>No Hidden Surge Charges</Text>
          <Text style={st.bannerSubtitle}>Confirmed upfront fare before you book. Ride smarter with RideNova.</Text>
        </View>
        <Text style={{ fontSize: 36, marginLeft: 10 }}>🛡️</Text>
      </View>

      <View style={{ height: 30 }} />
    </ScrollView>
  );
}

export function ChooseRideView() {
  const { pickup, setPickup, drop, setDrop, selectedVehicle, setSelectedVehicle, setRideStep } = useApp();

  return (
    <View style={{ flex: 1, backgroundColor: Colors.cloudWhite }}>
      <Header title="Choose Your Ride" onBack={() => setRideStep('home')} />
      <ScrollView style={{ flex: 1, paddingHorizontal: 16 }} showsVerticalScrollIndicator={false}>
        {/* Pickup & Drop Display Card */}
        <Card style={{ marginVertical: 10 }}>
          <View style={st.locationRow}>
            <View style={[st.locDot, { backgroundColor: Colors.successGreen }]} />
            <View style={{ flex: 1 }}>
              <Text style={st.locLabel}>PICKUP</Text>
              <Text style={st.locText}>{pickup.name} ({pickup.area})</Text>
            </View>
          </View>
          <View style={st.locDivider} />
          <View style={st.locationRow}>
            <View style={[st.locDot, { backgroundColor: Colors.electricPurple }]} />
            <View style={{ flex: 1 }}>
              <Text style={st.locLabel}>DESTINATION</Text>
              <Text style={st.locText}>{drop.name} ({drop.area})</Text>
            </View>
          </View>
        </Card>

        {/* Vehicle Selection List */}
        <Text style={[st.sectionTitle, { marginVertical: 8 }]}>Available Services</Text>
        {VEHICLES.map((v) => {
          const fareObj = calculateFare(v, pickup, drop);
          const isSelected = selectedVehicle.id === v.id;

          return (
            <Card
              key={v.id}
              active={isSelected}
              onPress={() => setSelectedVehicle(v)}
              style={st.vehicleSelectCard}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View style={st.vehicleIconBox}>
                  <Text style={{ fontSize: 28 }}>{v.icon}</Text>
                </View>
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={st.vehicleName}>{v.name}</Text>
                    {v.badge ? (
                      <View style={{ marginLeft: 6 }}>
                        <Badge text={v.badge} />
                      </View>
                    ) : null}
                  </View>
                  <Text style={st.vehicleTagline}>{v.tagline} • {v.capacity} seats</Text>
                  <Text style={st.vehicleTime}>ETA: {v.timeMin} min away • {fareObj.durationMin} min ride</Text>
                </View>
                <View style={{ alignItems: 'flex-end' }}>
                  <Text style={st.vehiclePrice}>₹{fareObj.total}</Text>
                  <Text style={st.fareLockTag}>FareLock ✓</Text>
                </View>
              </View>
            </Card>
          );
        })}

        <View style={{ height: 90 }} />
      </ScrollView>

      {/* Floating Bottom Booking Action */}
      <View style={st.bottomStickyBar}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
          <Text style={{ fontSize: 14, color: Colors.mutedText }}>Selected: <Text style={{ fontWeight: '700', color: Colors.darkNavy }}>{selectedVehicle.name}</Text></Text>
          <Text style={{ fontSize: 16, fontWeight: '800', color: Colors.electricPurple }}>₹{calculateFare(selectedVehicle, pickup, drop).total}</Text>
        </View>
        <PrimaryButton
          title="Continue to Fare Breakdown"
          onPress={() => setRideStep('fare_details')}
        />
      </View>
    </View>
  );
}

export function FareDetailsView() {
  const { pickup, drop, selectedVehicle, paymentMethod, setPaymentMethod, setRideStep, appliedCoupon, setAppliedCoupon } = useApp();
  const fareObj = calculateFare(selectedVehicle, pickup, drop);
  const discount = appliedCoupon ? appliedCoupon.discount : 0;
  const finalPayable = Math.max(10, fareObj.total - discount);

  return (
    <View style={{ flex: 1, backgroundColor: Colors.cloudWhite }}>
      <Header title="Fare Details & FareLock" onBack={() => setRideStep('choose_ride')} />
      <ScrollView style={{ flex: 1, paddingHorizontal: 16 }} showsVerticalScrollIndicator={false}>
        {/* Vehicle Header Card */}
        <Card style={{ marginVertical: 12, alignItems: 'center', paddingVertical: 20 }}>
          <Text style={{ fontSize: 44 }}>{selectedVehicle.icon}</Text>
          <Text style={[st.vehicleName, { fontSize: 20, marginTop: 6 }]}>{selectedVehicle.name}</Text>
          <Text style={st.vehicleTagline}>{selectedVehicle.carModel}</Text>
          <View style={{ flexDirection: 'row', marginTop: 8 }}>
            <Badge text={`Distance: ${fareObj.distanceKm} km`} color={Colors.deepIndigo} bg={Colors.lightLavender} />
            <View style={{ width: 8 }} />
            <Badge text={`ETA: ${fareObj.durationMin} mins`} color={Colors.successGreen} bg="#E6F9F3" />
          </View>
        </Card>

        {/* Itemized FareLock Breakdown */}
        <Card>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <Text style={st.sectionTitle}>Fare Breakdown</Text>
            <Badge text="FareLock Guaranteed" color={Colors.successGreen} bg="#E6F9F3" />
          </View>

          <View style={st.fareRow}>
            <Text style={st.fareLabel}>Base Fare</Text>
            <Text style={st.fareValue}>₹{fareObj.baseFare}</Text>
          </View>
          <View style={st.fareRow}>
            <Text style={st.fareLabel}>Distance Charge ({fareObj.distanceKm} km)</Text>
            <Text style={st.fareValue}>₹{fareObj.distanceFare}</Text>
          </View>
          <View style={st.fareRow}>
            <Text style={st.fareLabel}>Surge (1.0x Fixed)</Text>
            <Text style={[st.fareValue, { color: Colors.successGreen }]}>₹0 (No Surge)</Text>
          </View>
          <View style={st.fareRow}>
            <Text style={st.fareLabel}>Taxes & GST (5%)</Text>
            <Text style={st.fareValue}>₹{fareObj.gst}</Text>
          </View>

          {appliedCoupon ? (
            <View style={st.fareRow}>
              <Text style={[st.fareLabel, { color: Colors.electricPurple, fontWeight: '700' }]}>Coupon ({appliedCoupon.code})</Text>
              <Text style={[st.fareValue, { color: Colors.electricPurple, fontWeight: '700' }]}>-₹{discount}</Text>
            </View>
          ) : null}

          <View style={st.locDivider} />

          <View style={[st.fareRow, { marginTop: 8 }]}>
            <Text style={[st.fareLabel, { fontSize: 18, fontWeight: '800', color: Colors.darkNavy }]}>Total Payable</Text>
            <Text style={[st.fareValue, { fontSize: 22, fontWeight: '900', color: Colors.electricPurple }]}>₹{finalPayable}</Text>
          </View>
        </Card>

        {/* Coupon Selector */}
        <Card style={{ marginVertical: 10 }}>
          <Text style={[st.sectionTitle, { marginBottom: 8 }]}>Offers & Coupons</Text>
          {COUPONS.map((c) => (
            <TouchableOpacity
              key={c.code}
              style={[st.couponItem, appliedCoupon?.code === c.code && { borderColor: Colors.electricPurple, backgroundColor: Colors.lightLavender }]}
              onPress={() => setAppliedCoupon(appliedCoupon?.code === c.code ? null : c)}
            >
              <View style={{ flex: 1 }}>
                <Text style={{ fontWeight: '800', color: Colors.deepIndigo }}>{c.code}</Text>
                <Text style={{ fontSize: 12, color: Colors.mutedText }}>{c.title}</Text>
              </View>
              <Text style={{ fontWeight: '700', color: Colors.electricPurple }}>
                {appliedCoupon?.code === c.code ? 'Applied ✓' : 'Apply'}
              </Text>
            </TouchableOpacity>
          ))}
        </Card>

        {/* Payment Selection */}
        <Card style={{ marginBottom: 100 }}>
          <Text style={[st.sectionTitle, { marginBottom: 8 }]}>Payment Method</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
            {['Wallet', 'UPI', 'Credit/Debit Card', 'Cash'].map((m) => (
              <TouchableOpacity
                key={m}
                style={[st.payChip, paymentMethod === m && st.payChipActive]}
                onPress={() => setPaymentMethod(m)}
              >
                <Text style={[st.payChipText, paymentMethod === m && { color: Colors.pureWhite }]}>{m}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </Card>
      </ScrollView>

      {/* Floating Confirm Button */}
      <View style={st.bottomStickyBar}>
        <PrimaryButton
          title={`Confirm Ride • ₹${finalPayable}`}
          onPress={() => setRideStep('finding_captain')}
        />
      </View>
    </View>
  );
}

export function FindingCaptainView() {
  const { setRideStep } = useApp();

  return (
    <View style={st.findingContainer}>
      <View style={st.radarRings}>
        <View style={st.radarOuterRing} />
        <View style={st.radarMiddleRing} />
        <View style={st.radarInnerCircle}>
          <Text style={{ fontSize: 32 }}>🚘</Text>
        </View>
      </View>

      <Text style={st.findingTitle}>Finding a Captain...</Text>
      <Text style={st.findingSubtitle}>Connecting you with nearby trusted drivers</Text>

      <View style={st.findingActions}>
        <SecondaryButton
          title="Cancel Ride"
          color={Colors.dangerRed}
          onPress={() => setRideStep('choose_ride')}
        />
        <PrimaryButton
          title="Simulate Match Captain →"
          style={{ marginTop: 10 }}
          onPress={() => setRideStep('captain_assigned')}
        />
      </View>
    </View>
  );
}

export function CaptainAssignedView() {
  const { activeCaptain, otp, setRideStep } = useApp();

  return (
    <View style={{ flex: 1, backgroundColor: Colors.cloudWhite }}>
      <Header title="Captain Arriving Soon" onBack={() => setRideStep('home')} />
      <View style={{ flex: 1, padding: 16 }}>
        <SimulatedMap showRoute={true} driverName={activeCaptain.name} etaText="2 min" />

        <Card style={{ marginTop: 14 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View style={st.captainAvatar}>
              <Text style={{ fontSize: 26 }}>{activeCaptain.photo}</Text>
            </View>
            <View style={{ flex: 1, marginLeft: 12 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={st.captainName}>{activeCaptain.name}</Text>
                <Text style={st.captainRating}>⭐ {activeCaptain.rating}</Text>
              </View>
              <Text style={st.captainMeta}>{activeCaptain.vehicleModel} • {activeCaptain.plate}</Text>
              <Text style={{ fontSize: 11, color: Colors.mutedText }}>{activeCaptain.rides} completed rides</Text>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={st.otpLabel}>START OTP</Text>
              <Text style={st.otpCode}>{otp}</Text>
            </View>
          </View>

          <View style={st.locDivider} />

          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <TouchableOpacity
              style={st.actionPill}
              onPress={() => Alert.alert('Calling Driver', `Dialing ${activeCaptain.phone}...`)}
            >
              <Text style={{ fontSize: 16, marginRight: 6 }}>📞</Text>
              <Text style={st.actionPillText}>Call</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={st.actionPill}
              onPress={() => Alert.alert('Chat', 'Opening encrypted chat with driver.')}
            >
              <Text style={{ fontSize: 16, marginRight: 6 }}>💬</Text>
              <Text style={st.actionPillText}>Chat</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[st.actionPill, { backgroundColor: '#FDECEC' }]}
              onPress={() => Alert.alert('🚨 SOS', 'Guardian mode alerted. Location shared with emergency contacts.')}
            >
              <Text style={{ fontSize: 16, marginRight: 6 }}>🛡️</Text>
              <Text style={[st.actionPillText, { color: Colors.dangerRed }]}>SOS</Text>
            </TouchableOpacity>
          </View>
        </Card>

        <PrimaryButton
          title="Start Live Trip Navigation →"
          style={{ marginTop: 16 }}
          onPress={() => setRideStep('on_the_way')}
        />
      </View>
    </View>
  );
}

export function OnTheWayView() {
  const { pickup, drop, activeCaptain, setRideStep } = useApp();

  return (
    <View style={{ flex: 1, backgroundColor: Colors.cloudWhite }}>
      <Header title="On the Way • Enjoy your ride!" />
      <View style={{ flex: 1, padding: 16 }}>
        <SimulatedMap showRoute={true} driverName={activeCaptain.name} etaText="On Trip" />

        <Card style={{ marginTop: 16 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <View>
              <Text style={{ fontSize: 12, color: Colors.mutedText, fontWeight: '600' }}>DESTINATION</Text>
              <Text style={{ fontSize: 16, fontWeight: '800', color: Colors.darkNavy }}>{drop.name}</Text>
            </View>
            <Badge text="Live GPS Active" color={Colors.successGreen} bg="#E6F9F3" />
          </View>

          <View style={st.locDivider} />

          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <Text style={{ fontSize: 13, color: Colors.mutedText }}>Captain: <Text style={{ fontWeight: '700', color: Colors.darkNavy }}>{activeCaptain.name}</Text></Text>
            <Text style={{ fontSize: 13, color: Colors.mutedText }}>Vehicle: <Text style={{ fontWeight: '700', color: Colors.darkNavy }}>{activeCaptain.plate}</Text></Text>
          </View>

          <View style={{ flexDirection: 'row', marginTop: 14 }}>
            <SecondaryButton
              title="Share Trip Link"
              style={{ flex: 1, marginRight: 8 }}
              onPress={() => Alert.alert('Trip Shared', 'Live tracking link copied to clipboard.')}
            />
            <SecondaryButton
              title="🚨 SOS"
              color={Colors.dangerRed}
              style={{ width: 90 }}
              onPress={() => Alert.alert('🚨 Emergency', '112 Police and Emergency Contacts notified.')}
            />
          </View>
        </Card>

        <PrimaryButton
          title="Destination Reached (Complete Trip) →"
          color={Colors.successGreen}
          style={{ marginTop: 20 }}
          onPress={() => setRideStep('trip_completed')}
        />
      </View>
    </View>
  );
}

export function TripCompletedView() {
  const { setRideStep } = useApp();
  const [rating, setRating] = useState(5);
  const [selectedTags, setSelectedTags] = useState(['Clean Car', 'Safe Ride']);

  const tags = ['Clean Car', 'Polite Driver', 'Safe Ride', 'Driving Quality'];

  const toggleTag = (t) => {
    setSelectedTags((prev) => (prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]));
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: Colors.cloudWhite }} showsVerticalScrollIndicator={false}>
      <View style={{ alignItems: 'center', padding: 24, marginTop: 10 }}>
        <View style={st.successCircle}>
          <Text style={{ fontSize: 36 }}>✓</Text>
        </View>
        <Text style={[st.sectionTitle, { fontSize: 24, marginTop: 14 }]}>Trip Completed!</Text>
        <Text style={{ color: Colors.mutedText, fontSize: 14, textAlign: 'center', marginTop: 4 }}>
          Thank you for riding with RideNova.
        </Text>

        <Card style={{ width: '100%', marginTop: 20, alignItems: 'center' }}>
          <Text style={{ fontSize: 13, color: Colors.mutedText }}>Total Fare Paid</Text>
          <Text style={{ fontSize: 32, fontWeight: '900', color: Colors.electricPurple, marginTop: 4 }}>₹234</Text>
          <Text style={{ fontSize: 12, color: Colors.successGreen, fontWeight: '700', marginTop: 2 }}>Paid via RideNova Wallet ✓</Text>
        </Card>

        {/* 5-Star Rating Card */}
        <Card style={{ width: '100%', marginTop: 14, alignItems: 'center' }}>
          <Text style={{ fontSize: 16, fontWeight: '800', color: Colors.darkNavy }}>How was your ride?</Text>
          <View style={{ flexDirection: 'row', marginVertical: 14 }}>
            {[1, 2, 3, 4, 5].map((s) => (
              <TouchableOpacity key={s} onPress={() => setRating(s)} style={{ paddingHorizontal: 6 }}>
                <Text style={{ fontSize: 30, color: s <= rating ? '#FFB400' : '#D1D5DB' }}>★</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Feedback Tag Chips */}
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' }}>
            {tags.map((t) => (
              <TouchableOpacity
                key={t}
                style={[st.feedbackTag, selectedTags.includes(t) && st.feedbackTagActive]}
                onPress={() => toggleTag(t)}
              >
                <Text style={[st.feedbackTagText, selectedTags.includes(t) && { color: Colors.pureWhite }]}>{t}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </Card>

        <PrimaryButton
          title="Submit & Return Home"
          style={{ width: '100%', marginTop: 16 }}
          onPress={() => {
            Alert.alert('Thank You!', 'Feedback submitted. 24 Loyalty Points credited.');
            setRideStep('home');
          }}
        />
      </View>
    </ScrollView>
  );
}

export function WalletView() {
  const { customer, setCustomer } = useApp();

  const addCash = (amt) => {
    setCustomer((prev) => ({
      ...prev,
      walletBalance: prev.walletBalance + amt,
      transactions: [
        { id: Date.now() + '', title: 'Wallet Top-up', date: 'Just now', amount: amt, type: 'credit' },
        ...prev.transactions,
      ],
    }));
    Alert.alert('Money Added', `₹${amt} added to RideNova Wallet successfully.`);
  };

  return (
    <ScrollView style={st.container} showsVerticalScrollIndicator={false}>
      <Header title="My Wallet" />
      <View style={{ padding: 16 }}>
        {/* Wallet Balance Hero Card */}
        <View style={st.walletHeroCard}>
          <Text style={{ color: Colors.softViolet, fontSize: 14, fontWeight: '600' }}>Available Balance</Text>
          <Text style={{ color: Colors.pureWhite, fontSize: 34, fontWeight: '900', marginVertical: 6 }}>
            ₹{customer.walletBalance.toLocaleString('en-IN')}
          </Text>
          <Text style={{ color: Colors.lightLavender, fontSize: 12 }}>Loyalty Points: {customer.loyaltyPoints} pts (Worth ₹48)</Text>
        </View>

        {/* Quick Top-up buttons */}
        <Text style={[st.sectionTitle, { marginTop: 18, marginBottom: 8 }]}>Quick Add Money</Text>
        <View style={{ flexDirection: 'row' }}>
          {[100, 500, 1000].map((amt) => (
            <TouchableOpacity key={amt} style={st.topUpChip} onPress={() => addCash(amt)}>
              <Text style={st.topUpChipText}>+₹{amt}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Transactions History */}
        <Text style={[st.sectionTitle, { marginTop: 24, marginBottom: 8 }]}>Recent Transactions</Text>
        {customer.transactions.map((tx) => (
          <Card key={tx.id} style={{ marginVertical: 4 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <View>
                <Text style={{ fontWeight: '700', color: Colors.darkNavy, fontSize: 15 }}>{tx.title}</Text>
                <Text style={{ fontSize: 12, color: Colors.mutedText }}>{tx.date}</Text>
              </View>
              <Text
                style={{
                  fontWeight: '800',
                  fontSize: 16,
                  color: tx.type === 'credit' ? Colors.successGreen : Colors.dangerRed,
                }}
              >
                {tx.type === 'credit' ? '+' : '-'}₹{tx.amount}
              </Text>
            </View>
          </Card>
        ))}
      </View>
    </ScrollView>
  );
}

export function ProfileView() {
  const { customer, setAppMode } = useApp();

  return (
    <ScrollView style={st.container} showsVerticalScrollIndicator={false}>
      <Header title="My Profile" />
      <View style={{ padding: 16 }}>
        {/* User Card */}
        <Card style={{ alignItems: 'center', paddingVertical: 20 }}>
          <View style={st.bigAvatar}>
            <Text style={{ fontSize: 36 }}>👨🏽‍💼</Text>
          </View>
          <Text style={{ fontSize: 20, fontWeight: '800', color: Colors.darkNavy, marginTop: 8 }}>{customer.name}</Text>
          <Text style={{ color: Colors.mutedText, fontSize: 13 }}>{customer.email} • {customer.phone}</Text>
          <Badge text="RideNova Gold Member" color={Colors.warningAmber} bg="rgba(255,181,71,0.2)" />
        </Card>

        {/* Switch to Captain App Banner */}
        <TouchableOpacity
          style={st.switchModeBanner}
          activeOpacity={0.85}
          onPress={() => setAppMode('captain')}
        >
          <View style={{ flex: 1 }}>
            <Text style={{ color: Colors.pureWhite, fontWeight: '800', fontSize: 16 }}>Switch to Captain (Driver) Mode</Text>
            <Text style={{ color: Colors.softViolet, fontSize: 12 }}>Drive, accept rides, and earn on RideNova.</Text>
          </View>
          <Text style={{ fontSize: 22 }}>➔</Text>
        </TouchableOpacity>

        {/* Account Menu Items */}
        <Card style={{ marginTop: 14 }}>
          {[
            { label: 'Ride History', icon: '🧾' },
            { label: 'Guardian Mode (Emergency Contacts)', icon: '🛡️' },
            { label: 'Saved Addresses', icon: '📍' },
            { label: 'RideNova Prime Membership', icon: '👑' },
            { label: 'Help & 24x7 Support', icon: '💬' },
            { label: 'Settings & Privacy', icon: '⚙️' },
          ].map((item, idx) => (
            <TouchableOpacity
              key={item.label}
              style={[st.menuItem, idx !== 0 && { borderTopWidth: 1, borderTopColor: '#F0EDFD' }]}
              onPress={() => Alert.alert(item.label, `${item.label} features active.`)}
            >
              <Text style={{ fontSize: 18, marginRight: 12 }}>{item.icon}</Text>
              <Text style={{ flex: 1, fontSize: 15, fontWeight: '600', color: Colors.darkNavy }}>{item.label}</Text>
              <Text style={{ color: Colors.mutedText }}>›</Text>
            </TouchableOpacity>
          ))}
        </Card>
      </View>
    </ScrollView>
  );
}

export function MoreServicesView() {
  const { setRideStep } = useApp();

  const services = [
    { title: 'Parcel Delivery', icon: '📦', desc: 'Door-to-door courier' },
    { title: 'Corporate Rides', icon: '🏢', desc: 'Company travel billing' },
    { title: 'Airport Transfers', icon: '✈️', desc: 'Guaranteed flight pickup' },
    { title: 'Ride Sharing', icon: '👥', desc: 'Split commute cost' },
    { title: 'EV Rentals', icon: '⚡', desc: 'Self-drive electric cars' },
    { title: 'Accessible Rides', icon: '♿', desc: 'Wheelchair assistance' },
  ];

  return (
    <ScrollView style={st.container} showsVerticalScrollIndicator={false}>
      <Header title="More Mobility Services" />
      <View style={{ padding: 16 }}>
        <View style={st.servicesGrid}>
          {services.map((s) => (
            <TouchableOpacity
              key={s.title}
              style={st.serviceGridItem}
              activeOpacity={0.8}
              onPress={() => Alert.alert(s.title, `Book ${s.title} with upfront FareLock.`)}
            >
              <Text style={{ fontSize: 32 }}>{s.icon}</Text>
              <Text style={st.serviceGridTitle}>{s.title}</Text>
              <Text style={st.serviceGridDesc}>{s.desc}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Prime Banner */}
        <View style={st.primeCard}>
          <Text style={{ fontSize: 28, marginRight: 10 }}>👑</Text>
          <View style={{ flex: 1 }}>
            <Text style={{ color: Colors.pureWhite, fontWeight: '800', fontSize: 16 }}>RideNova Prime</Text>
            <Text style={{ color: Colors.lightLavender, fontSize: 12 }}>Free cancellations, zero wait fees & priority matching.</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const st = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.cloudWhite },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
  },
  userAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.lightLavender,
    justifyContent: 'center',
    alignItems: 'center',
  },
  topBarSub: { fontSize: 12, color: Colors.mutedText },
  topBarName: { fontSize: 18, fontWeight: '800', color: Colors.darkNavy },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.pureWhite,
    justifyContent: 'center',
    alignItems: 'center',
    ...Shadows.sm,
  },
  searchCard: { marginHorizontal: 16, marginTop: -20, zIndex: 10 },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F0FC',
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: Radius.md,
  },
  searchPlaceholder: { fontSize: 15, fontWeight: '600', color: Colors.mutedText },
  chipsRow: { flexDirection: 'row', marginTop: 12 },
  savedChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.cloudWhite,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: Radius.full,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#E7E2FA',
  },
  savedChipText: { fontSize: 12, fontWeight: '700', color: Colors.deepIndigo },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginTop: 20,
    marginBottom: 8,
  },
  sectionTitle: { fontSize: 17, fontWeight: '800', color: Colors.darkNavy },
  seeAllLink: { fontSize: 13, fontWeight: '700', color: Colors.electricPurple },
  categoriesScroll: { paddingLeft: 16 },
  categoryCard: {
    width: 125,
    backgroundColor: Colors.pureWhite,
    borderRadius: Radius.lg,
    padding: 12,
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#EFEBFD',
    ...Shadows.sm,
  },
  cardBadgeWrapper: { position: 'absolute', top: 8, right: 8 },
  categoryIcon: { fontSize: 32, marginVertical: 6 },
  categoryName: { fontSize: 14, fontWeight: '800', color: Colors.darkNavy },
  categoryEta: { fontSize: 11, color: Colors.mutedText, marginTop: 2 },
  categoryPrice: { fontSize: 13, fontWeight: '800', color: Colors.electricPurple, marginTop: 4 },
  bannerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.deepIndigo,
    marginHorizontal: 16,
    marginTop: 20,
    padding: 16,
    borderRadius: Radius.xl,
  },
  bannerTitle: { color: Colors.pureWhite, fontSize: 16, fontWeight: '800', marginTop: 6 },
  bannerSubtitle: { color: Colors.softViolet, fontSize: 12, marginTop: 2 },
  locationRow: { flexDirection: 'row', alignItems: 'center' },
  locDot: { width: 10, height: 10, borderRadius: 5, marginRight: 12 },
  locLabel: { fontSize: 10, fontWeight: '800', color: Colors.mutedText },
  locText: { fontSize: 14, fontWeight: '700', color: Colors.darkNavy, marginTop: 2 },
  locDivider: { height: 1, backgroundColor: '#F0EDFD', marginVertical: 10 },
  vehicleSelectCard: { marginVertical: 6 },
  vehicleIconBox: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: Colors.lightLavender,
    justifyContent: 'center',
    alignItems: 'center',
  },
  vehicleName: { fontSize: 16, fontWeight: '800', color: Colors.darkNavy },
  vehicleTagline: { fontSize: 12, color: Colors.mutedText, marginTop: 2 },
  vehicleTime: { fontSize: 11, color: Colors.successGreen, fontWeight: '600', marginTop: 2 },
  vehiclePrice: { fontSize: 18, fontWeight: '900', color: Colors.darkNavy },
  fareLockTag: { fontSize: 10, color: Colors.electricPurple, fontWeight: '700' },
  bottomStickyBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.pureWhite,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 24,
    borderTopWidth: 1,
    borderTopColor: '#ECE8FB',
    ...Shadows.glow,
  },
  fareRow: { flexDirection: 'row', justifyContent: 'space-between', marginVertical: 4 },
  fareLabel: { fontSize: 14, color: Colors.mutedText },
  fareValue: { fontSize: 14, fontWeight: '700', color: Colors.darkNavy },
  couponItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: '#ECE8FB',
    marginVertical: 4,
  },
  payChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: Radius.full,
    backgroundColor: '#F3F0FC',
    marginRight: 8,
    marginBottom: 8,
  },
  payChipActive: { backgroundColor: Colors.electricPurple },
  payChipText: { fontSize: 13, fontWeight: '700', color: Colors.darkNavy },
  findingContainer: {
    flex: 1,
    backgroundColor: Colors.deepIndigo,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  radarRings: { width: 220, height: 220, justifyContent: 'center', alignItems: 'center' },
  radarOuterRing: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: 'rgba(167, 139, 250, 0.25)',
  },
  radarMiddleRing: {
    position: 'absolute',
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 1.5,
    borderColor: 'rgba(113, 60, 245, 0.45)',
  },
  radarInnerCircle: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: Colors.electricPurple,
    justifyContent: 'center',
    alignItems: 'center',
    ...Shadows.glow,
  },
  findingTitle: { color: Colors.pureWhite, fontSize: 24, fontWeight: '900', marginTop: 24 },
  findingSubtitle: { color: Colors.softViolet, fontSize: 14, marginTop: 6, textAlign: 'center' },
  findingActions: { width: '100%', marginTop: 40 },
  captainAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: Colors.lightLavender,
    justifyContent: 'center',
    alignItems: 'center',
  },
  captainName: { fontSize: 16, fontWeight: '800', color: Colors.darkNavy, marginRight: 6 },
  captainRating: { fontSize: 12, fontWeight: '700', color: '#B45309' },
  captainMeta: { fontSize: 13, color: Colors.mutedText, marginTop: 2 },
  otpLabel: { fontSize: 9, fontWeight: '800', color: Colors.mutedText },
  otpCode: { fontSize: 20, fontWeight: '900', color: Colors.electricPurple },
  actionPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F0FC',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: Radius.full,
  },
  actionPillText: { fontSize: 13, fontWeight: '700', color: Colors.deepIndigo },
  successCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: Colors.successGreen,
    justifyContent: 'center',
    alignItems: 'center',
    ...Shadows.glow,
  },
  feedbackTag: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: Radius.full,
    borderWidth: 1,
    borderColor: '#E2DCF8',
    margin: 4,
    backgroundColor: Colors.pureWhite,
  },
  feedbackTagActive: { backgroundColor: Colors.electricPurple, borderColor: Colors.electricPurple },
  feedbackTagText: { fontSize: 12, fontWeight: '700', color: Colors.darkNavy },
  walletHeroCard: {
    backgroundColor: Colors.deepIndigo,
    borderRadius: Radius.xl,
    padding: 20,
    ...Shadows.glow,
  },
  topUpChip: {
    flex: 1,
    backgroundColor: Colors.pureWhite,
    paddingVertical: 12,
    borderRadius: Radius.md,
    alignItems: 'center',
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#E2DCF8',
  },
  topUpChipText: { fontSize: 15, fontWeight: '800', color: Colors.electricPurple },
  bigAvatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: Colors.lightLavender,
    justifyContent: 'center',
    alignItems: 'center',
  },
  switchModeBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.electricPurple,
    padding: 16,
    borderRadius: Radius.lg,
    marginTop: 14,
  },
  menuItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14 },
  servicesGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  serviceGridItem: {
    width: '48%',
    backgroundColor: Colors.pureWhite,
    padding: 16,
    borderRadius: Radius.lg,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#ECE8FB',
    ...Shadows.sm,
  },
  serviceGridTitle: { fontSize: 14, fontWeight: '800', color: Colors.darkNavy, marginTop: 8 },
  serviceGridDesc: { fontSize: 11, color: Colors.mutedText, marginTop: 2 },
  primeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.deepIndigo,
    padding: 16,
    borderRadius: Radius.xl,
    marginTop: 8,
  },
});
