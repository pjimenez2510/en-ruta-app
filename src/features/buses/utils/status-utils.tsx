import { BadgeCheck, AlertTriangle, Ban } from "lucide-react";
import React from "react";

export const getStatusColor = (status: string) => {
  switch (status) {
    case "ACTIVO":
      return "bg-green-100 text-green-700";
    case "MANTENIMIENTO":
      return "bg-yellow-100 text-yellow-700";
    case "RETIRADO":
      return "bg-red-100 text-red-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

export const getStatusIcon = (status: string) => {
  switch (status) {
    case "ACTIVO":
      return <BadgeCheck className="h-4 w-4" />;
    case "MANTENIMIENTO":
      return <AlertTriangle className="h-4 w-4" />;
    case "RETIRADO":
      return <Ban className="h-4 w-4" />;
    default:
      return null;
  }
}; 