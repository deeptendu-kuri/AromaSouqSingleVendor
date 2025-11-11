import { Star } from 'lucide-react';

interface StarRatingProps {
  rating: number;
  maxRating?: number;
  size?: 'sm' | 'md' | 'lg';
  interactive?: boolean;
  onChange?: (rating: number) => void;
}

export function StarRating({
  rating,
  maxRating = 5,
  size = 'md',
  interactive = false,
  onChange,
}: StarRatingProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  const handleClick = (index: number) => {
    if (interactive && onChange) {
      onChange(index + 1);
    }
  };

  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: maxRating }).map((_, index) => {
        const isFilled = index < Math.floor(rating);
        const isHalf = index < rating && index >= Math.floor(rating);

        return (
          <button
            key={index}
            type="button"
            onClick={() => handleClick(index)}
            disabled={!interactive}
            className={`relative ${interactive ? 'cursor-pointer hover:scale-110 transition' : ''}`}
          >
            <Star
              className={`${sizeClasses[size]} ${
                isFilled
                  ? 'fill-yellow-400 text-yellow-400'
                  : isHalf
                  ? 'fill-yellow-200 text-yellow-400'
                  : 'fill-gray-200 text-gray-300'
              }`}
            />
          </button>
        );
      })}
    </div>
  );
}
