import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import * as XLSX from 'xlsx'; // Tambahkan library Excel
import { 
  addSchedule, 
  updateSchedule, 
  deleteSchedule, 
  getSchedulesByUser,
  auth, 
  logout,
  getCurrentUser
} from '../firebase/config';
import { FaEdit, FaTrash } from 'react-icons/fa';

const PostJadwal = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [schedules, setSchedules] = useState([]);
  const [userEmail, setUserEmail] = useState('');
  const [formData, setFormData] = useState({
    lab: '',
    matkul: '',
    kelas: '',
    dosen: '',
    waktu: '',
    hari: '',
    status: 'Akan Datang'
  });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  
  // State untuk import Excel
  const [excelFile, setExcelFile] = useState(null);
  const [excelData, setExcelData] = useState([]);
  const [importLoading, setImportLoading] = useState(false);
  const [importProgress, setImportProgress] = useState({ current: 0, total: 0 });
  const [showImportModal, setShowImportModal] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setIsLoggedIn(!!user);
      if (user) {
        setUserEmail(user.email);
      } else {
        navigate('/');
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  useEffect(() => {
    if (isLoggedIn) {
      const unsubscribe = getSchedulesByUser((data) => {
        setSchedules(data);
      });
      return () => unsubscribe();
    }
  }, [isLoggedIn]);

  // ==================== FUNGSI IMPORT EXCEL ====================
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setExcelFile(file);
    
    const reader = new FileReader();
    reader.onload = (event) => {
      const data = new Uint8Array(event.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      
      // Ambil sheet pertama
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      
      // Convert ke JSON
      const jsonData = XLSX.utils.sheet_to_json(worksheet);
      
      // Mapping kolom Excel ke format aplikasi
      const mappedData = jsonData.map((row, index) => {
        // Cari kolom dengan nama yang sesuai (case insensitive)
        const findColumn = (possibleNames) => {
          for (const name of possibleNames) {
            if (row[name] !== undefined) return row[name];
          }
          return '';
        };

        return {
          lab: findColumn(['Lab', 'LAB', 'lab', 'Laboratorium']),
          matkul: findColumn(['Mata Kuliah', 'Matkul', 'MataKuliah', 'matkul', 'Mata_Kuliah']),
          kelas: findColumn(['Kelas', 'kelas', 'KELAS', 'Class']),
          dosen: findColumn(['Dosen', 'dosen', 'DOSEN', 'Pengajar', 'Instruktur']),
          hari: findColumn(['Hari', 'hari', 'HARI', 'Day']),
          waktu: findColumn(['Waktu', 'waktu', 'WAKTU', 'Time', 'Jam']),
          status: findColumn(['Status', 'status', 'STATUS', 'Kondisi']) || 'Akan Datang'
        };
      }).filter(item => item.lab && item.matkul); // Hanya data yang valid

      setExcelData(mappedData);
      setMessage({ 
        type: 'success', 
        text: `Berhasil membaca ${mappedData.length} data dari Excel. Preview data tersedia.` 
      });
    };
    
    reader.readAsArrayBuffer(file);
  };

  const handleImportToFirebase = async () => {
    if (excelData.length === 0) {
      setMessage({ type: 'error', text: 'Tidak ada data untuk diimport!' });
      return;
    }

    setImportLoading(true);
    setImportProgress({ current: 0, total: excelData.length });
    setShowImportModal(true);

    let successCount = 0;
    let errorCount = 0;
    const errors = [];

    for (let i = 0; i < excelData.length; i++) {
      const data = excelData[i];
      
      // Validasi data
      if (!data.lab || !data.matkul || !data.kelas || !data.dosen || !data.hari || !data.waktu) {
        errors.push(`Baris ${i + 2}: Data tidak lengkap`);
        errorCount++;
        continue;
      }

      try {
        const result = await addSchedule({
          lab: data.lab,
          matkul: data.matkul,
          kelas: data.kelas,
          dosen: data.dosen,
          hari: data.hari,
          waktu: data.waktu,
          status: data.status || 'Akan Datang'
        });

        if (result.success) {
          successCount++;
        } else {
          errors.push(`Baris ${i + 2}: ${result.error}`);
          errorCount++;
        }
      } catch (error) {
        errors.push(`Baris ${i + 2}: ${error.message}`);
        errorCount++;
      }

      // Update progress
      setImportProgress({ current: i + 1, total: excelData.length });
      
      // Delay kecil untuk menghindari rate limiting
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    setImportLoading(false);
    
    if (errors.length > 0) {
      setMessage({ 
        type: 'error', 
        text: `Import selesai. Berhasil: ${successCount}, Gagal: ${errorCount}. ${errors.slice(0, 3).join('; ')}${errors.length > 3 ? '...' : ''}` 
      });
    } else {
      setMessage({ 
        type: 'success', 
        text: `Berhasil mengimport ${successCount} data ke Firebase!` 
      });
    }

    // Reset data
    setTimeout(() => {
      setExcelFile(null);
      setExcelData([]);
      setShowImportModal(false);
      setImportProgress({ current: 0, total: 0 });
    }, 3000);
  };

  const downloadTemplateExcel = () => {
    // Data template
    const templateData = [
      {
        'Lab': 'Lab Komputer 1',
        'Mata Kuliah': 'Pemrograman Web',
        'Kelas': 'TE-4A',
        'Dosen': 'Dr. Ahmad Rizal, M.T.',
        'Hari': 'Senin',
        'Waktu': '08:00 - 10:30',
        'Status': 'Akan Datang'
      },
      {
        'Lab': 'Lab Komputer 2',
        'Mata Kuliah': 'Jaringan Komputer',
        'Kelas': 'TE-3B',
        'Dosen': 'Prof. Siti Aminah, M.Sc.',
        'Hari': 'Senin',
        'Waktu': '10:45 - 13:15',
        'Status': 'Sedang Berlangsung'
      }
    ];

    // Buat worksheet
    const ws = XLSX.utils.json_to_sheet(templateData);
    
    // Buat workbook
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Template Jadwal");
    
    // Tambahkan note di cell A10
    const noteData = [
      ['CATATAN PENTAH:'],
      ['1. Kolom wajib diisi: Lab, Mata Kuliah, Kelas, Dosen, Hari, Waktu'],
      ['2. Status (opsional): "Sedang Berlangsung", "Akan Datang", atau "Kosong"'],
      ['3. Format waktu: "HH:mm - HH:mm" (contoh: 08:00 - 10:30)'],
      ['4. Hari: Senin, Selasa, Rabu, Kamis, Jumat, Sabtu'],
      ['5. Lab: Lab Komputer 1, Lab Komputer 2, Lab Komputer 3']
    ];
    
    XLSX.utils.sheet_add_aoa(ws, noteData, { origin: 'A10' });
    
    // Atur lebar kolom
    const wscols = [
      { wch: 15 }, // Lab
      { wch: 25 }, // Mata Kuliah
      { wch: 10 }, // Kelas
      { wch: 25 }, // Dosen
      { wch: 10 }, // Hari
      { wch: 15 }, // Waktu
      { wch: 20 }  // Status
    ];
    ws['!cols'] = wscols;
    
    // Download file
    XLSX.writeFile(wb, 'template_jadwal_lab.xlsx');
  };

  const exportToExcel = () => {
    if (schedules.length === 0) {
      setMessage({ type: 'error', text: 'Tidak ada data untuk diexport!' });
      return;
    }

    // Format data untuk export
    const exportData = schedules.map(item => ({
      'Lab': item.lab,
      'Mata Kuliah': item.matkul,
      'Kelas': item.kelas,
      'Dosen': item.dosen,
      'Hari': item.hari,
      'Waktu': item.waktu,
      'Status': item.status,
      'ID': item.id,
      'Dibuat Oleh': item.userEmail || userEmail
    }));

    // Buat worksheet
    const ws = XLSX.utils.json_to_sheet(exportData);
    
    // Buat workbook
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Jadwal Lab");
    
    // Download file
    XLSX.writeFile(wb, `jadwal_lab_${new Date().toISOString().split('T')[0]}.xlsx`);
    
    setMessage({ 
      type: 'success', 
      text: `Berhasil mengexport ${schedules.length} data ke Excel!` 
    });
  };

  // ==================== FUNGSI LAINNYA (tetap sama) ====================
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      let result;
      if (editingId) {
        result = await updateSchedule(editingId, formData);
        if (result.success) {
          setMessage({ type: 'success', text: 'Jadwal berhasil diperbarui!' });
        }
      } else {
        result = await addSchedule(formData);
        if (result.success) {
          setMessage({ type: 'success', text: 'Jadwal berhasil ditambahkan!' });
        }
      }

      if (result.success) {
        setFormData({
          lab: '',
          matkul: '',
          kelas: '',
          dosen: '',
          waktu: '',
          hari: '',
          status: 'Akan Datang'
        });
        setEditingId(null);
        
        setTimeout(() => {
          setMessage({ type: '', text: '' });
        }, 3000);
      } else {
        setMessage({ type: 'error', text: result.error });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Terjadi kesalahan!' });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (schedule) => {
    setFormData({
      lab: schedule.lab,
      matkul: schedule.matkul,
      kelas: schedule.kelas,
      dosen: schedule.dosen,
      waktu: schedule.waktu,
      hari: schedule.hari,
      status: schedule.status
    });
    setEditingId(schedule.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus jadwal ini?')) {
      setLoading(true);
      const result = await deleteSchedule(id);
      if (result.success) {
        setMessage({ type: 'success', text: 'Jadwal berhasil dihapus!' });
      } else {
        setMessage({ type: 'error', text: result.error });
      }
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  // ==================== RENDER ====================
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Memeriksa autentikasi...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-800">Admin Panel</h1>
              <p className="text-lg text-gray-600 mt-2">Kelola Jadwal Lab Komputer</p>
              <div className="mt-2 flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-500">Login sebagai: {userEmail}</span>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/')}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition"
              >
                Kembali ke Jadwal
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition"
              >
                Logout
              </button>
            </div>
          </div>
        </header>

        {/* Notifikasi */}
        {message.text && (
          <div className={`mb-6 p-4 rounded-xl ${message.type === 'success' ? 'bg-green-100 text-green-800 border border-green-200' : 'bg-red-100 text-red-800 border border-red-200'}`}>
            <div className="flex justify-between items-center">
              <span>{message.text}</span>
              <button onClick={() => setMessage({ type: '', text: '' })} className="text-lg">
                ×
              </button>
            </div>
          </div>
        )}

        {/* Tombol Import/Export */}
        <div className="mb-6 bg-white rounded-2xl shadow-lg p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-4">
                {/* Import Excel */}
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Import dari Excel
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="file"
                      accept=".xlsx, .xls, .csv"
                      onChange={handleFileUpload}
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                    <button
                      onClick={downloadTemplateExcel}
                      className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition whitespace-nowrap"
                    >
                      📥 Template
                    </button>
                  </div>
                  {excelFile && (
                    <div className="mt-2 text-sm text-gray-600">
                      File: {excelFile.name} ({excelData.length} data ditemukan)
                      <button
                        onClick={() => setShowImportModal(true)}
                        className="ml-2 px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition text-sm"
                      >
                        Preview & Import
                      </button>
                    </div>
                  )}
                </div>

                {/* Export Excel */}
                <div className="flex flex-col">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Export Data
                  </label>
                  <button
                    onClick={exportToExcel}
                    disabled={schedules.length === 0}
                    className={`px-4 py-2 rounded-xl transition ${schedules.length === 0 ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-green-500 text-white hover:bg-green-600'}`}
                  >
                    📤 Export Excel ({schedules.length})
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form Panel (tetap sama) */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-8">
              <h2 className="text-xl font-bold text-gray-800 mb-6">
                {editingId ? 'Edit Jadwal' : 'Tambah Jadwal Baru'}
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Lab</label>
                  <select
                    name="lab"
                    value={formData.lab}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                    required
                  >
                    <option value="">Pilih Lab</option>
                    <option value="Lab Komputer 1">Lab Komputer 1</option>
                    <option value="Lab Komputer 2">Lab Komputer 2</option>
                    <option value="Lab Komputer 3">Lab Komputer 3</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Mata Kuliah</label>
                  <input
                    type="text"
                    name="matkul"
                    value={formData.matkul}
                    onChange={handleChange}
                    placeholder="Nama mata kuliah"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Kelas</label>
                  <input
                    type="text"
                    name="kelas"
                    value={formData.kelas}
                    onChange={handleChange}
                    placeholder="Contoh: TE-4A"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Dosen</label>
                  <input
                    type="text"
                    name="dosen"
                    value={formData.dosen}
                    onChange={handleChange}
                    placeholder="Nama dosen pengampu"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Hari</label>
                  <select
                    name="hari"
                    value={formData.hari}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                    required
                  >
                    <option value="">Pilih Hari</option>
                    <option value="Senin">Senin</option>
                    <option value="Selasa">Selasa</option>
                    <option value="Rabu">Rabu</option>
                    <option value="Kamis">Kamis</option>
                    <option value="Jumat">Jumat</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Waktu</label>
                  <input
                    type="text"
                    name="waktu"
                    value={formData.waktu}
                    onChange={handleChange}
                    placeholder="Contoh: 08:00 - 10:30"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  >
                    <option value="berlangsung">Sedang Berlangsung</option>
                    <option value="akan datang">Akan Datang</option>
                    <option value="kosong">Kosong</option>
                  </select>
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className={`w-full py-3 rounded-xl font-medium transition ${loading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700 text-white'}`}
                  >
                    {loading ? 'Memproses...' : editingId ? 'Update Jadwal' : 'Tambah Jadwal'}
                  </button>
                  
                  {editingId && (
                    <button
                      type="button"
                      onClick={() => {
                        setFormData({
                          lab: '',
                          matkul: '',
                          kelas: '',
                          dosen: '',
                          waktu: '',
                          hari: '',
                          status: 'akan datang'
                        });
                        setEditingId(null);
                      }}
                      className="w-full mt-3 py-3 bg-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-300 transition"
                    >
                      Batal Edit
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>

          {/* Tabel Jadwal (tetap sama) */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-xl font-bold text-gray-800">Daftar Jadwal Anda ({schedules.length})</h2>
                    <p className="text-gray-600">Hanya menampilkan jadwal yang Anda buat</p>
                  </div>
                  <div className="text-sm text-gray-500">
                    {userEmail}
                  </div>
                </div>
              </div>

              {schedules.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-gray-400 mb-4">
                    <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-700 mb-2">Belum ada jadwal</h3>
                  <p className="text-gray-500">Tambahkan jadwal pertama Anda menggunakan form di samping</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hari & Waktu</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lab</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mata Kuliah</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kelas</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {schedules.map((item) => (
                        <tr key={item.id} className="hover:bg-gray-50 transition">
                          <td className="px-6 py-4">
                            <div className="text-sm font-medium text-gray-900">{item.hari}</div>
                            <div className="text-sm text-gray-500">{item.waktu}</div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm font-medium text-gray-900">{item.lab}</div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm font-medium text-gray-900">{item.matkul}</div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-gray-900">{item.kelas}</div>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              item.status === 'berlangsung' 
                                ? 'bg-green-100 text-green-800' 
                                : item.status === 'akan datang' 
                                ? 'bg-blue-100 text-blue-800' 
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {item.status}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleEdit(item)}
                                className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition text-sm"
                              >
                                <FaEdit />
                              </button>
                              <button
                                onClick={() => handleDelete(item.id)}
                                className="px-3 py-1 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition text-sm"
                              >
                                <FaTrash />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white rounded-xl p-4 shadow">
                <div className="text-2xl font-bold text-blue-600">{schedules.length}</div>
                <div className="text-sm text-gray-600">Total Jadwal Anda</div>
              </div>
              <div className="bg-white rounded-xl p-4 shadow">
                <div className="text-2xl font-bold text-green-600">
                  {schedules.filter(s => s.status === 'berlangsung').length}
                </div>
                <div className="text-sm text-gray-600">Sedang Berlangsung</div>
              </div>
              <div className="bg-white rounded-xl p-4 shadow">
                <div className="text-2xl font-bold text-yellow-600">
                  {schedules.filter(s => s.status === 'akan datang').length}
                </div>
                <div className="text-sm text-gray-600">Akan Datang</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Preview & Import */}
      {showImportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-800">
                  Preview & Konfirmasi Import
                </h3>
                <button
                  onClick={() => setShowImportModal(false)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>

              {/* Progress Bar saat importing */}
              {importLoading && (
                <div className="mb-6">
                  <div className="flex justify-between text-sm text-gray-600 mb-2">
                    <span>Mengimport data ke Firebase...</span>
                    <span>{importProgress.current} / {importProgress.total}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(importProgress.current / importProgress.total) * 100}%` }}
                    ></div>
                  </div>
                </div>
              )}

              {/* Preview Data */}
              {excelData.length > 0 && !importLoading && (
                <>
                  <div className="mb-4">
                    <p className="text-gray-700">
                      <span className="font-semibold">{excelData.length} data</span> siap diimport ke Firebase. 
                      Pastikan format kolom sudah benar.
                    </p>
                  </div>

                  <div className="overflow-y-auto max-h-[300px] mb-6 border rounded-lg">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50 sticky top-0">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Lab</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Mata Kuliah</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Kelas</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Dosen</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Hari</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Waktu</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {excelData.slice(0, 10).map((row, index) => (
                          <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                            <td className="px-4 py-2 text-sm">{row.lab}</td>
                            <td className="px-4 py-2 text-sm">{row.matkul}</td>
                            <td className="px-4 py-2 text-sm">{row.kelas}</td>
                            <td className="px-4 py-2 text-sm">{row.dosen}</td>
                            <td className="px-4 py-2 text-sm">{row.hari}</td>
                            <td className="px-4 py-2 text-sm">{row.waktu}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {excelData.length > 10 && (
                      <div className="text-center py-2 bg-gray-100 text-gray-500 text-sm">
                        ... dan {excelData.length - 10} data lainnya
                      </div>
                    )}
                  </div>

                  <div className="flex justify-end gap-3 pt-4 border-t">
                    <button
                      onClick={() => setShowImportModal(false)}
                      className="px-4 py-2 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition"
                    >
                      Batal
                    </button>
                    <button
                      onClick={handleImportToFirebase}
                      disabled={importLoading}
                      className={`px-4 py-2 rounded-xl transition ${importLoading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 text-white'}`}
                    >
                      {importLoading ? 'Mengimport...' : 'Ya, Import Sekarang'}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostJadwal;
