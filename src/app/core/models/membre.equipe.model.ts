export interface PokemonMembreEquipe{
    nomFrancais ?: string;
    id ?: number;
    generation ?: string;
    sprite ?: {
        other: {
            showdown: {
                front_default: string;
            }
        }
    }
}