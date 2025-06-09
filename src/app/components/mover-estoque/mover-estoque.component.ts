import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Estoque, EstoqueService, MovimentarEstoque, PostEstoque } from 'src/app/estoque.service';
import { Feira, FeirasService } from 'src/app/feiras.service';
import { Produto, ProdutosService } from 'src/app/produtos.service';

@Component({
  selector: 'app-mover-estoque',
  templateUrl: './mover-estoque.component.html',
})
export class MoverEstoqueComponent implements OnInit {
  estoque?: Estoque;
  feiras: Feira[] = [];
  estoque_id?: number;
  estoqueForm: FormGroup;
  loading = true;
  feirasCarregadas = false;

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
      quantidade: [null, Validators.required],
      feira_id: ['', Validators.required],
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

      this.carregarfeiras();
    });
  }

  get isDisabled(): boolean {
    return (
      !this.estoqueForm.controls['feira_id'].value ||
      this.estoqueForm.controls['quantidade'].value  === null||
      this.estoqueForm.controls['quantidade'].value  === undefined
    );
  }

  carregarEstoque(): void {
    this.estoqueService.getEstoques().subscribe((res) => {
      this.estoque = res.find(
        (estoque) => estoque.estoque_id === this.estoque_id
      );

      this.loading = false;
    });
  }

  carregarfeiras(): void {
    this.feirasService.getFeiras().subscribe((res) => {
      const reversed = res.filter(item=> item?.nome?.toLowerCase() !== 'sede').reverse();
      this.feiras = reversed;
      if (this.feiras.length) {
        this.feirasCarregadas = true;
      }
    });
  }

  onSubmit(): void {
      const estoque: MovimentarEstoque = {
        produto_id: this.estoque?.produto?.produto_id as number,
        quantidade_a_mover: +this.estoqueForm.controls['quantidade'].value,
        feira_id_destino: +this.estoqueForm.controls['feira_id'].value,
      };

      this.estoqueService
        .moverEstoque(estoque)
        .subscribe({
          next: () => {
            this.toastr.success('Estoque movido com sucesso!');
            this.router.navigate(['/estoque']);
          },
          error: (err) => {
            this.toastr.error('Erro ao mover estoque.');
            console.error(err);
          },
        });
  }

  sair(): void {
    localStorage.removeItem('jwt');
    this.router.navigate(['/']);
  }
}
