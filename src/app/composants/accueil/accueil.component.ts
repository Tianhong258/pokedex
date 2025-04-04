import { Component, OnInit } from '@angular/core';
import { AccueilService } from '../../core/services/accueil.service';
import {MatListModule} from '@angular/material/list';
import { Pokemon } from '../../core/models/pokemon.model';
import { MatPaginatorModule, PageEvent} from '@angular/material/paginator';
import {AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, Validators} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatSelectChange, MatSelectModule} from '@angular/material/select';
import {MatFormFieldModule} from '@angular/material/form-field';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import {MatButtonModule} from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { NavbarComponent } from '../navbar/navbar.component';
import { DetailService } from '../../core/services/detail.service';


@Component({
  selector: 'app-accueil',
  imports: [MatPaginatorModule, CommonModule, ReactiveFormsModule, MatListModule, RouterLink, MatFormFieldModule, MatSelectModule, MatInputModule, FormsModule, MatButtonModule, MatCardModule,NavbarComponent],
  templateUrl: './accueil.component.html',
  styleUrl: './accueil.component.css'
})
export class AccueilComponent implements OnInit {
  readonly titre : string = "Pokédex";
  pageActuel :number = 0;
  form!: FormGroup;
  chercheForm !: FormGroup;
  tabPokemon : Pokemon[] = [];
  longueListPokemon : number = 0;
  typeChoisi : string = "";
  geneChoisi : string = "";
  isFiltrerParType : boolean = false;
  isFiltrerParGene : boolean = false;
  tabGene : Pokemon [] = [];
  tabType : Pokemon[] = [];
  tabPokemonNom : string[] = [];
 
  types = [
    { label: '', value: '' },
    { label: 'Plante', value: 'grass' },
    { label: 'Feu', value: 'fire' },
    { label: 'Eau', value: 'water' },
    { label: 'Électrik', value: 'electric' },
    { label: 'Normal', value: 'normal' },
    { label: 'Acier', value: 'steel' },
    { label: 'Vol', value: 'flying' },
    { label: 'Roche', value: 'rock' },
    { label: 'Sol', value: 'ground' },
    { label: 'Combat', value: 'fighting' },
    { label: 'Glace', value: 'ice' },
    { label: 'Psy', value: 'psychic' },
    { label: 'Ténèbres', value: 'dark' },
    { label: 'Insecte', value: 'bug' },
    { label: 'Spectre', value: 'ghost' },
    { label: 'Poison', value: 'poison' },
    { label: 'Dragon', value: 'dragon' },
    { label: 'Fée', value: 'fairy' }
  ];
  generations = [
    { label: '', value: '' },
    { label: 'Génération-I', value: '1' },
    { label: 'Génération-II', value: '2' },
    { label: 'Génération-III', value: '3' },
    { label: 'Génération-IV', value: '4' },
    { label: 'Génération-V', value: '5' },
    { label: 'Génération-VI', value: '6' },
    { label: 'Génération-VII', value: '7' },
    { label: 'Génération-VIII', value: '8' },
    { label: 'Génération-IX', value: '9' },
  ];
  constructor(
    private readonly accueilService: AccueilService,
    private fb: FormBuilder,
    private detailService : DetailService
  ){
      this.form = this.fb.group({
        selectedGeneration: [''],
        selectedType: ['']
    });
  }

  get selectedOptionGeneration() {
    this.geneChoisi = this.form.get('selectedGeneration')?.value || ''
    return this.geneChoisi;
  }

  get selectedOptionType() {
    this.typeChoisi = this.form.get('selectedType')?.value || '';
    return this.typeChoisi;
  }
 
  selectGeneration(event : MatSelectChange){
    if(this.selectedOptionGeneration === ""){
      this.isFiltrerParGene = false;
      if(this.selectedOptionType === ""){
        window.location.reload();
      }
    }
    else{
        this.accueilService.getListPokemonsByGeneration(this.selectedOptionGeneration).subscribe({
      next:(value : any) => {
        this.isFiltrerParGene = true;
        this.isFiltrerParType = false;
        this.tabGene = value;
        this.tabPokemon = this.tabGene.slice((this.pageActuel*20), (this.pageActuel*20 + 20));
        this.longueListPokemon = this.tabGene.length;
      },
      error:(err : any) => {
        console.error("Impossible trouver la liste de pokémon par génération : " + err);
      }
    })
  }
  }

  selectType(event : MatSelectChange){
    if(this.selectedOptionType === ""){
      this.isFiltrerParType =  false;
      if(this.selectedOptionGeneration === ""){
        window.location.reload(); 
      }
    }else{ 
    this.accueilService.getListPokemonsByType(this.selectedOptionType).subscribe({
      next:(value : any) => {
        this.isFiltrerParType = true;
        this.isFiltrerParGene = false;
        this.tabType = value;
        this.tabPokemon = this.tabType.slice((this.pageActuel*20), ((this.pageActuel*20) + 20));
        this.longueListPokemon = this.tabType.length;
      },
      error:(err : any) => {
        console.error("Impossible trouver la liste de pokémon par type : "  + err);
      }
    })
  }
  }

  ngOnInit(): void {
    this.accueilService.getListPokemons(this.longueListPokemon, 20).subscribe({
      next:(value : any) => {
        this.tabPokemon = value;
      },
      error:(err : any) => {
        console.error("Impossible trouver la liste de pokémon : " + err);
      }
    })
    this.accueilService.getNomberPokemon().subscribe({
      next:(value : any) => {
        this.longueListPokemon = value.count;
      },
      error:(err : any) => {
        console.error("Impossible trouver le nombre de pokémon : " + err);
      }
    })
    this.accueilService.getTousNomsPokemon().subscribe({
      next:(value : any) => {
        this.tabPokemonNom = value;
        console.log(this.tabPokemonNom);
        //ici la question
        this.chercheForm = this.fb.group({ 
          cherchePokemonParNom : ['', [this.pokemonNomValidator(this.tabPokemonNom)]]
        });
      },
      error:(err : any) => {
        console.error("Impossible de trouver la liste des noms : " + err);
      }
    })
  }
    pokemonNomValidator(pokemonNomValide: string[]) {
    return (control: AbstractControl): ValidationErrors | null => {
      console.log(pokemonNomValide);
      return pokemonNomValide.includes(control.value.toLowerCase()) ? null : { forbiddenNomPokemon : true } ;
    };
  }

  public getPaginatorData(event: PageEvent): PageEvent {
    this.pageActuel = event.pageIndex;
    if(this.isFiltrerParType === true){
      this.tabPokemon = this.tabType.slice(event.pageIndex*20, (event.pageIndex*20)+20);
    }
    else if(this.isFiltrerParGene === true){
      this.tabPokemon = this.tabGene.slice(event.pageIndex*20, (event.pageIndex*20)+20);
    }
    else {
      this.accueilService.getListPokemons(event.pageIndex, 20).subscribe({
        next:(value : any) => {
          this.tabPokemon = value;
        },
        error:(err : any) => {
          console.error("Impossible trouver la liste de pokémon :" + err);
        }
      })
    }
    return event;
  }

  cherchePokemon(){
    if(this.chercheForm.valid){
      this.detailService.getDetailPokemon(this.chercheForm.value.cherchePokemonParNom).subscribe({
        next:(value : any) => {
          this.tabPokemon = [];
          this.tabPokemon.push(value);
        },
        error:(err : any) => {
          console.error("Impossible de trouver les détails de pokémon : " + err);
        }
      })
    }
  }


}


