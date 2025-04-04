export interface Pokemon{
    id : number;
    name ?: string;
    sprites: {
        other: {
            showdown: {
                front_default: string
            }
        }
    }
}