import React from 'react';

const SimpleConfirm = ({
  isOpen,
  onClose,
  title,
  description,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  onConfirm,
  type = 'warning'
}) => {
  if (!isOpen) return null;

  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm();
    }
    onClose();
  };

  const handleCancel = () => {
    onClose();
  };

  const getColors = () => {
    switch (type) {
      case 'warning':
        return {
          bg: 'bg-yellow-50',
          border: 'border-yellow-200',
          icon: '⚠️',
          confirmBtn: 'bg-yellow-600 hover:bg-yellow-700'
        };
      case 'error':
        return {
          bg: 'bg-red-50',
          border: 'border-red-200',
          icon: '❌',
          confirmBtn: 'bg-red-600 hover:bg-red-700'
        };
      case 'success':
        return {
          bg: 'bg-green-50',
          border: 'border-green-200',
          icon: '✅',
          confirmBtn: 'bg-green-600 hover:bg-green-700'
        };
      default:
        return {
          bg: 'bg-blue-50',
          border: 'border-blue-200',
          icon: 'ℹ️',
          confirmBtn: 'bg-blue-600 hover:bg-blue-700'
        };
    }
  };

  const colors = getColors();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={handleCancel}
      />
      
      {/* Dialog */}
      <div className={`relative ${colors.bg} ${colors.border} border-2 rounded-lg shadow-xl max-w-md w-full`}>
        {/* Header */}
        <div className="p-6 pb-4">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-2xl">{colors.icon}</span>
            <h3 className="text-lg font-semibold text-gray-900">
              {title}
            </h3>
          </div>
          
          {/* Content */}
          <p className="text-gray-700 leading-relaxed mb-6">
            {description}
          </p>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={handleConfirm}
              className={`flex-1 px-4 py-2 rounded-md font-medium text-white transition-colors ${colors.confirmBtn}`}
            >
              {confirmText}
            </button>
            <button
              onClick={handleCancel}
              className="flex-1 px-4 py-2 rounded-md font-medium bg-gray-200 hover:bg-gray-300 text-gray-800 transition-colors"
            >
              {cancelText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export { SimpleConfirm };