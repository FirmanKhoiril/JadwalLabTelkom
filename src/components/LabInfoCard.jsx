import React from 'react';

const LabInfoCards = ({ labs, initialSchedule }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {labs.map((lab, index) => {
        const labSchedule = initialSchedule.filter(item => item.lab === lab);
        const currentSchedule = labSchedule.filter(item => item.status === 'berlangsung');
        
        return (
          <div key={index} className="bg-white rounded-2xl shadow-md p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-2">{lab}</h3>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-500">Status Saat Ini</div>
                <div className="text-2xl font-bold mt-1">
                  {currentSchedule.length > 0 
                    ? currentSchedule[0].matkul 
                    : 'Tidak ada kegiatan'}
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-500">Kapasitas</div>
                <div className="text-2xl font-bold text-blue-600 mt-1">30</div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default LabInfoCards;