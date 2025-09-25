import React from "react";
import Header from "@/components/Header/page";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100">
        <br></br>
           <br></br>
              <br></br>
    <Header />

      <main className="p-8">
        <h1 className="text-3xl font-bold">Página Inicial</h1>
        <p className="mt-4 text-black-600">Conteúdo da página</p>
        
      </main>
    </div>

    
  );
}

