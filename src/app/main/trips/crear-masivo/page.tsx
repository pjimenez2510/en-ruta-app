"use client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { format } from "date-fns";
import { getSession } from "next-auth/react";
import { useForm, FormProvider } from "react-hook-form";
import RHFDatePicker from "@/shared/components/rhf/RHFDatePicker";
import { toast } from "sonner";

interface FormValues {
  fechaInicio: Date | null;
  fechaFin: Date | null;
}

export default function CrearViajeMasivoPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<unknown[] | null>(null);
  const [executing, setExecuting] = useState(false);

  const methods = useForm<FormValues>({
    defaultValues: { fechaInicio: null, fechaFin: null },
    mode: "onChange",
  });
  const { handleSubmit, watch, setError: setFormError } = methods;

  const handlePreview = async (values: FormValues) => {
    setPreview(null);
    if (!values.fechaInicio || !values.fechaFin) {
      setFormError("fechaInicio", { type: "manual", message: "Campo requerido" });
      setFormError("fechaFin", { type: "manual", message: "Campo requerido" });
      toast.error("Ambas fechas son requeridas");
      return;
    }
    setLoading(true);
    try {
      const session = await getSession();
      const token = session?.user?.accessToken;
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/viajes/generar/previsualizar`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          fechaInicio: values.fechaInicio?.toISOString(),
          fechaFin: values.fechaFin?.toISOString(),
        })
      });
      const data = await res.json();
      if (res.ok && data.data) {
        setPreview(data.data);
      } else {
        toast.error(data.message || "Error al previsualizar viajes");
      }
    } catch (err) {
      toast.error("Error de red o del servidor" + (err instanceof Error ? ": " + err.message : ""));
    } finally {
      setLoading(false);
    }
  };

  const handleEjecutar = async () => {
    setExecuting(true);
    try {
      const session = await getSession();
      const token = session?.user?.accessToken;
      const values = methods.getValues();
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/viajes/generar/ejecutar`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          fechaInicio: values.fechaInicio?.toISOString(),
          fechaFin: values.fechaFin?.toISOString(),
        })
      });
      const data = await res.json();
      if (res.ok && data.data) {
        toast.success("¡Viajes generados exitosamente!");
        setPreview(null);
        setTimeout(() => {
          window.location.href = "/main/trips";
        }, 1200);
      } else {
        toast.error(data.message || "Error al crear viajes");
      }
    } catch (err) {
      toast.error("Error de red o del servidor" + (err instanceof Error ? ": " + err.message : ""));
    } finally {
      setExecuting(false);
    }
  };

  // Calcular la fecha máxima para fechaFin (90 días después de fechaInicio)
  const fechaInicioValue = watch("fechaInicio");
  let maxFechaFin: Date | undefined = undefined;
  if (fechaInicioValue) {
    maxFechaFin = new Date(fechaInicioValue);
    maxFechaFin.setDate(maxFechaFin.getDate() + 90);
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="mb-4">
        <Button variant="outline" onClick={() => router.back()} className="mb-2">
          ← Volver
        </Button>
      </div>
      <h1 className="text-2xl font-bold mb-4">Crear Viaje Masivo</h1>
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(handlePreview)} className="bg-white rounded-xl shadow-lg p-6 space-y-4 border max-w-xl">
          <div className="flex flex-col md:flex-row gap-4">
            <RHFDatePicker name="fechaInicio" label="Fecha Inicio" />
            <RHFDatePicker name="fechaFin" label="Fecha Fin" fromDate={fechaInicioValue || undefined} toDate={maxFechaFin} />
          </div>
          <Button type="submit" className="bg-primary text-white" disabled={loading}>
            {loading ? "Cargando..." : "Previsualizar viajes"}
          </Button>
        </form>
      </FormProvider>

      {preview && (
        <div className="bg-white rounded-xl shadow-lg p-6 border">
          <h2 className="text-lg font-bold mb-4">Previsualización de viajes generados</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border rounded-lg">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-2 py-2">Fecha</th>
                  <th className="px-2 py-2">Hora Salida</th>
                  <th className="px-2 py-2">Ruta</th>
                  <th className="px-2 py-2">Bus</th>
                  <th className="px-2 py-2">Capacidad</th>
                  <th className="px-2 py-2">Estado</th>
                </tr>
              </thead>
              <tbody>
                {preview.map((viaje, idx) => {
                  const v = viaje as {
                    fecha: string;
                    horarioRuta?: { horaSalida?: string; ruta?: { nombre?: string } };
                    bus?: { numero?: number; placa?: string };
                    capacidadTotal?: number;
                    estado?: string;
                  };
                  return (
                    <tr key={idx} className="border-b hover:bg-accent/30">
                      <td className="px-2 py-2 text-center">{format(new Date(v.fecha), "dd/MM/yyyy")}</td>
                      <td className="px-2 py-2 text-center">{v.horarioRuta?.horaSalida}</td>
                      <td className="px-2 py-2 text-center">{v.horarioRuta?.ruta?.nombre}</td>
                      <td className="px-2 py-2 text-center">{v.bus ? `${v.bus.numero} (${v.bus.placa})` : "-"}</td>
                      <td className="px-2 py-2 text-center">{v.capacidadTotal}</td>
                      <td className="px-2 py-2 text-center">
                        <span className="px-2 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
                          {v.estado}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="flex justify-end mt-4">
            <Button onClick={handleEjecutar} className="bg-green-600 text-white" disabled={executing}>
              {executing ? "Creando..." : "Aceptar y crear viajes"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
} 