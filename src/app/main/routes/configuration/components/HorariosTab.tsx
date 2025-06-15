'use client';

import React, { useState } from 'react';
import { Button } from "@/shared/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/components/ui/table";
import { Badge } from '@/shared/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/shared/components/ui/dialog';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select';
import { PlusCircle, Edit, Trash2 } from 'lucide-react';

interface Horario {
    id: string;
    ruta: string;
    horaInicio: string;
    horaFin: string;
    frecuencia: string;
    tipo: string;
    estado: string;
}

export default function HorariosTab() {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<Horario | null>(null);
    const [formData, setFormData] = useState<Partial<Horario>>({});

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

    const handleEdit = (hor: Horario) => {
        setEditingItem(hor);
        setFormData(hor);
        setIsDialogOpen(true);
    };

    const handleDelete = (id: string) => {
        setHorarios(prev => prev.filter(item => item.id !== id));
    };

    const handleSave = () => {
        const newId = editingItem ? editingItem.id : `HOR${Date.now()}`;
        const newItem = { ...formData, id: newId } as Horario;

        if (editingItem) {
            setHorarios(prev => prev.map(item => item.id === editingItem.id ? newItem : item));
        } else {
            setHorarios(prev => [...prev, newItem]);
        }

        setIsDialogOpen(false);
        setFormData({});
        setEditingItem(null);
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Horarios de Operación</h3>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button className="w-full sm:w-auto">
                            <PlusCircle className="mr-2 h-4 w-4" />
                            Nuevo Horario
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
                                        onClick={() => handleEdit(hor)}
                                    >
                                        <Edit className="w-4 h-4" />
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleDelete(hor.id)}
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
    );
}
