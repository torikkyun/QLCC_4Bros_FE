import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet,Modal } from 'react-native';
import { useElectionList } from '../hooks/electionList.hook';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedDescription, setSelectedDescription] = useState('');
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
  
    const openModal = (description: string) => {
      setSelectedDescription(description);
      setModalVisible(true);
    };
  
    if (loading) return <Text style={styles.loading}>Đang tải dữ liệu...</Text>;
    if (error) return <Text style={styles.error}>Lỗi: {error}</Text>;
  
    return (
      <View style={styles.wrapper}>
          <View style={[styles.header,{padding:10}]}>
            <Text style={styles.title}>Tạo Cuộc Bầu Cử</Text>
            <TouchableOpacity>
              <Ionicons name="add-circle-outline" size={28} color="black" />
            </TouchableOpacity>
          </View>
        <ScrollView style={styles.container}>
  
          {currentElections.map((election) => (
            <View
              key={election.id}
              style={[styles.card, { backgroundColor: getStatusColor(election.status) }]}
            >
              <Text style={styles.label}>Bầu cử quản lý dợt:</Text>
              <Text style={styles.electionId}>{String(election.id).padStart(2, '0')}</Text>
              <Text style={styles.date}>{election.startDate} - {election.endDate}</Text>
  
              <TouchableOpacity onPress={() => saveElectionId(election.id)}>
                <Text style={styles.moreInfo}>Mô Tả</Text>
              </TouchableOpacity>
  
              <View style={styles.iconRow}>
                <TouchableOpacity style={styles.iconButton}>
                  <MaterialIcons name="edit" size={22} color="#000" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.iconButton}>
                  <MaterialIcons name="delete" size={22} color="#000" />
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </ScrollView>
  
        <View style={styles.pagination}>
          <TouchableOpacity onPress={handlePrev} disabled={currentPage === 1} style={styles.pageBtn}>
            <Text style={styles.pageBtnText}>← Trang trước</Text>
          </TouchableOpacity>
          <Text style={styles.pageNumber}>Trang {currentPage} / {totalPages}</Text>
          <TouchableOpacity
            onPress={handleNext}
            disabled={currentPage === totalPages}
            style={styles.pageBtn}
          >
            <Text style={styles.pageBtnText}>Trang sau →</Text>
          </TouchableOpacity>
        </View>
  
        <Modal
          transparent
          visible={modalVisible}
          animationType="fade"
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalBackground}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalTitle}>Mô Tả</Text>
              <ScrollView>
                <Text style={styles.modalText}>{selectedDescription}</Text>
              </ScrollView>
              <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeButton}>
                <Text style={styles.closeButtonText}>Đóng</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    );
  };
  

export default ElectionList;

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'space-between',
  },
  container: {
    flex: 1,
    padding: 16,
  },
  loading: {
    marginTop: 32,
    textAlign: 'center',
  },
  error: {
    color: 'red',
    marginTop: 32,
    textAlign: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  card: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    position: 'relative',
  },
  label: {
    color: '#fff',
    fontWeight: 'bold',
  },
  electionId: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
  },
  date: {
    color: '#fff',
  },
  moreInfo: {
    color: '#fff',
    textDecorationLine: 'underline',
    marginTop: 4,
  },
  iconRow: {
    position: 'absolute',
    right: 10,
    bottom: 10,
    flexDirection: 'row',
  },
  iconButton: {
    marginLeft: 10,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f8f8f8',
    borderTopWidth: 1,
    borderColor: '#eee',
    marginBottom:120,
  },
  pageBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#e0e0e0',
    borderRadius: 6,
  },
  pageBtnText: {
    fontSize: 14,
  },
  pageNumber: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '80%',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    maxHeight: '70%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  modalText: {
    fontSize: 16,
    marginBottom: 20,
  },
  closeButton: {
    backgroundColor: '#15AABF',
    paddingVertical: 10,
    borderRadius: 6,
    alignItems: 'center',
  },
  closeButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
