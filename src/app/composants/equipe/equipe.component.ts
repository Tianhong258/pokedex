import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormArray, FormGroup, ReactiveFormsModule, ValidationErrors, Validators, FormControl, FormsModule } from '@angular/forms';
import { AccueilService } from '../../core/services/accueil.service';
import { DetailService } from '../../core/services/detail.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { PokemonMembreEquipe } from '../../core/models/membre.equipe.model';
import { MatCardModule } from '@angular/material/card';
import { NavbarComponent } from "../navbar/navbar.component";

@Component({
  selector: 'app-equipe',
  imports: [ReactiveFormsModule, FormsModule, MatFormFieldModule, MatInputModule, MatFormFieldModule, MatInputModule, FormsModule, ReactiveFormsModule, MatCardModule, NavbarComponent],
  templateUrl: './equipe.component.html',
  styleUrl: './equipe.component.css',
})
export class EquipeComponent {
  equipeForm : FormGroup;
  tabPokemonNom : string [] = [];
  equipeNom : string[] = [];
  equipeUrl : string[] =[];
  membreEquipe : PokemonMembreEquipe = {};
  listeMembreEquipe : PokemonMembreEquipe[] = [];
  isConstruit : boolean = false;
  titre : string = "Construire Mon Equipe Pokémon"
  constructor(
    private readonly fb : FormBuilder,
    private readonly accueilService: AccueilService,
    private readonly detailService: DetailService
  ){
    this.equipeForm = this.fb.group({
        nomEquipe : ['', [Validators.required]],
        pseudo : ['',[Validators.required, Validators.maxLength(100)]],
        mail : ['', [Validators.required, Validators.email]],
        strategie : [''],
        pokemons : this.fb.array([])
      });
  }

  ngOnInit(): void {
    this.accueilService.getTousNomsPokemon().subscribe({
      next:(value : any) => {
        this.tabPokemonNom = value;
      },
      error:(err : any) => {
        console.error("Impossible de trouver la liste des noms : " + err);
      }
    })
  }

  get pokemons(): FormArray{
    return this.equipeForm.get('pokemons') as FormArray;
  }

  getPokemonValue(index: number): string {
    return this.pokemons.at(index).value;
  }

  pokemonNomValidator(pokemonNomValide: string[]) {
    return (control: AbstractControl): ValidationErrors | null => {
      this.detailService.getSpecies(control.value.toLowerCase()).subscribe({
        next:(value : any) => {
          this.membreEquipe.nomFrancais = value.names[4].name;
        },
        error:(err : any) => {
          console.error("Impossible de trouver les précisions de pokémon : " + err);
        }
      })
      this.detailService.getDetailPokemon(control.value.toLowerCase()).subscribe({
        next:(value : any) => {
          this.membreEquipe.sprite = value.sprites;
        },
        error:(err : any) => {
          console.error("Impossible de trouver les détails de pokémon : " + err);
        }
      })
      return pokemonNomValide.includes(control.value.toLowerCase()) ? null : { forbiddenNomPokemon : true };
    };
  }
  
  ajouterPokemon():void{
    this.membreEquipe = {};
    if(this.pokemons.length<6){
      this.pokemons.push(
      new FormControl("", [Validators.required, this.pokemonNomValidator(this.tabPokemonNom)])
    );
  }
  }

  supprimerPokemon(i : number){
    this.pokemons.removeAt(i);
  }

  soumettre() : void{
    if(this.equipeForm.valid){
      this.isConstruit = true;
      this.titre = "Mon Equipe Pokémon";
      let listeNomPokemons = this.equipeForm.value.pokemons;
      for(let i=0; i<listeNomPokemons.length; i++){
        this.detailService.getSpecies(listeNomPokemons[i].toLowerCase()).subscribe({
          next:(value : any) => {
            this.equipeNom.push(value.names[4].name)
            //this.listeMembreEquipe[i].nomFrancais = value.names[4].name;
          },
          error:(err : any) => {
            console.error("Impossible de trouver les précisions de pokémon : " + err);
          }
        })
        this.detailService.getDetailPokemon(listeNomPokemons[i].toLowerCase()).subscribe({
          next:(value : any) => {
            this.equipeUrl.push(value.sprites.other.showdown.front_default);
            //this.listeMembreEquipe[i].sprite=value.sprites;
          },
          error:(err : any) => {
            console.error("Impossible de trouver les détails de pokémon : " + err);
          }
        })
      }
    }else{
      console.log("Formulaire invalide");
    }
  }
}