"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldDescription,
  FieldLabel,
  FieldGroup,
  FieldSeparator,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { apiJson } from "@/lib/api"

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const router = useRouter()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      const data = await apiJson<{ user?: { funcao?: string } }>("/auth/login", {
        method: "POST",
        body: JSON.stringify({
          username: username,
          senha: password,
        }),
      })
      const roleRaw: string | undefined = (data as any)?.user?.funcao
      const role = (roleRaw || "").toLowerCase().trim()

      if (role === "admin") {
        router.replace("/matriz/home")
      } else if (role === "caixa") {
        router.replace("/pdv")
      } else if (role === "gerente") {
        router.replace("/filial/home")
      } else {
        router.replace("/matriz/home")
      }
    } catch (err: any) {
      console.error("Erro no login:", err)
      setError(err?.message || "Erro ao fazer login. Verifique sua conexão com a API.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form className={cn("flex flex-col gap-6", className)} onSubmit={onSubmit} {...props}>
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-[#4B5EAA] to-[#4B5EAA] bg-clip-text text-transparent transition-colors duration-300 hover:bg-gradient-to-r hover:from-[#A83B3B] hover:to-[#A83B3B]">
            Faça login na sua conta
          </h1>
          <p className="text-[#4B5EAA] text-sm text-balance transition-colors duration-300 hover:text-[#A83B3B]">
            Digite seu e-mail abaixo para fazer login na sua conta
          </p>
        </div>
        {error && (
          <p className="text-sm text-red-600 text-center">{error}</p>
        )}
        <Field>
          <FieldLabel htmlFor="username" className="text-[#4B5EAA] transition-colors duration-300 hover:text-[#A83B3B]">Usuário</FieldLabel>
          <Input id="username" type="text" placeholder="seu usuário" required value={username} onChange={(e) => setUsername(e.target.value)} disabled={loading} className="bg-[#FFFFFF] border-[#4B5EAA] focus:border-[#4B5EAA] text-[#1F2937] transition-colors duration-300 hover:border-[#A83B3B] hover:focus:border-[#A83B3B]" />
        </Field>
        <Field>
          <div className="flex items-center">
            <FieldLabel htmlFor="password" className="text-[#4B5EAA] transition-colors duration-300 hover:text-[#A83B3B]">Senha</FieldLabel>
            <a
              href="#"
              className="ml-auto text-sm underline-offset-4 hover:underline text-[#4B5EAA] transition-colors duration-300 hover:text-[#A83B3B]"
            >
              Esqueceu sua senha?
            </a>
          </div>
          <Input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} disabled={loading} className="bg-[#FFFFFF] border-[#4B5EAA] focus:border-[#4B5EAA] text-[#1F2937] transition-colors duration-300 hover:border-[#A83B3B] hover:focus:border-[#A83B3B]" />
        </Field>
        <Field>
          <Button type="submit" disabled={loading} className="bg-[#4B5EAA] hover:bg-[#A83B3B] text-white transition-colors duration-300">{loading ? "Entrando..." : "Login"}</Button>
        </Field>
        <FieldSeparator className="text-[#4B5EAA] transition-colors duration-300 hover:text-[#A83B3B]">Ou continue com</FieldSeparator>
        <Field>

        </Field>
      </FieldGroup>
    </form>
  )
}