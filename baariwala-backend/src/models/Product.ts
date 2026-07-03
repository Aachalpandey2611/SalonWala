import mongoose, { Document, Schema } from 'mongoose';

export enum ProductCategory {
  HAIR_CARE = 'HAIR_CARE',
  BEARD_CARE = 'BEARD_CARE',
  FACIAL = 'FACIAL',
  SPA = 'SPA',
  HAIR_COLOR = 'HAIR_COLOR',
  SHAMPOO = 'SHAMPOO',
  CONDITIONER = 'CONDITIONER',
  STYLING = 'STYLING',
  TOOLS = 'TOOLS',
  ACCESSORIES = 'ACCESSORIES'
}

export enum ProductType {
  RETAIL = 'RETAIL',           // Sold directly to customers
  PROFESSIONAL = 'PROFESSIONAL' // Consumed during services
}

export enum ProductStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  DISCONTINUED = 'DISCONTINUED'
}

export interface IProduct extends Document {
  name: string;
  sku: string;
  barcode?: string;
  
  category: ProductCategory;
  productType: ProductType;
  brand: string;
  description?: string;
  
  unit: string; // e.g., 'ml', 'g', 'piece'
  
  sellingPrice?: number; // Null for professional-only products
  purchasePrice: number;
  gstPercent: number;
  
  image?: string;
  
  status: ProductStatus;
  
  createdAt: Date;
  updatedAt: Date;
}

const productSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true },
    sku: { type: String, required: true, unique: true, index: true },
    barcode: { type: String, unique: true, sparse: true },
    
    category: { type: String, enum: Object.values(ProductCategory), required: true, index: true },
    productType: { type: String, enum: Object.values(ProductType), required: true, index: true },
    brand: { type: String, required: true, index: true },
    description: { type: String },
    
    unit: { type: String, required: true },
    
    sellingPrice: { type: Number, min: 0 },
    purchasePrice: { type: Number, required: true, min: 0 },
    gstPercent: { type: Number, required: true, default: 0, min: 0 },
    
    image: { type: String },
    
    status: { type: String, enum: Object.values(ProductStatus), default: ProductStatus.ACTIVE, index: true },
  },
  {
    timestamps: true,
  }
);

export const Product = mongoose.model<IProduct>('Product', productSchema);
