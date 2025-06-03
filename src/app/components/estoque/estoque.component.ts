import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Estoque, EstoqueService } from 'src/app/estoque.service';

@Component({
  selector: 'app-estoque',
  templateUrl: './estoque.component.html',
})
export class EstoqueComponent {
  estoques: Estoque[] = [];
  estoquesFiltrados: Estoque[] = [];
  searchControl = new FormControl('');
  loading = false;

  constructor(
    private estoquesService: EstoqueService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.carregarProdutos();

    this.searchControl.valueChanges.subscribe((search) =>
      this.filtrarProdutos(search as string)
    );
  }

  carregarProdutos(): void {
    this.loading = true;
    this.estoquesService.getEstoques().subscribe((res) => {
      this.loading = false;
      const reversed = res.reverse();
      this.estoques = reversed;
      this.estoquesFiltrados = reversed;
    });
  }

  adicionarEstoque(): void {
    this.router.navigate(['/estoque/create']);
  }

  atualizarEstoque(id: number | undefined): void {
    this.router.navigate([`/estoque/create`, id]);
  }

  filtrarProdutos(valor: string): void {
    const termo = valor.toLowerCase();
    this.estoquesFiltrados =
      this.estoques.filter((estoque) =>
        estoque.produto?.nome?.toLowerCase().includes(termo)
      ) || [];
  }

  sair(): void {
    localStorage.removeItem('jwt');
    this.router.navigate(['/']);
  }
}
