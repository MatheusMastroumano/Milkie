"use client";

import RouteGuard from "@/components/RouteGuard";

export default function MatrizLayout({ children }) {
  return <RouteGuard>{children}</RouteGuard>;
}

