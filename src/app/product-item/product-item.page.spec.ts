import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductItemPage } from './product-item.page';

describe('ProductItemPage', () => {
  let component: ProductItemPage;
  let fixture: ComponentFixture<ProductItemPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductItemPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
