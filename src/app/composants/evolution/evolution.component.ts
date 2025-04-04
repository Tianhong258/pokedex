import { Component, Input, signal } from '@angular/core';
import { DetailService } from '../../core/services/detail.service';
import { Pokemon } from '../../core/models/pokemon.model';
import { MatCardModule } from '@angular/material/card';
import { MatExpansionModule } from '@angular/material/expansion';

@Component({
  selector: 'app-evolution',
  imports: [ MatCardModule, MatExpansionModule],
  templateUrl: './evolution.component.html',
  styleUrl: './evolution.component.css'
})
export class EvolutionComponent {
  @Input() urlChaine !: string;
  readonly panelOpenState = signal(false);
  pokemonChaineListe : Pokemon[] = [];
  constructor(
    private readonly detailService: DetailService
  ){}
  afficheEvolution() {
    this.panelOpenState.set(true);
    if(this.urlChaine){
      this.detailService.getChaineEvolution(this.urlChaine).subscribe({
        next:(value : any) => {
          console.log("get chaine évolution");
          let poke3 : string = value.chain?.evolves_to[0]?.evolves_to[0]?.species?.name;
          let poke2 : string = value.chain?.evolves_to[0]?.species?.name;
          let poke1 : string = value.chain?.species?.name;
          let listePoke : string[] = [];
          listePoke.push(poke1);
          listePoke.push(poke2);
          listePoke.push(poke3);
          for (let i = 0; i < listePoke.length; i++) {
            this.detailService.getDetailPokemonParNom(listePoke[i]).subscribe({
              next: (value: any) => {
                this.pokemonChaineListe[i] = value;
              },
              error: (err: any) => {
                console.error('Impossible de trouver des détails du Pokémon:', err);
              }
            });
          }
        },
        error:(err : any) => {
          console.error("Impossible de trouver la chaine évolution du pokémon : " + err);
        }
      });
  }

}
  }

