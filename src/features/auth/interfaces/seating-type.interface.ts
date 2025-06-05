export interface SeatingTypes {
    tenantId: number;
    nombre: string;
    description: string;
    color: string;
    icono: string;
    activo: string
    id: number
}

export interface SeatingTypesUpdate extends Partial<SeatingTypes> {
    id: number;
}

export interface SeatingTypesCreate extends Omit<SeatingTypes, 'id'> { }