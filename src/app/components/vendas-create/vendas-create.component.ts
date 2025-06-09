import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Feira, FeirasService } from 'src/app/feiras.service';
import { Produto, ProdutosService } from 'src/app/produtos.service';
import {
  ItensVendas,
  PostVendas,
  Vendas,
  VendasService,
} from 'src/app/vendas.service';

@Component({
  selector: 'app-vendas-create',
  templateUrl: './vendas-create.component.html',
})
export class VendasCreateComponent {
  venda?: Vendas;
  produtos: Produto[] = [];
  feiras: Feira[] = [];
  venda_id?: number;
  vendaForm: FormGroup;
  produtoForm: FormGroup;
  vendaPost?: PostVendas;
  itensVenda: ItensVendas[] = [];
  loading = true;
  feirasCarregadas = false;
  produtosCarregados = false;
  valorTotal: number = 0;

  constructor(
    private vendaService: VendasService,
    private produtosService: ProdutosService,
    private feirasService: FeirasService,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private toastr: ToastrService
  ) {
    this.vendaForm = this.fb.group({
      feira_id: [null, Validators.required],
    });
    this.produtoForm = this.fb.group({
      produto_id: [null, Validators.required],
      quantidade: [null, Validators.required],
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      if (!!params['id']) {
        this.venda_id = +params['id'];
        this.carregarVendas();
      } else {
        this.loading = false;
      }
      this.carregarProdutos();
      this.carregarfeiras();
    });
  }

  get isDisabled(): boolean {
    return this.vendaForm.invalid || !this.itensVenda.length;
  }

  carregarVendas(): void {
    this.vendaService.getVendas().subscribe((res) => {
      this.venda = res.find((venda) => venda.venda_id === this.venda_id);
      this.vendaForm.setValue({
        feira_id: this.venda?.feira_id,
      });
      this.produtoForm.setValue({
        produto_id: this.venda?.itens_venda[0]?.produto_id,
        quantidade: this.venda?.itens_venda[0]?.quantidade,
      });

    });
  }

  carregarProdutos(): void {
    this.produtosService.getProdutos().subscribe((res) => {
      const reversed = res.reverse();
      this.produtos = reversed;
      if (this.produtos.length) {
        this.produtosCarregados = true;
        if(this.venda?.venda_id) {
          this.itensVenda = this.venda?.itens_venda?.map(item => ({nome_produto :this.produtos.find(p => p.produto_id == item.produto_id)?.nome, quantidade:item.quantidade, produto_id: item.produto_id, preco_unitario: item.preco_unitario})) || [];
          this.loading = false;
          this.valorTotal = 0;
          this.itensVenda.forEach((item) => {
          this.valorTotal += item.preco_unitario * item.quantidade;
          });
        }
      }
    });
  }

  carregarfeiras(): void {
    this.feirasService.getFeiras().subscribe((res) => {
      const reversed = res.reverse();
      this.feiras = reversed;
      if (this.feiras.length) {
        this.feirasCarregadas = true;
      }
    });
  }

  adicionarProduto(): void {
    const produtoIdControl = this.produtoForm.controls['produto_id'].value;
    const produtoQuantidadeControl =
      this.produtoForm.controls['quantidade'].value;
    const item = this.itensVenda.find(
      (item) => item.produto_id === produtoIdControl
    );
    const produto = this.produtos.find(
      (prod) => prod.produto_id == produtoIdControl
    );
    if (item) {
      this.itensVenda = this.itensVenda.map((itemm) =>
        itemm.produto_id === produtoIdControl
          ? {
              ...itemm,
              quantidade: produtoQuantidadeControl,
            }
          : itemm
      );
    } else {
      this.itensVenda.push({
        produto_id: produtoIdControl,
        quantidade: produtoQuantidadeControl,
        preco_unitario: +(produto?.preco_unitario as string),
        nome_produto: produto?.nome,
      });
    }
    this.valorTotal = 0;
    this.itensVenda.forEach((item) => {
      this.valorTotal += item.preco_unitario * item.quantidade;
    });
  }

  editarProduto(id: number): void {
    const produto = this.itensVenda.find(
      (item) => item.produto_id.toString() == id.toString()
    );

    this.produtoForm.setValue({
      produto_id: produto?.produto_id,
      quantidade: produto?.quantidade,
    });
  }

  excluirProduto(id: number): void {
    this.itensVenda = this.itensVenda.filter(
      (item) => item.produto_id.toString() !== id.toString()
    );
    this.valorTotal = 0;
    this.itensVenda.forEach((item) => {
      this.valorTotal += item.preco_unitario * item.quantidade;
    });
  }

  onSubmit(): void {
    if (this.venda) {
      const venda: PostVendas = {
        ...this.venda,
        itens_venda: this.itensVenda,
        feira_id: this.vendaForm.controls['feira_id'].value,
        valor_total: `R$${this.valorTotal}`,
      };
      this.vendaService
        .editarVendas(this.venda?.venda_id as number, venda)
        .subscribe({
          next: () => {

            this.toastr.success('Venda atualizada com sucesso!');
            this.router.navigate(['/vendas']);
          },
          error: (err) => {
            this.toastr.error('Erro ao atualizar venda.');
            console.error(err);
          },
        });
    } else {
      const venda: PostVendas = {
        itens_venda: this.itensVenda,
        feira_id: this.vendaForm.controls['feira_id'].value,
        status_venda: 'finalizada',
        valor_total: `R$${this.valorTotal}`,
        cliente_id: 0,
      };
      this.vendaService.adicionarVendas(venda).subscribe({
        next: () => {
              const feira = this.feiras.find(item => item.feira_id === venda.feira_id)?.nome?.toLowerCase() !== 'sede'
          if(feira) {
           this.vendaService.consolidarVendas(venda.feira_id).subscribe()
          }
          this.toastr.success('Venda efetuada com sucesso!');
          this.router.navigate(['/vendas']);
        },
        error: (err) => {
          this.toastr.error('Erro ao efetuar venda.');
          console.error(err);
        },
      });
    }
  }

  sair(): void {
    localStorage.removeItem('jwt');
    this.router.navigate(['/']);
  }
}
