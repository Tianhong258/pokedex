import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PokemonDetail } from '../models/pokemon.detail.model';
import { Observable } from 'rxjs';
import { Pokemon } from '../models/pokemon.model';

@Injectable({
  providedIn: 'root'
})
export class DetailService {

  constructor(private readonly http: HttpClient) { }
  getDetailPokemon(param: number) : Observable<PokemonDetail>{
    return this.http.get<PokemonDetail>(`https://pokeapi.co/api/v2/pokemon/${param}`);
  }
  getDetailPokemonParNom(param: string) : Observable<Pokemon>{
    return this.http.get<Pokemon>(`https://pokeapi.co/api/v2/pokemon/${param}`);
  }
  getSpecies(param: number) : Observable<any>{
    return this.http.get<any>(`https://pokeapi.co/api/v2/pokemon-species/${param}`);
  }
  getDetailAttaques(param: any) : Observable<any>{
    return this.http.get<any>(`https://pokeapi.co/api/v2/move/${param}`);
  }
  getChaineEvolution(param : string) : Observable<any>{
    return this.http.get<any>(`${param}`);
  }
}
