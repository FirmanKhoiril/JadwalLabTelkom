
const LabInfoCards = ({ labs = [], totalSchedules = 0 }) => {
  if (labs.length === 0) return null;

  return (
    <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
      {labs.map((lab) => {
        const isActive = lab.ongoing > 0;
        
        return (
          <div 
            key={lab.id} 
            className={`bg-white rounded-xl p-4 shadow-lg hover:shadow-xl transition ${isActive ? 'border-l-4 border-green-500' : ''}`}
          >
            <div className="flex justify-between items-start mb-3">
              <div>
                <div className="flex items-center gap-2 justify-between">
                  <h3 className="text-lg font-bold text-gray-800">{lab.name}</h3>
                  {isActive && (
                    <span className="bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded-full">
                      Aktif
                    </span>
                  )}
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="text-center p-2 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-gray-800">{lab.total || 0}</div>
                <div className="text-xs text-gray-500">Total</div>
              </div>
              <div className="text-center p-2 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{lab.ongoing || 0}</div>
                <div className="text-xs text-gray-500">Berlangsung</div>
              </div>
              <div className="text-center p-2 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{lab.upcoming || 0}</div>
                <div className="text-xs text-gray-500">Akan Datang</div>
              </div>
              <div className="text-center p-2 bg-gray-100 rounded-lg">
                <div className="text-2xl font-bold text-gray-600">{lab.empty || 0}</div>
                <div className="text-xs text-gray-500">Kosong</div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default LabInfoCards;