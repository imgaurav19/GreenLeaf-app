import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, TextInput, Image, KeyboardAvoidingView, Platform, SafeAreaView, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function LoginScreen() {
  const router = useRouter();
  const [phone, setPhone] = useState('');
  const [step, setStep] = useState<'phone' | 'otp'>('phone');

  const handleLogin = () => {
    if (step === 'phone') {
      setStep('otp');
    } else {
      router.replace('/(tabs)');
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.container}>
      <SafeAreaView style={{ flex: 1 }}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>

        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
          <View style={styles.brandHero}>
            <LinearGradient colors={['#D8F36C', '#B2F44C']} style={styles.logoCircle}>
              <Ionicons name="leaf" size={40} color="#1A2A1A" />
            </LinearGradient>
            <Text style={styles.brandName}>Green Leaf</Text>
            <Text style={styles.brandTagline}>Your AI Botanical Expert</Text>
          </View>
          <Text style={styles.title}>{step === 'phone' ? 'Hello!' : 'Check your phone'}</Text>
          <Text style={styles.subtitle}>
            {step === 'phone' ? 'Log in with your mobile number to start caring for your plants.' : 'We sent a 6-digit code to your mobile number.'}
          </Text>

          <View style={styles.inputSection}>
            {step === 'phone' ? (
              <View style={styles.inputWrapper}>
                <Text style={styles.label}>Mobile Number</Text>
                <View style={styles.inputField}>
                  <Text style={styles.prefix}>+91</Text>
                  <TextInput
                    style={styles.textInput}
                    placeholder="123 456 7890"
                    keyboardType="phone-pad"
                    value={phone}
                    onChangeText={setPhone}
                    autoFocus
                  />
                </View>
              </View>
            ) : (
              <View style={styles.inputWrapper}>
                <Text style={styles.label}>OTP Code</Text>
                <TextInput
                  style={styles.otpInput}
                  placeholder="0 0 0 0 0 0"
                  keyboardType="number-pad"
                  maxLength={6}
                  autoFocus
                />
              </View>
            )}
          </View>

          <TouchableOpacity style={styles.loginBtn} onPress={handleLogin}>
            <LinearGradient colors={['#00C881', '#009D65']} style={styles.btnGradient}>
              <Text style={styles.btnText}>{step === 'phone' ? 'Send OTP' : 'Verify'}</Text>
            </LinearGradient>
          </TouchableOpacity>

          {step === 'phone' && (
            <View style={styles.socialSection}>
              <View style={styles.dividerRow}>
                <View style={styles.divider} />
                <Text style={styles.dividerText}>or continue with</Text>
                <View style={styles.divider} />
              </View>

              <View style={styles.socialBtns}>
                <TouchableOpacity style={[styles.socialBtn, styles.googleFullBtn]} onPress={() => router.replace('/(tabs)')}>
                  <Ionicons name="logo-google" size={20} color="#EA4335" />
                  <Text style={styles.socialBtnText}>Continue with Google</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {step === 'otp' && (
            <TouchableOpacity onPress={() => setStep('phone')} style={styles.resendBtn}>
              <Text style={styles.resendText}>Resend Code</Text>
            </TouchableOpacity>
          )}
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
  backBtn: {
    padding: 20,
    marginTop: 10,
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: 25,
    paddingTop: 10,
    paddingBottom: 30,
  },
  brandHero: {
    alignItems: 'center',
    marginBottom: 20,
  },
  logoCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
    shadowColor: '#D8F36C',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 10,
  },
  brandName: {
    fontSize: 32,
    fontWeight: '900',
    color: '#000',
    letterSpacing: -1,
  },
  brandTagline: {
    fontSize: 14,
    color: '#666',
    fontWeight: '600',
    marginTop: 5,
  },
  title: {
    fontSize: 28,
    fontWeight: '900',
    color: '#000',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: '#666',
    lineHeight: 22,
    marginBottom: 25,
  },
  inputSection: {
    marginBottom: 20,
  },
  inputWrapper: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#999',
    marginBottom: 10,
  },
  inputField: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: '#EEE',
    paddingBottom: 10,
  },
  prefix: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginRight: 15,
  },
  textInput: {
    flex: 1,
    fontSize: 18,
    color: '#000',
    fontWeight: '500',
  },
  otpInput: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#000',
    letterSpacing: 10,
    borderBottomWidth: 2,
    borderBottomColor: '#00C881',
    paddingBottom: 10,
    textAlign: 'center',
  },
  loginBtn: {
    height: 55,
    borderRadius: 28,
    overflow: 'hidden',
    marginTop: 15,
  },
  btnGradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  socialSection: {
    marginTop: 35,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 25,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: '#EEE',
  },
  dividerText: {
    color: '#999',
    marginHorizontal: 15,
    fontSize: 14,
  },
  socialBtns: {
    width: '100%',
    alignItems: 'center',
  },
  socialBtn: {
    height: 55,
    borderRadius: 28,
    borderWidth: 1,
    borderColor: '#EEE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  googleFullBtn: {
    width: '100%',
    flexDirection: 'row',
    gap: 12,
    backgroundColor: '#FFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  socialBtnText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  resendBtn: {
    alignSelf: 'center',
    marginTop: 30,
  },
  resendText: {
    color: '#00C881',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
