import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 text-center py-4 mt-auto">
      <p>&copy; {new Date().getFullYear()} KareXpert. All rights reserved.</p>
      <div className="flex justify-center space-x-4 mt-2">
        <a href="#" className="hover:text-white">Privacy Policy</a>
        <a href="#" className="hover:text-white">Terms of Service</a>
        <a href="#" className="hover:text-white">Support</a>
      </div>
    </footer>
  );
}
