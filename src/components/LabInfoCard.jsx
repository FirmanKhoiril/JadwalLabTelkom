import React from 'react';

const LabInfoCards = ({ labs = [], totalSchedules = 0 }) => {
  if (labs.length === 0) return null;

  return (
    <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
      {labs.map((lab, idx) => (
        <div key={lab.id + idx} className="bg-white rounded-xl p-4 shadow-lg hover:shadow-xl transition">
          <div className="flex justify-between items-start mb-3">
            <div>
              <h3 className="text-lg font-bold text-gray-800">{lab.name}</h3>
              <p className="text-sm text-gray-600">{lab.location}</p>
            </div>
            <span className="bg-blue-100 text-blue-800 text-xs px-3 py-1 rounded-full">
              Kapasitas: {lab.capacity}
            </span>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-800">{lab.total || 0}</div>
              <div className="text-xs text-gray-500">Total</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{lab.ongoing || 0}</div>
              <div className="text-xs text-gray-500">Berlangsung</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{lab.upcoming || 0}</div>
              <div className="text-xs text-gray-500">Akan Datang</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-600">{lab.empty || 0}</div>
              <div className="text-xs text-gray-500">Kosong</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default LabInfoCards;