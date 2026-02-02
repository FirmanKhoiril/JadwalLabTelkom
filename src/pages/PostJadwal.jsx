import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { addSchedule, updateSchedule, deleteSchedule, getSchedules, auth } from '../firebase/config';

const PostJadwal = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [schedules, setSchedules] = useState([]);
  const [formData, setFormData] = useState({
    lab: '',
    matkul: '',
    kelas: '',
    dosen: '',
    waktu: '',
    hari: '',
    status: 'akan datang'
  });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Check login status
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setIsLoggedIn(!!user);
      if (!user) {
        navigate('/');
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  // Load schedules from Firebase
  useEffect(() => {
    if (isLoggedIn) {
      const unsubscribe = getSchedules((data) => {
        setSchedules(data);
      });
      return () => unsubscribe();
    }
  }, [isLoggedIn]);

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
        // Reset form
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

  // if (!isLoggedIn) {
  //   return (
  //     <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 flex items-center justify-center p-4">
  //       <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
  //         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
  //         <p className="text-gray-600">Memeriksa autentikasi...</p>
  //       </div>
  //     </div>
  //   );
  // }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-800">Admin Panel</h1>
              <p className="text-lg text-gray-600 mt-2">Kelola Jadwal Lab Komputer</p>
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

        {/* Message Alert */}
        {message.text && (
          <div className={`mb-6 p-4 rounded-xl ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {message.text}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form Panel */}
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
                    placeholder="Contoh: TT-4A"
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

          {/* List Jadwal */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-800">Daftar Jadwal ({schedules.length})</h2>
                <p className="text-gray-600">Kelola semua jadwal lab komputer</p>
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
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleEdit(item)}
                                className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition text-sm"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDelete(item.id)}
                                className="px-3 py-1 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition text-sm"
                              >
                                Hapus
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

            {/* Stats */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white rounded-xl p-4 shadow">
                <div className="text-2xl font-bold text-blue-600">{schedules.length}</div>
                <div className="text-sm text-gray-600">Total Jadwal</div>
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
    </div>
  );
};

export default PostJadwal;