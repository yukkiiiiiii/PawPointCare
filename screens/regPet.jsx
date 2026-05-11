import React, {useRef} from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TextInput, 
  ScrollView, 
  Platform, 
  LayoutAnimation,
  UIManager,
  TouchableOpacity,
  onChange} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import DateTimePicker from '@react-native-community/datetimepicker';
import {collection, addDoc} from 'firebase/firestore';
import {FIREBASE_DB, FIREBASE_AUTH} from '../firebaseConfig';
import { type } from 'firebase/firestore/pipelines';
import QRCode from 'react-native-qrcode-svg';
import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import * as MediaLibrary from 'expo-media-library';


if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const RegPet = () => {
  const [isInfoOpen, setIsInfoOpen] = React.useState(false);
  const [isOwnerInfoOpen, setIsOwnerInfoOpen] = React.useState(false);
  const [isVaccinationOpen, setIsVaccinationOpen] = React.useState(false);
  const [isAllergiesOpen, setIsAllergiesOpen] = React.useState(false);
  const [isMedicalHistoryOpen, setIsMedicalHistoryOpen] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  const [dateGiven, setDateGiven] = useState(new Date());
  const [showDateGiven, setShowDateGiven] = useState(false);

  const [nextDueDate, setNextDueDate] = useState(new Date());
  const [showNextDue, setShowNextDue] = useState(false);

  const [dateDiagnosed, setDateDiagnosed] = useState(new Date());
  const [showDateDiagnosed, setShowDateDiagnosed] = useState(false);

  const [allergies, setAllergies] = React.useState(['']);

  const [medicalCond, setMedicalCond] = React.useState(['']);

  const [petName, setPetName] = React.useState('');
  const [species, setSpecies] = React.useState('');
  const [breed, setBreed] = React.useState('');
  const [age, setAge] = React.useState('');
  const [weight, setWeight] = React.useState('');
  const [color, setColor] = React.useState('');
  const [ownerName, setOwnerName] = React.useState(''); 
  const [ownerPhone, setOwnerPhone] = React.useState('');
  const [ownerAddress, setOwnerAddress] = React.useState('');
  const [vaccinationType, setVaccinationType] = React.useState('');

  const [qrValue, setQrValue] = React.useState('');
  const qrRef = useRef();

  

  const handleRegister = async () => {
    const user = FIREBASE_AUTH.currentUser;

    if(!user){
      alert("Action denied: No user logged in.");
      return;
    }

    setIsLoading(true);

    try{
      const docRef = await addDoc(collection(FIREBASE_DB, "pets"), {
        adminId: user.uid,
        adminEmail: user.email,
        petName: petName,
        species: species,
        breed: breed,
        age: age,
        weight: weight,
        color: color,
        owner: {
          name: ownerName,
          phone: ownerPhone,
          address: ownerAddress
        },
        vaccination: {
          type: vaccinationType,
          dateGiven: dateGiven.toISOString(),
          nextDue: nextDueDate.toISOString()
        },
        allergies: allergies.filter(a => a !== ''),
        medicalHistory: {
          conditions: medicalCond.filter(c => c !== ''),
          dateDiagnosed: dateDiagnosed.toISOString()
        },
        createdAt: new Date().toISOString()
      });
      setQrValue(docRef.id);
      alert("Registration Successful! ID: " + docRef.id);
    }catch(e){
      console.error("Error adding document: ", e);
      alert("Registration failed. Please try again.");
    }
  };

  const downloadQr = async () => {
    console.log("1. Button clicked, looking for QR ref...");
  
    if (qrRef.current) {
      qrRef.current.toDataURL((data) => {
        console.log("2. Captured data string. Length:", data?.length);
        
        if (data) {
          // Force the call to saveImage
          saveImage(data).catch(err => console.log("Error calling saveImage:", err));
        } else {
          console.log("Data was empty inside callback");
        }
      });
    } else {
      console.log("qrRef.current is null");
    }
  };

const saveImage = async (base64Data) => {
  console.log("3. Starting file save process...");
  try {
    const filename = `${FileSystem.documentDirectory}pet_qr_${qrValue}.png`;
    
    await FileSystem.writeAsStringAsync(filename, base64Data, {
      encoding: 'base64',
    });

    const { status } = await MediaLibrary.requestPermissionsAsync();
    if (status === 'granted') {
      await MediaLibrary.saveToLibraryAsync(filename);
      alert("Success! QR Code saved to your gallery.");
    } else {
      alert("Permission denied. Cannot save to gallery.");
    }
  } catch (err) {
    console.error("Save error inside saveImage:", err);
  }
};

  const addMedicalCond = () =>{
    setMedicalCond([...medicalCond, '']);
  }

  const updateMedicalCond = (text, index) => {
    const newMedicalCond = [...medicalCond];
    newMedicalCond[index] = text;
    setMedicalCond(newMedicalCond);
  }

  const removeMedicalCond = (index) => {
    if(medicalCond.length > 1){
      const newMedicalCond = medicalCond.filter((_, i) => i !== index);
      setMedicalCond(newMedicalCond);
    }
  };

  const addAllergy = () =>{
    setAllergies([...allergies, '']);
  };

  const updateAllergy = (text, index) => {
    const newAllergies = [...allergies];
    newAllergies[index] = text;
    setAllergies(newAllergies);
  };

  const removeAllergy = (index) => {
    if(allergies.length > 1){
      const newAllergies = allergies.filter((_, i) => i !== index);
      setAllergies(newAllergies);
    }
  };

  const onDateGivenChange = (event, selectedDate) => {
    setShowDateGiven(Platform.OS === 'ios');
    if (selectedDate) setDateGiven(selectedDate);
  };

  const onNextDueChange = (event, selectedDate) => {
    setShowNextDue(Platform.OS === 'ios');
    if (selectedDate) setNextDueDate(selectedDate);
  };

  const onDateDiagnosedChange = (event, selectedDate) => {
    setShowDateDiagnosed(Platform.OS === 'ios');
    if (selectedDate) setDateDiagnosed(selectedDate);
  }

 const formatDate = (selectedDate) => { 
  return `${selectedDate.getMonth() + 1}/${selectedDate.getDate()}/${selectedDate.getFullYear()}`;
};

 const togglePetInfo = () => {
  LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
  setIsInfoOpen(!isInfoOpen);
};

 const toggleOwnerInfo = () => {
  LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
  setIsOwnerInfoOpen(!isOwnerInfoOpen);
};

const toggleVaccination = () => {
  LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
  setIsVaccinationOpen(!isVaccinationOpen);
};

const toggleAllergies = () => {
  LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
  setIsAllergiesOpen(!isAllergiesOpen);
};

const toggleMedicalHistory = () => {
  LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
  setIsMedicalHistoryOpen(!isMedicalHistoryOpen);
};

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light-content" />
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        
        <View style={styles.header}>
          <LinearGradient colors={['#5ECDC5', '#1F395F']} style={styles.iconCircle}>
            <MaterialCommunityIcons name="heart-outline" size={40} color="white" />
          </LinearGradient>
          <Text style={styles.title}>Pet Registration</Text>
          <Text style={styles.subtitle}>
            Create a comprehensive health profile for your beloved companion
          </Text>
        </View>

        {/*Basic Info tab*/}
        <View style={styles.card}>
        <TouchableOpacity 
            style={styles.sectionHeader} 
            onPress={togglePetInfo}
            activeOpacity={0.7}>
            <View style={styles.sectionIconTitle}>
            <View style={styles.smallIconBox}>
                <MaterialCommunityIcons name="paw" size={20} color="white" />
            </View>
            <Text style={styles.sectionLabel}>Basic Information</Text>
            </View>
            <MaterialCommunityIcons 
            name={isInfoOpen ? "chevron-up" : "chevron-down"} 
            size={24} 
            color="#5ECDC5" 
            />
        </TouchableOpacity>

        {/* Only show this content if isInfoOpen is true */}
        {isInfoOpen && (
          <View>
            <View style={styles.grid}>
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Pet Name</Text>
                    <TextInput style={styles.input} 
                    placeholder="e.g., Max" 
                    placeholderTextColor="#ccc" 
                    value={petName} 
                    onChangeText={(text) => setPetName(text)} />
                </View>
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Species</Text>
                    <TextInput style={styles.input} 
                    placeholder="e.g., Dog, Cat" 
                    placeholderTextColor="#ccc" 
                    value={species} 
                    onChangeText={(text) => setSpecies(text)} />
                </View>
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Breed</Text>
                    <TextInput style={styles.input} 
                    placeholder="e.g., Golden R." 
                    placeholderTextColor="#ccc" 
                    value={breed} 
                    onChangeText={(text) => setBreed(text)} />
                </View>
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Age</Text>
                    <TextInput style={styles.input} 
                    placeholder="e.g., 3 years" 
                    placeholderTextColor="#ccc" 
                    value={age} 
                    onChangeText={(text) => setAge(text)} />
                </View>
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Weight</Text>
                    <TextInput style={styles.input} 
                    placeholder="e.g., 25 kg" 
                    placeholderTextColor="#ccc" 
                    value={weight} 
                    onChangeText={(text) => setWeight(text)} />
                </View>
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Color/Markings</Text>
                    <TextInput style={styles.input} 
                    placeholder="e.g., Golden" 
                    placeholderTextColor="#ccc" 
                    value={color} 
                    onChangeText={(text) => setColor(text)} />
                </View>
            </View>
          </View>
        )}
        </View>
        {/*Owner tab*/}
        <View style={[styles.card, { marginTop: 20 }]}>
          <TouchableOpacity 
            style={styles.sectionHeader} 
            onPress={toggleOwnerInfo} 
            activeOpacity={0.7}>
            <View style={styles.sectionIconTitle}>
              <View style={[styles.smallIconBox, { backgroundColor: '#5ECDC5' }]}> 
                <MaterialCommunityIcons name="account" size={20} color="white" />
              </View>
              <Text style={styles.sectionLabel}>Owner Information</Text>
            </View>
            <MaterialCommunityIcons 
              name={isOwnerInfoOpen ? "chevron-up" : "chevron-down"} 
              size={24} 
              color="#5ECDC5" 
            />
          </TouchableOpacity>

          {isOwnerInfoOpen && (
            <View>
              <View style={styles.grid}>
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Owner Name</Text>
                  <TextInput style={styles.input} 
                    placeholder="e.g., John Doe" 
                    placeholderTextColor="#ccc" 
                    value={ownerName} 
                    onChangeText={(text) => setOwnerName(text)} />
                </View>
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Phone Number</Text>
                  <TextInput style={styles.input} 
                    placeholder="e.g., 09123..." 
                    placeholderTextColor="#ccc" 
                    keyboardType="phone-pad" 
                    value={ownerPhone} 
                    onChangeText={(text) => setOwnerPhone(text)} />
                </View>
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Address</Text>
                  <TextInput style={styles.input} 
                    placeholder="e.g., 123 Main St" 
                    placeholderTextColor="#ccc" 
                    value={ownerAddress} 
                    onChangeText={(text) => setOwnerAddress(text)} />
                </View>

              </View>
            </View>
          )}
        </View>
        {/*Vaccination tab*/}
        <View style={[styles.card, { marginTop: 20 }]}>
          <TouchableOpacity 
            style={styles.sectionHeader} 
            onPress={toggleVaccination} 
            activeOpacity={0.7}>
            <View style={styles.sectionIconTitle}>
              <View style={[styles.smallIconBox, { backgroundColor: '#5ECDC5' }]}> 
                <MaterialCommunityIcons name="needle" size={20} color="white" />
              </View>
              <Text style={styles.sectionLabel}>Vaccination</Text>
            </View>
            <MaterialCommunityIcons 
              name={isVaccinationOpen ? "chevron-up" : "chevron-down"} 
              size={24} 
              color="#5ECDC5" 
            />
          </TouchableOpacity>

          {isVaccinationOpen && (
            <View>
              <View style={styles.grid}>
                {/* Vaccination Type */}
                <View style={[styles.inputGroup, { width: '100%' }]}>
                  <Text style={styles.label}>Vaccination type</Text>
                  <TextInput style={styles.input} 
                    placeholder="e.g., Anti-Rabies" 
                    placeholderTextColor="#ccc" 
                    value={vaccinationType} 
                    onChangeText={(text) => setVaccinationType(text)} />
                </View>

                {/* Date Given */}
                <View style={styles.inputGroup}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                    <MaterialCommunityIcons name="calendar" size={18} color="#5ECDC5" style={{ marginRight: 6 }} />
                    <Text style={[styles.label, { marginBottom: 0 }]}>Date given</Text>
                  </View>
                  
                  <TouchableOpacity 
                    style={styles.input} 
                    onPress={() => setShowDateGiven(true)}
                    activeOpacity={0.7}>
                    <Text style={{ color: '#000' }}>{dateGiven.toLocaleDateString()}</Text>
                  </TouchableOpacity>

                  {showDateGiven && (
                    <DateTimePicker 
                      value={dateGiven}
                      mode="date"
                      display="default"
                      onChange={onDateGivenChange}
                      maximumDate={new Date()} 
                    />
                  )}
                </View>

                {/* Next Due */}
                <View style={styles.inputGroup}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                    <MaterialCommunityIcons name="calendar" size={18} color="#5ECDC5" style={{ marginRight: 6 }} />
                    <Text style={[styles.label, { marginBottom: 0 }]}>Next Due</Text>
                  </View>

                  <TouchableOpacity 
                    style={styles.input} 
                    onPress={() => setShowNextDue(true)}
                    activeOpacity={0.7}>
                    <Text style={{ color: '#000' }}>{nextDueDate.toLocaleDateString()}</Text>
                  </TouchableOpacity>

                  {showNextDue && (
                    <DateTimePicker 
                      value={nextDueDate}
                      mode="date"
                      display="default"
                      onChange={onNextDueChange}
                    />
                  )}
                </View>
              </View>
            </View>
          )} 
        </View>

        {/*Allergies tab*/}
        <View style={[styles.card, { marginTop: 20 }]}>
          <TouchableOpacity 
            style={styles.sectionHeader} 
            onPress={toggleAllergies} 
            activeOpacity={0.7}>
            <View style={styles.sectionIconTitle}>
              <View style={[styles.smallIconBox, { backgroundColor: '#5ECDC5' }]}> 
                <MaterialCommunityIcons name="alert-circle" size={20} color="white" />
              </View>
              <Text style={styles.sectionLabel}>Allergies & Sensitivities</Text>
            </View>
            <MaterialCommunityIcons 
              name={isAllergiesOpen ? "chevron-up" : "chevron-down"} 
              size={24} 
              color="#5ECDC5" 
            />
          </TouchableOpacity>

          {isAllergiesOpen && (
          <View style={styles.grid}>
            {allergies.map((allergy, index) => (
              <View key={index} style={styles.inputGroup}>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                  <TextInput
                    style={styles.input}
                    placeholder="e.g., Food Allergy"
                    placeholderTextColor="#ccc"
                    value={allergy}
                    onChangeText={(text) => updateAllergy(text, index)}
                    width="70%"
                  />
                  
                  {/* Only show the plus button on the LAST input field */}
                  {index === allergies.length - 1 ? (
                    <TouchableOpacity 
                      onPress={addAllergy}
                      style={{ marginLeft: 10, backgroundColor: '#5ECDC5', borderRadius: 10, padding: 6 }}
                    >
                      <MaterialCommunityIcons name="plus" size={25} color="white" />
                    </TouchableOpacity>
                  ) : (
                    /* Optional: Show a delete button for previous fields */
                    <TouchableOpacity 
                      onPress={() => removeAllergy(index)}
                      style={{ marginLeft: 10, backgroundColor: '#FF6B6B', borderRadius: 10, padding: 6 }}
                    >
                      <MaterialCommunityIcons name="minus" size={25} color="white" />
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            ))}
          </View>
        )}
        </View>

      {/*Medical History tab*/}
      <View style={[styles.card, { marginTop: 20 }]}>
          <TouchableOpacity 
            style={styles.sectionHeader} 
            onPress={toggleMedicalHistory} 
            activeOpacity={0.7}>
            <View style={styles.sectionIconTitle}>
              <View style={[styles.smallIconBox, { backgroundColor: '#5ECDC5' }]}> 
                <MaterialCommunityIcons name="account" size={20} color="white" />
              </View>
              <Text style={styles.sectionLabel}>Medical History</Text>
            </View>
            <MaterialCommunityIcons 
              name={isMedicalHistoryOpen ? "chevron-up" : "chevron-down"} 
              size={24} 
              color="#5ECDC5" 
            />
          </TouchableOpacity>

          {isMedicalHistoryOpen && (
            <View>
              <View style={styles.grid}>
                {medicalCond.map((cond, index) => (
                  <View key={index} style={styles.inputGroup}>
                    <Text style={styles.label}>Condition</Text>
                    <TextInput 
                      style={styles.input} 
                      placeholder="e.g., arthritis" 
                      placeholderTextColor="#ccc" 
                      value={cond}
                      onChangeText={(text) => updateMedicalCond(text, index)}
                    />
                  </View>
                ))}

                <View style={styles.inputGroup} transform={[{ translateY: -4 }]}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                    <MaterialCommunityIcons name="calendar" size={18} color="#5ECDC5" style={{ marginRight: 6 }} />
                    <Text style={[styles.label, { marginBottom: 0 }]}>Date diagnosed</Text>
                  </View>
                  
                  <TouchableOpacity 
                    style={styles.input} 
                    onPress={() => setShowDateDiagnosed(true)}
                    activeOpacity={0.7}>
                    <Text style={{ color: '#000' }}>{dateDiagnosed.toLocaleDateString()}</Text>
                  </TouchableOpacity>

                  {showDateDiagnosed && (
                    <DateTimePicker 
                      value={dateDiagnosed}
                      mode="date"
                      display="default"
                      onChange={onDateDiagnosedChange}
                      maximumDate={new Date()} 
                    />
                  )}
                </View>

                <TouchableOpacity style={[styles.inputGroup, { width: '100%', marginTop: 15 }]} activeOpacity={0.7} onPress={addMedicalCond}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#5ECDC5', padding: 12, borderRadius: 10 }}>
                    <MaterialCommunityIcons name="plus" size={20} color="white" />
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>

          {/* Register Button */}
           <TouchableOpacity activeOpacity={0.8} padding={15} onPress={handleRegister} disabled={isLoading}>
            <LinearGradient colors={['#5ECDC5', '#1F395F']}  start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }} style={{ padding: 30, borderRadius: 15, alignItems: 'center', marginTop: '20' }}>
              <View style={{ flexDirection: 'row', alignItems: 'center'}}>
                <MaterialCommunityIcons name="check" size={20} color="white" style={{ marginRight: 6}} />
                <Text style={{ color: 'white', fontSize: 17, fontWeight: 'bold'}}>
                  {isLoading ? "Processing..." : "Generate QR code & Complete Registration"}
                </Text>
              </View>
            </LinearGradient>
           </TouchableOpacity>

           {/* Show QR Code after successful registration */}
          {qrValue ? (
            <View style={[styles.card, { marginTop: 20, alignItems: 'center' }]}>
              <Text style={[styles.sectionLabel, { marginBottom: 15 }]}>Pet QR Passport</Text>
              
              <QRCode
                value={qrValue}
                size={200}
                getRef={(c) =>(qrRef.current = c)}
              />

              <TouchableOpacity 
                style={styles.downloadButton} 
                onPress={downloadQr}>
                <MaterialCommunityIcons name="download" size={20} color="white" />
                <Text style={{ color: 'white', fontWeight: 'bold', marginLeft: 8 }}>
                  Download as PNG
                </Text>
              </TouchableOpacity>
            </View>
          ) : null}
        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

export default RegPet;

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#F8F9FA' 
  },
  scrollContent: { 
    padding: 20, 
    paddingTop: Platform.OS === 'android' ? 40 : 20 
  },
  header: { 
    alignItems: 'center', 
    marginBottom: 30 
  },
  iconCircle: {
    width: 80, 
    height: 80, 
    borderRadius: 40,
    justifyContent: 'center', 
    alignItems: 'center', 
    marginBottom: 15,
  },
  title: { 
    fontSize: 26, 
    fontWeight: 'bold', 
    color: '#1F395F' 
  },
  subtitle: { 
    textAlign: 'center', 
    color: '#8a8787', 
    marginTop: 5, 
    paddingHorizontal: 20,
    fontSize: 14,
    lineHeight: 20
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  sectionHeader: {
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginBottom: 25,
  },
  sectionIconTitle: { 
    flexDirection: 'row', 
    alignItems: 'center' 
  },
  smallIconBox: {
    backgroundColor: '#5ECDC5', 
    padding: 8, 
    borderRadius: 10, 
    marginRight: 10,
  },
  sectionLabel: { 
    fontSize: 18, 
    color: '#1F395F', 
    fontWeight: 'bold' 
  },
  grid: { 
    flexDirection: 'row', 
    flexWrap: 'wrap', 
    justifyContent: 'space-between' 
  },
  inputGroup: { 
    width: '48%', 
    marginBottom: 20 
  },
  label: { 
    color: '#1F395F', 
    marginBottom: 8, 
    fontSize: 13, 
    fontWeight: '600' 
  },
  input: {
    borderWidth: 1, 
    borderColor: '#E8E8E8', 
    borderRadius: 12,
    padding: 12, 
    color: '#000', 
    fontSize: 14,
    backgroundColor: '#FCFCFC'
  },
  downloadButton: {
    backgroundColor: '#1F395F',
    flexDirection: 'row',
    padding: 15,
    borderRadius: 12,
    marginTop: 20,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center'
 },
});