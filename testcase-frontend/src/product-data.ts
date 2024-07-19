export type TypeProduct = {
  name: string;
  picture: string;
  stock: number;
  price: number;
};

export const products: TypeProduct[] = [
  {
    name: 'Bluetooth speaker',
    picture:
      'https://www.sencor.com/getmedia/6770caad-d0be-4d0d-b5f0-01bbc4c1c555/35059169.jpg.aspx?width=2100&height=2100&ext=.jpg',
    stock: 10,
    price: 623
  },
  {
    name: 'Headphone',
    picture: 'https://luna.co.id/wp-content/uploads/2021/09/WH-816.png',
    stock: 20,
    price: 734
  },
  {
    name: 'Laptop charger',
    picture:
      'https://techiestore.in/wp-content/uploads/2020/09/IMG_1128_2-scaled.jpg',
    stock: 15,
    price: 21
  },
  {
    name: 'LCD Monitor',
    picture:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTRIYsaq_pFzJ_3G2aIhlB68XtKAnN9UGMTQA&s',
    stock: 5,
    price: 437
  }
];
