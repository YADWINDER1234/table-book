import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const CredentialsHelper: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const credentials = [
    {
      type: 'Demo User',
      email: 'john@example.com',
      password: 'password123',
      color: 'bg-blue-50 border-blue-200'
    },
    {
      type: 'Admin User',
      email: 'admin@restaurant.com',
      password: 'password123',
      color: 'bg-amber-50 border-amber-200'
    }
  ];

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <>
      {/* Info Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 w-10 h-10 rounded-full bg-gray-800 text-white flex items-center justify-center shadow-lg hover:bg-gray-900 transition-all"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        title="View test credentials"
      >
        <span className="text-lg font-semibold">?</span>
      </motion.button>

      {/* Credentials Popup */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-20 right-6 w-80 bg-white rounded-lg shadow-2xl border border-gray-200 z-50 p-4"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-200">
              <h3 className="font-semibold text-gray-800 text-sm">Test Credentials</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-500 hover:text-gray-700 text-lg leading-none"
              >
                ✕
              </button>
            </div>

            {/* Credentials */}
            <div className="space-y-3">
              {credentials.map((cred, idx) => (
                <div
                  key={idx}
                  className={`p-3 rounded border ${cred.color}`}
                >
                  <p className="text-xs font-semibold text-gray-700 mb-2">
                    {cred.type}
                  </p>
                  
                  {/* Email */}
                  <div className="mb-2">
                    <p className="text-xs text-gray-600 mb-1">Email:</p>
                    <div
                      onClick={() => copyToClipboard(cred.email)}
                      className="bg-white p-2 rounded text-xs font-mono text-gray-800 cursor-pointer hover:bg-gray-50 transition flex items-center justify-between group"
                    >
                      <span>{cred.email}</span>
                      <span className="text-gray-400 group-hover:text-gray-600 text-xs">
                        📋
                      </span>
                    </div>
                  </div>

                  {/* Password */}
                  <div>
                    <p className="text-xs text-gray-600 mb-1">Password:</p>
                    <div
                      onClick={() => copyToClipboard(cred.password)}
                      className="bg-white p-2 rounded text-xs font-mono text-gray-800 cursor-pointer hover:bg-gray-50 transition flex items-center justify-between group"
                    >
                      <span>{cred.password}</span>
                      <span className="text-gray-400 group-hover:text-gray-600 text-xs">
                        📋
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <p className="text-xs text-gray-500 mt-3 pt-3 border-t border-gray-200">
              💡 Click any field to copy
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Overlay - click outside to close */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};
