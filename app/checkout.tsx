import React, { useState } from 'react';
import {
  StyleSheet, View, Text, TouchableOpacity,
  ScrollView, Dimensions, TextInput, Modal, ActivityIndicator, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useCart } from '@/context/CartContext';
import { useUser } from '@/context/UserContext';
import { getProductById } from '@/constants/products';
import LocationPickerModal from '@/components/LocationPickerModal';
import * as Haptics from 'expo-haptics';

const { width } = Dimensions.get('window');

const PAYMENT_METHODS = [
  { id: 'cod', label: 'Cash on Delivery', icon: 'cash-outline' as const, sub: 'Pay when delivered' },
  { id: 'upi', label: 'UPI / Google Pay', icon: 'phone-portrait-outline' as const, sub: 'PhonePe, GPay, Paytm' },
  { id: 'card', label: 'Credit / Debit Card', icon: 'card-outline' as const, sub: 'Visa, Mastercard, RuPay' },
];

export default function CheckoutScreen() {
  const { items, itemCount, clearCart } = useCart();
  const { locationCity, area, isDarkMode, addOwnedPlants } = useUser();
  const [selectedPayment, setSelectedPayment] = useState('cod');
  const [promoCode, setPromoCode] = useState('');
  
  // Picker visibility
  const [pickerVisible, setPickerVisible] = useState(false);
  
  // Payment Simulation States
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing_upi' | 'card_entry' | 'processing_card' | 'success'>('idle');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  
  // Full Address Details
  const [houseNo, setHouseNo] = useState('');
  const [landmark, setLandmark] = useState('');

  // Delivery Time
  const [selectedDeliveryTime, setSelectedDeliveryTime] = useState('15 - 30 mins');
  const DELIVERY_OPTIONS = ['15 - 30 mins', '1 Week', '2 Weeks', '3 Weeks'];

  // Map cart items to product details
  const cartProducts = items.map(item => {
    const detail = getProductById(item.id);
    return {
      ...item,
      name: detail?.name || 'Money Plant',
      price: detail?.price || 299,
    };
  });

  const subtotal = cartProducts.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryFee = subtotal > 0 ? 40 : 0;
  const discount = promoCode.toUpperCase() === 'GREEN60' ? Math.round(subtotal * 0.6) : 0;
  const total = subtotal + deliveryFee - discount;

  const handlePlaceOrder = () => {
    if (items.length === 0) {
      Alert.alert('Empty Bag', 'Please add items to your bag before checking out.');
      return;
    }
    
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    if (selectedPayment === 'cod') {
      // Immediate flow
      proceedToSuccess();
    } else if (selectedPayment === 'upi') {
      // UPI Processing simulation
      setPaymentStatus('processing_upi');
      setTimeout(() => {
        proceedToSuccess();
      }, 2500);
    } else if (selectedPayment === 'card') {
      // Show card form
      setPaymentStatus('card_entry');
    }
  };

  const handleCardPay = () => {
    if (cardNumber.length < 16 || expiry.length < 4 || cvv.length < 3) {
      Alert.alert('Invalid Details', 'Please fill in correct card details (16 digit number, Expiry, and CVV).');
      return;
    }
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setPaymentStatus('processing_card');
    setTimeout(() => {
      proceedToSuccess();
    }, 2000);
  };

  const proceedToSuccess = () => {
    setPaymentStatus('success');
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    
    setTimeout(() => {
      setPaymentStatus('idle');
      // Pass ordered items and calculations as search params
      const orderedItems = cartProducts.map(p => ({
        name: p.name,
        price: p.price,
        quantity: p.quantity,
      }));

      const params = {
        items: JSON.stringify(orderedItems),
        subtotal,
        deliveryFee,
        discount,
        total,
      };

      addOwnedPlants(orderedItems);
      clearCart();
      
      router.replace({
        pathname: '/tracking',
        params: params,
      });
    }, 2000);
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={isDarkMode ? ['#121212', '#1E1E1E'] : ['#F0F4EF', '#FAFDF7']} style={StyleSheet.absoluteFill} />

      <SafeAreaView style={{ flex: 1 }}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={[styles.headerBtn, { backgroundColor: isDarkMode ? '#222' : '#FFF' }]}>
            <Ionicons name="chevron-back" size={24} color={isDarkMode ? '#FFF' : '#000'} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: isDarkMode ? '#FFF' : '#000' }]}>Checkout</Text>
          <View style={{ width: 44 }} />
        </View>

        {items.length === 0 ? (
          <View style={styles.emptyContainer}>
            <MaterialCommunityIcons name="shopping-outline" size={64} color={isDarkMode ? '#555' : '#CCC'} />
            <Text style={[styles.emptyTitle, { color: isDarkMode ? '#FFF' : '#000' }]}>Your Bag is Empty</Text>
            <Text style={styles.emptySub}>Add plants and accessories to get started!</Text>
            <TouchableOpacity style={styles.shopBtn} onPress={() => router.replace('/(tabs)')}>
              <Text style={styles.shopText}>Go Shop</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 140 }}>

            {/* Delivery Address */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={[styles.sectionTitle, { color: isDarkMode ? '#FFF' : '#1A2A1A' }]}>Delivery Address</Text>
                <TouchableOpacity onPress={() => setPickerVisible(true)}>
                  <Text style={styles.changeBtn}>Change Area</Text>
                </TouchableOpacity>
              </View>
              <View style={[styles.addressCard, { backgroundColor: isDarkMode ? '#1E1E1E' : '#FFF', borderColor: isDarkMode ? 'rgba(0,200,129,0.3)' : 'rgba(0,200,129,0.15)' }]}>
                <View style={styles.addressTopRow}>
                  <View style={styles.addressIcon}>
                    <Ionicons name="location" size={22} color="#00C881" />
                  </View>
                  <View style={styles.addressContent}>
                    <Text style={[styles.addressName, { color: isDarkMode ? '#FFF' : '#000' }]}>{locationCity}, {area}</Text>
                  </View>
                </View>
                
                <View style={styles.addressForm}>
                  <TextInput 
                    style={[styles.addressInput, { color: isDarkMode ? '#FFF' : '#000', borderColor: isDarkMode ? '#333' : '#E0E0E0' }]} 
                    placeholder="House / Flat No., Building Name"
                    placeholderTextColor={isDarkMode ? '#888' : '#AAA'}
                    value={houseNo}
                    onChangeText={setHouseNo}
                  />
                  <TextInput 
                    style={[styles.addressInput, { color: isDarkMode ? '#FFF' : '#000', borderColor: isDarkMode ? '#333' : '#E0E0E0' }]} 
                    placeholder="Landmark (Optional)"
                    placeholderTextColor={isDarkMode ? '#888' : '#AAA'}
                    value={landmark}
                    onChangeText={setLandmark}
                  />
                </View>
              </View>
            </View>

            {/* Order Summary */}
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: isDarkMode ? '#FFF' : '#1A2A1A' }]}>Order Summary</Text>
              <View style={[styles.summaryCard, { backgroundColor: isDarkMode ? '#1E1E1E' : '#FFF' }]}>
                {/* Item rows */}
                {cartProducts.map((p, index) => (
                  <View key={p.id + '-' + index} style={styles.itemRow}>
                    <View style={styles.itemInfo}>
                      <View style={styles.itemQtyBadge}>
                        <Text style={styles.itemQtyText}>{p.quantity}x</Text>
                      </View>
                      <Text style={[styles.itemName, { color: isDarkMode ? '#FFF' : '#333' }]} numberOfLines={1}>
                        {p.name}
                      </Text>
                    </View>
                    <Text style={[styles.itemPrice, { color: isDarkMode ? '#FFF' : '#000' }]}>₹{p.price * p.quantity}</Text>
                  </View>
                ))}

                <View style={[styles.divider, { backgroundColor: isDarkMode ? '#333' : '#F0F0F0' }]} />

                <View style={styles.feeRow}>
                  <Text style={[styles.feeLabel, { color: isDarkMode ? '#AAA' : '#666' }]}>Subtotal</Text>
                  <Text style={[styles.feeValue, { color: isDarkMode ? '#FFF' : '#333' }]}>₹{subtotal}</Text>
                </View>
                <View style={styles.feeRow}>
                  <View style={styles.feeWithIcon}>
                    <MaterialCommunityIcons name="truck-delivery-outline" size={16} color={isDarkMode ? '#AAA' : '#666'} />
                    <Text style={[styles.feeLabel, { color: isDarkMode ? '#AAA' : '#666' }]}>Delivery Fee</Text>
                  </View>
                  <Text style={[styles.feeValue, { color: isDarkMode ? '#FFF' : '#333' }]}>₹{deliveryFee}</Text>
                </View>
                {discount > 0 && (
                  <View style={styles.feeRow}>
                    <Text style={[styles.feeLabel, { color: '#00C881' }]}>Discount (GREEN60)</Text>
                    <Text style={[styles.feeValue, { color: '#00C881' }]}>-₹{discount}</Text>
                  </View>
                )}

                <View style={[styles.divider, { marginVertical: 12, backgroundColor: isDarkMode ? '#333' : '#F0F0F0' }]} />

                <View style={styles.feeRow}>
                  <Text style={[styles.totalLabel, { color: isDarkMode ? '#FFF' : '#000' }]}>Total</Text>
                  <Text style={[styles.totalValue, { color: isDarkMode ? '#FFF' : '#000' }]}>₹{total}</Text>
                </View>
              </View>
            </View>

            {/* Promo Code */}
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: isDarkMode ? '#FFF' : '#1A2A1A' }]}>Promo Code</Text>
              <View style={styles.promoRow}>
                <View style={[styles.promoInputWrap, { backgroundColor: isDarkMode ? '#1E1E1E' : '#FFF', borderColor: isDarkMode ? '#333' : '#EEE' }]}>
                  <Ionicons name="pricetag-outline" size={18} color="#999" />
                  <TextInput
                    placeholder="Enter promo code (e.g. GREEN60)"
                    placeholderTextColor="#999"
                    style={[styles.promoInput, { color: isDarkMode ? '#FFF' : '#000' }]}
                    value={promoCode}
                    onChangeText={setPromoCode}
                    autoCapitalize="characters"
                  />
                </View>
                <TouchableOpacity style={styles.promoApplyBtn} onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  if (promoCode.toUpperCase() === 'GREEN60') {
                    Alert.alert('Promo Applied', '60% discount code successfully applied!');
                  } else {
                    Alert.alert('Invalid Code', 'Try GREEN60 to get a promo discount.');
                  }
                }}>
                  <Text style={styles.promoApplyText}>Apply</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Payment Method */}
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: isDarkMode ? '#FFF' : '#1A2A1A' }]}>Payment Method</Text>
              {PAYMENT_METHODS.map(method => (
                <TouchableOpacity
                  key={method.id}
                  style={[
                    styles.paymentOption,
                    { backgroundColor: isDarkMode ? '#1E1E1E' : '#FFF', borderColor: isDarkMode ? '#333' : '#F0F0F0' },
                    selectedPayment === method.id && styles.paymentOptionActive,
                  ]}
                  onPress={() => setSelectedPayment(method.id)}
                >
                  <View style={[
                    styles.paymentIconBox,
                    selectedPayment === method.id && styles.paymentIconBoxActive,
                  ]}>
                    <Ionicons
                      name={method.icon}
                      size={22}
                      color={selectedPayment === method.id ? '#FFF' : (isDarkMode ? '#FFF' : '#666')}
                    />
                  </View>
                  <View style={styles.paymentInfo}>
                    <Text style={[
                      styles.paymentLabel,
                      { color: isDarkMode ? '#FFF' : '#333' },
                      selectedPayment === method.id && styles.paymentLabelActive,
                    ]}>{method.label}</Text>
                    <Text style={styles.paymentSub}>{method.sub}</Text>
                  </View>
                  <View style={[
                    styles.radio,
                    selectedPayment === method.id && styles.radioActive,
                  ]}>
                    {selectedPayment === method.id && <View style={styles.radioInner} />}
                  </View>
                </TouchableOpacity>
              ))}
            </View>

            {/* Delivery Time */}
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: isDarkMode ? '#FFF' : '#1A2A1A' }]}>Estimated Delivery</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 10 }}>
                {DELIVERY_OPTIONS.map(option => (
                  <TouchableOpacity
                    key={option}
                    style={[
                      styles.deliveryTimeCard,
                      {
                        backgroundColor: selectedDeliveryTime === option 
                          ? (isDarkMode ? 'rgba(0,200,129,0.15)' : 'rgba(0,200,129,0.08)') 
                          : (isDarkMode ? '#1E1E1E' : '#FFF'),
                        borderColor: selectedDeliveryTime === option 
                          ? (isDarkMode ? 'rgba(0,200,129,0.3)' : 'rgba(0,200,129,0.15)') 
                          : (isDarkMode ? '#333' : '#F0F0F0'),
                      }
                    ]}
                    onPress={() => setSelectedDeliveryTime(option)}
                  >
                    <View style={[
                      styles.deliveryTimeIcon,
                      selectedDeliveryTime !== option && { backgroundColor: isDarkMode ? '#333' : '#F5F5F5' }
                    ]}>
                      <MaterialCommunityIcons 
                        name={option === '15 - 30 mins' ? "clock-fast" : "calendar-clock"} 
                        size={20} 
                        color={selectedDeliveryTime === option ? "#00C881" : (isDarkMode ? '#AAA' : '#666')} 
                      />
                    </View>
                    <Text style={[
                      styles.deliveryTimeValue, 
                      { 
                        color: selectedDeliveryTime === option 
                          ? (isDarkMode ? '#FFF' : '#1A2A1A')
                          : (isDarkMode ? '#AAA' : '#666')
                      }
                    ]}>{option}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

          </ScrollView>
        )}

        {/* Bottom Place Order Bar */}
        {items.length > 0 && (
          <View style={styles.bottomBar}>
            <View style={styles.bottomPill}>
              <View style={styles.bottomPriceInfo}>
                <Text style={styles.bottomTotalLabel}>Total</Text>
                <Text style={styles.bottomTotalValue}>₹{total}</Text>
              </View>
              <TouchableOpacity style={styles.placeOrderBtn} onPress={handlePlaceOrder}>
                <Text style={styles.placeOrderText}>Place Order</Text>
                <Ionicons name="arrow-forward" size={20} color="#000" />
              </TouchableOpacity>
            </View>
          </View>
        )}

      </SafeAreaView>

      {/* Location Picker Bottom Sheet */}
      <LocationPickerModal visible={pickerVisible} onClose={() => setPickerVisible(false)} />

      {/* Simulated Payments Overlays */}
      <Modal
        visible={paymentStatus !== 'idle'}
        transparent
        animationType="fade"
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalCard, { backgroundColor: isDarkMode ? '#1E1E1E' : '#FFF' }]}>
            
            {/* 1. UPI Loading Screen */}
            {paymentStatus === 'processing_upi' && (
              <View style={styles.modalContent}>
                <ActivityIndicator size="large" color="#00C881" />
                <Text style={[styles.modalTitle, { color: isDarkMode ? '#FFF' : '#000' }]}>Waiting for UPI</Text>
                <Text style={styles.modalText}>Approve the payment request on your UPI app (GPay / PhonePe / Paytm)...</Text>
              </View>
            )}

            {/* 2. Card Form Screen */}
            {paymentStatus === 'card_entry' && (
              <View style={styles.modalContent}>
                <Ionicons name="card" size={44} color="#00C881" />
                <Text style={[styles.modalTitle, { color: isDarkMode ? '#FFF' : '#000' }]}>Enter Card Details</Text>
                
                <TextInput
                  placeholder="Card Number (16 Digits)"
                  placeholderTextColor="#999"
                  style={[styles.modalInput, { color: isDarkMode ? '#FFF' : '#000', borderColor: isDarkMode ? '#333' : '#DDD' }]}
                  keyboardType="numeric"
                  maxLength={16}
                  value={cardNumber}
                  onChangeText={setCardNumber}
                />
                <View style={styles.row}>
                  <TextInput
                    placeholder="Expiry MM/YY"
                    placeholderTextColor="#999"
                    style={[styles.modalInput, { flex: 1, color: isDarkMode ? '#FFF' : '#000', borderColor: isDarkMode ? '#333' : '#DDD' }]}
                    maxLength={5}
                    value={expiry}
                    onChangeText={setExpiry}
                  />
                  <TextInput
                    placeholder="CVV"
                    placeholderTextColor="#999"
                    style={[styles.modalInput, { flex: 1, color: isDarkMode ? '#FFF' : '#000', borderColor: isDarkMode ? '#333' : '#DDD' }]}
                    keyboardType="numeric"
                    maxLength={3}
                    secureTextEntry
                    value={cvv}
                    onChangeText={setCvv}
                  />
                </View>

                <TouchableOpacity style={styles.payBtn} onPress={handleCardPay}>
                  <Text style={styles.payBtnText}>Pay ₹{total}</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.cancelLink} onPress={() => setPaymentStatus('idle')}>
                  <Text style={styles.cancelText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            )}

            {/* 3. Card Loading Screen */}
            {paymentStatus === 'processing_card' && (
              <View style={styles.modalContent}>
                <ActivityIndicator size="large" color="#00C881" />
                <Text style={[styles.modalTitle, { color: isDarkMode ? '#FFF' : '#000' }]}>Processing Payment...</Text>
                <Text style={styles.modalText}>Securely authorizing your card via RBI-compliant gateway...</Text>
              </View>
            )}

            {/* 3. Success Screen */}
            {paymentStatus === 'success' && (
              <View style={styles.modalContent}>
                <Ionicons name="checkmark-circle" size={80} color="#00C881" />
                <Text style={[styles.modalTitle, { color: isDarkMode ? '#FFF' : '#000', marginTop: 15 }]}>Payment Successful!</Text>
                <Text style={styles.modalText}>Your order has been placed. Redirecting to live tracking...</Text>
              </View>
            )}

          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 15,
  },
  headerBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    elevation: 2,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '900',
  },

  // Empty Cart
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 30,
    paddingTop: 80,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 8,
  },
  emptySub: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
    marginBottom: 30,
  },
  shopBtn: {
    backgroundColor: '#00C881',
    paddingHorizontal: 40,
    paddingVertical: 14,
    borderRadius: 25,
  },
  shopText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },

  // Sections
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 12,
  },
  changeBtn: {
    color: '#00C881',
    fontWeight: '700',
    fontSize: 14,
    marginBottom: 12,
  },

  // Address
  addressCard: {
    flexDirection: 'row',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    gap: 14,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    borderWidth: 1,
  },
  addressTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  addressForm: {
    marginTop: 4,
  },
  addressInput: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 10,
    fontSize: 14,
  },
  addressIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(0,200,129,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addressContent: {
    flex: 1,
  },
  addressName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  addressText: {
    fontSize: 13,
    lineHeight: 18,
  },

  // Order Summary
  summaryCard: {
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  itemInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  itemQtyBadge: {
    backgroundColor: '#D8F36C',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  itemQtyText: {
    fontWeight: '900',
    fontSize: 13,
    color: '#000',
  },
  itemName: {
    fontSize: 15,
    fontWeight: '600',
    flex: 1,
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: '800',
  },
  divider: {
    height: 1,
    marginVertical: 14,
  },
  feeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  feeWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  feeLabel: {
    fontSize: 14,
  },
  feeValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '900',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: '900',
  },

  // Promo
  promoRow: {
    flexDirection: 'row',
    gap: 10,
  },
  promoInputWrap: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    paddingHorizontal: 16,
    gap: 10,
    borderWidth: 1,
  },
  promoInput: {
    flex: 1,
    paddingVertical: 14,
    fontSize: 14,
    fontWeight: '600',
  },
  promoApplyBtn: {
    backgroundColor: '#1A2A1A',
    paddingHorizontal: 24,
    borderRadius: 16,
    justifyContent: 'center',
  },
  promoApplyText: {
    color: '#D8F36C',
    fontWeight: 'bold',
    fontSize: 14,
  },

  // Payment Methods
  paymentOption: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 18,
    padding: 16,
    marginBottom: 10,
    gap: 14,
    borderWidth: 1.5,
  },
  paymentOptionActive: {
    borderColor: '#00C881',
    backgroundColor: 'rgba(0,200,129,0.03)',
  },
  paymentIconBox: {
    width: 46,
    height: 46,
    borderRadius: 14,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paymentIconBoxActive: {
    backgroundColor: '#00C881',
  },
  paymentInfo: {
    flex: 1,
  },
  paymentLabel: {
    fontSize: 15,
    fontWeight: '700',
  },
  paymentLabelActive: {
    fontWeight: '900',
  },
  paymentSub: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: '#DDD',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioActive: {
    borderColor: '#00C881',
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#00C881',
  },

  // Delivery Time
  deliveryTimeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    padding: 12,
    paddingRight: 18,
    gap: 10,
    borderWidth: 1.5,
  },
  deliveryTimeIcon: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#FFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  deliveryTimeValue: {
    fontSize: 15,
    fontWeight: 'bold',
  },

  // Bottom bar
  bottomBar: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
  },
  bottomPill: {
    backgroundColor: '#1A2A1A',
    borderRadius: 30,
    padding: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 15,
    elevation: 12,
  },
  bottomPriceInfo: {
    paddingLeft: 20,
  },
  bottomTotalLabel: {
    color: '#888',
    fontSize: 12,
  },
  bottomTotalValue: {
    color: '#FFF',
    fontSize: 22,
    fontWeight: '900',
  },
  placeOrderBtn: {
    backgroundColor: '#D8F36C',
    paddingHorizontal: 30,
    paddingVertical: 16,
    borderRadius: 24,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  placeOrderText: {
    color: '#000',
    fontWeight: '900',
    fontSize: 16,
  },

  // Simulated Payments UI
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  modalCard: {
    width: '100%',
    borderRadius: 28,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 15,
    elevation: 10,
  },
  modalContent: {
    width: '100%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '900',
    marginTop: 18,
    marginBottom: 10,
    textAlign: 'center',
  },
  modalText: {
    fontSize: 13,
    color: '#666',
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 10,
  },
  modalInput: {
    width: '100%',
    height: 50,
    borderWidth: 1.5,
    borderRadius: 14,
    paddingHorizontal: 16,
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
    marginBottom: 18,
  },
  payBtn: {
    width: '100%',
    height: 52,
    backgroundColor: '#00C881',
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#00C881',
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  payBtnText: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: '900',
  },
  cancelLink: {
    marginTop: 15,
    padding: 5,
  },
  cancelText: {
    color: '#999',
    fontWeight: '700',
    fontSize: 13,
  },
  successIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#00C881',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#00C881',
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
});
