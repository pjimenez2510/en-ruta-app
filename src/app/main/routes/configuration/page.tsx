'use client';

import React, { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ParadasTab from './components/ParadasTab';
import { HorariosTab } from './components/HorariosTab';

type TabType = 'paradas' | 'horarios';

export default function ConfigurationPage() {
    const [activeTab, setActiveTab] = useState<TabType>('paradas');
    const searchParams = useSearchParams();
    const rutaId = searchParams.get('rutaId');
    
    // Convert rutaId to number and validate
    const rutaIdNumber = rutaId ? parseInt(rutaId, 10) : 0;

    const handleTabChange = (value: string) => {
        setActiveTab(value as TabType);
    };    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">Configuración de la Ruta</h1>
                <p className="text-muted-foreground">
                    Complete la información sobre Paradas y Horarios de la ruta.
                </p>
            </div>

            {!rutaId || rutaIdNumber <= 0 ? (
                <Card>
                    <CardContent className="p-6">
                        <div className="text-center py-8">
                            <p className="text-muted-foreground">
                                No se ha seleccionado una ruta válida. Por favor, vaya a la lista de rutas y seleccione Configurar Ruta.
                            </p>
                        </div>
                    </CardContent>
                </Card>
            ) : (
                <Card>
                    <CardContent className="p-6">
                        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
                            <TabsList className="grid w-full grid-cols-2">
                                <TabsTrigger value="paradas">Paradas</TabsTrigger>
                                <TabsTrigger value="horarios">Horarios</TabsTrigger>
                            </TabsList>                        <TabsContent value="paradas">
                                <ParadasTab ruta={{ id: rutaIdNumber, nombre: 'Ruta Seleccionada', resolucionId: 0, activo: true }} />
                            </TabsContent>

                            <TabsContent value="horarios">
                                <HorariosTab ruta={{ id: rutaIdNumber, nombre: 'Ruta Seleccionada', resolucionId: 0, activo: true }} />
                            </TabsContent>
                        </Tabs>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}