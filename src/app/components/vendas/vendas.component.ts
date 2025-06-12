import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

import { Vendas, VendasService } from 'src/app/vendas.service';

@Component({
  selector: 'app-vendas',
  templateUrl: './vendas.component.html',
})
export class VendasComponent {
  vendas: Vendas[] = [];
  vendasFiltrados: Vendas[] = [];
  searchControl = new FormControl('');
  loading = false;

  constructor(
    private vendasService: VendasService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.carregarProdutos();
  }

  carregarProdutos(): void {
    this.loading = true;
    this.vendasService.getVendas().subscribe((res) => {
      this.loading = false;
      const reversed = res.reverse();
      this.vendas = reversed;
      this.vendasFiltrados = reversed;
    });
  }

  adicionarVenda(): void {
    this.router.navigate(['/vendas/create']);
  }


   excluirVenda(id: number | undefined): void {
    this.vendasService.excluirVendas(id).subscribe({
      next: () => {
        this.toastr.success('Venda excluída com sucesso!');
        this.carregarProdutos();
      },
      error: (err) => {
        this.toastr.error('Erro ao excluir venda.');
        console.error(err);
      },
    });
  }

  editarVenda(id: number | undefined): void {
    this.router.navigate([`/vendas/create`, id]);
  }

  sair(): void {
    localStorage.removeItem('jwt');
    this.router.navigate(['/']);
  }
}
