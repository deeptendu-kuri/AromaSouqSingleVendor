export interface Review {
  id: string;
  userId: string;
  productId: string;
  rating: number;
  title?: string;
  comment?: string;
  images: string[];
  reviewImages?: ReviewImage[];
  vendorReply?: string;
  vendorRepliedAt?: string;
  helpfulCount: number;
  notHelpfulCount: number;
  isVerifiedPurchase: boolean;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    avatar?: string;
  };
}

export interface ReviewImage {
  id: string;
  url: string;
  sortOrder: number;
}

export interface ReviewStats {
  averageRating: number;
  totalReviews: number;
  ratingDistribution: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
  };
}
