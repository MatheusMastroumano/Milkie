import React from 'react';

const SimpleConfirm = ({
  isOpen,
  onClose,
  title,
  description,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  onConfirm,
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

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div className="absolute inset-0" onClick={handleCancel} />

      <div className="relative bg-[#FFFFFF] rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-[#2A4E73]">{title}</h3>
            <button
              onClick={handleCancel}
              className="text-[#2A4E73] hover:text-[#AD343E] text-2xl font-bold"
              aria-label="Fechar modal"
            >
              ×
            </button>
          </div>

          <p className="text-sm text-[#2A4E73] mb-6">{description}</p>

          <div className="flex gap-3">
            <button
              onClick={handleConfirm}
              className="flex-1 px-4 py-1.5 text-sm font-medium text-[#FFFFFF] bg-[#AD343E] rounded-md hover:bg-[#2A4E73] focus:outline-none focus:ring-2 focus:ring-[#CFE8F9] transition-colors"
            >
              {confirmText}
            </button>
            <button
              onClick={handleCancel}
              className="flex-1 px-4 py-1.5 text-sm font-medium text-[#FFFFFF] bg-[#2A4E73] rounded-md hover:bg-[#AD343E] focus:outline-none focus:ring-2 focus:ring-[#CFE8F9] transition-colors"
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
