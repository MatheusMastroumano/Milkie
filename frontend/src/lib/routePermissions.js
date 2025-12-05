// Mapeamento de rotas para módulos de permissão
// Baseado no backend/src/shared/config/permissions.js

const ROUTE_PERMISSIONS = {
  // Rotas da Matriz - APENAS ADMIN (baseado no backend: matriz tem módulos que só admin acessa)
  '/matriz/home': ['admin'],
  '/matriz/lojas': ['admin'], // Gerente não deve acessar lojas da matriz
  '/matriz/funcionarios': ['admin'], // Gerente não deve acessar funcionários da matriz
  '/matriz/usuarios': ['admin'], // Gerente não deve acessar usuários da matriz
  '/matriz/produtos': ['admin'], // Gerente não deve acessar produtos da matriz
  '/matriz/fornecedores': ['admin'], // Gerente não deve acessar fornecedores da matriz
  '/matriz/estoque': ['admin'], // Caixa não deve acessar estoque da matriz
  '/matriz/pdv': ['admin'], // Caixa não deve acessar PDV da matriz
  '/matriz/financeiro': ['admin'], // Gerente não deve acessar financeiro da matriz
  '/matriz/relatorios': ['admin'], // Gerente não deve acessar relatórios da matriz
  '/matriz/perfil': ['admin'], // Apenas admin acessa perfil da matriz

  // Rotas da Filial - ADMIN e GERENTE (baseado no backend: filial tem módulos que admin e gerente acessam)
  '/filial/home': ['admin', 'gerente'],
  '/filial/funcionarios': ['admin', 'gerente'],
  '/filial/usuarios': ['admin', 'gerente'],
  '/filial/produtos': ['admin', 'gerente'],
  '/filial/estoque': ['admin', 'gerente'], // Caixa não deve acessar estoque da filial
  '/filial/vendas': ['admin', 'gerente'], // Caixa não deve acessar vendas da filial
  '/filial/financeiro': ['admin', 'gerente'],
  '/filial/relatorios': ['admin', 'gerente'],
  '/filial/perfil': ['admin', 'gerente'], // Caixa não deve acessar perfil da filial

  // Rotas do PDV - ADMIN, GERENTE e CAIXA (baseado no backend: pdv tem módulos que todos acessam)
  '/pdv': ['admin', 'gerente', 'caixa'],
  '/pdv/manual': ['admin', 'gerente', 'caixa'],
  '/pdv/auto-atendimento': ['admin', 'gerente', 'caixa'],
  '/pdv/pagamento': ['admin', 'gerente', 'caixa'],
  
  // Rotas dinâmicas serão tratadas pela função getBaseRoute
  // Ex: /matriz/funcionarios/123 -> /matriz/funcionarios
  // Ex: /filial/produtos/456 -> /filial/produtos
};

// Função para obter a rota base (sem parâmetros dinâmicos)
function getBaseRoute(pathname) {
  // Remove parâmetros dinâmicos como [id]
  // Ex: /matriz/funcionarios/123 -> /matriz/funcionarios
  // Ex: /filial/produtos/456 -> /filial/produtos
  const parts = pathname.split('/').filter(Boolean);
  
  // Se a rota começa com matriz, filial ou pdv, pega até o segundo nível
  if (parts[0] === 'matriz' || parts[0] === 'filial' || parts[0] === 'pdv') {
    if (parts.length >= 2) {
      // Verifica se o terceiro segmento é um número (ID) ou uma rota específica
      if (parts.length >= 3) {
        // Se for um número, ignora (é um ID)
        if (/^\d+$/.test(parts[2])) {
          return `/${parts[0]}/${parts[1]}`;
        }
        // Se não for número, pode ser uma sub-rota (ex: /pdv/manual)
        return `/${parts[0]}/${parts[1]}/${parts[2]}`;
      }
      return `/${parts[0]}/${parts[1]}`;
    } else if (parts.length === 1) {
      return `/${parts[0]}`;
    }
  }
  
  return pathname;
}

// Função para verificar se o usuário tem permissão para acessar uma rota
export function hasRoutePermission(userRole, pathname) {
  const baseRoute = getBaseRoute(pathname);
  const allowedRoles = ROUTE_PERMISSIONS[baseRoute];
  
  // Se a rota não está mapeada
  if (!allowedRoles) {
    // Se começa com /matriz, /filial ou /pdv, bloqueia por padrão (rota protegida não mapeada)
    if (pathname.startsWith('/matriz') || pathname.startsWith('/filial') || pathname.startsWith('/pdv')) {
      console.log(`[hasRoutePermission] Rota protegida não mapeada: ${pathname} (base: ${baseRoute})`);
      return false;
    }
    // Caso contrário, pode ser página pública, permite acesso
    return true;
  }
  
  const normalizedRole = (userRole || '').toLowerCase().trim();
  const normalizedAllowedRoles = allowedRoles.map(r => r.toLowerCase().trim());
  
  const hasPermission = normalizedAllowedRoles.includes(normalizedRole);
  
  if (!hasPermission) {
    console.log(`[hasRoutePermission] Acesso negado. Role: ${normalizedRole}, Rota: ${pathname} (base: ${baseRoute}), Permitido para: ${normalizedAllowedRoles.join(', ')}`);
  }
  
  return hasPermission;
}

// Função para obter a rota padrão baseada no nível de acesso
export function getDefaultRoute(userRole) {
  const role = (userRole || '').toLowerCase().trim();
  
  if (role === 'admin') {
    return '/matriz/home';
  } else if (role === 'gerente') {
    return '/filial/home';
  } else if (role === 'caixa') {
    return '/pdv';
  }
  
  return '/';
}

export default ROUTE_PERMISSIONS;

