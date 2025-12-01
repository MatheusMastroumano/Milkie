import { LoginForm } from "@/components/login-form"

export default function LoginPage() {
  return (
    <div className="grid min-h-svh lg:grid-cols-[1fr_1.3fr] overflow-y-hidden">
      
      {/* Coluna da esquerda */}
      <div className="flex flex-col items-center justify-center p-6 md:p-10">
        
        {/* Logo em cima e centralizada */}
        <div className="mb-8 flex justify-center">
          <img 
            src="/milkie.svg" 
            alt="Logo Milkie" 
            className="h-20 w-auto object-contain"
          />
        </div>

        {/* Formulário centralizado */}
        <div className="w-full max-w-xs">
          <LoginForm />
        </div>

      </div>

      {/* Imagem da direita */}
      <div className="bg-[#F9FAFB] relative hidden lg:block">
        <img
          src="./vaquinha.png"
          alt="Login Background"
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>

    </div>
  )
}
