export class MenuNode {
  idItem = 0;
  name = '';
  routeOrFunction: string | null = null;
  icon: string | null = null;
  position = 0;
  children: MenuNode[] = [];
}
