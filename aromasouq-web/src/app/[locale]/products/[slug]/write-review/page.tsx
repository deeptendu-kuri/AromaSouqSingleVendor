'use client';

import { useState } from 'react';
import { useParams, useRouter } from '@/i18n/navigation';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { StarRating } from '@/components/reviews/StarRating';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useProduct } from '@/hooks/useProducts';
import { useCreateReview, useUploadReviewImages } from '@/hooks/useReviews';
import { toast } from 'sonner';
import Link from 'next/link';
import Image from 'next/image';

// Helper function to get first product image
const getFirstProductImage = (product: any) => {
  if (product?.images && product.images.length > 0) {
    return product.images[0].url;
  }
  return null;
};

export default function WriteReviewPage() {
  const params = useParams();
  const router = useRouter();
  const { data: product, isLoading: productLoading } = useProduct(params.slug as string);
  const createReview = useCreateReview();
  const uploadImages = useUploadReviewImages();

  const [rating, setRating] = useState(0);
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);

    if (images.length + files.length > 5) {
      toast.error('You can only upload up to 5 images');
      return;
    }

    // Validate file types and sizes
    const validFiles = files.filter((file) => {
      if (!file.type.startsWith('image/')) {
        toast.error(`${file.name} is not an image`);
        return false;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`${file.name} is too large (max 5MB)`);
        return false;
      }
      return true;
    });

    // Create previews
    const newPreviews: string[] = [];
    validFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        newPreviews.push(e.target?.result as string);
        if (newPreviews.length === validFiles.length) {
          setImagePreviews([...imagePreviews, ...newPreviews]);
        }
      };
      reader.readAsDataURL(file);
    });

    setImages([...images, ...validFiles]);
  };

  const handleRemoveImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
    setImagePreviews(imagePreviews.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (rating === 0) {
      toast.error('Please select a rating');
      return;
    }

    if (!product) {
      toast.error('Product not found');
      return;
    }

    setIsSubmitting(true);

    try {
      // Create the review
      const review = await createReview.mutateAsync({
        productId: product.id,
        rating,
        title: title.trim() || undefined,
        comment: comment.trim() || undefined,
      });

      // Upload images if any
      if (images.length > 0) {
        await uploadImages.mutateAsync({
          reviewId: review.id,
          files: images,
        });
      }

      toast.success('Review submitted successfully!');
      router.push(`/products/${params.slug}?tab=reviews`);
    } catch (error: any) {
      toast.error(error?.message || 'Failed to submit review');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (productLoading || !product) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <Loader2 className="w-8 h-8 animate-spin mx-auto text-gray-400" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      {/* Back Button */}
      <Link href={`/products/${params.slug}`} className="inline-flex items-center gap-2 mb-6 text-gray-600 hover:text-gray-900">
        <ArrowLeft className="w-4 h-4" />
        Back to Product
      </Link>

      <Card>
        <CardHeader>
          <CardTitle>Write a Review</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Product Info */}
          <div className="flex items-center gap-4 mb-6 pb-6 border-b">
            <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-gray-100">
              <Image
                src={getFirstProductImage(product) || '/placeholder.png'}
                alt={product.nameEn}
                fill
                className="object-cover"
              />
            </div>
            <div>
              <h3 className="font-semibold">{product.nameEn}</h3>
              <p className="text-sm text-gray-600">{product.brand?.nameEn}</p>
            </div>
          </div>

          {/* Review Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Rating */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Overall Rating <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center gap-4">
                <StarRating rating={rating} size="lg" interactive onChange={setRating} />
                {rating > 0 && (
                  <span className="text-sm text-gray-600">{rating} out of 5 stars</span>
                )}
              </div>
            </div>

            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium mb-2">
                Review Title (Optional)
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Summarize your experience"
                maxLength={100}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <p className="text-xs text-gray-500 mt-1">{title.length}/100 characters</p>
            </div>

            {/* Comment */}
            <div>
              <label htmlFor="comment" className="block text-sm font-medium mb-2">
                Your Review (Optional)
              </label>
              <textarea
                id="comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share your thoughts about this product..."
                rows={6}
                maxLength={1000}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              />
              <p className="text-xs text-gray-500 mt-1">{comment.length}/1000 characters</p>
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Add Photos (Optional)
              </label>
              <p className="text-xs text-gray-500 mb-3">
                Upload up to 5 images (max 5MB each, JPG/PNG)
              </p>

              {/* Image Previews */}
              {imagePreviews.length > 0 && (
                <div className="flex gap-2 mb-3 flex-wrap">
                  {imagePreviews.map((preview, index) => (
                    <div key={index} className="relative w-20 h-20 rounded-lg overflow-hidden border">
                      <img src={preview} alt={`Preview ${index + 1}`} className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(index)}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Upload Button */}
              {images.length < 5 && (
                <div>
                  <input
                    type="file"
                    id="images"
                    accept="image/jpeg,image/png,image/jpg"
                    multiple
                    onChange={handleImageSelect}
                    className="hidden"
                  />
                  <label
                    htmlFor="images"
                    className="inline-flex items-center gap-2 px-4 py-2 border rounded-md cursor-pointer hover:bg-gray-50"
                  >
                    <span className="text-2xl">+</span>
                    <span>Add Photos</span>
                  </label>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <div className="flex gap-3 pt-4">
              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="flex-1"
                disabled={isSubmitting || rating === 0}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  'Submit Review'
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                size="lg"
                onClick={() => router.back()}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
