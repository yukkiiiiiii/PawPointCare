import React, {useRef} from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  TouchableOpacity 
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import MapView, { Marker, UrlTile } from './MapViewWrapper';

const PAWPOINT_HOME = {
  latitude: 14.448639,
  longitude: 120.981917,
  latitudeDelta: 0.01, 
  longitudeDelta: 0.01,
};

const NEARBY_CLINICS = [
  {
    id: 'pawpoint-main',
    name: 'Paw Point Clinic',
    specialty: 'Primary Care & Emergency',
    latitude: 14.448639,
    longitude: 120.981917,
    address: "14°26'55.1\"N 120°58'54.9\"E, Las Piñas", 
    rating: '5.0',
    distance: 'Main Office',
    phone: '09XX XXX XXXX', 
    openTime: 'Open 24 Hours',
    isPrimary: true 
  },
  {
    id: '1',
    name: 'Jordan Veterinary Clinic',
    specialty: 'Full Service Care',
    latitude: 14.444111,
    longitude: 120.994873,
    address: '655 Alabang–Zapote Rd, Talon Uno',
    rating: '4.5',
    distance: '0.8 km',
    openTime: 'Open 24 Hours',
    phone: '0954 220 4725'
  },
  {
    id: '2',
    name: 'Pet Hub Veterinary Clinic',
    specialty: 'Emergency & Wellness',
    latitude: 14.448597,
    longitude: 120.993891,
    address: 'Unit 5, Sahar Bldg, CAA Rd, Pamplona Tres',
    rating: '3.5',
    distance: '1.1 km',
    openTime: 'Open 24 Hours',
    phone: '0917 116 4171'
  },
  {
    id: '3',
    name: 'Doc Arf Arf Veterinary Clinic',
    specialty: 'General Consultation',
    latitude: 14.451521,
    longitude: 120.979727,
    address: '14 Villa Cristina Ave, Las Piñas',
    rating: '4.3',
    distance: '1.5 km',
    openTime: '9:00 AM - 6:00 PM',
    phone: '0906 567 1672'
  },
  {
    id: '4',
    name: 'Pawcketful Veterinary Clinic',
    specialty: 'Pet Surgery & Grooming',
    latitude: 14.461940,
    longitude: 120.969579,
    address: 'Alabang–Zapote Rd, Las Piñas',
    rating: '4.1',
    distance: '2.3 km',
    openTime: '9:00 AM - 6:00 PM',
    phone: '0919 094 4994'
  },
  {
    id: '5',
    name: 'JPK Veterinary Clinic',
    specialty: 'General Practice',
    latitude: 14.449059,
    longitude: 120.978739,
    address: 'Unit 5, Star Arcade, Philamlife Village',
    rating: '4.5',
    distance: '1.2 km',
    openTime: '9:00 AM - 4:00 PM',
    phone: '(02) 8831 0031'
  },
  {
    id: '6',
    name: 'Golden Bunch Vet & Grooming',
    specialty: 'Grooming & Veterinary',
    latitude: 14.465632,
    longitude: 120.972071,
    address: '1330 Fruto Santos Ave, Las Piñas',
    rating: '4.4',
    distance: '2.8 km',
    openTime: '8:00 AM - 7:00 PM',
    phone: '0995 041 5994'
  },
];

const INITIAL_REGION = {
  latitude: 14.448639,
  longitude: 120.981917,
  latitudeDelta: 0.01, 
  longitudeDelta: 0.01,
};

const Vets = () => {
  const mapRef = useRef(null);

  const focusOnClinic = (clinic) => {
    mapRef.current?.animateToRegion({
      latitude: clinic.latitude,
      longitude: clinic.longitude,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    }, 1000);
  };

  const handleLocationButton = () => {
    mapRef.current?.animateToRegion(PAWPOINT_HOME, 1000);
    };
  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient 
        colors={['#5ECDC5', '#3e5974']} 
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        <Text style={styles.headerTitle}>Nearby Veterinarians</Text>
        <Text style={styles.headerSubtitle}>Find the best care for your pet</Text>
      </LinearGradient>

      <View style={styles.mapContainer}>
        <MapView ref={mapRef}
            style={styles.map}
            initialRegion={PAWPOINT_HOME} 
            mapType="none">
          <UrlTile 
          urlTemplate="https://api.maptiler.com/maps/openstreetmap/256/{z}/{x}/{y}.jpg?key=tSns80kXPIojWBLGFZLt"
          maximumZ={19}
          flipY={false}
          tileSize={256} 
          userAgent="com.pawpoint.app"/>
         {NEARBY_CLINICS.map((clinic) => (
            <Marker
              key={clinic.id}
              coordinate={{ latitude: clinic.latitude, longitude: clinic.longitude }}
              title={clinic.name}
              description={clinic.specialty}
              pinColor="#5ECDC5"
            />
          ))}
        </MapView>

          {/* Loc button to reset to the default location*/}
          <TouchableOpacity style={styles.locationButton}
                            onPress={handleLocationButton}>
            <MaterialCommunityIcons name="near-me" size={20} color="#5ECDC5" />
          </TouchableOpacity>
      </View>

      <View style={styles.listContainer}>
        <Text style={styles.listTitle}>Pet Clinics Near You</Text>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
  
          {NEARBY_CLINICS.map((clinic) => (
  <TouchableOpacity 
    key={clinic.id} 
    style={[styles.card, clinic.isPrimary && styles.primaryCard]}
    onPress={() => focusOnClinic(clinic)}
  >
    {/* Name and Rating */}
    <View style={styles.cardHeader}>
      <View style={{ flex: 1 }}>
        <Text style={[styles.clinicName, clinic.isPrimary && styles.primaryText]}>
          {clinic.name}
        </Text>
        <Text style={styles.specialtyText}>{clinic.specialty}</Text>
      </View>
      <View style={styles.ratingBadge}>
        <MaterialCommunityIcons name="star" size={14} color="#FFD700" />
        <Text style={styles.ratingText}>{clinic.rating}</Text>
      </View>
    </View>

    {/* Address */}
    <View style={styles.addressRow}>
      <MaterialCommunityIcons name="map-marker-outline" size={16} color="#5ECDC5" />
      <Text style={styles.addressText} numberOfLines={1}>{clinic.address}</Text>
    </View>

    {/* Contact  */}
    <View style={styles.cardFooter}>
      <View style={styles.contactInfo}>
        <View style={styles.detailItem}>
          <MaterialCommunityIcons name="clock-outline" size={14} color="#8a8787" />
          <Text style={styles.detailText}>{clinic.openTime}</Text>
        </View>
        <View style={styles.detailItem}>
          <MaterialCommunityIcons name="phone-outline" size={14} color="#8a8787" />
          <Text style={styles.detailText}>{clinic.phone}</Text>
        </View>
      </View>
    </View>
  </TouchableOpacity>
))}

        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#E0F2F1' 
},

  header: { padding: 25, 
    paddingTop: 40 },

  headerTitle: { 
    color: 'white', 
    fontSize: 22, 
    fontWeight: 'bold' },
  headerSubtitle: { 
    color: 'white', 
    opacity: 0.9, 
    fontSize: 14 },
  
  mapPlaceholder: {
    height: 200,
    backgroundColor: '#E0F2F1',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },

  locationButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 25,
    elevation: 3,
  },
  mapText: { color: '#3e5974', 
    marginTop: 10, 
    fontWeight: '500' 
},

  mapSubtext: { color: '#8a8787', 
    fontSize: 12 
},

  listContainer: {
    flex: 1,
    backgroundColor: 'white',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 20,
  },

  listTitle: { 
    fontSize: 18, 
    fontWeight: 'bold', 
    color: '#1F395F', 
    marginBottom: 15 },

  scrollContent: { 
    paddingBottom: 100 
}, 

  card: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#f0f0f0',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
  },
  cardTop: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    marginBottom: 10 },

  clinicName: { 
    fontSize: 16, 
    fontWeight: 'bold', 
    color: '#1F395F' },

  specialty: { 
    color: '#8a8787', 
    fontSize: 13 },

  ratingBadge: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#FFF9E6', 
    paddingHorizontal: 8, 
    borderRadius: 12,
    height: 24
  },

  ratingText: { 
    marginLeft: 4, 
    fontWeight: 'bold', 
    color: '#1F395F' },

  infoRow: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginBottom: 10 },

  address: { 
    marginLeft: 5, 
    color: '#8a8787', 
    fontSize: 13 },
  
  cardBottom: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 10
  },

  distanceText: { 
    color: '#5ECDC5', 
    fontSize: 13, 
    fontWeight: '500' },

  bookButton: { 
    backgroundColor: '#5ECDC5', 
    paddingHorizontal: 20, 
    paddingVertical: 8, 
    borderRadius: 10 },

  bookButtonText: { color: 'white', 
    fontWeight: 'bold' },

    mapContainer: {
      height: 250, 
      width: '100%',
      overflow: 'hidden',
    },
    map: {
      ...StyleSheet.absoluteFillObject, 
    },

    locationButton: {
      position: 'absolute',
      top: 20,
      right: 20,
      backgroundColor: 'white',
      padding: 10,
      borderRadius: 25,
      elevation: 5,
      zIndex: 1, 
    },

    card: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },

  primaryCard: {
    borderColor: '#5ECDC5',
    backgroundColor: '#f9ffff',
  },

  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },

  clinicName: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#1F395F',
    marginBottom: 2,
  },

  specialtyText: {
    fontSize: 13,
    color: '#8a8787',
    fontWeight: '500',
  },

  addressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f5f5f5', 
  },

  addressText: {
    fontSize: 13,
    color: '#666',
    marginLeft: 4,
    flex: 1,
  },

  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  contactInfo: {
    flex: 1,
  },

  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },

  detailText: {
    fontSize: 12,
    color: '#8a8787',
    marginLeft: 6,
  },

  bookButton: {
    backgroundColor: '#5ECDC5',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 12,
  },

  primaryButton: {
    backgroundColor: '#3e5974',
  },

  bookButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
});

export default Vets;