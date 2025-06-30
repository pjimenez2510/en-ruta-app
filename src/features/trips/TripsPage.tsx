"use client";
import { useState } from "react";
import { useTrips, TripsTable } from ".";
import { TripFilters } from "./components/trip-filters";
import { TripFilters as TripFiltersType } from "./interfaces/trips.interface";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { TripForm } from "./components/trip-form";

const TripsPage = () => {
  const [filters, setFilters] = useState<TripFiltersType>({});
  const { allTrips, createTrip } = useTrips();
  const router = useRouter();

  return (
    <>
      <div className="flex flex-col gap-2 mb-4">
        <div className="flex flex-row items-center justify-between w-full mb-2">
          <h2 className="text-2xl font-bold">Hoja de Ruta</h2>
          <div className="flex flex-row gap-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-2 bg-primary text-white hover:bg-primary/90 rounded-lg shadow-sm px-4 py-2">
                  <Plus className="h-4 w-4" />
                  Crear Viaje
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Crear Nuevo Viaje</DialogTitle>
                </DialogHeader>
                <TripForm
                  onSubmit={async (data) => {
                    await createTrip.mutateAsync(data);
                  }}
                />
              </DialogContent>
            </Dialog>
            <Button
              className="flex items-center gap-2 bg-secondary text-secondary-foreground hover:bg-secondary/80 rounded-lg shadow-sm px-4 py-2"
              onClick={() => router.push("/main/trips/crear-masivo")}
            >
              <Plus className="h-4 w-4" />
              Crear Viaje Masivo
            </Button>
          </div>
        </div>
        <TripFilters
          filters={filters}
          setFilters={setFilters}
          allTrips={allTrips}
        />
      </div>
      <TripsTable filters={filters} allTrips={allTrips} />
    </>
  );
};

export default TripsPage;
