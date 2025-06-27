import { Button } from "@/components/ui/button";
import { Bus, Search, Plus } from "lucide-react";

interface EmptyStateProps {
  type: "no-buses" | "no-results";
  onAction?: () => void;
}

export const EmptyState = ({ type, onAction }: EmptyStateProps) => {
  const content = {
    "no-buses": {
      icon: <Bus className="h-12 w-12 text-primary/40" />,
      title: "No hay buses registrados",
      description: "Aún no se han agregado buses al sistema. ¡Comienza agregando uno!",
      actionLabel: "Agregar Bus",
      actionIcon: <Plus className="h-4 w-4 mr-2" />
    },
    "no-results": {
      icon: <Search className="h-12 w-12 text-primary/40" />,
      title: "No se encontraron resultados",
      description: "No hay buses que coincidan con los filtros aplicados. Intenta con otros criterios de búsqueda.",
      actionLabel: "Limpiar filtros",
      actionIcon: <Search className="h-4 w-4 mr-2" />
    }
  };

  const { icon, title, description, actionLabel, actionIcon } = content[type];

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-8 text-center bg-gray-50/50 rounded-lg border-2 border-dashed border-gray-200">
      <div className="bg-white rounded-full p-4 shadow-sm mb-4">
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        {title}
      </h3>
      <p className="text-gray-500 max-w-sm mb-6">
        {description}
      </p>
      {onAction && (
        <Button 
          onClick={onAction}
          className="min-w-[200px] shadow-sm"
        >
          {actionIcon}
          {actionLabel}
        </Button>
      )}
    </div>
  );
}; 