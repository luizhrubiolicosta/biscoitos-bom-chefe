import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoginService } from './login.service';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { HomeComponent } from './components/home/home.component';

import { EstoqueComponent } from './components/estoque/estoque.component';

import { ProdutosService } from './produtos.service';
import { ProdutosComponent } from './components/produtos/produtos.component';
import { ProdutosCreateComponent } from './components/produtos-create/produtos-create.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { FeirasService } from './feiras.service';
import { FeirasComponent } from './components/feiras/feiras.component';
import { EstoqueService } from './estoque.service';
import { VendasComponent } from './components/vendas/vendas.component';
import { FeirasCreateComponent } from './components/feiras-create/feiras-create.component';
import { EstoqueCreateComponent } from './components/estoque-create/estoque-create.component';
import { VendasCreateComponent } from './components/vendas-create/vendas-create.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    ProdutosComponent,
    EstoqueComponent,
    FeirasComponent,
    ProdutosCreateComponent,
    VendasComponent,
    FeirasCreateComponent,
    EstoqueCreateComponent,
    VendasCreateComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    RouterModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
  ],
  providers: [LoginService, ProdutosService, FeirasService, EstoqueService],
  bootstrap: [AppComponent],
})
export class AppModule {}
