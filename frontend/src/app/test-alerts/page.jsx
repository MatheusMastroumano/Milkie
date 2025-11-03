"use client";

import React, { useState } from 'react';
import { AlertDialog } from '@/components/ui/alert-dialog.jsx';
import { SimpleConfirm } from '@/components/ui/simple-confirm.jsx';

export default function TestAlerts() {
  const [showAlertDialog, setShowAlertDialog] = useState(false);
  const [showSimpleConfirm, setShowSimpleConfirm] = useState(false);
  const [dialogType, setDialogType] = useState('warning');

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">Teste de Componentes de Alerta</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* AlertDialog Tests */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">AlertDialog</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Tipo:</label>
                <select 
                  value={dialogType} 
                  onChange={(e) => setDialogType(e.target.value)}
                  className="w-full p-2 border rounded"
                >
                  <option value="success">Success</option>
                  <option value="error">Error</option>
                  <option value="warning">Warning</option>
                  <option value="info">Info</option>
                </select>
              </div>
              
              <button
                onClick={() => setShowAlertDialog(true)}
                className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Testar AlertDialog
              </button>
            </div>
          </div>

          {/* SimpleConfirm Tests */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">SimpleConfirm</h2>
            
            <div className="space-y-4">
              <button
                onClick={() => setShowSimpleConfirm(true)}
                className="w-full px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              >
                Testar SimpleConfirm
              </button>
              
              <button
                onClick={() => {
                  if (window.confirm('Teste do window.confirm nativo. Confirma?')) {
                    alert('Confirmado!');
                  }
                }}
                className="w-full px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
              >
                Testar window.confirm (nativo)
              </button>
            </div>
          </div>
        </div>

        {/* Resultados */}
        <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Instruções de Teste</h2>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>Teste o AlertDialog com diferentes tipos (success, error, warning, info)</li>
            <li>Teste o SimpleConfirm para confirmações simples</li>
            <li>Compare com o window.confirm nativo</li>
            <li>Verifique se os modais fecham corretamente</li>
            <li>Teste o clique no backdrop para fechar</li>
          </ul>
        </div>
      </div>

      {/* AlertDialog */}
      <AlertDialog
        isOpen={showAlertDialog}
        onClose={() => setShowAlertDialog(false)}
        title={`Teste ${dialogType.charAt(0).toUpperCase() + dialogType.slice(1)}`}
        description={`Este é um teste do AlertDialog com tipo "${dialogType}". O componente está funcionando corretamente?`}
        type={dialogType}
        confirmText="Sim, funciona!"
        cancelText="Não funciona"
        onConfirm={() => {
          alert('AlertDialog funcionou!');
          setShowAlertDialog(false);
        }}
        showCancel={true}
      />

      {/* SimpleConfirm */}
      <SimpleConfirm
        isOpen={showSimpleConfirm}
        onClose={() => setShowSimpleConfirm(false)}
        title="Confirmar Ação"
        description="Tem certeza que deseja executar esta ação? Esta é uma confirmação usando o SimpleConfirm."
        type="warning"
        confirmText="Confirmar"
        cancelText="Cancelar"
        onConfirm={() => {
          alert('SimpleConfirm funcionou!');
        }}
      />
    </div>
  );
}