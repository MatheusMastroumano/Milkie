import React from 'react';

export default function Error404() {
  const handleGoBack = () => {
    window.history.back();
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4">
      <div className="text-center">
        <div className="flex items-center justify-center mb-8">
          <span className="text-9xl font-bold" style={{ color: '#2A4E73' }}>4</span>
          <span className="text-9xl font-bold" style={{ color: '#2A4E73' }}>0</span>
          <span className="text-9xl font-bold" style={{ color: '#2A4E73' }}>4</span>
        </div>

        <h1 className="text-3xl font-semibold text-gray-800 mb-4">
          Página não encontrada
        </h1>
        <p className="text-gray-600 mb-8 max-w-md mx-auto">
          Desculpe, a página que você está procurando não existe ou foi movida.
        </p>

        <button
          onClick={handleGoBack}
          className="px-6 py-3 rounded-lg font-medium text-white transition-colors duration-200"
          style={{ 
            backgroundColor: '#2A4E73',
            ':hover': { backgroundColor: '#1e3a54' }
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#1e3a54'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#2A4E73'}
        >
          Voltar para página anterior
        </button>
      </div>
    </div>
  );
}