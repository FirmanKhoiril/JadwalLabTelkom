import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import FilterSidebar from './components/FilterSidebar';
import LabInfoCards from './components/LabInfoCard';
import ScheduleTable from './components/ScheduleTable';
import Footer from './components/Footer';
import { initialSchedule, labs, days, statuses } from './data/scheduleData';

const App = () => {
  const [schedule, setSchedule] = useState(initialSchedule);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLab, setSelectedLab] = useState('semua');
  const [selectedDay, setSelectedDay] = useState('semua');
  const [selectedStatus, setSelectedStatus] = useState('semua');
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    let filtered = initialSchedule;
    
    if (searchTerm) {
      filtered = filtered.filter(item => 
        item.matkul.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.dosen.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.kelas.toLowerCase().includes(searchTerm.toLowerCase())
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
  }, [searchTerm, selectedLab, selectedDay, selectedStatus]);

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedLab('semua');
    setSelectedDay('semua');
    setSelectedStatus('semua');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <Header currentTime={currentTime} />
        
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
            initialSchedule={initialSchedule}
            labs={labs}
            days={days}
            statuses={statuses}
          />
          
          <div className="lg:col-span-3">
            <LabInfoCards labs={labs} initialSchedule={initialSchedule} />
            
            <ScheduleTable schedule={schedule} statuses={statuses} />
            
            <Footer />
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;