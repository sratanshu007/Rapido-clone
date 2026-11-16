import React from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  Platform,
  StyleSheet,
} from 'react-native';
import { AppProvider, useApp } from './src/Store';
import { Colors, Radius, Shadows } from './src/theme';
import { Logo } from './src/ui';
import {
  HomeView,
  ChooseRideView,
  FareDetailsView,
  FindingCaptainView,
  CaptainAssignedView,
  OnTheWayView,
  TripCompletedView,
  WalletView,
  ProfileView,
  MoreServicesView,
} from './src/CustomerScreens';
import { CaptainDashboardView } from './src/CaptainScreens';

function MainAppShell() {
  const { appMode, setAppMode, rideStep, setRideStep, activeTab, setActiveTab } = useApp();

  // If in Captain Mode
  if (appMode === 'captain') {
    return (
      <SafeAreaView style={st.safeArea}>
        <StatusBar barStyle="dark-content" backgroundColor={Colors.pureWhite} />
        {/* Captain Top Branding Bar */}
        <View style={st.brandBar}>
          <Logo />
          <TouchableOpacity
            style={st.modeSwitchPill}
            onPress={() => setAppMode('customer')}
          >
            <Text style={st.modeSwitchText}>Driver App 🚗</Text>
          </TouchableOpacity>
        </View>
        <CaptainDashboardView />
      </SafeAreaView>
    );
  }

  // Customer Mode Content Selection
  const renderCustomerScreen = () => {
    // If active in a ride flow
    if (rideStep === 'choose_ride') return <ChooseRideView />;
    if (rideStep === 'fare_details') return <FareDetailsView />;
    if (rideStep === 'finding_captain') return <FindingCaptainView />;
    if (rideStep === 'captain_assigned') return <CaptainAssignedView />;
    if (rideStep === 'on_the_way') return <OnTheWayView />;
    if (rideStep === 'trip_completed') return <TripCompletedView />;

    // Tab-based navigation
    if (activeTab === 'wallet') return <WalletView />;
    if (activeTab === 'profile') return <ProfileView />;
    if (activeTab === 'services') return <MoreServicesView />;
    return <HomeView />;
  };

  const showBottomNav = ['home', 'wallet', 'profile', 'services'].includes(activeTab) && rideStep === 'home';

  return (
    <SafeAreaView style={st.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.pureWhite} />

      {/* Top Branding Bar */}
      <View style={st.brandBar}>
        <Logo />
        <TouchableOpacity
          style={st.modeSwitchPill}
          onPress={() => setAppMode('captain')}
        >
          <Text style={st.modeSwitchText}>Captain Mode ➔</Text>
        </TouchableOpacity>
      </View>

      {/* Screen Body */}
      <View style={{ flex: 1 }}>{renderCustomerScreen()}</View>

      {/* Bottom Navigation */}
      {showBottomNav && (
        <View style={st.bottomNav}>
          {[
            { id: 'home', label: 'Home', icon: '🏠' },
            { id: 'services', label: 'Services', icon: '📦' },
            { id: 'wallet', label: 'Wallet', icon: '👛' },
            { id: 'profile', label: 'Profile', icon: '👤' },
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <TouchableOpacity
                key={tab.id}
                onPress={() => {
                  setRideStep('home');
                  setActiveTab(tab.id);
                }}
                style={st.navTab}
              >
                <Text style={{ fontSize: 20 }}>{tab.icon}</Text>
                <Text
                  style={[
                    st.navLabel,
                    isActive ? { color: Colors.electricPurple, fontWeight: '800' } : { color: Colors.mutedText },
                  ]}
                >
                  {tab.label}
                </Text>
                {isActive && <View style={st.navActiveIndicator} />}
              </TouchableOpacity>
            );
          })}
        </View>
      )}
    </SafeAreaView>
  );
}

export default function App() {
  return (
    <AppProvider>
      <MainAppShell />
    </AppProvider>
  );
}

const st = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.pureWhite,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  brandBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: Colors.pureWhite,
    borderBottomWidth: 1,
    borderBottomColor: '#F0EDFD',
  },
  modeSwitchPill: {
    backgroundColor: Colors.lightLavender,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: Radius.full,
    borderWidth: 1,
    borderColor: '#E2DCF8',
  },
  modeSwitchText: {
    fontSize: 12,
    fontWeight: '800',
    color: Colors.deepIndigo,
  },
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: Colors.pureWhite,
    borderTopWidth: 1,
    borderTopColor: '#ECE8FB',
    paddingVertical: 8,
    paddingBottom: Platform.OS === 'ios' ? 24 : 10,
    ...Shadows.glow,
  },
  navTab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  navLabel: {
    fontSize: 11,
    fontWeight: '600',
    marginTop: 3,
  },
  navActiveIndicator: {
    width: 18,
    height: 3,
    borderRadius: 2,
    backgroundColor: Colors.electricPurple,
    marginTop: 4,
  },
});
