import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import * as Haptics from 'expo-haptics';

export default function OrdersScreen() {
  const params = useLocalSearchParams();
  const [orderStatus, setOrderStatus] = useState(params.status === 'Delivered' ? 'Delivered' : 'Active');

  let orderedItems: any[] = [];
  try {
    if (params.items) {
      orderedItems = JSON.parse(params.items as string);
    }
  } catch (e) {
    console.warn('Error parsing items', e);
  }

  const total = Number(params.total) || 0;
  const subtotal = Number(params.subtotal) || 0;
  const deliveryFee = Number(params.deliveryFee) || 0;
  const discount = Number(params.discount) || 0;

  const handleRefund = () => {
    Alert.alert(
      "Cancel & Refund",
      "Are you sure you want to cancel this order and request a refund? This action cannot be undone.",
      [
        {
          text: "No, Keep It",
          style: "cancel"
        },
        { 
          text: "Yes, Cancel", 
          style: "destructive",
          onPress: () => {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            setOrderStatus('Refund Processed');
            Alert.alert("Refund Initiated", `Your refund of ₹${total} has been initiated and will reflect in your original payment method in 2-3 days.`);
          }
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.replace('/(tabs)')} style={styles.backBtn}>
            <Ionicons name="close" size={24} color="#1A2A1A" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Order Details</Text>
          <View style={{ width: 44 }} />
        </View>

        {orderedItems.length === 0 ? (
          <View style={styles.content}>
            <Ionicons name="receipt-outline" size={80} color="#CCC" />
            <Text style={styles.emptyText}>No orders yet</Text>
            <Text style={styles.subText}>Your recent purchases will appear here.</Text>
            <TouchableOpacity 
              style={[styles.refundBtn, { marginTop: 20, backgroundColor: '#00C881' }]} 
              onPress={() => router.replace('/(tabs)')}
            >
              <Text style={[styles.refundBtnText, { color: '#FFF' }]}>Start Shopping</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 20 }}>
            {/* Status Card */}
            <View style={[
              styles.statusCard, 
              orderStatus === 'Delivered' ? { backgroundColor: 'rgba(0,200,129,0.1)', borderColor: '#00C881' } : 
              orderStatus === 'Refund Processed' ? { backgroundColor: 'rgba(255,59,48,0.1)', borderColor: '#FF3B30' } :
              { backgroundColor: 'rgba(255,165,0,0.1)', borderColor: '#FFA500' }
            ]}>
              <MaterialCommunityIcons 
                name={
                  orderStatus === 'Delivered' ? "check-circle" : 
                  orderStatus === 'Refund Processed' ? "cash-refund" : "truck-delivery"
                } 
                size={32} 
                color={
                  orderStatus === 'Delivered' ? "#00C881" : 
                  orderStatus === 'Refund Processed' ? "#FF3B30" : "#FFA500"
                } 
              />
              <View style={{ marginLeft: 12, flex: 1 }}>
                <Text style={[styles.statusText, { 
                  color: orderStatus === 'Delivered' ? "#00C881" : 
                         orderStatus === 'Refund Processed' ? "#FF3B30" : "#FFA500"
                }]}>
                  {orderStatus}
                </Text>
                <Text style={styles.statusSub}>
                  {orderStatus === 'Delivered' ? 'Your plants have safely arrived.' : 
                   orderStatus === 'Refund Processed' ? `₹${total} refund initiated successfully.` : 'Your order is on the way.'}
                </Text>
              </View>
            </View>

            <Text style={styles.sectionTitle}>Items Ordered</Text>
            <View style={styles.summaryCard}>
              {orderedItems.map((item, index) => (
                <View key={item.name + '-' + index} style={styles.itemRow}>
                  <View style={styles.itemLeft}>
                    <View style={styles.itemQtyBadge}>
                      <Text style={styles.itemQtyText}>{item.quantity}x</Text>
                    </View>
                    <Text style={styles.itemName}>{item.name}</Text>
                  </View>
                  <Text style={styles.itemPrice}>₹{item.price * item.quantity}</Text>
                </View>
              ))}

              <View style={styles.divider} />
              
              <View style={styles.feeRow}>
                <Text style={styles.feeLabel}>Subtotal</Text>
                <Text style={styles.feeValue}>₹{subtotal}</Text>
              </View>
              <View style={styles.feeRow}>
                <Text style={styles.feeLabel}>Delivery Fee</Text>
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
                <Text style={styles.totalLabel}>Total Paid</Text>
                <Text style={styles.totalValue}>₹{total}</Text>
              </View>
            </View>

            {/* Actions */}
            {orderStatus !== 'Refund Processed' && (
              <View style={styles.actionsContainer}>
                <Text style={styles.sectionTitle}>Need Help?</Text>
                <TouchableOpacity style={styles.supportBtn} onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}>
                  <Ionicons name="chatbubble-ellipses-outline" size={20} color="#1A2A1A" />
                  <Text style={styles.supportBtnText}>Chat with Support</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.refundBtn} onPress={handleRefund}>
                  <Ionicons name="alert-circle-outline" size={20} color="#FF3B30" />
                  <Text style={styles.refundBtnText}>Cancel & Request Refund</Text>
                </TouchableOpacity>
              </View>
            )}

            <View style={{ height: 40 }} />
          </ScrollView>
        )}
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9F9F9',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 15,
    backgroundColor: '#FFF',
  },
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#1A2A1A',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 20,
    fontWeight: '900',
    marginTop: 20,
    color: '#1A2A1A',
  },
  subText: {
    fontSize: 14,
    color: '#888',
    marginTop: 10,
    textAlign: 'center',
    paddingHorizontal: 40,
  },
  
  statusCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 20,
    borderWidth: 1.5,
    marginBottom: 24,
  },
  statusText: {
    fontSize: 18,
    fontWeight: '900',
    marginBottom: 2,
  },
  statusSub: {
    fontSize: 13,
    color: '#666',
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#1A2A1A',
    marginBottom: 14,
  },
  summaryCard: {
    backgroundColor: '#FFF',
    borderRadius: 24,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
    marginBottom: 24,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  itemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  itemQtyBadge: {
    backgroundColor: '#D8F36C',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  itemQtyText: {
    fontWeight: '900',
    fontSize: 12,
    color: '#1A2A1A',
  },
  itemName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
    flex: 1,
  },
  itemPrice: {
    fontSize: 15,
    fontWeight: '800',
    color: '#1A2A1A',
  },
  divider: {
    height: 1,
    backgroundColor: '#F0F0F0',
    marginVertical: 10,
  },
  feeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  feeLabel: {
    fontSize: 14,
    color: '#666',
  },
  feeValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#333',
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '900',
    color: '#1A2A1A',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: '900',
    color: '#1A2A1A',
  },

  actionsContainer: {
    marginTop: 10,
  },
  supportBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#FFF',
    borderWidth: 1.5,
    borderColor: '#E0E0E0',
    paddingVertical: 14,
    borderRadius: 16,
    marginBottom: 12,
  },
  supportBtnText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#1A2A1A',
  },
  refundBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: 'rgba(255,59,48,0.1)',
    borderWidth: 1.5,
    borderColor: 'rgba(255,59,48,0.3)',
    paddingVertical: 14,
    borderRadius: 16,
  },
  refundBtnText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FF3B30',
  },
});
