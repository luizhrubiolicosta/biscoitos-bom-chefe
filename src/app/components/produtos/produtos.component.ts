import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Produto, ProdutosService } from 'src/app/produtos.service';

@Component({
  selector: 'app-produtos',
  templateUrl: './produtos.component.html',
})
export class ProdutosComponent implements OnInit {
  produtos: Produto[] = [];
  produtosFiltrados: Produto[] = [];
  searchControl = new FormControl('');
  loading = false;

  constructor(
    private produtosService: ProdutosService,
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
    this.produtosService.getProdutos().subscribe((res) => {
      this.loading = false;
      const reversed = res.reverse();
      this.produtos = reversed;
      this.produtosFiltrados = reversed;
    });
  }

  adicionarProduto(): void {
    this.router.navigate(['/produtos/create']);
  }

  editarProduto(id: number | undefined): void {
    this.router.navigate([`/produtos/create`, id]);
  }

  excluirProduto(id: number | undefined): void {
    this.produtosService.excluirProduto(id).subscribe({
      next: () => {
        this.toastr.success('Produto atualizado com sucesso!');
        this.carregarProdutos();
      },
      error: (err) => {
        this.toastr.error('Erro ao atualizar produto.');
        console.error(err);
      },
    });
  }

  filtrarProdutos(valor: string): void {
    const termo = valor.toLowerCase();
    this.produtosFiltrados = this.produtos.filter((produto) =>
      produto.nome.toLowerCase().includes(termo)
    );
  }

  sair(): void {
    localStorage.removeItem('jwt');
    this.router.navigate(['/']);
  }
}
