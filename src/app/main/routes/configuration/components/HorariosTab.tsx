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

interface Segmento {
    id: string;
    nombre: string;
    distancia: string;
    tiempo: string;
    tarifa: string;
    estado: string;
}

export default function HorariosTab() {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<Segmento | null>(null);
    const [formData, setFormData] = useState<Partial<Segmento>>({});

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

    const handleEdit = (seg: Segmento) => {
        setEditingItem(seg);
        setFormData(seg);
        setIsDialogOpen(true);
    };

    const handleDelete = (id: string) => {
        setSegmentos(prev => prev.filter(item => item.id !== id));
    };

    const handleSave = () => {
        const newId = editingItem ? editingItem.id : `SEG${Date.now()}`;
        const newItem = { ...formData, id: newId } as Segmento;

        if (editingItem) {
            setSegmentos(prev => prev.map(item => item.id === editingItem.id ? newItem : item));
        } else {
            setSegmentos(prev => [...prev, newItem]);
        }

        setIsDialogOpen(false);
        setFormData({});
        setEditingItem(null);
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Segmentos de Ruta</h3>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button className="w-full sm:w-auto">
                            <PlusCircle className="mr-2 h-4 w-4" />
                            Nuevo Segmento
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
                                        onClick={() => handleEdit(seg)}
                                    >
                                        <Edit className="w-4 h-4" />
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleDelete(seg.id)}
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
