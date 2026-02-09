import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";

@Component({
  selector: "app-support-card",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./support-card.component.html",
  styleUrl: "./support-card.component.css",
})
export class SupportCardComponent {
  readonly soporte = {
    sistema: "Sismas",
    descripcion:
      "Sistema de negocios que permite tener el control de todo el proceso ERP.",
    telefono: "902104314",
    email: "ricardomayta1@gmail.com",
    nombre: "Ricardo Mayta",
    cargo: "CEO y creador del sistema",
    profesion: "Ingeniero de Sistemas e Informática",
    foto:
      "https://scontent-lim1-1.xx.fbcdn.net/v/t39.30808-6/532417416_723965810637619_4252221064118965631_n.jpg?_nc_cat=106&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=_NUEEmw4Z9sQ7kNvwF2k4dy&_nc_oc=Adk8CtylktZWrmhPwLkZmnwhNc_Ooz5gQsj0GtKgKeDITXPTgPhN2pLVY9lZ708-ubg&_nc_zt=23&_nc_ht=scontent-lim1-1.xx&_nc_gid=F54ouPvlTw2lkdo1zGz5SA&oh=00_AfvePPRKMLZYBBhCiKZuhhxTVB1Wj5bZxI1WCVtP1kgJoA&oe=698EFEC5",
  };
}
