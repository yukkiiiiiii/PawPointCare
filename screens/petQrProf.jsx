import React, {useState, useEffect, useRef} from 'react';
import { View, 
    Text, 
    StyleSheet, 
    TouchableOpacity,
    ActivityIndicator,
    Animated,
    Share,
    Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { ScrollView } from 'react-native-gesture-handler';
import QRCode from 'react-native-qrcode-svg';
import { Share2, Download } from 'lucide-react-native';
import { StatusBar } from 'expo-status-bar';
import {collection, query, where, onSnapshot} from 'firebase/firestore';
import {FIREBASE_DB, FIREBASE_AUTH, FIREBASE_STORAGE, FIREBASE_APP} from '../firebaseConfig';
import * as FileSystem from 'expo-file-system/legacy';
import * as MediaLibrary from 'expo-media-library';
import * as Sharing from 'expo-sharing';
import * as ImagePicker from 'expo-image-picker';
import { EncodingType } from 'expo-file-system/legacy';
import {doc, updateDoc} from 'firebase/firestore';



export default function PetQrProf() {

    const [pets, setPets] = useState([]);
    const [selectedPetIndex, setSelectedPetIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);
    const qrRef = useRef();
    
    const editProfilePic = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') return alert('Permission needed!');

        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.3, // quality is directly proportional to string length
            base64: true, 
        });

        if (!result.canceled) {
            try {
            setLoading(true);
            
            // It creates a data URL string
            const base64Image = `data:image/jpeg;base64,${result.assets[0].base64}`;

            // Saves the text string directly to firestore
            const petDocRef = doc(FIREBASE_DB, 'pets', currentPet.id);
            await updateDoc(petDocRef, {
                petImageUrl: base64Image 
            });

            alert("Profile picture saved to database!");
            } catch (error) {
            console.error(error);
            alert("Failed to save image string.");
            } finally {
            setLoading(false);
            }
        }
    };

    const shareQr = async () => {
        if (!qrRef.current) return;

        qrRef.current.toDataURL(async (data) => {
            if (data) {
            try {
                const safePetName = currentPet?.petName ? currentPet.petName.replace(/[^a-z0-9]/gi, '_').toLowerCase() : 'pet';
                
                const filename = `${FileSystem.cacheDirectory}qr_${safePetName}.png`;

                await FileSystem.writeAsStringAsync(filename, data, {
                encoding: FileSystem.EncodingType.Base64,
                });

                const isAvailable = await Sharing.isAvailableAsync();
                if (isAvailable) {
                await Sharing.shareAsync(filename, {
                    mimeType: 'image/png',
                    dialogTitle: `Share ${currentPet.petName}'s QR Passport`,
                    UTI: 'public.png',
                });
                } else {
                alert("Sharing is not available on this device");
                }
            } catch (error) {
                console.error("Sharing Error:", error);
                alert("Failed to share QR code.");
            }
            }
        });
    };

    useEffect(() => {
      const user = FIREBASE_AUTH.currentUser;
      if(!user) return;
      
      const q = query(collection(FIREBASE_DB, 'pets'), where("adminId", "==", user.uid));

      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const petList = [];
        querySnapshot.forEach((doc) => {
            petList.push({id: doc.id, ...doc.data()});
        });
        setPets(petList);
        setLoading(false);
      });

      return () => unsubscribe();
    }, []);

    const currentPet = pets[selectedPetIndex];
   const websiteUrl = currentPet?.id 
    ? `https://pawpointcare.web.app/details.html?id=${currentPet.id}` 
    : '';

    const downloadQr = async () => {
        if (!qrRef.current) return;

        qrRef.current.toDataURL(async (data) => {
            if (data) {
            try {
                const safePetName = currentPet?.petName ? currentPet.petName.replace(/[^a-z0-9]/gi, '_').toLowerCase() : 'pet';
                const filename = `${FileSystem.documentDirectory}qr_${safePetName}.png`;

                await FileSystem.writeAsStringAsync(filename, data, {
                encoding: EncodingType.Base64, 
                });
                // Requesting permissions
                const { status } = await MediaLibrary.requestPermissionsAsync();
                
                if (status === 'granted') {
                await MediaLibrary.saveToLibraryAsync(filename);
                alert("Success! QR code saved to your gallery.");
                } else {
                alert("Permission denied. We need access to save the image.");
                }
            } catch (error) {
                console.error("Error saving QR:", error);
                alert("An error occurred while saving the QR code.");
            }
            }
        });
    };

    if(loading){
        return(
            <View style={[styles.container, { justifyContent: 'center' }]}>
                <ActivityIndicator size="large" color="#3DB2A4" />
            </View>
        );
    }

  return (
    <SafeAreaView style={styles.container}>
    <ScrollView>
      <StatusBar style="light-content" />
      <LinearGradient colors={['#3DB2A4', '#3e5974']} style={styles.header}>
        <Text style={styles.headerTitle}>Pet QR Passports</Text>
        <Text style={styles.headerSubtitle}>
          {pets.length > 0 ? "Select a pet to view their code" : "No pets registered yet"}
        </Text>
      </LinearGradient>

      <View style={styles.card}>
        {pets.length > 0 ? (
          <>
            {/* Toggle Buttons */}
            <View style={styles.toggleContainer}>
              {pets.map((pet, index) => (
                <TouchableOpacity
                  key={pet.id}
                  style={[styles.toggleBtn, selectedPetIndex === index ? styles.activeBtn : styles.inactiveBtn]}
                  onPress={() => {
                    setSelectedPetIndex(index);
                    setIsDetailsOpen(false);
                  }}
                >
                  <Text style={selectedPetIndex === index ? styles.activeText : styles.inactiveText}>
                    {pet.petName}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* QR Code Section */}
            <View style={styles.qrWrapper}>
              <QRCode 
               value={websiteUrl} 
                size={200} 
                getRef={(c) => (qrRef.current = c)}
              />
            </View>
            <Text style={styles.scanInstruction}>Scan to view {currentPet.petName}'s profile</Text>

            {/* Action Buttons */}
            <View style={styles.buttonRow}>
              <TouchableOpacity style={styles.shareBtn} activeOpacity={0.7} onPress={shareQr}>
                <MaterialCommunityIcons name="share-variant" size={20} color="white" />
                <Text style={styles.buttonText}> Share</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.downloadBtn} onPress={downloadQr} activeOpacity={0.7}>
                <MaterialCommunityIcons name="download" size={20} color="#64748B" />
                <Text style={[styles.buttonText, { color: '#64748B' }]}> Download</Text>
              </TouchableOpacity>
            </View>

            {/* Dropdown Section */}
            <TouchableOpacity 
              style={styles.dropdownHeader} 
              onPress={() => setIsDetailsOpen(!isDetailsOpen)}
            >
              <Text style={styles.viewDetails} name={isDetailsOpen}>View Pet Details</Text>
              
            </TouchableOpacity>

            {/* Pet Information Section */}
            {isDetailsOpen && (
            <View style={styles.detailsContent}>
                <View style={styles.divider} />

                <View style={styles.profileHeader}>
                <TouchableOpacity onPress={editProfilePic} activeOpacity={0.8}>
                    <View style={styles.imageContainer}>
                    <Image key={currentPet.petImageUrl}
                        source={{ uri: currentPet.petImageUrl || 'https://placedog.net/500', cache: 'reload' }} 
                        style={styles.profileImage} 
                        onLoadStart={() => console.log("Image: Started loading...")}
                        onLoad={() => console.log("Image: Load Success!")}
                        onError={(e) => console.log("Image: Load Error!", e.nativeEvent.error)}
                    />
                    {/* Overlay Edit Icon */}
                    <View style={styles.editIconBadge}>
                        <MaterialCommunityIcons name="camera-flip" size={16} color="white" />
                    </View>
                    </View>
                </TouchableOpacity>

                <View style={styles.profileHeaderText}>
                    <Text style={styles.petNameHeader}>{currentPet.petName}</Text>
                    <Text style={styles.petBreedHeader}>{currentPet.breed}</Text>
                </View>
                </View>

                <View style={styles.divider} />

                <Text style={styles.sectionTitle}>Pet Information</Text>
                
                <View style={styles.detailGroup}>
                <Text style={styles.detailLabel}>Pet ID</Text>
                <Text style={styles.detailValue}>{currentPet.id || 'N/A'}</Text>
                </View>

                <View style={styles.detailGroup}>
                <Text style={styles.detailLabel}>Name</Text>
                <Text style={styles.detailValue}>{currentPet.petName}</Text>
                </View>

                <View style={styles.detailGroup}>
                <Text style={styles.detailLabel}>Breed</Text>
                <Text style={styles.detailValue}>{currentPet.breed}</Text>
                </View>

                <View style={styles.detailGroup}>
                <Text style={styles.detailLabel}>Age</Text>
                <Text style={styles.detailValue}>{currentPet.age}</Text>
                </View>

                <View style={styles.detailGroup}>
                <Text style={styles.detailLabel}>Weight</Text>
                <Text style={styles.detailValue}>{currentPet.weight ? `${currentPet.weight}` : 'N/A'}</Text>
                </View>

                <View style={styles.divider} />

                {/* Owner Information Section */}
                <Text style={styles.sectionTitle}>Owner Information</Text>
                
                <View style={styles.detailGroup}>
                <Text style={styles.detailLabel}>Owner Name</Text>
                {/* Accessing nested owner object */}
                <Text style={styles.detailValue}>{currentPet.owner?.name || currentPet.ownerName || 'N/A'}</Text>
                </View>

                <View style={styles.detailGroup}>
                <Text style={styles.detailLabel}>Contact Number</Text>
                <Text style={styles.detailValue}>{currentPet.owner?.phone || currentPet.ownerPhone || 'N/A'}</Text>
                </View>

                <View style={styles.detailGroup}>
                <Text style={styles.detailLabel}>Home Address</Text>
                <Text style={styles.detailValue}>{currentPet.owner?.address || currentPet.ownerAddress || 'No address provided'}</Text>
                </View>

                <View style={styles.divider} />

                {/* Medical Information Section */}
                <Text style={styles.sectionTitle}>Medical Information</Text>
                
                <View style={styles.detailGroup}>
                <Text style={styles.detailLabel}>Medical Conditions</Text>
                {/* Logic to handle array of conditions */}
                {currentPet.medicalHistory?.conditions && currentPet.medicalHistory.conditions.length > 0 ? (
                    currentPet.medicalHistory.conditions.map((condition, index) => (
                    <Text key={index} style={styles.detailValue}>• {condition}</Text>
                    ))
                ) : (
                    <Text style={styles.detailValue}>{currentPet.medicalCondition || 'No known conditions'}</Text>
                )}
                </View>

                <View style={styles.detailGroup}>
                <Text style={styles.detailLabel}>Vaccination Status</Text>
                <Text style={styles.detailValue}>
                    {currentPet.vaccination?.type ? `Last: ${currentPet.vaccination.type}` : (currentPet.vaccinationStatus || 'Pending')}
                </Text>
                </View>

                <View style={styles.detailGroup}>
                <Text style={styles.detailLabel}>Allergies</Text>
                <Text style={styles.detailValue}>{currentPet.allergies || 'None'}</Text>
                </View>
            </View>
            )}
          </>
        ) : (
          /* empty -> should be shown when no pets are registered */
          <View style={styles.emptyContainer}>
            <View style={styles.emptyQrBox}>
              <MaterialCommunityIcons name="qrcode-scan" size={80} color="#CBD5E1" />
              <Text style={styles.emptyNote}>Register a pet to generate QR</Text>
            </View>
            
            <View style={styles.emptyDetailsBox}>
              <Text style={styles.emptyDetailsText}>Pet details will appear here after registration.</Text>
            </View>
          </View>
        )}
      </View>
    </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },

  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 100, 
  },

  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },

  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 8,
  },

  card: {
    backgroundColor: 'white',
    borderRadius: 24,
    marginHorizontal: 20,
    marginTop: -60, 
    padding: 24,
    alignItems: 'center',

    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
   
    elevation: 8,
  },

  toggleContainer: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
    padding: 4,
    marginBottom: 30,
    width: '100%',
  },

  toggleBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },

  activeBtn: {
    backgroundColor: '#3DB2A4',
  },

  activeText: {
    color: 'white',
    fontWeight: '600',
  },
  
  inactiveText: {
    color: '#64748B',
  },
  
  qrWrapper: {
    padding: 15,
    backgroundColor: 'white',
    borderRadius: 16,
    
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },

  scanInstruction: {
    marginVertical: 20,
    color: '#64748B',
    fontSize: 13,
  },

  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },

  shareBtn: {
    flex: 1,
    backgroundColor: '#3DB2A4',
    flexDirection: 'row',
    paddingVertical: 14,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  downloadBtn: {
    flex: 1,
    backgroundColor: '#F1F5F9',
    flexDirection: 'row',
    paddingVertical: 14,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },

  buttonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },

  viewDetails: {
    color: '#3DB2A4',
    fontWeight: '600',
    fontSize: 16,
    marginTop: 10,
  },
  //empty state 
  emptyContainer: {
    width: '100%',
    alignItems: 'center',
    paddingVertical: 20,
  },

  emptyQrBox: {
    width: 220,
    height: 220,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#E2E8F0',
    borderStyle: 'dashed', 
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    marginBottom: 20,
  },

  emptyNote: {
    color: '#94A3B8',
    fontSize: 12,
    marginTop: 10,
    textAlign: 'center',
    paddingHorizontal: 20,
  },

  emptyDetailsBox: {
    width: '100%',
    padding: 20,
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
    marginTop: 10,
  },

  emptyDetailsText: {
    color: '#64748B',
    fontSize: 14,
    textAlign: 'center',
    fontStyle: 'italic',
  },

detailsContent: {
    paddingHorizontal: 15,
    paddingBottom: 20,
    width: '100%',
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A', // Darker blue/black
    marginBottom: 15,
    marginTop: 10,
  },

  detailGroup: {
    marginBottom: 12,
  },

  detailLabel: {
    fontSize: 12,
    color: '#64748B', 
    marginBottom: 2,
  },
  
  detailValue: {
    fontSize: 15,
    fontWeight: '500',
    color: '#1E293B',
  },
  divider: {
    height: 1,
    backgroundColor: '#E2E8F0',
    marginVertical: 15,
    width: '100%',
  },

  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    backgroundColor: '#F8FAFC',
    borderRadius: 15,
    paddingHorizontal: 15,
  },

  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50, 
    borderWidth: 2,
    borderColor: '#3DB2A4',
  },

  profileHeaderText: {
    marginLeft: 15,
  },

  petNameHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1E293B',
  },

  petBreedHeader: {
    fontSize: 14,
    color: '#64748B',
  },

  imageContainer: {
    position: 'relative',
  },

  editIconBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#3DB2A4',
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'white',
  },

});
