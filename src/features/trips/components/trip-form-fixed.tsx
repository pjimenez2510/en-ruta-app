"use client";

import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, SubmitHandler } from "react-hook-form";
import * as z from "zod";
import { Trip, CreateTripDTO } from "../interfaces/trips.interface";
import { useCrewData } from "../hooks/use-crew-data";
import { useEffect, useState } from "react";
import { RouteSchedule, Bus, UsuarioTenant } from "../interfaces/crew.interface";
import { createAuthApi } from "@/core/infrastructure/auth-axios";

const tripSchema = z.object({
	fecha: z.string().min(1, "La fecha es requerida"),
	estado: z
		.enum([
			"PROGRAMADO",
			"EN_RUTA",
			"COMPLETADO",
			"CANCELADO",
			"RETRASADO",
		] as const)
		.default("PROGRAMADO")
		.optional(),
	observaciones: z.string().optional().nullable(),
	horarioRutaId: z.string().min(1, "El horario es requerido"),
	busId: z.string().min(1, "El bus es requerido"),
	conductorId: z.string().optional().nullable(),
	ayudanteId: z.string().optional().nullable(),
	generacion: z
		.enum(["MANUAL", "AUTOMATICA"] as const)
		.default("MANUAL")
		.optional(),
});

type TripFormValues = z.infer<typeof tripSchema>;

interface TripFormProps {
	trip?: Trip;
	onSubmit: (data: CreateTripDTO) => Promise<void>;
}

export const TripForm = ({ trip, onSubmit }: TripFormProps) => {
	// Estado para buses desde la API externa
	const [externalBuses, setExternalBuses] = useState<Bus[]>([]);
	const [loadingBuses, setLoadingBuses] = useState(false);
	const [errorBuses, setErrorBuses] = useState<string | null>(null);

	useEffect(() => {
		const fetchBuses = async () => {
			setLoadingBuses(true);
			try {
				const api = await createAuthApi();
				const response = await api.get(
					`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/buses`
				);
				setExternalBuses(response.data.data || []);
				setErrorBuses(null);
			} catch (err) {
				setErrorBuses(
					"Error cargando buses" +
						(err instanceof Error ? ": " + err.message : "")
				);
			} finally {
				setLoadingBuses(false);
			}
		};
		fetchBuses();
	}, []);

	// Estado para conductores desde la API externa
	const [externalDrivers, setExternalDrivers] = useState<UsuarioTenant[]>([]);
	const [loadingDrivers, setLoadingDrivers] = useState(false);
	const [errorDrivers, setErrorDrivers] = useState<string | null>(null);

	useEffect(() => {
		const fetchDrivers = async () => {
			setLoadingDrivers(true);
			try {
				const api = await createAuthApi();
				const response = await api.get(
					`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/usuario-tenant?rol=CONDUCTOR`
				);
				setExternalDrivers(response.data.data || []);
				setErrorDrivers(null);
			} catch (err) {
				setErrorBuses(
					"Error cargando conductores" +
						(err instanceof Error ? ": " + err.message : "")
				);
			} finally {
				setLoadingDrivers(false);
			}
		};
		fetchDrivers();
	}, []);

	// Estado para ayudantes desde la API externa
	const [externalHelpers, setExternalHelpers] = useState<UsuarioTenant[]>([]);
	const [loadingHelpers, setLoadingHelpers] = useState(false);
	const [errorHelpers, setErrorHelpers] = useState<string | null>(null);

	useEffect(() => {
		const fetchHelpers = async () => {
			setLoadingHelpers(true);
			try {
				const api = await createAuthApi();
				const response = await api.get(
					`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/usuario-tenant?rol=AYUDANTE`
				);
				setExternalHelpers(response.data.data || []);
				setErrorHelpers(null);
			} catch (err) {
				setErrorHelpers("Error cargando ayudantes" + (err instanceof Error ? ": " + err.message : ""));
			} finally {
				setLoadingHelpers(false);
			}
		};
		fetchHelpers();
	}, []);

	const { schedules, isLoading, hasErrors, refetchSchedules } = useCrewData();

	const form = useForm<TripFormValues>({
		resolver: zodResolver(tripSchema),
		defaultValues: {
			fecha: "",
			estado: "PROGRAMADO",
			observaciones: "",
			horarioRutaId: "",
			busId: "",
			conductorId: "",
			ayudanteId: "",
			generacion: "MANUAL",
		},
	});

	useEffect(() => {
		if (trip) {
			form.reset({
				fecha: new Date(trip.fecha).toISOString().split("T")[0],
				estado: trip.estado,
				observaciones: trip.observaciones || "",
				horarioRutaId: trip.horarioRuta.id.toString(),
				busId: trip.bus.id.toString(),
				conductorId: trip.conductorId?.toString() || "",
				ayudanteId: trip.ayudanteId?.toString() || "",
				generacion: trip.generacion || "MANUAL",
			});
		}
	}, [trip, form]);

	const handleSubmit: SubmitHandler<TripFormValues> = async (values) => {
		try {
			// Construir el DTO según especificación del backend
			const tripData: CreateTripDTO = {
				horarioRutaId: Number(values.horarioRutaId),
				busId: Number(values.busId),
				fecha: new Date(values.fecha).toISOString(),
			};

			// Agregar campos opcionales solo si tienen valor
			if (values.conductorId && values.conductorId !== "") {
				tripData.conductorId = Number(values.conductorId);
			}

			if (values.ayudanteId && values.ayudanteId !== "") {
				tripData.ayudanteId = Number(values.ayudanteId);
			}

			if (values.estado) {
				tripData.estado = values.estado;
			}

			if (values.observaciones && values.observaciones.trim() !== "") {
				tripData.observaciones = values.observaciones;
			}

			if (values.generacion) {
				tripData.generacion = values.generacion;
			}

			console.log("Enviando datos al backend:", tripData);
			await onSubmit(tripData);
		} catch (error) {
			console.error("Error submitting trip:", error);
			throw error;
		}
	};

	if (isLoading) {
		return <div>Cargando datos...</div>;
	}

	const availableSchedules = Array.isArray(schedules) ? schedules : [];
	const availableBuses = Array.isArray(externalBuses) ? externalBuses : [];
	const availableDrivers = Array.isArray(externalDrivers)
		? externalDrivers
		: [];
	const availableHelpers = Array.isArray(externalHelpers)
		? externalHelpers
		: [];

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
				{/* Campo Fecha - REQUERIDO */}
				<FormField
					control={form.control}
					name="fecha"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Fecha *</FormLabel>
							<FormControl>
								<Input type="date" required {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				{/* Campo Horario - REQUERIDO */}
				<FormField
					control={form.control}
					name="horarioRutaId"
					render={({ field }) => (
						<FormItem>
							<div className="flex items-center justify-between">
								<FormLabel>Horario de Ruta *</FormLabel>
								{hasErrors && (
									<Button
										type="button"
										variant="ghost"
										size="sm"
										onClick={() => refetchSchedules()}
										className="h-8 px-2 text-xs"
									>
										Recargar horarios
									</Button>
								)}
							</div>
							<Select
								onValueChange={field.onChange}
								value={field.value}
								required
							>
								<FormControl>
									<SelectTrigger>
										<SelectValue placeholder="Seleccionar horario" />
									</SelectTrigger>
								</FormControl>
								<SelectContent>
									{availableSchedules.length > 0 ? (
										availableSchedules.map((schedule: RouteSchedule) => (
											<SelectItem
												key={schedule.id}
												value={schedule.id.toString()}
											>
												{schedule.horaSalida} - {schedule.ruta?.nombre}
											</SelectItem>
										))
									) : (
										<div className="px-4 py-2 text-sm text-gray-500">
											No hay horarios disponibles
										</div>
									)}
								</SelectContent>
							</Select>
							<FormMessage />
						</FormItem>
					)}
				/>
				{/* Campo Bus - REQUERIDO */}
				<FormField
					control={form.control}
					name="busId"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Bus *</FormLabel>
							<Select
								onValueChange={field.onChange}
								value={field.value}
								required
							>
								<FormControl>
									<SelectTrigger>
										<SelectValue placeholder="Seleccionar bus" />
									</SelectTrigger>
								</FormControl>
								<SelectContent>
									{loadingBuses ? (
										<div className="px-4 py-2 text-sm text-gray-500">
											Cargando buses...
										</div>
									) : errorBuses ? (
										<div className="px-4 py-2 text-sm text-red-500">
											{errorBuses}
										</div>
									) : availableBuses.length > 0 ? (
										availableBuses.map((bus: Bus) => (
											<SelectItem key={bus.id} value={bus.id.toString()}>
												{`#${bus.numero} - ${bus.placa} (${bus.modeloBus?.marca} ${bus.modeloBus?.modelo}, ${bus.totalAsientos} asientos)`}
											</SelectItem>
										))
									) : (
										<div className="px-4 py-2 text-sm text-gray-500">
											No hay buses disponibles
										</div>
									)}
								</SelectContent>
							</Select>
							<FormMessage />
						</FormItem>
					)}
				/>{" "}
				{/* Campo Conductor - OPCIONAL */}
				<FormField
					control={form.control}
					name="conductorId"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Conductor (Opcional)</FormLabel>
							<Select onValueChange={field.onChange} value={field.value || ""}>
								<FormControl>
									<SelectTrigger>
										<SelectValue placeholder="Seleccionar conductor" />
									</SelectTrigger>
								</FormControl>
								<SelectContent>
									<SelectItem value="">Sin conductor asignado</SelectItem>
									{loadingDrivers ? (
										<div className="px-4 py-2 text-sm text-gray-500">
											Cargando conductores...
										</div>
									) : errorDrivers ? (
										<div className="px-4 py-2 text-sm text-red-500">
											{errorDrivers}
										</div>
									) : availableDrivers.length > 0 ? (
										availableDrivers.map((driver: UsuarioTenant) => (
											<SelectItem key={driver.id} value={driver.id.toString()}>
												{driver.usuario?.username || `Conductor #${driver.id}`}
											</SelectItem>
										))
									) : (
										<div className="px-4 py-2 text-sm text-gray-500">
											No hay conductores disponibles
										</div>
									)}
								</SelectContent>
							</Select>
							<FormMessage />
						</FormItem>
					)}
				/>{" "}
				{/* Campo Ayudante - OPCIONAL */}
				<FormField
					control={form.control}
					name="ayudanteId"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Ayudante (Opcional)</FormLabel>
							<Select onValueChange={field.onChange} value={field.value || ""}>
								<FormControl>
									<SelectTrigger>
										<SelectValue placeholder="Seleccionar ayudante" />
									</SelectTrigger>
								</FormControl>
								<SelectContent>
									<SelectItem value="">Sin ayudante asignado</SelectItem>
									{loadingHelpers ? (
										<div className="px-4 py-2 text-sm text-gray-500">
											Cargando ayudantes...
										</div>
									) : errorHelpers ? (
										<div className="px-4 py-2 text-sm text-red-500">
											{errorHelpers}
										</div>
									) : availableHelpers.length > 0 ? (
										availableHelpers.map((helper: UsuarioTenant) => (
											<SelectItem key={helper.id} value={helper.id.toString()}>
												{helper.usuario?.username || `Ayudante #${helper.id}`}
											</SelectItem>
										))
									) : (
										<div className="px-4 py-2 text-sm text-gray-500">
											No hay ayudantes disponibles
										</div>
									)}
								</SelectContent>
							</Select>
							<FormMessage />
						</FormItem>
					)}
				/>
				{/* Campo Estado - Con default PROGRAMADO */}
				<FormField
					control={form.control}
					name="estado"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Estado</FormLabel>
							<Select onValueChange={field.onChange} value={field.value}>
								<FormControl>
									<SelectTrigger>
										<SelectValue placeholder="Seleccionar estado" />
									</SelectTrigger>
								</FormControl>
								<SelectContent>
									<SelectItem value="PROGRAMADO">Programado</SelectItem>
									<SelectItem value="EN_RUTA">En Ruta</SelectItem>
									<SelectItem value="COMPLETADO">Completado</SelectItem>
									<SelectItem value="CANCELADO">Cancelado</SelectItem>
									<SelectItem value="RETRASADO">Retrasado</SelectItem>
								</SelectContent>
							</Select>
							<FormMessage />
						</FormItem>
					)}
				/>
				{/* Campo Observaciones - OPCIONAL */}
				<FormField
					control={form.control}
					name="observaciones"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Observaciones (Opcional)</FormLabel>
							<FormControl>
								<Textarea
									{...field}
									placeholder="Ej: Viaje regular matutino"
									value={field.value || ""}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				{/* Campo Generación - Con default MANUAL */}
				<FormField
					control={form.control}
					name="generacion"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Tipo de Generación</FormLabel>
							<Select onValueChange={field.onChange} value={field.value}>
								<FormControl>
									<SelectTrigger>
										<SelectValue placeholder="Seleccionar tipo de generación" />
									</SelectTrigger>
								</FormControl>
								<SelectContent>
									<SelectItem value="MANUAL">Manual</SelectItem>
									<SelectItem value="AUTOMATICA">Automática</SelectItem>
								</SelectContent>
							</Select>
							<FormMessage />
						</FormItem>
					)}
				/>
				<div className="flex justify-end">
					<Button type="submit">{trip ? "Actualizar" : "Crear"} Viaje</Button>
				</div>
			</form>
		</Form>
	);
};
