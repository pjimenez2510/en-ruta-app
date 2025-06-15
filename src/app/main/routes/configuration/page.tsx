'use client';

import React, { useState } from 'react';
import { Card, CardContent } from '@/shared/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';
import ParadasTab from './components/ParadasTab';
import { HorariosTab } from './components/HorariosTab';

type TabType = 'paradas' | 'horarios';

export default function ConfigurationPage() {
    const [activeTab, setActiveTab] = useState<TabType>('paradas');

    const handleTabChange = (value: string) => {
        setActiveTab(value as TabType);
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">Configuración de la Ruta</h1>
                <p className="text-muted-foreground">
                    Complete la información sobre Paradas y Horarios de la ruta.
                </p>
            </div>

            <Card>
                <CardContent className="p-6">
                    <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="paradas">Paradas</TabsTrigger>
                            <TabsTrigger value="horarios">Horarios</TabsTrigger>
                        </TabsList>

                        <TabsContent value="paradas">
                            <ParadasTab ruta={{ id: 0, nombre: 'Ejemplo de Ruta', resolucionId: 0, activo: false }} />
                        </TabsContent>

                        <TabsContent value="horarios">
                            <HorariosTab ruta={{ id: 0, nombre: 'Ejemplo de Ruta', resolucionId: 0, activo: false }} />
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>
        </div>
    );
}