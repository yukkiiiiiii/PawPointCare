import React, {useState, useEffect} from 'react';
import { StyleSheet, 
        Text, 
        View, 
        Image, 
        TouchableOpacity,  
        StatusBar,
        ActivityIndicator, FlatList} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import {LinearGradient} from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import Logo from '../assets/img/ppcLogo.png';
import { ScrollView, TextInput } from "react-native-gesture-handler";
import { useNavigation } from '@react-navigation/native';
import {collection, query, where, onSnapshot} from 'firebase/firestore';
import {FIREBASE_DB, FIREBASE_AUTH} from '../firebaseConfig';


const Home = () =>{
    const navigation = useNavigation();
    const [pets, setPets] = useState([]);
    const [loading, setLoading] = useState(true);
    console.log("NAV:", navigation);

    useEffect(() => {
        const user = FIREBASE_AUTH.currentUser;
        if (!user) return;

        const q = query(collection(FIREBASE_DB, 'pets'), where("adminId", "==", user.uid));

        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const petList = [];
            querySnapshot.forEach((doc) => {
                petList.push({ id: doc.id, ...doc.data() });
            });
            setPets(petList);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);
    return(
        <SafeAreaView style={styles.container}>
            <StatusBar style="light-content" />
            <ScrollView contentContainerStyle={styles.scrollContent}
                        showsVerticalScrollIndicator={false}> 
                <View style={styles.bgContainer}>
                    <LinearGradient colors={['#5ECDC5', '#3e5974']}
                                    style={styles.background}
                                    start={{x: 0, y: 0}} 
                                    end={{x: 1, y: 1}}>
                        <Text style={styles.welcomeText}>Welcome!</Text>
                        <Text style={styles.helpText}>How can we help your pet today?</Text>
                    </LinearGradient>
                </View>

                <View style={styles.quickActionContainer}>
                    <Text style={styles.sectionTitle}>Quick Actions</Text>
                    <View style={styles.grid}>
                        <TouchableOpacity style={[styles.card, { backgroundColor: '#5ECDC5' }]}
                                          onPress={() => navigation.navigate('Vets')}>
                            <MaterialCommunityIcons name="map-marker-outline" size={32} color="white" />
                            <Text style={styles.cardText}>Find Clinics</Text>
                        </TouchableOpacity>
                        
                        <TouchableOpacity style={[styles.card, {backgroundColor: '#FF8383' }]}
                            onPress={() => navigation.navigate('Book')}>
                            <MaterialCommunityIcons name="calendar-check-outline" size={32} color="white" />
                            <Text style={styles.cardText}>Book Appointment</Text>    
                        </TouchableOpacity>

                        <TouchableOpacity style={[styles.card, {backgroundColor: '#37c4ba' }]} 
                        onPress={() => navigation.navigate('PetQrProf')}>
                            <MaterialCommunityIcons name="qrcode-scan" size={32} color="white" />
                            <Text style={styles.cardText}>Pet QR Profile</Text>    
                        </TouchableOpacity>

                        <TouchableOpacity style={[styles.card, {backgroundColor: '#8B9D83' }]} 
                        onPress={() => navigation.navigate('RegPet')}>
                            <MaterialCommunityIcons name="paw-outline" size={32} color="white" />
                            <Text style={styles.cardText}>Register Pets</Text>    
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={styles.appointmentContainer}>
                    <Text style={styles.sectionTitle}>Upcoming Appointments</Text>
                    <View style={styles.aptmntRowCard}>
                        <View style={styles.apptLeft}>
                             <Text style={styles.doctorName}>Dr. Sarah Jhonson</Text>
                             <Text style={styles.apptType}>Checkup - Max</Text>
                        </View>
                        <View style={styles.aptRight}>
                            <Text style={styles.apptDate}>Apr 10</Text>
                            <Text style={styles.apptTime}>2:00 PM</Text>
                        </View>
                    </View>

                    <View style={styles.aptmntRowCard}>
                        <View style={styles.apptLeft}>
                             <Text style={styles.doctorName}>Dr. Mike Brillante</Text>
                             <Text style={styles.apptType}>Vaccination - Luna</Text>
                        </View>
                        <View style={styles.aptRight}>
                            <Text style={styles.apptDate}>Apr 15</Text>
                            <Text style={styles.apptTime}>10:30 AM</Text>
                        </View>
                    </View>
                </View>

                <View style={styles.petContainer}>
                    <Text style={styles.sectionTitle}>Your Pets</Text>
                    
                    {loading ? (
                        <ActivityIndicator size="small" color="#5ECDC5" />
                    ) : pets.length > 0 ? (
                        pets.map((pet) => (
                            <View key={pet.id} style={styles.petCard}>
                                <View style={styles.petInfoLeft}>
                                    {/* Dynamic Image from DB */}
                                    <Image 
                                        source={{ uri: pet.petImageUrl || 'https://placedog.net/500' }} 
                                        style={styles.petImage} 
                                    />

                                    <View style={styles.petTextContainer}>
                                        <Text style={styles.petName}>{pet.petName}</Text>
                                        <Text style={styles.petDetail}>
                                            {pet.breed} • {pet.age} {parseInt(pet.age) === 1 ? 'year' : 'years'} old
                                        </Text>
                                    </View>
                                </View>

                                {/* QR Icon Navigates to the QR Profile page */}
                                <TouchableOpacity 
                                    style={styles.petInfoRight}
                                    onPress={() => navigation.navigate('PetQrProf')}
                                >
                                    <MaterialCommunityIcons name="qrcode-scan" size={28} color="#5ECDC5" />
                                </TouchableOpacity>
                            </View>
                        ))
                    ) : (
                        <Text style={styles.emptyText}>No pets registered yet.</Text>
                    )}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default Home;
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },

    scrollContent: {
        flexGrow: 1,
        backgroundColor:'#F8F9FA',
    },

    bgContainer: {
        height: '250',
        
    },

    background: {
        flex: 1,
        paddingTop: 60,
        paddingBottom: 30, 
        paddingHorizontal: 20,
        borderBottomLeftRadius: 20, 
        borderBottomRightRadius: 20,
    },

    welcomeText: {
        color: '#fff',
        fontSize: 25,
        fontWeight: 'bold',
        fontFamily: 'montserrat-bold',
    },

    helpText:{
        color: '#fff',
        fontSize: 14,
        fontWeight: '320',
        fontFamily: 'montserrat-regular',
        marginTop: 5,
    },

    quickActionContainer:{
        marginTop: -120,
        padding: 20,
        backgroundColor: '#fff',
        margin: 20,
        borderRadius: 20,
        marginHorizontal: 20,
        
        // shadow ng box yang baba
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
    },

    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        fontFamily: 'montserrat-bold',
        marginBottom: 15,
        color: '#1F395F',
    },

    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },

    card: {
        width: '48%',
        aspectRatio: 1,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 15,
        padding: 20,
    },
    
    cardText: {
        color: '#fff',
        fontSize: 13,
        fontWeight: 'bold',
        fontFamily: 'montserrat-regular',
        marginTop: 10,
        textAlign: 'center',
    },

    appointmentContainer:{
        padding: 20,
        backgroundColor: '#fff',
        margin: 20,
        borderRadius: 10,
        marginTop: 5,
        
        elevation: 3,
        boxShadow: '0px 2.2px 0.1px rgba(0, 0, 0, 0.1)',
        shadowOpacity: 0.1,
        shadowRadius: 5,
    },
    
    aptmntRowCard: {
        backgroundColor: '#F8F9FA', 
        borderRadius: 15,
        padding: 15,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },

    aptLeft: {
        flex: 1,
    },

    aptRight: {
        alignItems: 'flex-end', 
    },

    doctorName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#1F395F',
        fontFamily: 'montserrat-bold',
    },

    apptType: {
        fontSize: 14,
        color: '#8a8787',
        marginTop: 4,
        fontFamily: 'montserrat-regular',
    },

    dateText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#5ECDC5',
        fontFamily: 'montserrat-bold',
    },

    timeText: {
        fontSize: 13,
        color: '#1F395F',
        marginTop: 2,
        fontFamily: 'montserrat-regular',
    },

    petContainer: {
        padding: 20,
        backgroundColor: '#fff',
        margin: 20,
        borderRadius: 10,
        marginTop: 5,

        elevation: 3,
        boxShadow: '0px 2.2px 0.1px rgba(0, 0, 0, 0.1)',
        shadowOpacity: 0.1,
        shadowRadius: 5,
    },

    petCard: {
        backgroundColor: '#F8F9FA',
        borderRadius: 15,
        padding: 15,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },

    petInfoLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },

    circle: {
        width: 50,
        height: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },

    avatarLetter: {
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold',
    },

    petTextContainer: {
         flex: 1,
    },

    petName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#1F395F',
    },

    petDetail: {
        fontSize: 13,
        color: '#8a8787',
        marginTop: 2,
    },
    petInfoRight: {
        paddingLeft: 10,
    },

    petImage: {
        width: 55,
        height: 55,
        borderRadius: 27.5,
        marginRight: 15,
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },

    emptyText: {
        textAlign: 'center',
        color: '#64748B',
        fontStyle: 'italic',
        marginVertical: 10,
    },

    petInfoRight: {
        padding: 5,
    }
});