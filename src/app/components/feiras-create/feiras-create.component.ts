import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Feira, FeirasService } from 'src/app/feiras.service';

@Component({
  selector: 'app-feiras-create',
  templateUrl: './feiras-create.component.html',
})
export class FeirasCreateComponent implements OnInit {
  feira?: Feira;
  feira_id?: number;
  feiraForm: FormGroup;
  loading = true;
  nome_feira_edit = '';

  constructor(
    private feirasService: FeirasService,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private toastr: ToastrService
  ) {
    this.feiraForm = this.fb.group({
      nome: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      if (!!params['id']) {
        this.feira_id = +params['id'];
        this.carregarProdutos();
      } else {
        this.loading = false;
      }
    });
  }

  get isDisabled(): boolean {
    return (
      this.nome_feira_edit === this.feiraForm.controls['nome'].value ||
      !this.feiraForm.controls['nome'].value
    );
  }

  carregarProdutos(): void {
    this.feirasService.getFeiras().subscribe((res) => {
      this.feira = res.find((feira) => feira.feira_id === this.feira_id);
      this.feiraForm.setValue({
        nome: this.feira?.nome,
      });
      this.nome_feira_edit = this.feira?.nome as string;
      this.loading = false;
    });
  }

  onSubmit(): void {
    if (this.feira) {
      const feira: Feira = {
        ...this.feira,
        nome: this.feiraForm.controls['nome'].value,
      };
      this.feirasService
        .editarFeira(this.feira?.feira_id as number, feira)
        .subscribe({
          next: () => {
            this.toastr.success('feira atualizado com sucesso!');
            this.router.navigate(['/feiras']);
          },
          error: (err) => {
            this.toastr.error('Erro ao atualizar feira.');
            console.error(err);
          },
        });
    } else {
      const feira: Feira = {
        nome: this.feiraForm.controls['nome'].value,
      };
      this.feirasService.adicionarFeira(feira).subscribe({
        next: () => {
          this.toastr.success('feira atualizado com sucesso!');
          this.router.navigate(['/feiras']);
        },
        error: (err) => {
          this.toastr.error('Erro ao atualizar feira.');
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
