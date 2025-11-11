'use client';

import { useState } from 'react';
import { ReviewCard } from './ReviewCard';
import { useReviews } from '@/hooks/useReviews';
import { Loader2 } from 'lucide-react';

interface ReviewListProps {
  productId: string;
}

export function ReviewList({ productId }: ReviewListProps) {
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState<'recent' | 'helpful'>('recent');
  const limit = 10;

  const { data, isLoading, isError, error } = useReviews({
    productId,
    page,
    limit,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
        Failed to load reviews. Please try again later.
      </div>
    );
  }

  const reviews = data?.data || [];
  const meta = data?.meta || { total: 0, page: 1, limit: 10, totalPages: 1 };

  if (reviews.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No reviews yet. Be the first to review this product!</p>
      </div>
    );
  }

  // Sort reviews based on selected sort option
  const sortedReviews = [...reviews].sort((a, b) => {
    if (sortBy === 'recent') {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    } else {
      // Sort by helpful votes
      return b.helpfulCount - a.helpfulCount;
    }
  });

  return (
    <div className="space-y-6">
      {/* Sort Controls */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">
          {meta.total} {meta.total === 1 ? 'Review' : 'Reviews'}
        </h3>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as 'recent' | 'helpful')}
          className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="recent">Most Recent</option>
          <option value="helpful">Most Helpful</option>
        </select>
      </div>

      {/* Reviews */}
      <div className="space-y-4">
        {sortedReviews.map((review) => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </div>

      {/* Pagination */}
      {meta.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-6">
          <button
            onClick={() => setPage(page - 1)}
            disabled={page === 1}
            className="px-4 py-2 border rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <span className="px-4 py-2 text-sm text-gray-600">
            Page {page} of {meta.totalPages}
          </span>
          <button
            onClick={() => setPage(page + 1)}
            disabled={page === meta.totalPages}
            className="px-4 py-2 border rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
