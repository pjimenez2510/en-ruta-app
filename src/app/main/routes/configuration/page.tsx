'use client';

import React, { useState } from 'react';
import { Card, CardContent } from '@/shared/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';
import ProgramacionesTab from './components/ProgramacionesTab';
import SegmentosTab from './components/SegmentosTab';
import HorariosTab from './components/HorariosTab';

type TabType = 'programaciones' | 'segmentos' | 'horarios';

export default function ConfigurationPage() {
    const [activeTab, setActiveTab] = useState<TabType>('programaciones');

    const handleTabChange = (value: string) => {
        setActiveTab(value as TabType);
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
                            <ProgramacionesTab />
                        </TabsContent>

                        <TabsContent value="segmentos">
                            <SegmentosTab />
                        </TabsContent>

                        <TabsContent value="horarios">
                            <HorariosTab />
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>
        </div>
    );
}