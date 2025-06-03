import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Produto, ProdutosService } from 'src/app/produtos.service';

@Component({
  selector: 'app-produtos-create',
  templateUrl: './produtos-create.component.html',
})
export class ProdutosCreateComponent implements OnInit {
  produto?: Produto;
  produto_id?: number;
  produtosForm: FormGroup;
  loading = true;

  constructor(
    private produtosService: ProdutosService,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private toastr: ToastrService
  ) {
    this.produtosForm = this.fb.group({
      nome: ['', [Validators.required]],
      descricao: ['', Validators.required],
      preco_unitario: ['', Validators.required],
      peso_gramas: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      if (!!params['id']) {
        this.produto_id = +params['id'];
        this.carregarProdutos();
      } else {
        this.loading = false;
      }
    });
  }

  carregarProdutos(): void {
    this.produtosService.getProdutos().subscribe((res) => {
      this.produto = res.find(
        (produto) => produto.produto_id === this.produto_id
      );
      this.produtosForm.setValue({
        nome: this.produto?.nome,
        descricao: this.produto?.descricao,
        preco_unitario: this.produto?.preco_unitario,
        peso_gramas: this.produto?.peso_gramas,
      });
      this.loading = false;
    });
  }

  onSubmit(): void {
    if (this.produto) {
      const produto: Produto = {
        ...this.produto,
        nome: this.produtosForm.controls['nome'].value,
        descricao: this.produtosForm.controls['descricao'].value,
        preco_unitario: this.produtosForm.controls['preco_unitario'].value,
        peso_gramas: this.produtosForm.controls['peso_gramas'].value,
      };
      this.produtosService
        .editarProduto(this.produto?.produto_id as number, produto)
        .subscribe({
          next: () => {
            this.toastr.success('Produto atualizado com sucesso!');
            this.router.navigate(['/produtos']);
          },
          error: (err) => {
            this.toastr.error('Erro ao atualizar produto.');
            console.error(err);
          },
        });
    } else {
      const produto: Produto = {
        nome: this.produtosForm.controls['nome'].value,
        descricao: this.produtosForm.controls['descricao'].value,
        preco_unitario: this.produtosForm.controls['preco_unitario'].value,
        peso_gramas: this.produtosForm.controls['peso_gramas'].value,
        categoria: 'Biscoito',
        data_criacao: new Date().toISOString().slice(0, 10),
        status: true,
      };
      this.produtosService.adicionarProduto(produto).subscribe({
        next: () => {
          this.toastr.success('Produto atualizado com sucesso!');
          this.router.navigate(['/produtos']);
        },
        error: (err) => {
          this.toastr.error('Erro ao atualizar produto.');
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
