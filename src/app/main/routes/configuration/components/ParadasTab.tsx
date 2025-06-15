'use client';

import React, { useState } from 'react';
import { Button } from "@/shared/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/shared/components/ui/dialog';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { PlusCircle, Edit, Trash2 } from 'lucide-react';

interface Programacion {
    id: string;
    origen: string;
    destino: string;
    hora: string;
    salida: string;
}

export default function ParadasTab() {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<Programacion | null>(null);
    const [formData, setFormData] = useState<Partial<Programacion>>({});

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

    const handleEdit = (prog: Programacion) => {
        setEditingItem(prog);
        setFormData(prog);
        setIsDialogOpen(true);
    };

    const handleDelete = (id: string) => {
        setProgramaciones(prev => prev.filter(item => item.id !== id));
    };

    const handleSave = () => {
        const newId = editingItem ? editingItem.id : `PROG${Date.now()}`;
        const newItem = { ...formData, id: newId } as Programacion;

        if (editingItem) {
            setProgramaciones(prev => prev.map(item => item.id === editingItem.id ? newItem : item));
        } else {
            setProgramaciones(prev => [...prev, newItem]);
        }

        setIsDialogOpen(false);
        setFormData({});
        setEditingItem(null);
    };

    return (
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
                                        onClick={() => handleEdit(prog)}
                                    >
                                        <Edit className="w-4 h-4" />
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleDelete(prog.id)}
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
