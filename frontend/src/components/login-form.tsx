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

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  return (
    <form className={cn("flex flex-col gap-6", className)} {...props}>
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-[#4B5EAA] to-[#4B5EAA] bg-clip-text text-transparent transition-colors duration-300 hover:bg-gradient-to-r hover:from-[#A83B3B] hover:to-[#A83B3B]">
            Faça login na sua conta
          </h1>
          <p className="text-[#4B5EAA] text-sm text-balance transition-colors duration-300 hover:text-[#A83B3B]">
            Digite seu e-mail abaixo para fazer login na sua conta
          </p>
        </div>
        <Field>
          <FieldLabel htmlFor="email" className="text-[#4B5EAA] transition-colors duration-300 hover:text-[#A83B3B]">E-mail</FieldLabel>
          <Input id="email" type="email" placeholder="m@example.com" required className="bg-[#FFFFFF] border-[#4B5EAA] focus:border-[#4B5EAA] text-[#1F2937] transition-colors duration-300 hover:border-[#A83B3B] hover:focus:border-[#A83B3B]" />
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
          <Input id="password" type="password" required className="bg-[#FFFFFF] border-[#4B5EAA] focus:border-[#4B5EAA] text-[#1F2937] transition-colors duration-300 hover:border-[#A83B3B] hover:focus:border-[#A83B3B]" />
        </Field>
        <Field>
          <Button type="submit" className="bg-[#4B5EAA] hover:bg-[#A83B3B] text-white transition-colors duration-300">Login</Button>
        </Field>
        <FieldSeparator className="text-[#4B5EAA] transition-colors duration-300 hover:text-[#A83B3B]">Ou continue com</FieldSeparator>
        <Field>

        </Field>
      </FieldGroup>
    </form>
  )
}