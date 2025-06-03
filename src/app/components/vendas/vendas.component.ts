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

    this.searchControl.valueChanges.subscribe((search) =>
      this.filtrarVendas(search as string)
    );
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
    this.vendasService.excluirVendas(id);
  }

  editarVenda(id: number | undefined): void {
    this.router.navigate([`/vendas/create`, id]);
  }

  filtrarVendas(valor: string): void {
    // const termo = valor.toLowerCase();
    // this.vendasFiltrados =
    //   this.vendas.filter((venda) =>
    //     venda.feira_id?.toLowerCase().includes(termo)
    //   ) || [];
  }

  sair(): void {
    localStorage.removeItem('jwt');
    this.router.navigate(['/']);
  }
}
