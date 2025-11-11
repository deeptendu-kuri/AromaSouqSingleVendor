export enum DiscountType {
  PERCENTAGE = 'PERCENTAGE',
  FIXED = 'FIXED',
}

export interface Coupon {
  id: string;
  code: string;
  discountType: DiscountType;
  discountValue: number;
  minOrderAmount?: number | null;
  maxDiscount?: number | null;
  usageLimit?: number | null;
  usageCount: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
  vendorId: string;
  createdAt: string;
  updatedAt: string;

  // Relations
  vendor?: {
    id: string;
    businessName: string;
  };
}

export interface CreateCouponDto {
  code: string;
  discountType: DiscountType;
  discountValue: number;
  minOrderAmount?: number;
  maxDiscount?: number;
  usageLimit?: number;
  startDate: Date | string;
  endDate: Date | string;
}

export interface UpdateCouponDto {
  code?: string;
  discountType?: DiscountType;
  discountValue?: number;
  minOrderAmount?: number;
  maxDiscount?: number;
  usageLimit?: number;
  startDate?: Date | string;
  endDate?: Date | string;
  isActive?: boolean;
}
