export const initialSchedule = [
  { id: 1, lab: 'Lab Komputer 1', matkul: 'Pemrograman Web', kelas: 'TE-4A', dosen: 'Dr. Ahmad Rizal, M.T.', waktu: '08:00 - 10:30', hari: 'Senin', status: 'berlangsung' },
  { id: 2, lab: 'Lab Komputer 2', matkul: 'Jaringan Komputer', kelas: 'TE-3B', dosen: 'Prof. Siti Aminah, M.Sc.', waktu: '10:45 - 13:15', hari: 'Senin', status: 'akan datang' },
  { id: 3, lab: 'Lab Komputer 3', matkul: 'Basis Data', kelas: 'TE-2C', dosen: 'Ir. Bambang Setiawan', waktu: '13:30 - 16:00', hari: 'Senin', status: 'kosong' },
  { id: 4, lab: 'Lab Komputer 1', matkul: 'Algoritma & Struktur Data', kelas: 'TE-1A', dosen: 'Dian Permana, M.Kom.', waktu: '08:00 - 10:30', hari: 'Selasa', status: 'akan datang' },
  { id: 5, lab: 'Lab Komputer 2', matkul: 'Sistem Operasi', kelas: 'TE-4B', dosen: 'Dr. Rina Melati, M.T.', waktu: '10:45 - 13:15', hari: 'Selasa', status: 'akan datang' },
  { id: 6, lab: 'Lab Komputer 3', matkul: 'Kecerdasan Buatan', kelas: 'TE-3A', dosen: 'Prof. Hendra Wijaya, Ph.D.', waktu: '13:30 - 16:00', hari: 'Selasa', status: 'akan datang' },
  { id: 7, lab: 'Lab Komputer 1', matkul: 'Pemrograman Mobile', kelas: 'TE-4C', dosen: 'Fajar Nugraha, M.Kom.', waktu: '08:00 - 10:30', hari: 'Rabu', status: 'akan datang' },
  { id: 8, lab: 'Lab Komputer 2', matkul: 'Keamanan Jaringan', kelas: 'TE-3C', dosen: 'Dr. Andi Prasetyo', waktu: '10:45 - 13:15', hari: 'Rabu', status: 'akan datang' },
  { id: 9, lab: 'Lab Komputer 3', matkul: 'Grafika Komputer', kelas: 'TE-2B', dosen: 'Maya Sari, M.T.', waktu: '13:30 - 16:00', hari: 'Rabu', status: 'akan datang' },
  { id: 10, lab: 'Lab Komputer 1', matkul: 'Internet of Things', kelas: 'TE-4A', dosen: 'Rizki Ramadan, M.Sc.', waktu: '08:00 - 10:30', hari: 'Kamis', status: 'akan datang' },
  { id: 11, lab: 'Lab Komputer 2', matkul: 'Data Mining', kelas: 'TE-3A', dosen: 'Dr. Fitriani, M.Kom.', waktu: '10:45 - 13:15', hari: 'Kamis', status: 'akan datang' },
  { id: 12, lab: 'Lab Komputer 3', matkul: 'Rekayasa Perangkat Lunak', kelas: 'TE-2A', dosen: 'Prof. Arifin, Ph.D.', waktu: '13:30 - 16:00', hari: 'Kamis', status: 'akan datang' },
  { id: 13, lab: 'Lab Komputer 1', matkul: 'Komputasi Awan', kelas: 'TE-4B', dosen: 'Surya Adi, M.T.', waktu: '08:00 - 10:30', hari: 'Jumat', status: 'akan datang' },
  { id: 14, lab: 'Lab Komputer 2', matkul: 'Pemrograman Python', kelas: 'TE-1B', dosen: 'Rina Andriani, M.Kom.', waktu: '10:45 - 13:15', hari: 'Jumat', status: 'akan datang' },
  { id: 15, lab: 'Lab Komputer 3', matkul: 'Jaringan Nirkabel', kelas: 'TE-3B', dosen: 'Dr. Eko Prasetyo', waktu: '13:30 - 16:00', hari: 'Jumat', status: 'akan datang' },
];

export const labs = ['Lab Komputer 1', 'Lab Komputer 2', 'Lab Komputer 3'];

export const days = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat'];

export const statuses = [
  { value: 'berlangsung', label: 'Sedang Berlangsung', color: 'bg-green-100 text-green-800' },
  { value: 'akan datang', label: 'Akan Datang', color: 'bg-blue-100 text-blue-800' },
  { value: 'kosong', label: 'Kosong', color: 'bg-gray-100 text-gray-800' }
];