'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import { ThumbsUp, ThumbsDown, CheckCircle } from 'lucide-react';
import { StarRating } from './StarRating';
import { Review } from '@/types/review';
import { useVoteReview } from '@/hooks/useReviews';
import { toast } from 'sonner';

interface ReviewCardProps {
  review: Review;
  showVendorReply?: boolean;
}

export function ReviewCard({ review, showVendorReply = true }: ReviewCardProps) {
  const [hasVoted, setHasVoted] = useState(false);
  const voteReview = useVoteReview();

  const handleVote = async (voteType: 'HELPFUL' | 'NOT_HELPFUL') => {
    if (hasVoted) {
      toast.error('You have already voted on this review');
      return;
    }

    try {
      await voteReview.mutateAsync({ reviewId: review.id, voteType });
      setHasVoted(true);
      toast.success('Thank you for your feedback!');
    } catch (error) {
      toast.error('Failed to submit vote');
    }
  };

  return (
    <div className="bg-white rounded-lg border p-6">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          {review.user.avatar ? (
            <img
              src={review.user.avatar}
              alt={`${review.user.firstName} ${review.user.lastName}`}
              className="w-10 h-10 rounded-full object-cover"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
              <span className="text-gray-600 font-medium">
                {review.user.firstName[0]}{review.user.lastName[0]}
              </span>
            </div>
          )}
          <div>
            <div className="font-medium">
              {review.user.firstName} {review.user.lastName}
            </div>
            <div className="text-sm text-gray-500">
              {format(new Date(review.createdAt), 'MMM d, yyyy')}
            </div>
          </div>
        </div>

        {review.isVerifiedPurchase && (
          <div className="flex items-center gap-1 text-green-600 text-sm">
            <CheckCircle className="w-4 h-4" />
            <span>Verified Purchase</span>
          </div>
        )}
      </div>

      {/* Rating */}
      <div className="mb-3">
        <StarRating rating={review.rating} size="sm" />
      </div>

      {/* Title */}
      {review.title && (
        <h4 className="font-semibold mb-2">{review.title}</h4>
      )}

      {/* Comment */}
      {review.comment && (
        <p className="text-gray-700 mb-4 whitespace-pre-wrap">{review.comment}</p>
      )}

      {/* Images */}
      {review.reviewImages && review.reviewImages.length > 0 && (
        <div className="flex gap-2 mb-4 flex-wrap">
          {review.reviewImages
            .sort((a, b) => a.sortOrder - b.sortOrder)
            .map((image) => (
              <img
                key={image.id}
                src={image.url}
                alt="Review image"
                className="w-20 h-20 object-cover rounded-lg cursor-pointer hover:opacity-80 transition"
                onClick={() => window.open(image.url, '_blank')}
              />
            ))}
        </div>
      )}

      {/* Vendor Reply */}
      {showVendorReply && review.vendorReply && (
        <div className="bg-gray-50 rounded-lg p-4 mb-4">
          <div className="font-medium text-sm mb-2">Response from Vendor</div>
          <p className="text-sm text-gray-700">{review.vendorReply}</p>
          {review.vendorRepliedAt && (
            <div className="text-xs text-gray-500 mt-2">
              {format(new Date(review.vendorRepliedAt), 'MMM d, yyyy')}
            </div>
          )}
        </div>
      )}

      {/* Helpful Voting */}
      <div className="flex items-center gap-4 pt-4 border-t">
        <span className="text-sm text-gray-600">Was this helpful?</span>
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleVote('HELPFUL')}
            disabled={hasVoted || voteReview.isPending}
            className="flex items-center gap-1 px-3 py-1 rounded-md border hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            <ThumbsUp className="w-4 h-4" />
            <span className="text-sm">{review.helpfulCount}</span>
          </button>
          <button
            onClick={() => handleVote('NOT_HELPFUL')}
            disabled={hasVoted || voteReview.isPending}
            className="flex items-center gap-1 px-3 py-1 rounded-md border hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            <ThumbsDown className="w-4 h-4" />
            <span className="text-sm">{review.notHelpfulCount}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
