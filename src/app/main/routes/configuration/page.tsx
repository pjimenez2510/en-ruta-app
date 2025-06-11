'use client';

import React, { useState } from 'react';
import { Button } from "@/shared/components/ui/button"
import { Card, CardContent } from '@/shared/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/components/ui/table"
import { Badge } from '@/shared/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/shared/components/ui/dialog';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select';
import { Plus, Edit, Trash2, PlusCircle } from 'lucide-react';

interface Programacion {
    id: string;
    origen: string;
    destino: string;
    hora: string;
    salida: string;
}

interface Segmento
{
	id: string;
	nombre: string;
	distancia: string;
	tiempo: string;
	tarifa: string;
	estado: string;
}

interface Horario
{
	id: string;
	ruta: string;
	horaInicio: string;
	horaFin: string;
	frecuencia: string;
	tipo: string;
	estado: string;
}

type ItemType = 'programaciones' | 'segmentos' | 'horarios';

type FormData = Partial<Programacion & Segmento & Horario>;

interface EditingItem extends FormData
{
	type: ItemType;
}

export default function ConfigurationPage() {
    const [activeTab, setActiveTab] = useState<ItemType>('programaciones');
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<EditingItem | null>(null);
    const [currentItemType, setCurrentItemType] = useState<ItemType>('programaciones');
    const [formData, setFormData] = useState<FormData>({});

    const [programaciones, setProgramaciones] = useState<Programacion[]>([
        {
            id: 'RUTA001',
            origen: 'Ambato',
            destino: 'Quito',
            hora: '08:00',
            salida: '08:30'
        },
        {
            id: 'RUTA002',
            origen: 'Guayaquil',
            destino: 'Quito',
            hora: '09:00',
            salida: '09:30'
        }
    ]);
    
    const [segmentos, setSegmentos] = useState<Segmento[]>([
		{
			id: 'SEG001',
			nombre: 'Ambato - Latacunga',
			distancia: '45 km',
			tiempo: '45 min',
			tarifa: '$2.50',
			estado: 'Activo'
		},
		{
			id: 'SEG002',
			nombre: 'Latacunga - Quito',
			distancia: '89 km',
			tiempo: '1h 30m',
			tarifa: '$4.50',
			estado: 'Activo'
		}
	]);

	const [horarios, setHorarios] = useState<Horario[]>([
		{
			id: 'HOR001',
			ruta: 'Ambato - Quito',
			horaInicio: '06:00',
			horaFin: '22:00',
			frecuencia: '30 min',
			tipo: 'Diario',
			estado: 'Activo'
		},
		{
			id: 'HOR002',
			ruta: 'Ambato - Guayaquil',
			horaInicio: '07:00',
			horaFin: '20:00',
			frecuencia: '45 min',
			tipo: 'Diario',
			estado: 'Activo'
		}
	]);

	const handleAdd = () =>
	{
		setEditingItem(null);
		setFormData({});
		setCurrentItemType(activeTab);
		setIsDialogOpen(true);
	};

	const handleEdit = (item: Programacion | Segmento | Horario, type: ItemType) =>
	{
		setEditingItem({ ...item, type });
		setFormData(item);
		setCurrentItemType(type);
		setIsDialogOpen(true);
	};

	const handleDelete = (id: string, type: ItemType) =>
	{
		if (type === 'programaciones')
		{
			setProgramaciones(prev => prev.filter(item => item.id !== id));
		} else if (type === 'segmentos')
		{
			setSegmentos(prev => prev.filter(item => item.id !== id));
		} else if (type === 'horarios')
		{
			setHorarios(prev => prev.filter(item => item.id !== id));
		}
	};

	const handleSave = () =>
	{
		const newId = editingItem ? editingItem.id : `${currentItemType.toUpperCase()}${Date.now()}`;
		const newItem = { ...formData, id: newId };

		if (currentItemType === 'programaciones')
		{
			if (editingItem)
			{
				setProgramaciones(prev => prev.map(item => item.id === editingItem.id ? newItem as Programacion : item));
			} else
			{
				setProgramaciones(prev => [...prev, newItem as Programacion]);
			}
		} else if (currentItemType === 'segmentos')
		{
			if (editingItem)
			{
				setSegmentos(prev => prev.map(item => item.id === editingItem.id ? newItem as Segmento : item));
			} else
			{
				setSegmentos(prev => [...prev, newItem as Segmento]);
			}
		} else if (currentItemType === 'horarios')
		{
			if (editingItem)
			{
				setHorarios(prev => prev.map(item => item.id === editingItem.id ? newItem as Horario : item));
			} else
			{
				setHorarios(prev => [...prev, newItem as Horario]);
			}
		}

		setIsDialogOpen(false);
		setFormData({});
		setEditingItem(null);
	};

	const renderForm = () =>
	{
		if (currentItemType === 'programaciones')
		{
			return (
				<div className="grid gap-4">
					<div className="grid grid-cols-2 gap-4">
						<div>
							<Label htmlFor="origen">Origen</Label>
							<Input
								id="origen"
								value={formData.origen || ''}
								onChange={(e) => setFormData({ ...formData, origen: e.target.value })}
								placeholder="Ciudad de origen"
							/>
						</div>
						<div>
							<Label htmlFor="destino">Destino</Label>
							<Input
								id="destino"
								value={formData.destino || ''}
								onChange={(e) => setFormData({ ...formData, destino: e.target.value })}
								placeholder="Ciudad de destino"
							/>
						</div>
					</div>
					<div className="grid grid-cols-2 gap-4">
						<div>
							<Label htmlFor="hora">Hora</Label>
							<Input
								id="hora"
								type="time"
								value={formData.hora || ''}
								onChange={(e) => setFormData({ ...formData, hora: e.target.value })}
							/>
						</div>
						<div>
							<Label htmlFor="salida">Hora de Salida</Label>
							<Input
								id="salida"
								type="time"
								value={formData.salida || ''}
								onChange={(e) => setFormData({ ...formData, salida: e.target.value })}
							/>
						</div>
					</div>
				</div>
			);
		} else if (currentItemType === 'segmentos')
		{
			return (
				<div className="grid gap-4">
					<div>
						<Label htmlFor="nombre">Nombre del Segmento</Label>
						<Input
							id="nombre"
							value={formData.nombre || ''}
							onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
							placeholder="Ej: Ambato - Latacunga"
						/>
					</div>
					<div className="grid grid-cols-2 gap-4">
						<div>
							<Label htmlFor="distancia">Distancia</Label>
							<Input
								id="distancia"
								value={formData.distancia || ''}
								onChange={(e) => setFormData({ ...formData, distancia: e.target.value })}
								placeholder="Ej: 45 km"
							/>
						</div>
						<div>
							<Label htmlFor="tiempo">Tiempo</Label>
							<Input
								id="tiempo"
								value={formData.tiempo || ''}
								onChange={(e) => setFormData({ ...formData, tiempo: e.target.value })}
								placeholder="Ej: 45 min"
							/>
						</div>
					</div>
					<div className="grid grid-cols-2 gap-4">
						<div>
							<Label htmlFor="tarifa">Tarifa</Label>
							<Input
								id="tarifa"
								value={formData.tarifa || ''}
								onChange={(e) => setFormData({ ...formData, tarifa: e.target.value })}
								placeholder="Ej: $2.50"
							/>
						</div>
						<div>
							<Label htmlFor="estado">Estado</Label>
							<Select
								value={formData.estado || ''}
								onValueChange={(value) => setFormData({ ...formData, estado: value })}
							>
								<SelectTrigger>
									<SelectValue placeholder="Seleccionar estado" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="Activo">Activo</SelectItem>
									<SelectItem value="Inactivo">Inactivo</SelectItem>
								</SelectContent>
							</Select>
						</div>
					</div>
				</div>
			);
		} else if (currentItemType === 'horarios')
		{
			return (
				<div className="grid gap-4">
					<div>
						<Label htmlFor="ruta">Ruta</Label>
						<Input
							id="ruta"
							value={formData.ruta || ''}
							onChange={(e) => setFormData({ ...formData, ruta: e.target.value })}
							placeholder="Ej: Ambato - Quito"
						/>
					</div>
					<div className="grid grid-cols-2 gap-4">
						<div>
							<Label htmlFor="horaInicio">Hora Inicio</Label>
							<Input
								id="horaInicio"
								type="time"
								value={formData.horaInicio || ''}
								onChange={(e) => setFormData({ ...formData, horaInicio: e.target.value })}
							/>
						</div>
						<div>
							<Label htmlFor="horaFin">Hora Fin</Label>
							<Input
								id="horaFin"
								type="time"
								value={formData.horaFin || ''}
								onChange={(e) => setFormData({ ...formData, horaFin: e.target.value })}
							/>
						</div>
					</div>
					<div className="grid grid-cols-2 gap-4">
						<div>
							<Label htmlFor="frecuencia">Frecuencia</Label>
							<Input
								id="frecuencia"
								value={formData.frecuencia || ''}
								onChange={(e) => setFormData({ ...formData, frecuencia: e.target.value })}
								placeholder="Ej: 30 min"
							/>
						</div>
						<div>
							<Label htmlFor="tipo">Tipo</Label>
							<Select
								value={formData.tipo || ''}
								onValueChange={(value) => setFormData({ ...formData, tipo: value })}
							>
								<SelectTrigger>
									<SelectValue placeholder="Seleccionar tipo" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="Diario">Diario</SelectItem>
									<SelectItem value="Semanal">Semanal</SelectItem>
									<SelectItem value="Especial">Especial</SelectItem>
								</SelectContent>
							</Select>
						</div>
					</div>
					<div>
						<Label htmlFor="estado">Estado</Label>
						<Select
							value={formData.estado || ''}
							onValueChange={(value) => setFormData({ ...formData, estado: value })}
						>
							<SelectTrigger>
								<SelectValue placeholder="Seleccionar estado" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="Activo">Activo</SelectItem>
								<SelectItem value="Inactivo">Inactivo</SelectItem>
							</SelectContent>
						</Select>
					</div>
				</div>
			);
		}
	};

	const handleTabChange = (value: string) =>
	{
		setActiveTab(value as ItemType);
	};

	return (
		<div className="space-y-6">
			<div>
				<h1 className="text-2xl font-bold tracking-tight">Configuración de la Ruta</h1>
				<p className="text-muted-foreground">
					Complete la información sobre Programaciones, Segmentos y Horarios de la ruta.
				</p>
			</div>

			<Card>
				<CardContent className="p-6">
					<Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
						<TabsList className="grid w-full grid-cols-3">
							<TabsTrigger value="programaciones">Programaciones</TabsTrigger>
							<TabsTrigger value="segmentos">Segmentos</TabsTrigger>
							<TabsTrigger value="horarios">Horarios</TabsTrigger>
						</TabsList>

						<TabsContent value="programaciones">
							<div className="space-y-4">
								<div className="flex justify-between items-center">
									<h3 className="text-lg font-medium">Programaciones de Rutas</h3>
									<Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
										<DialogTrigger asChild>
											<Button className="w-full sm:w-auto">
												<PlusCircle className="mr-2 h-4 w-4" />
												Nueva Programación
											</Button>
										</DialogTrigger>
										<DialogContent className="sm:max-w-[500px]">
											<DialogHeader>
												<DialogTitle>
													{editingItem ? 'Editar Programación' : 'Nueva Programación'}
												</DialogTitle>
												<DialogDescription>
													{editingItem ? 'Modifica los datos de la programación' : 'Completa la información de la nueva programación'}
												</DialogDescription>
											</DialogHeader>
											{renderForm()}
											<DialogFooter>
												<Button variant="outline" onClick={() => setIsDialogOpen(false)}>
													Cancelar
												</Button>
												<Button onClick={handleSave}>
													{editingItem ? 'Guardar Cambios' : 'Crear Programación'}
												</Button>
											</DialogFooter>
										</DialogContent>
									</Dialog>
								</div>

								<Table>
									<TableHeader>
										<TableRow>
											<TableHead>ID</TableHead>
											<TableHead>Origen</TableHead>
											<TableHead>Destino</TableHead>
											<TableHead>Hora</TableHead>
											<TableHead>Hora de Salida</TableHead>
											<TableHead>Acciones</TableHead>
										</TableRow>
									</TableHeader>
									<TableBody>
										{programaciones.map((prog) => (
											<TableRow key={prog.id}>
												<TableCell className="font-medium">{prog.id}</TableCell>
												<TableCell>{prog.origen}</TableCell>
												<TableCell>{prog.destino}</TableCell>
												<TableCell>{prog.hora}</TableCell>
												<TableCell>{prog.salida}</TableCell>
												<TableCell>
													<div className="flex space-x-2">
														<Button
															variant="outline"
															size="sm"
															onClick={() => handleEdit(prog, 'programaciones')}
														>
															<Edit className="w-4 h-4" />
														</Button>
														<Button
															variant="outline"
															size="sm"
															onClick={() => handleDelete(prog.id, 'programaciones')}
														>
															<Trash2 className="w-4 h-4" />
														</Button>
													</div>
												</TableCell>
											</TableRow>
										))}
									</TableBody>
								</Table>
							</div>
						</TabsContent>

						<TabsContent value="segmentos">
							<div className="space-y-4">
								<div className="flex justify-between items-center">
									<h3 className="text-lg font-medium">Segmentos de Ruta</h3>
									<Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
										<DialogTrigger asChild>
											<Button className="w-full sm:w-auto">
												<PlusCircle className="mr-2 h-4 w-4" />
												Nueva Ruta
											</Button>
										</DialogTrigger>
										<DialogContent className="sm:max-w-[500px]">
											<DialogHeader>
												<DialogTitle>
													{editingItem ? 'Editar Segmento' : 'Nuevo Segmento'}
												</DialogTitle>
												<DialogDescription>
													{editingItem ? 'Modifica los datos del segmento' : 'Completa la información del nuevo segmento'}
												</DialogDescription>
											</DialogHeader>
											{renderForm()}
											<DialogFooter>
												<Button variant="outline" onClick={() => setIsDialogOpen(false)}>
													Cancelar
												</Button>
												<Button onClick={handleSave}>
													{editingItem ? 'Guardar Cambios' : 'Crear Segmento'}
												</Button>
											</DialogFooter>
										</DialogContent>
									</Dialog>
								</div>

								<Table>
									<TableHeader>
										<TableRow>
											<TableHead>ID</TableHead>
											<TableHead>Nombre</TableHead>
											<TableHead>Distancia</TableHead>
											<TableHead>Tiempo</TableHead>
											<TableHead>Tarifa</TableHead>
											<TableHead>Estado</TableHead>
											<TableHead>Acciones</TableHead>
										</TableRow>
									</TableHeader>
									<TableBody>
										{segmentos.map((seg) => (
											<TableRow key={seg.id}>
												<TableCell className="font-medium">{seg.id}</TableCell>
												<TableCell>{seg.nombre}</TableCell>
												<TableCell>{seg.distancia}</TableCell>
												<TableCell>{seg.tiempo}</TableCell>
												<TableCell>{seg.tarifa}</TableCell>
												<TableCell>
													<Badge variant={seg.estado === 'Activo' ? 'default' : 'secondary'}>
														{seg.estado}
													</Badge>
												</TableCell>
												<TableCell>
													<div className="flex space-x-2">
														<Button
															variant="outline"
															size="sm"
															onClick={() => handleEdit(seg, 'segmentos')}
														>
															<Edit className="w-4 h-4" />
														</Button>
														<Button
															variant="outline"
															size="sm"
															onClick={() => handleDelete(seg.id, 'segmentos')}
														>
															<Trash2 className="w-4 h-4" />
														</Button>
													</div>
												</TableCell>
											</TableRow>
										))}
									</TableBody>
								</Table>
							</div>
						</TabsContent>

						<TabsContent value="horarios">
							<div className="space-y-4">
								<div className="flex justify-between items-center">
									<h3 className="text-lg font-medium">Horarios de Operación</h3>
									<Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
										<DialogTrigger asChild>
											<Button className="w-full sm:w-auto">
												<PlusCircle className="mr-2 h-4 w-4" />
												Nueva Ruta
											</Button>
										</DialogTrigger>
										<DialogContent className="sm:max-w-[500px]">
											<DialogHeader>
												<DialogTitle>
													{editingItem ? 'Editar Horario' : 'Nuevo Horario'}
												</DialogTitle>
												<DialogDescription>
													{editingItem ? 'Modifica los datos del horario' : 'Completa la información del nuevo horario'}
												</DialogDescription>
											</DialogHeader>
											{renderForm()}
											<DialogFooter>
												<Button variant="outline" onClick={() => setIsDialogOpen(false)}>
													Cancelar
												</Button>
												<Button onClick={handleSave}>
													{editingItem ? 'Guardar Cambios' : 'Crear Horario'}
												</Button>
											</DialogFooter>
										</DialogContent>
									</Dialog>
								</div>

								<Table>
									<TableHeader>
										<TableRow>
											<TableHead>ID</TableHead>
											<TableHead>Ruta</TableHead>
											<TableHead>Hora Inicio</TableHead>
											<TableHead>Hora Fin</TableHead>
											<TableHead>Frecuencia</TableHead>
											<TableHead>Tipo</TableHead>
											<TableHead>Estado</TableHead>
											<TableHead>Acciones</TableHead>
										</TableRow>
									</TableHeader>
									<TableBody>
										{horarios.map((hor) => (
											<TableRow key={hor.id}>
												<TableCell className="font-medium">{hor.id}</TableCell>
												<TableCell>{hor.ruta}</TableCell>
												<TableCell>{hor.horaInicio}</TableCell>
												<TableCell>{hor.horaFin}</TableCell>
												<TableCell>{hor.frecuencia}</TableCell>
												<TableCell>{hor.tipo}</TableCell>
												<TableCell>
													<Badge variant={hor.estado === 'Activo' ? 'default' : 'secondary'}>
														{hor.estado}
													</Badge>
												</TableCell>
												<TableCell>
													<div className="flex space-x-2">
														<Button
															variant="outline"
															size="sm"
															onClick={() => handleEdit(hor, 'horarios')}
														>
															<Edit className="w-4 h-4" />
														</Button>
														<Button
															variant="outline"
															size="sm"
															onClick={() => handleDelete(hor.id, 'horarios')}
														>
															<Trash2 className="w-4 h-4" />
														</Button>
													</div>
												</TableCell>
											</TableRow>
										))}
									</TableBody>
								</Table>
							</div>
						</TabsContent>
					</Tabs>
				</CardContent>
			</Card>
		</div>
	);
}