import MODULE_PERMISSIONS from "../config/permissions.js";
// isso é importado de config/permissions.js

export default function moduleAccess(moduleName) {
  return (req, res, next) => {
    const role = req.user?.funcao;

    if (!role) {
      console.error(`[moduleAccess] Usuário não autenticado para módulo ${moduleName}`);
      return res.status(401).json({ error: "Usuário não autenticado" });
    }

    const allowedRoles = MODULE_PERMISSIONS[moduleName];

    if (!allowedRoles) {
      console.error(`[moduleAccess] Módulo ${moduleName} não encontrado nas permissões`);
      return res.status(500).json({ error: `Módulo ${moduleName} não configurado` });
    }

    // Normalizar para comparação case-insensitive
    const normalizedRole = role.toLowerCase().trim();
    const normalizedAllowedRoles = allowedRoles.map(r => r.toLowerCase().trim());

    if (!normalizedAllowedRoles.includes(normalizedRole)) {
      console.error(`[moduleAccess] Acesso negado: role="${normalizedRole}" não está em [${normalizedAllowedRoles.join(', ')}] para módulo ${moduleName}`);
      return res.status(403).json({ 
        error: `Acesso negado ao módulo ${moduleName}`,
        role: normalizedRole,
        allowedRoles: normalizedAllowedRoles
      });
    }

    next();
  };
}
