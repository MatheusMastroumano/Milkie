"use client";

import React, { useState } from 'react';
import { AlertDialog } from './alert-dialog.jsx';

export default function TestAlert() {
  const [showDialog, setShowDialog] = useState(false);

  return (
    <div className="p-4">
      <button
        onClick={() => setShowDialog(true)}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Testar AlertDialog
      </button>

      <AlertDialog
        isOpen={showDialog}
        onClose={() => setShowDialog(false)}
        title="Teste de Confirmação"
        description="Este é um teste do componente AlertDialog. Está funcionando corretamente?"
        type="warning"
        confirmText="Sim, funciona!"
        cancelText="Cancelar"
        onConfirm={() => {
          alert('Confirmado!');
          setShowDialog(false);
        }}
        showCancel={true}
      />
    </div>
  );
}