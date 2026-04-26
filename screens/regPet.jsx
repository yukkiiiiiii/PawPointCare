import React from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TextInput, 
  ScrollView, 
  SafeAreaView,
  Platform, 
  LayoutAnimation,
  UIManager,
  TouchableOpacity,
  onChange} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import DateTimePicker from '@react-native-community/datetimepicker';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const RegPet = () => {
 const [isInfoOpen, setIsInfoOpen] = React.useState(false);
 const [isOwnerInfoOpen, setIsOwnerInfoOpen] = React.useState(false);
 const [isVaccinationOpen, setIsVaccinationOpen] = React.useState(false);

  const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(false);
 
 const DateInput = () =>{
  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(Platform.OS === 'android');
    setDate(currentDate);
  }
 };

 const formatDate = (selectedDate) => {
  // Make sure the name matches the parameter in the parentheses
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

        {/* Form */}
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
                    <TextInput style={styles.input} placeholder="e.g., Max" placeholderTextColor="#ccc" />
                </View>
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Species</Text>
                    <TextInput style={styles.input} placeholder="e.g., Dog, Cat" placeholderTextColor="#ccc" />
                </View>
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Breed</Text>
                    <TextInput style={styles.input} placeholder="e.g., Golden R." placeholderTextColor="#ccc" />
                </View>
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Age</Text>
                    <TextInput style={styles.input} placeholder="e.g., 3 years" placeholderTextColor="#ccc" />
                </View>
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Weight</Text>
                    <TextInput style={styles.input} placeholder="e.g., 25 kg" placeholderTextColor="#ccc" />
                </View>
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Color/Markings</Text>
                    <TextInput style={styles.input} placeholder="e.g., Golden" placeholderTextColor="#ccc" />
                </View>
            </View>

            <View style={[styles.inputGroup, { width: '100%', marginTop: 15 }]}>
                <Text style={styles.label}>Microchip ID</Text>
                <TextInput style={styles.input} placeholder="e.g., 123456789012345" placeholderTextColor="#ccc" />
            </View>
          </View>
        )}
        </View>
        
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
                  <TextInput style={styles.input} placeholder="e.g., John Doe" placeholderTextColor="#ccc" />
                </View>
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Phone Number</Text>
                  <TextInput style={styles.input} placeholder="e.g., 09123..." placeholderTextColor="#ccc" keyboardType="phone-pad" />
                </View>
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Address</Text>
                  <TextInput style={styles.input} placeholder="e.g., 123 Main St" placeholderTextColor="#ccc" />
                </View>

              </View>
            </View>
          )}
        </View>
        
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
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Vaccination type</Text>
                  <TextInput style={styles.input} placeholder="e.g., John Doe" placeholderTextColor="#ccc" />
                </View>
                <View style={styles.inputGroup}>
                  <MaterialCommunityIcons name="calendar" size={20} color="#5ECDC5" style={{ marginBottom: 5 }} />
                  <Text style={styles.label}>Date given</Text>
                  <TouchableOpacity style={styles.input} 
                          onPress={() => setShow(true)}
                          activeOpacity={0.7}>
                          <Text style={{ color: '#000' }}>{date.toLocaleDateString()}</Text>
                  </TouchableOpacity>
                {show && (
                      <DateTimePicker value={date}
                                      mode="date"
                                      display="default"
                                      onChange={onChange}
                                      maximumDate={new Date()}/>
                )}
                </View>
                <View style={styles.inputGroup}>
                  <MaterialCommunityIcons name="calendar" size={20} color="#5ECDC5" style={{ marginRight: 5 }} />
                  <Text style={styles.label}>Next Due</Text>
                  <TouchableOpacity style={styles.input} 
                          onPress={() => setShow(true)}
                          activeOpacity={0.7}>
                          <Text style={{ color: '#000' }}>{date.toLocaleDateString()}</Text>
                  </TouchableOpacity>
                  {show && (
                      <DateTimePicker value={date}
                                      mode="date"
                                      display="default"
                                      onChange={onChange}
                                      maximumDate={new Date()}/>
                  )}
                </View>

              </View>
            </View>
          )}
        </View>
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
});