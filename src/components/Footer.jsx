import React from 'react';

const Footer = () => {
  return (
    <footer className="mt-8 text-center text-gray-500 text-sm">
      <p>© {new Date().getFullYear()} Teknik Telekomunikasi - Politeknik Negeri Semarang. Hak Cipta Dilindungi.</p>
      <p className="mt-1">Jadwal Lab Komputer v1.0</p>
    </footer>
  );
};

export default Footer;