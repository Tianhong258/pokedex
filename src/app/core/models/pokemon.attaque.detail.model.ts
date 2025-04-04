export interface AttaqueDetail {
    type ?: {
        name ?: string;
    }
    power ?: number;
    accuracy ?: number;
    damage_class?:{
        name ?: string;
    }
    id ?: number;
}