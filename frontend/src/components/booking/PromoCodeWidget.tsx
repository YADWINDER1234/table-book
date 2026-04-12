import React, { useState } from 'react';
import { t } from '../../utils/i18n';

interface PromoCodeProps {
  onApply: (code: string, discount: number) => void;
}

const PromoCodeWidget: React.FC<PromoCodeProps> = ({ onApply }) => {
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [discount, setDiscount] = useState(0);

  const handleApply = async () => {
    try {
      setIsLoading(true);
      setMessage('');

      // Mock validation - in real app, call API
      if (!code.trim()) {
        setMessage('Please enter a promo code');
        return;
      }

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Mock discount calculation
      const mockCodes: { [key: string]: number } = {
        SAVE10: 10,
        SAVE20: 20,
        WELCOME: 15,
        LOYALTY: 25,
      };

      const discountAmount = mockCodes[code.toUpperCase()];

      if (discountAmount) {
        setDiscount(discountAmount);
        setMessage(`✓ Promo code applied! ${discountAmount}% discount`);
        onApply(code.toUpperCase(), discountAmount);
        setCode('');
      } else {
        setMessage('✗ Invalid or expired promo code');
        setDiscount(0);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
      <label className="block text-sm font-medium text-gray-700 mb-3">
        {t('promo-code')}
      </label>
      <div className="flex gap-2 mb-3">
        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Enter promo code"
          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600"
          disabled={isLoading}
        />
        <button
          onClick={handleApply}
          disabled={isLoading}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 font-medium whitespace-nowrap"
        >
          {isLoading ? 'Loading...' : 'Apply'}
        </button>
      </div>

      {message && (
        <p
          className={`text-sm font-medium ${
            discount > 0 ? 'text-green-600' : 'text-red-600'
          }`}
        >
          {message}
        </p>
      )}

      {discount > 0 && (
        <div className="mt-3 p-3 bg-green-100 rounded-lg">
          <p className="text-sm font-bold text-green-700">
            Discount Applied: {discount}%
          </p>
        </div>
      )}
    </div>
  );
};

export default PromoCodeWidget;
