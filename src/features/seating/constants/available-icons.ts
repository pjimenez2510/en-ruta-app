import {
    Armchair,
    BedDouble,
    BedSingle,
    Sofa
} from 'lucide-react';

export const AVAILABLE_ICONS = {
    Armchair: Armchair,
    BedDouble: BedDouble,
    BedSingle: BedSingle,
    Sofa: Sofa
} as const;

export type IconName = keyof typeof AVAILABLE_ICONS; 