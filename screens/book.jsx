import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View,  
  ScrollView, 
  TouchableOpacity, 
  ActivityIndicator,
  Alert
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { FIREBASE_AUTH, FIREBASE_DB } from "../firebaseConfig";
import { collection, addDoc, serverTimestamp, query, where, getDocs } from "firebase/firestore";
import emailjs from '@emailjs/react-native';

const generateDates = () => {
  const dateArray = [];
  const daysToShow = 31; 
  for (let i = 0; i < daysToShow; i++) {
    const date = new Date();
    date.setDate(date.getDate() + i); 
    
    const label = date.toLocaleDateString('en-US', { day: 'numeric', weekday: 'short' });
    
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const value = `${year}-${month}-${day}`; 
    
    dateArray.push({ label, value });
  }
  return dateArray;
};

const Book = () => {

  useEffect(() => {
    emailjs.init("H5GsI8-bePiUDmeLF");
  }, []);

  const availableDates = generateDates();

  // 1. States
  const [selectedVet, setSelectedVet] = useState(null);
  const [selectedPet, setSelectedPet] = useState(null);
  const [selectedSer, setSelectedSer] = useState(null);
  const [selectedDate, setSelectedDate] = useState(availableDates[0].value);
  const [selectedTime, setSelectedTime] = useState(null);
  const [pets, setPets] = useState([]);
  const [loadingPets, setLoadingPets] = useState(true);

  const timeSlots = [
    // Morning Sesh
    { label: '08:00 AM', value: '08:00' },
    { label: '09:00 AM', value: '09:00' },
    { label: '10:00 AM', value: '10:00' },
    { label: '11:00 AM', value: '11:00' },
    
    // Afternoon Sesh
    { label: '01:00 PM', value: '13:00' },
    { label: '02:00 PM', value: '14:00' },
    { label: '03:00 PM', value: '15:00' },
    { label: '04:00 PM', value: '16:00' },
    
    // Evening Sesh
    { label: '05:00 PM', value: '17:00' },
    { label: '06:00 PM', value: '18:00' },
    { label: '07:00 PM', value: '19:00' },
  ];

  // Fetching Pets Logic
  useEffect(() => {
    const user = FIREBASE_AUTH.currentUser;
    if (!user) {
      setLoadingPets(false);
      return;
    }

    const fetchPets = async () => {
      try {
        const q = query(
          collection(FIREBASE_DB, 'pets'), 
          where("adminId", "==", user.uid)
        );
        const querySnapshot = await getDocs(q);
        const petList = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          petList.push({ id: doc.id, name: data.petName || "Unnamed Pet" });
        });
        setPets(petList);
        if (petList.length > 0) setSelectedPet(petList[0].name);
      } catch (error) {
        console.error("Firestore Error:", error);
      } finally {
        setLoadingPets(false);
      }
    };
    fetchPets();
  }, []);

  // Booking Logic
  const handleBooking = async () => {
    const user = FIREBASE_AUTH.currentUser;
    if (!user) {
      Alert.alert("Error", "No user found. Please log in.");
      return;
    }

    if (!selectedVet || !selectedSer || !selectedTime || !selectedDate || !selectedPet) {
      Alert.alert("Missing Info", "Please select a pet, service, and time slot.");
      return;
    }

    try {
      const combinedDateTimeString = `${selectedDate}T${selectedTime}:00`;
      const finalAppointmentDate = new Date(combinedDateTimeString);

      const docRef = await addDoc(collection(FIREBASE_DB, "bookings"), {
        userEmail: user.email,
        userId: user.uid,
        veterinarian: selectedVet,
        petName: selectedPet,
        service: selectedSer,
        appointmentDateAndTime: finalAppointmentDate,
        createdAt: serverTimestamp(),
        status: "pending"
      });

      const emailData = {
        service_id: 'service_t3hfsbo',
        template_id: 'template_9cj1sv5',
        user_id: 'H5GsI8-bePiUDmeLF', 
        accessToken: 'VMQPu5GVcZgJrxcn8f2W7',
        template_params: {
          owner_email: user.email,
          pet_name: selectedPet,
          service_type: selectedSer,
          appointment_info: `${selectedDate} at ${selectedTime}`,
        }
      };

      const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(emailData),
      });

      if (response.ok) {
        Alert.alert("Success!", "Appointment confirmed and clinic notified!");
        
        // Reset fields after success
        setSelectedSer(null);
        setSelectedTime(null);
      } else {
        const errorText = await response.text();
        console.error("EmailJS API Error:", errorText);
        Alert.alert("Partial Success", "Booking saved, but email notification failed.");
      }
    } catch (error) {
      console.error("DETAILED ERROR:", error); 
      Alert.alert("Booking Failed", "Check your internet connection and try again.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={['#5ECDC5', '#3e5974']} style={styles.header} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
        <Text style={styles.headerTitle}>Book Appointment</Text>
        <Text style={styles.headerSubtitle}>Schedule a visit for your pet</Text>
      </LinearGradient>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Select Clinic */}
        <View style={styles.sectionCard}>
          <Text style={styles.label}>Select Clinic</Text>
          {['Pawpoint Clinic'].map((vet) => (
            <TouchableOpacity key={vet} style={[styles.chip, selectedVet === vet && styles.chipActive]} onPress={() => setSelectedVet(vet)}>
              <MaterialCommunityIcons name="map-marker-outline" size={18} color={selectedVet === vet ? "#5ECDC5" : "#1F395F"} />
              <Text style={[styles.selectionText, selectedVet === vet && styles.chipTextActive]}>{vet}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Select Pet */}
        <View style={styles.sectionCard}>
          <Text style={styles.label}>Select Pet</Text>
          {loadingPets ? <ActivityIndicator color="#5ECDC5" /> : (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{gap: 10}}>
              {pets.map((pet) => (
                <TouchableOpacity key={pet.id} style={[styles.chip, selectedPet === pet.name && styles.chipActive, {minWidth: 100}]} onPress={() => setSelectedPet(pet.name)}>
                  <Text style={[styles.chipText, selectedPet === pet.name && styles.chipTextActive]}>{pet.name}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}
        </View>

        {/* Select Service */}
        <View style={styles.sectionCard}>
          <Text style={styles.label}>Select Service</Text>
          {['General Checkup', 'Vaccination', 'Dental Cleaning'].map((service) => (
            <TouchableOpacity key={service} style={[styles.chip, {marginBottom: 8}, selectedSer === service && styles.chipActive]} onPress={() => setSelectedSer(service)}>
              <Text style={[styles.selectionText, selectedSer === service && styles.chipTextActive]}>{service}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Select Date */}
        <View style={styles.sectionCard}>
          <Text style={styles.label}>Select Date</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} 
                    contentContainerStyle={{ gap: 10 }}>
            {availableDates.map((item) => (
              <TouchableOpacity key={item.value} 
                                onPress={() => setSelectedDate(item.value)} 
                                style={[styles.dateChip, selectedDate === item.value && styles.chipActive]}>
                <Text style={[styles.dateNumber, selectedDate === item.value && styles.chipTextActive]}>
                  {item.label.split(' ')[0]}
                </Text>
                <Text style={[styles.dateDay, selectedDate === item.value && styles.chipTextActive]}>
                  {item.label.split(' ')[1]}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Select Time */}
        <View style={styles.sectionCard}>
          <Text style={styles.label}>Select Time Slot</Text>
          
          <Text style={styles.subLabel}>Morning</Text>
          <View style={styles.timeGrid}>
            {timeSlots.filter(slot => slot.value < "12:00").map((slot) => (
              <TouchableOpacity
                key={slot.value}
                onPress={() => setSelectedTime(slot.value)}
                style={[
                  styles.timeChip,
                  selectedTime === slot.value && styles.chipActive
                ]}
              >
                <Text style={[
                  styles.chipText,
                  selectedTime === slot.value && styles.chipTextActive
                ]}>
                  {slot.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={[styles.subLabel, { marginTop: 15 }]}>Afternoon</Text>
          <View style={styles.timeGrid}>
            {timeSlots.filter(slot => slot.value >= "12:00").map((slot) => (
              <TouchableOpacity
                key={slot.value}
                onPress={() => setSelectedTime(slot.value)}
                style={[
                  styles.timeChip,
                  selectedTime === slot.value && styles.chipActive
                ]}
              >
                <Text style={[
                  styles.chipText,
                  selectedTime === slot.value && styles.chipTextActive
                ]}>
                  {slot.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <TouchableOpacity style={styles.confirmButton} 
                          onPress={handleBooking}>
          <Text style={styles.confirmButtonText}>Confirm Appointment</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: 
  { 
    flex: 1, 
    backgroundColor: '#F8F9FA' 
  },

  header: { 
    padding: 25, 
    paddingTop: 40, 
    paddingBottom: 50 
  },

  headerTitle: { 
    color: 'white', 
    fontSize: 22, 
    fontWeight: 'bold' 
  },

  headerSubtitle: { 
    color: 'white', 
    opacity: 0.9, 
    fontSize: 14 
  },

  scrollContent: { 
    padding: 15, 
    marginTop: -30 
  },

  sectionCard: { 
    backgroundColor: 'white', 
    borderRadius: 20, 
    padding: 20, 
    marginBottom: 20, 
    elevation: 3, 
    marginTop: 25
  },

  label: { 
    fontSize: 14, 
    fontWeight: 'bold', 
    color: '#1F395F', 
    marginBottom: 15 
  },

  selectionText: {
     marginLeft: 10, 
     color: '#1F395F', 
     fontSize: 14 
    },

  chip: { 
    backgroundColor: '#F8F9FA', 
    paddingVertical: 12, 
    paddingHorizontal: 10, 
    borderRadius: 12, 
    alignItems: 'center', 
    flexDirection: 'row', 
    justifyContent: 'center' 
  },

  chipActive: { 
    backgroundColor: '#E0F2F1', 
    borderWidth: 1, 
    borderColor: '#5ECDC5' 
  },

  chipText: { 
    color: '#1F395F', 
    fontWeight: '500' 
  },

  chipTextActive: { 
    color: '#3DB2A4', 
    fontWeight: 'bold' 
  },

  dateChip: { 
    width: 60, 
    height: 70, 
    backgroundColor: '#F8F9FA', 
    borderRadius: 15, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },

  dateNumber: { 
    fontSize: 18, 
    fontWeight: 'bold', 
    color: '#1F395F' 
  },

  dateDay: { 
    fontSize: 12, 
    color: '#64748B' 
  },

  confirmButton: { 
    backgroundColor: '#5ECDC5', 
    padding: 18, 
    borderRadius: 15, 
    alignItems: 'center', 
    marginBottom: 40 
  },

  confirmButtonText: { 
    color: 'white', 
    fontWeight: 'bold', 
    fontSize: 16 
  },

  subLabel: {
    fontSize: 12,
    color: '#94A3B8',
    marginBottom: 10,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },

  timeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },

  timeChip: {
    width: '30%', 
    backgroundColor: '#F8F9FA',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
});

export default Book;