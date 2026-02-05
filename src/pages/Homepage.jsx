import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import FilterSidebar from '../components/FilterSidebar';
import LabInfoCards from '../components/LabInfoCard';
import ScheduleTable from '../components/ScheduleTable';
import Footer from '../components/Footer';
import { getRealTimeSchedules } from '../firebase/config';
import { labs, days, statuses } from '../data/scheduleData';

const Homepage = () => {
  const [schedule, setSchedule] = useState([]);
  const [allSchedules, setAllSchedules] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLab, setSelectedLab] = useState('semua');
  const [selectedDay, setSelectedDay] = useState('semua');
  const [selectedStatus, setSelectedStatus] = useState('semua');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [indexBuilding, setIndexBuilding] = useState(false);

  useEffect(() => {
    
    setLoading(true);
    setError(null);
    setIndexBuilding(false);
    
    try {
      const unsubscribe = getRealTimeSchedules((data) => {
        setAllSchedules(data);
        setSchedule(data);
        setLoading(false);
        setIndexBuilding(false);
      }, (error) => {
        
        if (error.code === 'failed-precondition' && 
            error.message.includes('currently building')) {
          setIndexBuilding(true);
          setError("Database index sedang dibangun. Coba lagi dalam 2-3 menit.");
          
          setLoading(false);
          setAllSchedules([]);
          setSchedule([]);
        } else {
          setError("Gagal memuat data dari database: " + error.message);
          setLoading(false);
        }
      });

      return () => {
        unsubscribe();
      };
    } catch (err) {
      setError("Gagal menghubungkan ke database");
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (allSchedules.length === 0) {
      setSchedule([]);
      return;
    }

    let filtered = [...allSchedules];
    
    if (searchTerm.trim() !== '') {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(item => 
        (item.matkul && item.matkul.toLowerCase().includes(term)) ||
        (item.dosen && item.dosen.toLowerCase().includes(term)) ||
        (item.kelas && item.kelas.toLowerCase().includes(term)) ||
        (item.lab && item.lab.toLowerCase().includes(term))
      );
    }
    
    if (selectedLab !== 'semua') {
      filtered = filtered.filter(item => item.lab === selectedLab);
    }
    
    if (selectedDay !== 'semua') {
      filtered = filtered.filter(item => item.hari === selectedDay);
    }
    
    if (selectedStatus !== 'semua') {
      filtered = filtered.filter(item => item.status === selectedStatus);
    }
    
    setSchedule(filtered);
  }, [searchTerm, selectedLab, selectedDay, selectedStatus, allSchedules]);

  const calculateStats = () => {
    return {
      total: allSchedules.length,
      ongoing: allSchedules.filter(s => s.status === 'Sedang Berlangsung').length,
      upcoming: allSchedules.filter(s => s.status === 'Akan Datang').length,
      empty: allSchedules.filter(s => s.status === 'Kosong').length
    };
  };

  const calculateActiveLabs = () => {
    if (allSchedules.length === 0) return 0;
    
    const allLabs = [...new Set(allSchedules.map(s => s.lab))];
    
    const activeLabs = allLabs.filter(labName => {
      const labSchedules = allSchedules.filter(s => s.lab === labName);
      return labSchedules.some(s => s.status === 'Sedang Berlangsung');
    });
    
    return activeLabs.length;
  };

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedLab('semua');
    setSelectedDay('semua');
    setSelectedStatus('semua');
  };

  if (indexBuilding) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="animate-pulse text-yellow-500 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-800 mb-2">Database Sedang Dipersiapkan</h3>
          <p className="text-gray-600 mb-4">
            Index database sedang dibangun. Proses ini membutuhkan waktu 2-5 menit.
          </p>
          <div className="mb-4">
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-blue-500 rounded-full animate-pulse w-3/4"></div>
            </div>
            <p className="text-xs text-gray-500 mt-2">Membangun index...</p>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="w-full px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition"
          >
            Coba Lagi
          </button>
        </div>
      </div>
    );
  }

  if (error && !indexBuilding) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="text-red-500 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-800 mb-2">Error</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition"
          >
            Refresh Halaman
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Memuat data jadwal...</p>
          <p className="text-sm text-gray-400 mt-2">Menghubungkan ke database</p>
        </div>
      </div>
    );
  }

  const stats = calculateStats();
  const activeLabsCount = calculateActiveLabs();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <Header 
          currentTime={currentTime} 
          totalSchedules={stats.total}
          filteredSchedules={schedule.length}
          scheduleStats={stats}
          activeLabsCount={activeLabsCount}
        />
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <FilterSidebar
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            selectedLab={selectedLab}
            setSelectedLab={setSelectedLab}
            selectedDay={selectedDay}
            setSelectedDay={setSelectedDay}
            selectedStatus={selectedStatus}
            setSelectedStatus={setSelectedStatus}
            resetFilters={resetFilters}
            schedule={schedule}
            initialSchedule={allSchedules}
            labs={labs}
            days={days}
            statuses={statuses}
          />
          
          <div className="lg:col-span-3">
            <LabInfoCards 
              labs={labs.map(lab => ({
                ...lab,
                total: allSchedules.filter(s => s.lab === lab.name).length,
                ongoing: allSchedules.filter(s => s.lab === lab.name && s.status === 'Sedang Berlangsung').length,
                upcoming: allSchedules.filter(s => s.lab === lab.name && s.status === 'Akan Datang').length,
                empty: allSchedules.filter(s => s.lab === lab.name && s.status === 'Kosong').length
              }))} 
              totalSchedules={allSchedules.length}
            />
            
            <ScheduleTable 
              schedule={schedule} 
              statuses={statuses} 
              loading={loading}
            />
            
            <Footer />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Homepage;