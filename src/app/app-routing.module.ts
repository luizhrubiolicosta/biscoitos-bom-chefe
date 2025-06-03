import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';

import { EstoqueComponent } from './components/estoque/estoque.component';
import { FeirasComponent } from './components/feiras/feiras.component';
import { ProdutosComponent } from './components/produtos/produtos.component';
import { ProdutosCreateComponent } from './components/produtos-create/produtos-create.component';
import { VendasComponent } from './components/vendas/vendas.component';
import { FeirasCreateComponent } from './components/feiras-create/feiras-create.component';
import { EstoqueCreateComponent } from './components/estoque-create/estoque-create.component';
import { AuthGuard } from './auth.guard';
import { VendasCreateComponent } from './components/vendas-create/vendas-create.component';

const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'produtos', component: ProdutosComponent, canActivate: [AuthGuard] },
  {
    path: 'produtos/create',
    component: ProdutosCreateComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'produtos/create/:id',
    component: ProdutosCreateComponent,
    canActivate: [AuthGuard],
  },
  { path: 'estoque', component: EstoqueComponent, canActivate: [AuthGuard] },
  {
    path: 'estoque/create',
    component: EstoqueCreateComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'estoque/create/:id',
    component: EstoqueCreateComponent,
    canActivate: [AuthGuard],
  },
  { path: 'feiras', component: FeirasComponent, canActivate: [AuthGuard] },
  {
    path: 'feiras/create',
    component: FeirasCreateComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'feiras/create/:id',
    component: FeirasCreateComponent,
    canActivate: [AuthGuard],
  },
  { path: 'vendas', component: VendasComponent, canActivate: [AuthGuard] },
  {
    path: 'vendas/create',
    component: VendasCreateComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'vendas/create/:id',
    component: VendasCreateComponent,
    canActivate: [AuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
