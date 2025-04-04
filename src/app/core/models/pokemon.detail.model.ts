import { AttaqueDetail } from "./pokemon.attaque.detail.model";

export interface PokemonDetail{
        nomFrancais ?: string;
        nomJaponais ?: string;
        nomChinois ?: string;
    id ?: number;
    types ?: {
         type?: {
            name ?: string;
        }
    }[];
    description ?:string;
    generation ?: string;
    sprite ?: {
        back_default?: string;
        back_female?: string;
        back_shiny?: string;
        back_shiny_female?: string;
        front_default?: string;
        front_female?: string;
        front_shiny?: string;
        front_shiny_female?: string;
        other: {
            showdown: {
                front_default: string;
            }
        }
    };
    statistiques?:{
        base_stat : number;
        stat ?:{
            name?: string;
        }
    }[];
    attaques ?: {
        move ?: {
            id ?: number;
            name ?: string;
        };
        attaquesDetail ?: AttaqueDetail;
    }[];
}
