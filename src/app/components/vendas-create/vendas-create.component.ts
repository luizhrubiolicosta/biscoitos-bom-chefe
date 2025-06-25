// VendasCreateComponent atualizado para funcionar corretamente com múltiplos produtos
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { forkJoin, map } from 'rxjs';
import { EstoqueService } from 'src/app/estoque.service';
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
export class VendasCreateComponent implements OnInit {
  venda?: Vendas;
  produtos: Produto[] = [];
  feiras: Feira[] = [];
  venda_id?: number;
  vendaForm: FormGroup;
  produtoForm: FormGroup;
  itensVenda: ItensVendas[] = [];
  loading = true;
  feirasCarregadas = false;
  valorTotal = 0;

  constructor(
    private vendaService: VendasService,
    private produtosService: ProdutosService,
    private estoqueService: EstoqueService,
    private feirasService: FeirasService,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private toastr: ToastrService
  ) {
    this.vendaForm = this.fb.group({
      feira_id: [null, Validators.required],
      quantidade: this.fb.array([]),
    });
    this.produtoForm = this.fb.group({
      produto_id: [null, Validators.required],
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.carregarfeiras();
      setTimeout(() => {
         if (!!params['id']) {
        this.venda_id = +params['id'];
        this.carregarVendas();
      } else {
        this.loading = false;
      }
      }, 500);
    });

    this.vendaForm.controls['feira_id'].valueChanges.subscribe(item => {
      if(item){
        this.produtos = []
        this.produtoForm.reset()
        this.itensVenda = []
        this.valorTotal = 0
        this.carregarProdutosPorFeira()
      }
    })
  }

  get quantidadeFormArray(): FormArray {
    return this.vendaForm.get('quantidade') as FormArray;
  }

  get isDisabled(): boolean {
    return this.vendaForm.invalid || !this.itensVenda.length;
  }

  carregarVendas(): void {
    this.vendaService.getVendas().subscribe((res) => {
      this.venda = res.find((venda) => venda.venda_id === this.venda_id);
      this.vendaForm.patchValue({ feira_id: this.venda?.feira_id });
      this.loading = false
      if (this.venda?.itens_venda?.length) {
        this.itensVenda = this.venda.itens_venda.map((item) => {
          const produto = this.produtos.find(
            (p) => p.produto_id === (item.item_de_estoque_utilizado?.produto?.produto_id as number)
          );
          this.quantidadeFormArray.push(this.fb.control(item.quantidade));
          return {
            produto_id: produto?.produto_id as number,
            nome_produto: produto?.nome ?? '',
            preco_unitario: item.preco_unitario,
            quantidade: item.quantidade,
          };
        });
        this.atualizarValorTotal();
      }
    });
  }

  carregarProdutosPorFeira(): void {
    this.produtosService.getProdutosPorFeira(this.vendaForm.controls['feira_id'].value).subscribe((res) => {
      this.produtos = res.reverse();
    });
  }

  carregarfeiras(): void {
    this.feirasService.getFeiras().subscribe((res) => {
      this.feiras = res.reverse();
      this.feirasCarregadas = true;
    });
  }

  adicionarProduto(): void {
    const produtoId = +this.produtoForm.controls['produto_id'].value;

    const exists = this.itensVenda.find((i) => i.produto_id === produtoId);
    if (exists) {
      this.toastr.warning('Produto já adicionado!');
      return;
    }

    const prod = this.produtos.find((p) => p.produto_id === produtoId);
    if (!prod) {
      this.toastr.error('Produto inválido.');
      return;
    }

    this.itensVenda.push({
      produto_id: prod.produto_id as number,
      nome_produto: prod.nome,
      preco_unitario: +prod.preco_unitario,
      quantidade: 1,
    });

    const quantidadeArray = this.vendaForm.get('quantidade') as FormArray;
    quantidadeArray.push(this.fb.control(1, Validators.required));
    this.atualizarValorTotal();
    this.produtoForm.reset();

    console.log('Produto adicionado com sucesso:', this.itensVenda);
  }

  editarProduto(id: number): void {
    const index = this.itensVenda.findIndex((item) => item.produto_id === id);
    const item = this.itensVenda[index];
    this.produtoForm.setValue({ produto_id: item.produto_id });
  }

  excluirProduto(id: number): void {
    const index = this.itensVenda.findIndex((item) => item.produto_id === id);
    if (index >= 0) {
      this.itensVenda.splice(index, 1);
      this.quantidadeFormArray.removeAt(index);
    }
    this.atualizarValorTotal();
  }

  atualizarQuantidade(index: number): void {
    const novaQuantidade = this.quantidadeFormArray.at(index).value;
    this.itensVenda[index].quantidade = novaQuantidade;
    this.atualizarValorTotal();
  }

  atualizarValorTotal(): void {
    this.valorTotal = this.itensVenda.reduce(
      (total, item) => total + item.quantidade * item.preco_unitario,
      0
    );
  }

  onSubmit(): void {
      const feiraId = this.vendaForm.controls['feira_id'].value;
const feir =
              this.feiras
                .find((item) => item.feira_id === +feiraId)


  const estoqueRequests = this.itensVenda.map(item =>
    this.estoqueService.getProdutosEstoques(item.produto_id).pipe(
      map(result => result.find(i => i?.feira_id === feir?.feira_id && i.quantidade > 0)?.estoque_id)
    )
  );

  forkJoin(estoqueRequests).subscribe({
    next: (estoqueIds: (number | undefined)[]) => {

      const venda: PostVendas = {
        itens_venda: this.itensVenda.map((item, index) => ({
          estoque_id:  estoqueIds[index] as number,
          quantidade: item.quantidade,
          preco_unitario: +item.preco_unitario
        })),
        feira_id: feiraId,
        status_venda: this.venda ? this.venda.status_venda : 'finalizada',
        valor_total: this.valorTotal,
        cliente_id: null ,
      };

       this.vendaService.adicionarVendas(venda).subscribe({
        next: (vend) => {
          if(vend.feira?.nome.toLocaleLowerCase() !== 'sede') {
            this.vendaService.consolidarVendas(vend.venda_id as number).subscribe();
          }
          this.toastr.success(
           'Venda efetuada com sucesso!'
          );
          this.router.navigate(['/vendas']);
        },
        error: (err) => {
          this.toastr.error('Erro ao efetuar venda.');
          console.error(err);
        },
      })
          },
    error: (err) => {
      this.toastr.error('Erro ao buscar estoques.');
      console.error(err);
    }
  });


  }

  sair(): void {
    localStorage.removeItem('jwt');
    this.router.navigate(['/']);
  }
}
