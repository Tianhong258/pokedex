import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { Pokemon } from '../models/pokemon.model';

@Injectable({
  providedIn: 'root'
})
export class AccueilService {
  private readonly apiUrl = 'https://pokeapi.co/api/v2/pokemon'

  constructor(private readonly http: HttpClient) { }

  getListPokemons(pageIndex: number, limit: number): Observable<Pokemon[]> {
    const result  = new BehaviorSubject<Pokemon[]>([]); 
    this.http.get<PaginedPokemonList>(`${this.apiUrl}/?offset=${pageIndex*limit}&limit=${limit}`).subscribe({
      next: (paginedPokemonList: PaginedPokemonList) => {
        let listPokemons: Pokemon[] = [];
        paginedPokemonList.results.forEach((pokemonPagined) => {
          this.http.get<Pokemon>(pokemonPagined.url).subscribe({
            next: (pokemon: Pokemon) => {
              listPokemons.push(pokemon);
              listPokemons = listPokemons.sort((a: Pokemon, b: Pokemon) => {return a.id - b.id;})
              result.next(listPokemons);
            },
            error: () => {
              console.error(`Erreur de récupération sur l'endpoint ${pokemonPagined.url}`)
            }
          });
        });
      },
      error: () => {
        console.error(`Erreur de récupération de la page ${pageIndex} des Pokémons (taille de page ${limit})`)
      }
    });
    return result;
  }

  getNomberPokemon() : any {
    return this.http.get<any>(`${this.apiUrl}`)
  }

  getTousNomsPokemon(): Observable<string[]> {
    return this.http.get<any>(`${this.apiUrl}/?limit=1302`).pipe(
      map((paginedPokemonList: PaginedPokemonList) => {
        return paginedPokemonList.results.map((pokemon) => pokemon.name);
      })
    )
  }
 

  getListPokemonsByType(typeFilter: string): BehaviorSubject<Pokemon[]> {
    let filterPageIndex = 0;
    let listPokemonsMatchingGen: Pokemon[] = [];
    const result  = new BehaviorSubject<Pokemon[]>([]); 
      this.http.get<any>(`https://pokeapi.co/api/v2/type/${typeFilter}`).subscribe({
        next: (type) => {
          console.warn(type)
          type.pokemon.forEach((pokemonMatchingType: { pokemon: {name: string}}) => {
            this.http.get<Pokemon>(`https://pokeapi.co/api/v2/pokemon/${pokemonMatchingType.pokemon.name}`).subscribe({
              next: (pokemon: Pokemon) => {
                listPokemonsMatchingGen.push(pokemon);
                listPokemonsMatchingGen = listPokemonsMatchingGen.sort((a: Pokemon, b: Pokemon) => {return a.id - b.id;})
                result.next(listPokemonsMatchingGen);
              },
              error: () => {
                console.error(`Erreur de récupération sur l'endpoint https://pokeapi.co/api/v2/pokemon/${pokemonMatchingType.pokemon.name}`)
              }
            });
          });
        },
        error: () => {
          console.error(`Erreur de récupération du type spécifié`)
        }
      });
      filterPageIndex++;
    return result;
  }

  getListPokemonsByGeneration(genFilter: string): BehaviorSubject<Pokemon[]> {
    let filterPageIndex = 0;
    let listPokemonsMatchingGen: Pokemon[] = [];
    const result  = new BehaviorSubject<Pokemon[]>([]); 
      this.http.get<any>(`https://pokeapi.co/api/v2/generation/${genFilter}`).subscribe({
        next: (generation) => {
          generation.pokemon_species.forEach((pokemonMatchingGen: {name: string}) => {
            this.http.get<Pokemon>(`https://pokeapi.co/api/v2/pokemon/${pokemonMatchingGen.name}`).subscribe({
              next: (pokemon: Pokemon) => {        
                listPokemonsMatchingGen.push(pokemon);
                listPokemonsMatchingGen = listPokemonsMatchingGen.sort((a: Pokemon, b: Pokemon) => {return a.id - b.id;})
                result.next(listPokemonsMatchingGen);
              },
              error: () => {
                console.error(`Erreur de récupération sur l'endpoint https://pokeapi.co/api/v2/pokemon/${pokemonMatchingGen.name}`)
              }
            });
          });
        },
        error: () => {
          console.error(`Erreur de récupération de la génération spécifiée`)
        }
      });
      filterPageIndex++;
    return result;
  }

}

export interface PaginedPokemonList {
  results: {
    name: string;
    url: string;
  }[];

}
 