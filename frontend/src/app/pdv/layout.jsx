"use client";

import RouteGuard from "@/components/RouteGuard";

export default function PDVLayout({ children }) {
  return <RouteGuard>{children}</RouteGuard>;
}

