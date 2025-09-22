import React from 'react';

export default function LoginPage() {
  return (
    <div className="flex flex-col min-h-screen md:flex-row">
      {/* Seção - Formulário de Login */}
      <div className="w-full bg-[#FFFFFF] flex items-center justify-center p-6 md:p-10 md:w-1/4">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <img src="https://via.placeholder.com/150" alt="Logo SeedProd" className="h-12 md:h-10" />
            <h2 className="text-3xl md:text-2xl font-semibold text-black mt-4">Bem-vindo de Volta</h2>
          </div>
          <form className="space-y-6">
            <div>
              <label className="block text-black text-lg md:text-sm font-medium mb-2">Endereço de E-mail</label>
              <input
                type="email"
                className="w-full p-4 md:p-2 border border-black rounded-lg md:rounded-md focus:outline-none focus:border-[#2A4E73] text-black text-lg md:text-sm"
                placeholder="Digite seu e-mail"
              />
            </div>
            <div>
              <label className="block text-black text-lg md:text-sm font-medium mb-2">Senha</label>
              <input
                type="password"
                className="w-full p-4 md:p-2 border border-black rounded-lg md:rounded-md focus:outline-none focus:border-[#2A4E73] text-black text-lg md:text-sm"
                placeholder="Digite sua senha"
              />
            </div>
            <div className="flex items-center justify-between">
              <label className="flex items-center text-black text-lg md:text-sm">
                <input type="checkbox" className="mr-3 md:mr-2 h-6 w-6" />
                Lembrar-me
              </label>
              <a href="#" className="text-[#2A4E73] text-lg md:text-sm">Esqueceu sua senha?</a>
            </div>
            <button
              type="submit"
              className="w-full bg-[#2A4E73] text-[#FFFFFF] p-4 md:p-2 rounded-lg md:rounded-md hover:bg-[#AD343E] transition-colors text-lg md:text-sm"
            >
              Entrar
            </button>
          </form>
          <p className="text-black text-base md:text-xs mt-6">
            Copyright © 2025 SeedProd LLC. "SeedProd" é uma marca registrada da SeedProd LLC.
          </p>
          <p className="text-black text-base md:text-xs mt-2">
            <a href="#" className="underline">Termos de Serviço</a> | <a href="#" className="underline">Política de Privacidade</a> 
          </p>
        </div>
      </div>

      {/* Seção Direita - Imagem de Fundo (visível apenas em telas maiores) */}
      <div className="hidden md:flex md:w-3/4 relative">
        <img
          src="./vaquinha.png" // Substitua pela sua imagem de fundo
          alt="Fundo"
          className="absolute inset-0 w-full h-full object-cover"
        />
      </div>
    </div>
  );
}