import MODULE_PERMISSIONS from "../config/permissions.js";
// isso é importado de config/permissions.js

export default function moduleAccess(moduleName) {
  return (req, res, next) => {
    const role = req.user?.role;

    if (!role) return res.status(401).json({ error: "Usuário não autenticado" });

    const allowedRoles = MODULE_PERMISSIONS[moduleName];

    if (!allowedRoles.includes(role)) {
      return res.status(403).json({ error: `Acesso negado ao módulo ${moduleName}` });
    }

    next();
  };
}
