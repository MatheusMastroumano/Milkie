import React from 'react';

const AlertDialog = ({
  isOpen,
  onClose,
  title,
  description,
  type = 'info',
  confirmText = 'OK',
  cancelText = 'Cancelar',
  onConfirm,
  onCancel,
  showCancel = false
}) => {
  if (!isOpen) return null;

  const getIcon = () => {
    switch (type) {
      case 'success':
        return '✅';
      case 'error':
        return '❌';
      case 'warning':
        return '⚠️';
      default:
        return 'ℹ️';
    }
  };

  const getColorClasses = () => {
    switch (type) {
      case 'success':
        return 'border-green-200 bg-green-50';
      case 'error':
        return 'border-red-200 bg-red-50';
      case 'warning':
        return 'border-yellow-200 bg-yellow-50';
      default:
        return 'border-blue-200 bg-blue-50';
    }
  };

  const getButtonColor = () => {
    switch (type) {
      case 'success':
        return 'bg-green-600 hover:bg-green-700';
      case 'error':
        return 'bg-red-600 hover:bg-red-700';
      case 'warning':
        return 'bg-yellow-600 hover:bg-yellow-700';
      default:
        return 'bg-blue-600 hover:bg-blue-700';
    }
  };

  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm();
    } else {
      onClose();
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      onClose();
    }
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={handleBackdropClick}
      />
      
      {/* Dialog */}
      <div className={`relative bg-white rounded-lg shadow-xl max-w-md w-full mx-4 border-2 ${getColorClasses()}`}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 pb-4">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{getIcon()}</span>
            <h3 className="text-lg font-semibold text-gray-900">
              {title}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl font-bold leading-none"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="px-6 pb-6">
          <p className="text-gray-700 leading-relaxed">
            {description}
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-3 px-6 pb-6">
          <button
            onClick={handleConfirm}
            className={`flex-1 px-4 py-2 rounded-md font-medium text-white transition-colors ${getButtonColor()}`}
          >
            {confirmText}
          </button>
          {showCancel && (
            <button
              onClick={handleCancel}
              className="flex-1 px-4 py-2 rounded-md font-medium bg-gray-200 hover:bg-gray-300 text-gray-800 transition-colors"
            >
              {cancelText}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export { AlertDialog };