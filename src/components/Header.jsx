import React from 'react';
import { formatTime, formatDate } from '../utils/dateFormatter';

const Header = ({ currentTime }) => {
  return (
    <header className="relative mb-12">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-10 rounded-3xl"></div>
      
      <div className="relative bg-white/90 backdrop-blur-sm rounded-3xl shadow-lg p-8 border border-white/30">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">
          
          {/* Logo dan Judul */}
          <div className="flex-1">
            <div className="flex items-center gap-4 mb-4">
              <div className="relative">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"></path>
                  </svg>
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center">
                  <span className="text-xs font-bold text-white">3</span>
                </div>
              </div>
              
              <div>
                <h1 className="text-4xl md:text-5xl font-bold text-blue-700">
                  Jadwal Lab Komputer
                </h1>
                <div className="flex items-center gap-3 mt-2">
                  <span className="text-gray-600">Teknik Telekomunikasi</span>
                  <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                  <span className="text-gray-600">Politeknik Negeri Semarang</span>
                </div>
              </div>
            </div>
            
            {/* Status Indicator */}
            <div className="flex flex-wrap gap-4 mt-6">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-gray-700">Aktif</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="text-sm font-medium text-gray-700">3 Lab Tersedia</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                <span className="text-sm font-medium text-gray-700">Online</span>
              </div>
            </div>
          </div>
          
          {/* Waktu dan Tanggal */}
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl blur opacity-30 group-hover:opacity-70 transition duration-500"></div>
            
            <div className="relative bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 text-white shadow-xl">
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <svg className="w-5 h-5 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <span className="text-sm text-blue-200 font-medium">WAKTU REAL-TIME</span>
                </div>
                
                <div className="relative">
                  <div className="text-4xl md:text-5xl font-bold tracking-tight mb-2">
                    <span className="bg-gradient-to-r from-blue-300 to-purple-300 bg-clip-text text-transparent">
                      {formatTime(currentTime)}
                    </span>
                  </div>
                  
                  <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-blue-400 to-transparent"></div>
                </div>
                
                <div className="flex items-center justify-center gap-2 mt-4 text-gray-300">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                  </svg>
                  <span className="text-sm font-medium">{formatDate(currentTime)}</span>
                </div>
                
                <div className="mt-4 pt-4 border-t border-gray-700/50">
                  <div className="text-xs text-gray-400">
                    Update otomatis setiap menit
                  </div>
                </div>
              </div>
            </div>
            
            {/* Decorative Elements */}
            <div className="absolute -top-2 -right-2 w-4 h-4 bg-blue-400 rounded-full animate-ping"></div>
            <div className="absolute -bottom-2 -left-2 w-3 h-3 bg-purple-400 rounded-full"></div>
          </div>
        </div>
        
        {/* Quick Stats Bar */}
        <div className="mt-8 pt-6 border-t border-gray-200/50">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">15</div>
              <div className="text-sm text-gray-600">Total Jadwal</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">1</div>
              <div className="text-sm text-gray-600">Sedang Berlangsung</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">13</div>
              <div className="text-sm text-gray-600">Akan Datang</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-600">1</div>
              <div className="text-sm text-gray-600">Kosong</div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Floating Elements */}
      <div className="absolute top-6 right-10 w-24 h-24 bg-blue-400/10 rounded-full blur-2xl"></div>
      <div className="absolute bottom-6 left-10 w-32 h-32 bg-purple-400/10 rounded-full blur-3xl"></div>
    </header>
  );
};

export default Header;