import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Feira, FeirasService } from 'src/app/feiras.service';
import { Produto, ProdutosService } from 'src/app/produtos.service';

@Component({
  selector: 'app-feiras',
  templateUrl: './feiras.component.html',
})
export class FeirasComponent {
  feiras: Feira[] = [];
  feirasFiltradas: Feira[] = [];
  searchControl = new FormControl('');
  loading = false;

  constructor(
    private feirasService: FeirasService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.carregarfeiras();

    this.searchControl.valueChanges.subscribe((search) =>
      this.filtrarfeiras(search as string)
    );
  }

  carregarfeiras(): void {
    this.loading = true;
    this.feirasService.getFeiras().subscribe((res) => {
      this.loading = false;
      const reversed = res.reverse();
      this.feiras = reversed;
      this.feirasFiltradas = reversed;
    });
  }

  adicionarfeira(): void {
    this.router.navigate(['/feiras/create']);
  }

  editarfeira(id: number | undefined): void {
    this.router.navigate([`/feiras/create`, id]);
  }

  excluirfeira(id: number | undefined): void {
    this.feirasService.excluirFeira(id).subscribe({
      next: () => {
        this.toastr.success('feira atualizado com sucesso!');
        this.carregarfeiras();
      },
      error: (err) => {
        this.toastr.error('Erro ao atualizar feira.');
        console.error(err);
      },
    });
  }

  filtrarfeiras(valor: string): void {
    const termo = valor.toLowerCase();
    this.feirasFiltradas = this.feiras.filter((feira) =>
      feira.nome.toLowerCase().includes(termo)
    );
  }

  sair(): void {
    localStorage.removeItem('jwt');
    this.router.navigate(['/']);
  }
}
