import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Estoque, EstoqueService } from 'src/app/estoque.service';
import { Feira, FeirasService } from 'src/app/feiras.service';
import { Produto, ProdutosService } from 'src/app/produtos.service';

@Component({
  selector: 'app-estoque-create',
  templateUrl: './estoque-create.component.html',
})
export class EstoqueCreateComponent implements OnInit {
  estoque?: Estoque;
  produtos: Produto[] = [];
  feiras: Feira[] = [];
  estoque_id?: number;
  estoqueForm: FormGroup;
  loading = true;
  feirasCarregadas = false;
  produtosCarregados = false;

  constructor(
    private estoqueService: EstoqueService,
    private produtosService: ProdutosService,
    private feirasService: FeirasService,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private toastr: ToastrService
  ) {
    this.estoqueForm = this.fb.group({
      produto_id: [null, [Validators.required]],
      quantidade: [null, Validators.required],
      lote: ['', Validators.required],
      data_producao: ['', Validators.required],
      data_validade: ['', Validators.required],
      localizacao: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      if (!!params['id']) {
        this.estoque_id = +params['id'];
        this.carregarEstoque();
      } else {
        this.loading = false;
      }
      this.carregarProdutos();
      this.carregarfeiras();
    });
  }

  get isDisabled(): boolean {
    return (
      !this.estoqueForm.controls['produto_id'].value ||
      !this.estoqueForm.controls['quantidade'].value ||
      !this.estoqueForm.controls['lote'].value ||
      !this.estoqueForm.controls['localizacao'].value
    );
  }

  carregarEstoque(): void {
    this.estoqueService.getEstoques().subscribe((res) => {
      this.estoque = res.find(
        (estoque) => estoque.estoque_id === this.estoque_id
      );
      this.estoqueForm.setValue({
        produto_id: this.estoque?.produto_id,
        quantidade: this.estoque?.quantidade,
        lote: this.estoque?.lote,
        data_producao: this.estoque?.data_producao,
        data_validade: this.estoque?.data_validade,
        localizacao: this.estoque?.localizacao,
      });
      this.loading = false;
    });
  }

  carregarProdutos(): void {
    this.produtosService.getProdutos().subscribe((res) => {
      const reversed = res.reverse();
      this.produtos = reversed;
      if (this.produtos.length) {
        this.produtosCarregados = true;
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

  onSubmit(): void {
    if (this.estoque) {
      const estoque: Estoque = {
        ...this.estoque,
        produto_id: this.estoqueForm.controls['produto_id'].value,
        quantidade: this.estoqueForm.controls['quantidade'].value,
        lote: this.estoqueForm.controls['lote'].value,
        data_producao: new Date().toISOString().slice(0, 10),
        data_validade: new Date().toISOString().slice(0, 10),
        localizacao: this.estoqueForm.controls['localizacao'].value,
        data_atualizacao: new Date().toISOString().slice(0, 10),
      };
      this.estoqueService
        .editarEstoque(this.estoque?.estoque_id as number, estoque)
        .subscribe({
          next: () => {
            this.toastr.success('Estoque atualizado com sucesso!');
            this.router.navigate(['/estoque']);
          },
          error: (err) => {
            this.toastr.error('Erro ao atualizar estoque.');
            console.error(err);
          },
        });
    } else {
      const estoque: Estoque = {
        produto_id: this.estoqueForm.controls['produto_id'].value,
        quantidade: this.estoqueForm.controls['quantidade'].value,
        lote: this.estoqueForm.controls['lote'].value,
        data_producao: new Date().toISOString().slice(0, 10),
        data_validade: new Date().toISOString().slice(0, 10),
        localizacao: this.estoqueForm.controls['localizacao'].value,
        data_atualizacao: new Date().toISOString().slice(0, 10),
      };
      this.estoqueService.adicionarEstoque(estoque).subscribe({
        next: () => {
          this.toastr.success('Estoque atualizado com sucesso!');
          this.router.navigate(['/etoque']);
        },
        error: (err) => {
          this.toastr.error('Erro ao atualizar estoque.');
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
