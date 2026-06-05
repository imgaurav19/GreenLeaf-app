import React, { useState } from 'react';
import {
  StyleSheet, View, Text, TouchableOpacity,
  ScrollView, Dimensions, TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useCart } from '@/context/CartContext';
import { useUser } from '@/context/UserContext';

const { width } = Dimensions.get('window');

const PAYMENT_METHODS = [
  { id: 'cod', label: 'Cash on Delivery', icon: 'cash-outline' as const, sub: 'Pay when delivered' },
  { id: 'upi', label: 'UPI / Google Pay', icon: 'phone-portrait-outline' as const, sub: 'PhonePe, GPay, Paytm' },
  { id: 'card', label: 'Credit / Debit Card', icon: 'card-outline' as const, sub: 'Visa, Mastercard, RuPay' },
];

export default function CheckoutScreen() {
  const { itemCount, clearCart } = useCart();
  const { locationCity, area } = useUser();
  const [selectedPayment, setSelectedPayment] = useState('cod');
  const [promoCode, setPromoCode] = useState('');

  const subtotal = itemCount * 299;
  const deliveryFee = 40;
  const discount = 0;
  const total = subtotal + deliveryFee - discount;

  const handlePlaceOrder = () => {
    clearCart();
    router.replace('/tracking');
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#F0F4EF', '#FAFDF7']} style={StyleSheet.absoluteFill} />

      <SafeAreaView style={{ flex: 1 }}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.headerBtn}>
            <Ionicons name="chevron-back" size={24} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Checkout</Text>
          <View style={{ width: 44 }} />
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 140 }}>

          {/* Delivery Address */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Delivery Address</Text>
              <TouchableOpacity>
                <Text style={styles.changeBtn}>Change</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.addressCard}>
              <View style={styles.addressIcon}>
                <Ionicons name="location" size={22} color="#00C881" />
              </View>
              <View style={styles.addressContent}>
                <Text style={styles.addressName}>Current Location</Text>
                <Text style={styles.addressText}>{area}</Text>
                <Text style={styles.addressText}>{locationCity}</Text>
              </View>
            </View>
          </View>

          {/* Order Summary */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Order Summary</Text>
            <View style={styles.summaryCard}>
              {/* Item rows */}
              <View style={styles.itemRow}>
                <View style={styles.itemInfo}>
                  <View style={styles.itemQtyBadge}>
                    <Text style={styles.itemQtyText}>{itemCount}x</Text>
                  </View>
                  <Text style={styles.itemName}>Money Plant (Epipremnum)</Text>
                </View>
                <Text style={styles.itemPrice}>₹{subtotal}</Text>
              </View>

              <View style={styles.divider} />

              <View style={styles.feeRow}>
                <Text style={styles.feeLabel}>Subtotal</Text>
                <Text style={styles.feeValue}>₹{subtotal}</Text>
              </View>
              <View style={styles.feeRow}>
                <View style={styles.feeWithIcon}>
                  <MaterialCommunityIcons name="truck-delivery-outline" size={16} color="#666" />
                  <Text style={styles.feeLabel}>Delivery Fee</Text>
                </View>
                <Text style={styles.feeValue}>₹{deliveryFee}</Text>
              </View>
              {discount > 0 && (
                <View style={styles.feeRow}>
                  <Text style={[styles.feeLabel, { color: '#00C881' }]}>Discount</Text>
                  <Text style={[styles.feeValue, { color: '#00C881' }]}>-₹{discount}</Text>
                </View>
              )}

              <View style={[styles.divider, { marginVertical: 12 }]} />

              <View style={styles.feeRow}>
                <Text style={styles.totalLabel}>Total</Text>
                <Text style={styles.totalValue}>₹{total}</Text>
              </View>
            </View>
          </View>

          {/* Promo Code */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Promo Code</Text>
            <View style={styles.promoRow}>
              <View style={styles.promoInputWrap}>
                <Ionicons name="pricetag-outline" size={18} color="#999" />
                <TextInput
                  placeholder="Enter promo code"
                  placeholderTextColor="#999"
                  style={styles.promoInput}
                  value={promoCode}
                  onChangeText={setPromoCode}
                />
              </View>
              <TouchableOpacity style={styles.promoApplyBtn}>
                <Text style={styles.promoApplyText}>Apply</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Payment Method */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Payment Method</Text>
            {PAYMENT_METHODS.map(method => (
              <TouchableOpacity
                key={method.id}
                style={[
                  styles.paymentOption,
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
                    color={selectedPayment === method.id ? '#FFF' : '#666'}
                  />
                </View>
                <View style={styles.paymentInfo}>
                  <Text style={[
                    styles.paymentLabel,
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
            <View style={styles.deliveryTimeCard}>
              <View style={styles.deliveryTimeIcon}>
                <MaterialCommunityIcons name="clock-fast" size={24} color="#00C881" />
              </View>
              <View>
                <Text style={styles.deliveryTimeTitle}>Estimated Delivery</Text>
                <Text style={styles.deliveryTimeValue}>15 – 30 minutes</Text>
              </View>
            </View>
          </View>

        </ScrollView>

        {/* Bottom Place Order Bar */}
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

      </SafeAreaView>
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
    backgroundColor: '#FFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    elevation: 2,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#000',
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
    color: '#1A2A1A',
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
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 18,
    alignItems: 'center',
    gap: 14,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: 'rgba(0,200,129,0.15)',
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
    color: '#000',
    marginBottom: 4,
  },
  addressText: {
    fontSize: 13,
    color: '#666',
    lineHeight: 18,
  },

  // Order Summary
  summaryCard: {
    backgroundColor: '#FFF',
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
    color: '#333',
    flex: 1,
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: '800',
    color: '#000',
  },
  divider: {
    height: 1,
    backgroundColor: '#F0F0F0',
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
    color: '#666',
  },
  feeValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '900',
    color: '#000',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: '900',
    color: '#000',
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
    backgroundColor: '#FFF',
    borderRadius: 16,
    paddingHorizontal: 16,
    gap: 10,
    borderWidth: 1,
    borderColor: '#EEE',
  },
  promoInput: {
    flex: 1,
    paddingVertical: 14,
    fontSize: 15,
    color: '#000',
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
    backgroundColor: '#FFF',
    borderRadius: 18,
    padding: 16,
    marginBottom: 10,
    gap: 14,
    borderWidth: 1.5,
    borderColor: '#F0F0F0',
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
    color: '#333',
  },
  paymentLabelActive: {
    color: '#000',
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
    backgroundColor: 'rgba(0,200,129,0.08)',
    borderRadius: 18,
    padding: 18,
    gap: 14,
    borderWidth: 1,
    borderColor: 'rgba(0,200,129,0.15)',
  },
  deliveryTimeIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  deliveryTimeTitle: {
    fontSize: 13,
    color: '#666',
  },
  deliveryTimeValue: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#1A2A1A',
    marginTop: 2,
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
});
