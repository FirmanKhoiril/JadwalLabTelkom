import React from 'react';

const FilterSidebar = ({
  searchTerm,
  setSearchTerm,
  selectedLab,
  setSelectedLab,
  selectedDay,
  setSelectedDay,
  selectedStatus,
  setSelectedStatus,
  resetFilters,
  schedule,
  initialSchedule,
  labs,
  days,
  statuses
}) => {
  return (
    <div className="lg:col-span-1">
      <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-8">
        <h2 className="text-xl font-bold text-gray-800 mb-6">Filter Jadwal</h2>
        
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Cari Jadwal</label>
          <input
            type="text"
            placeholder="Cari mata kuliah, dosen, atau kelas..."
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Pilih Lab</label>
          <div className="space-y-2">
            <button
              className={`w-full text-left px-4 py-3 rounded-xl ${selectedLab === 'semua' ? 'bg-blue-100 text-blue-700 font-medium' : 'bg-gray-100 text-gray-700'}`}
              onClick={() => setSelectedLab('semua')}
            >
              Semua Lab
            </button>
            {labs.map((lab, index) => (
              <button
                key={index}
                className={`w-full text-left px-4 py-3 rounded-xl ${selectedLab === lab.name ? 'bg-blue-100 text-blue-700 font-medium' : 'bg-gray-100 text-gray-700'}`}
                onClick={() => setSelectedLab(lab.name)}
              >
                {lab.name}
              </button>
            ))}
          </div>
        </div>
        
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Pilih Hari</label>
          <div className="space-y-2">
            <button
              className={`w-full text-left px-4 py-3 rounded-xl ${selectedDay === 'semua' ? 'bg-blue-100 text-blue-700 font-medium' : 'bg-gray-100 text-gray-700'}`}
              onClick={() => setSelectedDay('semua')}
            >
              Semua Hari
            </button>
            {days.map((day, index) => (
              <button
                key={index}
                className={`w-full text-left px-4 py-3 rounded-xl ${selectedDay === day ? 'bg-blue-100 text-blue-700 font-medium' : 'bg-gray-100 text-gray-700'}`}
                onClick={() => setSelectedDay(day)}
              >
                {day}
              </button>
            ))}
          </div>
        </div>
        
        <div className="mb-8">
          <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
          <div className="space-y-2">
            <button
              className={`w-full text-left px-4 py-3 rounded-xl ${selectedStatus === 'semua' ? 'bg-blue-100 text-blue-700 font-medium' : 'bg-gray-100 text-gray-700'}`}
              onClick={() => setSelectedStatus('semua')}
            >
              Semua Status
            </button>
            {statuses.map((status, index) => (
              <button
                key={index}
                className={`w-full text-left px-4 py-3 rounded-xl ${selectedStatus === status.value ? 'bg-blue-100 text-blue-700 font-medium' : 'bg-gray-100 text-gray-700'}`}
                onClick={() => setSelectedStatus(status.value)}
              >
                {status.label}
              </button>
            ))}
          </div>
        </div>
        
        <button
          className="w-full bg-gray-800 text-white py-3 rounded-xl font-medium hover:bg-gray-900 transition"
          onClick={resetFilters}
        >
          Reset Filter
        </button>
        
        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-center text-gray-600">
            Menampilkan <span className="font-bold text-blue-600">{schedule.length}</span> dari {initialSchedule.length} jadwal
          </p>
        </div>
      </div>
    </div>
  );
};

export default FilterSidebar;