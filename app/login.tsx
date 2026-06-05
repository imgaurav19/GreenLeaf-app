import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, TextInput, Image, KeyboardAvoidingView, Platform, ScrollView, Alert, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useUser } from '@/context/UserContext';

export default function LoginScreen() {
  const router = useRouter();
  const { setUserName } = useUser();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (loading) return;
    if (step === 'phone') {
      if (!name.trim()) {
        Alert.alert('Name Required', 'Please enter your name.');
        return;
      }
      if (phone.length < 10) {
        Alert.alert('Invalid Number', 'Please enter a valid 10-digit mobile number.');
        return;
      }
    }
    
    setLoading(true);

    // MOCK LOGIN FOR HACKATHON
    setTimeout(() => {
      if (step === 'phone') {
        setUserName(name); // Save name to context
        setStep('otp');
      } else {
        // Check for specific passcodes
        if (otp === '544657' || otp === '454545' || otp === '123456') {
          router.replace('/(tabs)');
        } else {
          Alert.alert('Invalid OTP', 'Please use the tester codes: 544657 or 454545');
        }
      }
      setLoading(false);
    }, 1000);
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
          
          <View style={styles.formSection}>
            {step === 'phone' ? (
              <>
                <Text style={styles.mainTitle}>Enter your details</Text>
                
                <View style={styles.nameInputRow}>
                  <Ionicons name="person-outline" size={20} color="#666" />
                  <TextInput
                    style={styles.input}
                    placeholder="Enter your name"
                    placeholderTextColor="#999"
                    value={name}
                    onChangeText={setName}
                  />
                </View>

                <View style={styles.row}>
                  <View style={styles.countryPicker}>
                    <Image source={{ uri: 'https://flagcdn.com/w40/in.png' }} style={styles.flag} />
                    <Ionicons name="chevron-down" size={14} color="#000" />
                  </View>

                  <View style={styles.phoneInputRow}>
                    <Text style={styles.prefix}>+91</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="Mobile number"
                      placeholderTextColor="#999"
                      keyboardType="phone-pad"
                      maxLength={10}
                      value={phone}
                      onChangeText={setPhone}
                      autoFocus
                    />
                  </View>
                </View>

                <TouchableOpacity 
                  style={[styles.blackBtn, loading && { opacity: 0.7 }]} 
                  onPress={handleLogin} 
                  disabled={loading}
                >
                  <Text style={styles.blackBtnText}>{loading ? 'Please wait...' : 'Continue'}</Text>
                </TouchableOpacity>

                <View style={styles.dividerRow}>
                  <View style={styles.line} />
                  <Text style={styles.orText}>or</Text>
                  <View style={styles.line} />
                </View>

                <TouchableOpacity style={styles.socialBtn} onPress={() => router.replace('/(tabs)')}>
                  <Ionicons name="logo-google" size={20} color="#EA4335" />
                  <Text style={styles.socialBtnText}>Continue with Google</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.socialBtn}>
                  <Ionicons name="mail-outline" size={20} color="#000" />
                  <Text style={styles.socialBtnText}>Continue with email</Text>
                </TouchableOpacity>

                <View style={styles.dividerRow}>
                  <View style={styles.line} />
                  <Text style={styles.orText}>or</Text>
                  <View style={styles.line} />
                </View>

                <TouchableOpacity style={styles.findAccountBtn}>
                  <Ionicons name="search-outline" size={20} color="#000" />
                  <Text style={styles.findAccountText}>Find my account</Text>
                </TouchableOpacity>

                <View style={styles.footerWrap}>
                  <Text style={styles.footerNote}>
                    By continuing, you agree to our <Text style={styles.boldText}>Terms of Service</Text> & <Text style={styles.boldText}>Privacy Policy</Text>.
                  </Text>
                </View>

                <TouchableOpacity 
                  style={styles.bypassLink} 
                  onPress={() => router.replace('/(tabs)')}
                >
                  <Text style={styles.bypassText}>Tester Bypass (Skip to App)</Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <Text style={styles.mainTitle}>Verify Details</Text>
                <Text style={styles.subtitle}>Enter the 6-digit code sent to +91-{phone}</Text>
                
                <View style={styles.otpBox}>
                  <TextInput
                    style={styles.otpInput}
                    placeholder="000000"
                    placeholderTextColor="#CCC"
                    keyboardType="number-pad"
                    maxLength={6}
                    value={otp}
                    onChangeText={setOtp}
                    autoFocus
                  />
                </View>

                <TouchableOpacity 
                  style={[styles.blackBtn, loading && { opacity: 0.7 }]} 
                  onPress={handleLogin} 
                  disabled={loading}
                >
                  <Text style={styles.blackBtnText}>{loading ? 'Verifying...' : 'Verify & Proceed'}</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => setStep('phone')} style={styles.backBtn}>
                  <Text style={styles.backBtnText}>Change Mobile Number</Text>
                </TouchableOpacity>
              </>
            )}
          </View>

        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  content: {
    flexGrow: 1,
    paddingTop: 40,
  },
  formSection: {
    paddingHorizontal: 25,
    paddingTop: 20,
  },
  mainTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#000',
    marginBottom: 30,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 25,
  },
  countryPicker: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 12,
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
  },
  flag: {
    width: 24,
    height: 18,
    borderRadius: 2,
  },
  nameInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#000',
    borderRadius: 12,
    paddingHorizontal: 15,
    height: 56,
    marginBottom: 15,
    gap: 12,
  },
  phoneInputRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#000',
    borderRadius: 12,
    paddingHorizontal: 15,
    height: 56,
  },
  prefix: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000',
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  inputIcon: {
    marginLeft: 10,
  },
  blackBtn: {
    backgroundColor: '#000',
    height: 56,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 25,
  },
  blackBtnText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '800',
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: '#E5E7EB',
  },
  orText: {
    marginHorizontal: 15,
    color: '#9CA3AF',
    fontSize: 14,
  },
  socialBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 56,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    backgroundColor: '#F3F4F6',
    gap: 12,
    marginBottom: 15,
  },
  socialBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000',
  },
  findAccountBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    marginTop: 10,
  },
  findAccountText: {
    fontSize: 17,
    fontWeight: '700',
    color: '#000',
  },
  footerWrap: {
    marginTop: 40,
    marginBottom: 20,
  },
  footerNote: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'left',
    lineHeight: 18,
  },
  boldText: {
    fontWeight: '800',
    color: '#000',
  },
  bypassLink: {
    alignSelf: 'center',
    marginTop: 20,
    padding: 10,
  },
  bypassText: {
    color: '#9CA3AF',
    fontSize: 14,
    textDecorationLine: 'underline',
  },
  subtitle: {
    fontSize: 15,
    color: '#666',
    marginBottom: 25,
  },
  otpBox: {
    height: 60,
    borderWidth: 1.5,
    borderColor: '#000',
    borderRadius: 12,
    backgroundColor: '#FAFAFA',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 25,
  },
  otpInput: {
    fontSize: 24,
    fontWeight: '900',
    color: '#000',
    textAlign: 'center',
    width: '100%',
    letterSpacing: 10,
  },
  backBtn: {
    alignSelf: 'center',
    marginTop: 15,
  },
  backBtnText: {
    color: '#000',
    fontWeight: '700',
    fontSize: 14,
  },
});
