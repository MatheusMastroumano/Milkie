"use client";

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { apiJson } from '@/lib/api';
import { hasRoutePermission, getDefaultRoute } from '@/lib/routePermissions';

export default function RouteGuard({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isChecking, setIsChecking] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const checkAccess = async () => {
      try {
        // Páginas públicas não precisam de verificação
        if (pathname === '/' || pathname === '/login') {
          if (isMounted) {
            setIsAuthorized(true);
            setIsChecking(false);
          }
          return;
        }

        // Verificar autenticação
        const auth = await apiJson('/auth/check-auth');
        
        if (!isMounted) return;
        
        if (!auth?.authenticated || !auth?.user) {
          // Não autenticado, redirecionar para login
          setIsRedirecting(true);
          router.replace('/');
          return;
        }

        const userRole = auth.user.funcao;
        
        // Verificar se o usuário tem permissão para acessar a rota atual
        const hasPermission = hasRoutePermission(userRole, pathname);
        
        if (!hasPermission) {
          // Sem permissão, redirecionar para a rota padrão do usuário
          setIsRedirecting(true);
          const defaultRoute = getDefaultRoute(userRole);
          console.log(`[RouteGuard] ❌ Acesso negado. Usuário: ${userRole}, Rota: ${pathname}, Redirecionando para: ${defaultRoute}`);
          router.replace(defaultRoute);
          return;
        }
        
        // Tem permissão, autorizar acesso
        if (isMounted) {
          console.log(`[RouteGuard] ✅ Acesso permitido. Usuário: ${userRole}, Rota: ${pathname}`);
          setIsAuthorized(true);
        }
      } catch (error) {
        console.error('[RouteGuard] Erro ao verificar acesso:', error);
        if (isMounted) {
          // Em caso de erro, redirecionar para login
          setIsRedirecting(true);
          router.replace('/');
        }
      } finally {
        if (isMounted) {
          setIsChecking(false);
        }
      }
    };

    checkAccess();

    return () => {
      isMounted = false;
    };
  }, [pathname, router]);

  // Enquanto está verificando ou redirecionando, não renderiza nada
  if (isChecking || isRedirecting) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#F9FAFB] via-[#E5E7EB] to-[#F9FAFB] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4B5EAA] mx-auto"></div>
          <p className="mt-4 text-[#6B7280]">
            {isRedirecting ? 'Redirecionando...' : 'Verificando permissões...'}
          </p>
        </div>
      </div>
    );
  }

  // Se não está autorizado, não renderiza nada
  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#F9FAFB] via-[#E5E7EB] to-[#F9FAFB] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4B5EAA] mx-auto"></div>
          <p className="mt-4 text-[#6B7280]">Redirecionando...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

