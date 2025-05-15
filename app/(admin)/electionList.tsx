import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet,Modal,TextInput,Alert, Platform } from 'react-native';
import { useElectionList } from '../../hooks/electionList.hook';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BottomTabsAdmin from '@/components/BottomTabsAdmin';
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
    const { Elections, loading, error, refetch } = useElectionList();
    const [currentPage, setCurrentPage] = useState(1);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedDescription, setSelectedDescription] = useState('');
    const itemsPerPage = 4;
  
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentElections = Elections.slice(startIndex, startIndex + itemsPerPage);
    const totalPages = Math.ceil(Elections.length / itemsPerPage);
    
    const [formVisible, setFormVisible] = useState(false);
    const [formData, setFormData] = useState({
      title: '',
      description: '',
      startDate: '',
      endDate: '',
      status: 'upcoming',
    });

    const handleDeleteElection = async (id: number) => {
  const confirm = window.confirm?.('Bạn có chắc chắn muốn xóa cuộc bầu cử này?');

  // Với Android không có window.confirm, bạn có thể dùng Alert API:
  if (Platform.OS !== 'web') {
    return Alert.alert(
      'Xác nhận xóa',
      'Bạn có chắc chắn muốn xóa cuộc bầu cử này?',
      [
        { text: 'Huỷ', style: 'cancel' },
        {
          text: 'Xoá',
          style: 'destructive',
          onPress: async () => {
            await executeDelete(id);
          },
        },
      ]
    );
  }

  // Web - nếu xác nhận thì xóa
  if (confirm) {
    await executeDelete(id);
  }
};

    const executeDelete = async (id: number) => {
  try {
    const token = await AsyncStorage.getItem('userToken');
    if (!token) {
      alert('Không tìm thấy token. Vui lòng đăng nhập lại.');
      return;
    }

    const res = await fetch(`http://103.167.89.178:3000/api/election/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      const error = await res.json();
      console.error('Delete error:', error);
      alert(error.message || 'Xóa thất bại');
      return;
    }

    alert('Xóa thành công!');
    await refetch();
  } catch (error) {
    console.error('Delete API error:', error);
    alert('Đã xảy ra lỗi khi xóa cuộc bầu cử.');
  }
};


    const router = useRouter();
    const handleNavigateToTenantList = async (electionId: string | number) => {
      await AsyncStorage.setItem('selectedElectionId', electionId.toString());
      router.push('/(admin)/TenantListScreen');
    };
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
            <TouchableOpacity onPress={() => setFormVisible(true)}>
              <Ionicons name="add-circle-outline" size={36} color="black" />
            </TouchableOpacity>
          </View>
        <ScrollView style={styles.container}>
  
          {currentElections.map((election) => (
            <TouchableOpacity
                    key={election.id}
                    style={[styles.card, { backgroundColor: getStatusColor(election.status) }]}
                    onPress={() => handleNavigateToTenantList(election.id)}
                  >
                    <Text style={styles.label}>Bầu cử quản lý đợt:</Text>
                    <Text style={styles.electionId}>{String(election.id).padStart(2, '0')}</Text>
                    <Text style={styles.date}>{election.startDate} - {election.endDate}</Text>
                    <TouchableOpacity>
                      <Text style={styles.label} onPress={() => openModal(election.description)}>Mô tả</Text>
                    </TouchableOpacity>
              <View style={styles.iconRow}>
                  <TouchableOpacity style={styles.iconButton}>
                    <MaterialIcons name="edit" size={22} color="#000" />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.iconButton} onPress={() => handleDeleteElection(election.id)}>
                    <MaterialIcons name="delete" size={22} color="#000" />
                  </TouchableOpacity>
              </View>
            </TouchableOpacity>
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
  
          {/* modal descripton */}
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

         <Modal visible={formVisible} transparent animationType="slide">
  <View style={styles.modalBackground}>
    <View style={styles.modalContainer}>
      <Text style={styles.modalTitle}>Tạo Cuộc Bầu Cử</Text>

      {['title', 'description', 'startDate', 'endDate'].map((field) => (
        <TextInput
          key={field}
          placeholder={field}
          style={styles.input}
          value={formData[field as keyof typeof formData]}
          onChangeText={(text) =>
            setFormData({ ...formData, [field]: text })
          }
        />
      ))}

      <View style={styles.input}>
        <Text style={{ marginBottom: 6, fontWeight: 'bold' }}>Trạng thái:</Text>
        {['upcoming', 'ongoing', 'completed'].map((status) => (
          <TouchableOpacity
            key={status}
            onPress={() => setFormData({ ...formData, status })}
            style={{
              padding: 6,
              backgroundColor: formData.status === status ? '#15AABF' : '#f1f1f1',
              borderRadius: 4,
              marginBottom: 4,
            }}
          >
            <Text style={{ color: formData.status === status ? '#fff' : '#000' }}>{status}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Submit & Cancel buttons */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 12 }}>
        <TouchableOpacity
          style={[styles.closeButton, { backgroundColor: '#0CA678' }]}
          onPress={async () => {
              try {
                const token = await AsyncStorage.getItem('userToken');
                if (!token) {
                  alert('Không tìm thấy token. Vui lòng đăng nhập lại.');
                  return;
                }

                const res = await fetch('http://103.167.89.178:3000/api/election', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                  },
                  body: JSON.stringify(formData),
                });

                if (!res.ok) {
                  const error = await res.json();
                  console.error('Server error:', error);
                  alert(error.message || 'Tạo thất bại');
                  return;
                }

                const data = await res.json();
                console.log('Election created:', data);
                setFormVisible(false);
                 await refetch();
              } catch (error) {
                console.error('POST error:', error);
                alert('Đã xảy ra lỗi khi tạo cuộc bầu cử.');
              }
            }}

        >
              <Text style={styles.closeButtonText}>Tạo</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.closeButton} onPress={() => setFormVisible(false)}>
              <Text style={styles.closeButtonText}>Huỷ</Text>
            </TouchableOpacity>
      </View>
    </View>
  </View>
</Modal>
   

        <BottomTabsAdmin/>
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
    marginBottom:2,
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
  input: {
  borderWidth: 1,
  borderColor: '#ccc',
  borderRadius: 6,
  padding: 10,
  marginBottom: 12,
},

});
