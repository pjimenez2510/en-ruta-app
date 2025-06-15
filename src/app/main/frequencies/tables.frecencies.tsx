"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const data = [
  {
    id: "FREQ001",
    origen: "Ambato",
    destino: "Quito",
    hora: "08:00",
    duracion: "3h 30m",
    utilizacion: "92%",
    ingresos: "$18,500",
    estado: "Activa",
  },
  {
    id: "FREQ002",
    origen: "Ambato",
    destino: "Guayaquil",
    hora: "09:30",
    duracion: "5h 45m",
    utilizacion: "85%",
    ingresos: "$12,300",
    estado: "Activa",
  },
  {
    id: "FREQ003",
    origen: "Ambato",
    destino: "Cuenca",
    hora: "10:15",
    duracion: "5h 00m",
    utilizacion: "45%",
    ingresos: "$5,600",
    estado: "Inactiva",
  },
  {
    id: "FREQ004",
    origen: "Quito",
    destino: "Loja",
    hora: "20:00",
    duracion: "12h 00m",
    utilizacion: "82%",
    ingresos: "$8,700",
    estado: "Activa",
  },
  {
    id: "FREQ005",
    origen: "Ambato",
    destino: "Esmeraldas",
    hora: "21:30",
    duracion: "8h 30m",
    utilizacion: "78%",
    ingresos: "$7,800",
    estado: "Activa",
  },
];

export function FrecuenciasTable() {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Origen</TableHead>
            <TableHead>Destino</TableHead>
            <TableHead>Hora</TableHead>
            <TableHead>Duración</TableHead>
            <TableHead>Utilización</TableHead>
            <TableHead>Ingresos</TableHead>
            <TableHead>Estado</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((row) => (
            <TableRow key={row.id}>
              <TableCell>{row.id}</TableCell>
              <TableCell>{row.origen}</TableCell>
              <TableCell>{row.destino}</TableCell>
              <TableCell>{row.hora}</TableCell>
              <TableCell>{row.duracion}</TableCell>
              <TableCell>{row.utilizacion}</TableCell>
              <TableCell>{row.ingresos}</TableCell>
              <TableCell>
                <div
                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    row.estado === "Activa"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {row.estado}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
