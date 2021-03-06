import {Injectable} from '@angular/core';
import {AngularFirestore, AngularFirestoreDocument, DocumentReference} from '@angular/fire/firestore';
import {Category} from '../models/category';
import {Product} from '../models/product';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

  CATEGORIES_ROOT_COLLECTION = 'categories';
  categories: Category[];
  products: Product[];

  constructor(private firebase: AngularFirestore) {
    this.resetProducts();
  }

  resetProducts() {
    this.products = [];
  }

  loadCategories() {
    return new Promise<void>((resolve, reject) => {
      this.firebase.collection(this.CATEGORIES_ROOT_COLLECTION)
        .get()
        .subscribe(querySnapshot => {
          this.categories = [];
          querySnapshot.forEach(doc => {
            const category = doc.data() as Category;
            this.categories.push(category);
          });
          resolve();
        });
    });
  }

  getCategories() {
    return this.categories;
  }

  loadProducts(productRefArray: DocumentReference[]) {
    this.resetProducts();
    return new Promise<void>((resolve, reject) => {
      // for (const productRef of productRefArray) {
      //   this.firebase.doc(productRef)
      //     .get()
      //     .subscribe(doc => {
      //       const product = doc.data() as Product;
      //       this.products.push(product);
      //     });
      // }

      for (const product of productRefArray) {
        product.get()
          .then(doc => {
            this.products.push(doc.data() as Product);
          });
      }
      resolve();
    });
  }

  getProducts() {
    return this.products;
  }
}
