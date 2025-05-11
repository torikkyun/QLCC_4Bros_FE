import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { useElectionList } from '../../hooks/electionList.hook';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

const getStatusColor = (status: string) => {
  switch (status) {
    case 'upcoming': return '#15AABF'; // Xanh lam
    case 'ongoing': return '#D97706';  // Cam
    case 'completed': return '#0CA678'; // Xanh lá
    default: return '#ccc';
  }
};

const saveElectionId = async (id: string | number) => {
  try {
    await AsyncStorage.setItem('selectedElectionId', id.toString());
    console.log('Election ID saved:', id);
  } catch (e) {
    console.error('Failed to save election ID:', e);
  }
};

const ElectionList = () => {
  const { Elections, loading, error } = useElectionList();
  const [currentPage, setCurrentPage] = useState(1);
  const router = useRouter();
  const itemsPerPage = 4;

  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentElections = Elections.slice(startIndex, startIndex + itemsPerPage);
  const totalPages = Math.ceil(Elections.length / itemsPerPage);

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  const handleViewDetails = async (electionId: string | number) => {
    await saveElectionId(electionId);
    router.push('/(admin)/TenantListScreen');
  };

  if (loading) return <Text style={styles.loading}>Đang tải dữ liệu...</Text>;
  if (error) return <Text style={styles.error}>Lỗi: {error}</Text>;

  return (
    <View style={styles.wrapper}>
      <View style={styles.header}>
        <Text style={styles.title}>Tạo Cuộc Bầu Cử</Text>
        <TouchableOpacity>
          <Ionicons name="add-circle" size={32} color="#1a3c5e" />
        </TouchableOpacity>
      </View>
      <ScrollView style={styles.container}>
        {currentElections.map((election) => (
          <View
            key={election.id}
            style={[styles.card, { backgroundColor: getStatusColor(election.status) }]}
          >
            <Text style={styles.label}>Bầu cử quản lý đợt:</Text>
            <Text style={styles.electionId}>{String(election.id).padStart(2, '0')}</Text>
            <Text style={styles.date}>
              {election.startDate} - {election.endDate}
            </Text>
            <TouchableOpacity onPress={() => handleViewDetails(election.id)}>
              <Text style={styles.moreInfo}>Xem chi tiết</Text>
            </TouchableOpacity>
            <View style={styles.iconRow}>
              <TouchableOpacity style={styles.iconButton}>
                <MaterialIcons name="edit" size={24} color="#fff" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.iconButton}>
                <MaterialIcons name="delete" size={24} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>
      <View style={styles.pagination}>
        <TouchableOpacity
          onPress={handlePrev}
          disabled={currentPage === 1}
          style={[styles.pageBtn, currentPage === 1 && styles.disabledBtn]}
        >
          <Text style={styles.pageBtnText}>← Trang trước</Text>
        </TouchableOpacity>
        <Text style={styles.pageNumber}>
          Trang {currentPage} / {totalPages}
        </Text>
        <TouchableOpacity
          onPress={handleNext}
          disabled={currentPage === totalPages}
          style={[styles.pageBtn, currentPage === totalPages && styles.disabledBtn]}
        >
          <Text style={styles.pageBtnText}>Trang sau →</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ElectionList;

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#f8fafc',
    justifyContent: 'space-between',
  },
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a3c5e',
  },
  card: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  label: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  electionId: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#fff',
    marginVertical: 8,
  },
  date: {
    color: '#fff',
    fontSize: 14,
    marginBottom: 12,
  },
  moreInfo: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
    textDecorationLine: 'underline',
  },
  iconRow: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    flexDirection: 'row',
  },
  iconButton: {
    marginLeft: 16,
    padding: 8,
    backgroundColor: 'rgba(0,0,0,0.1)',
    borderRadius: 8,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  pageBtn: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#1a3c5e',
    borderRadius: 8,
  },
  disabledBtn: {
    backgroundColor: '#d1d5db',
  },
  pageBtnText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '500',
  },
  pageNumber: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a3c5e',
  },
  loading: {
    marginTop: 32,
    textAlign: 'center',
    fontSize: 18,
    color: '#1a3c5e',
  },
  error: {
    color: '#dc2626',
    marginTop: 32,
    textAlign: 'center',
    fontSize: 18,
  },
});

