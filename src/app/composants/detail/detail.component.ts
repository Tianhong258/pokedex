import { Component, OnInit, signal } from '@angular/core';
import { DetailService } from '../../core/services/detail.service';
import { PokemonDetail } from '../../core/models/pokemon.detail.model';
import { ActivatedRoute } from '@angular/router';
import { AttaqueDetail } from '../../core/models/pokemon.attaque.detail.model';
import {MatTableModule} from '@angular/material/table';
import {MatCardModule} from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import { Pokemon } from '../../core/models/pokemon.model';
import {MatExpansionModule} from '@angular/material/expansion';
import { EvolutionComponent } from '../evolution/evolution.component';
import { NavbarComponent } from "../navbar/navbar.component";


@Component({
  selector: 'app-detail',
  imports: [MatTableModule, MatCardModule, MatButtonModule, MatProgressBarModule, MatExpansionModule, EvolutionComponent, NavbarComponent],
  templateUrl: './detail.component.html',
  styleUrl: './detail.component.css',
})
export class DetailComponent implements OnInit{
  readonly panelOpenState = signal(false);
  titre1 : string = "";
  titre2 : string = "";
   pokemonChaineListe : Pokemon[] = [];
   pokemon : PokemonDetail = {};
   id : number = -1;
   movepoke : any[] = [];
  pokemonAttaqueDetail : AttaqueDetail = {};
   dataSource=this.pokemon.attaques;
   urlChaine : string = "";
   colonesTableAttaque : string[] = ["name", "type", "puissance", "precision", "physiqueOuSpecial"];
  nomStatistique : string[] = ["PV", "Attaque", "Défense","Attaque Spéciale", "Défense Spéciale", "Vitesse"];
  constructor(
     private readonly detailService: DetailService,
     private readonly activatedRoute : ActivatedRoute
   ){}

   ngOnInit(): void {
    this.id = this.activatedRoute.snapshot.params['id'];
    this.detailService.getDetailPokemon(this.id).subscribe({
      next:(value : any) => {
        this.pokemon.id = value.id;
        this.pokemon.types = value.types;
        this.pokemon.sprite = value.sprites;
        this.pokemon.attaques = value.moves;
        this.pokemon.statistiques = value.stats;
        this.movepoke = value.moves;
        this.titre1 = value.id;
      },
      error:(err : any) => {
        console.error("Impossible de trouver les détails du pokémon : " + err);
      }
    })
    this.detailService.getSpecies(this.id).subscribe({
      next:(value : any) => {
        this.pokemon.nomFrancais = value.names[4].name;
        this.pokemon.nomJaponais = value.names[0].name;
        this.pokemon.nomChinois = value.names[10].name;
        this.pokemon.generation = value.generation.name;
        this.pokemon.description = value.flavor_text_entries[18].flavor_text;
        this.urlChaine = value.evolution_chain.url;
        this.titre2 = " - " + value.names[4].name;
      },
      error:(err : any) => {
        console.error("Impossible de trouver les précisions du pokémon : " + err);
      }
    })
  }
  afficherAttaque(i : number){
    this.panelOpenState.set(true);
      this.detailService.getDetailAttaques(this.movepoke[i].move.name).subscribe({
        next:(value : any) => {
          this.pokemonAttaqueDetail = value;
          console.log("get détail d'attaque");
          if(this.pokemon.attaques){
            this.pokemon.attaques[i].attaquesDetail = this.pokemonAttaqueDetail;
          }
        },
        error:(err : any) => {
          console.error("Impossible de trouver les attaques du pokémon : " + err);
        }
      })
    }
}
