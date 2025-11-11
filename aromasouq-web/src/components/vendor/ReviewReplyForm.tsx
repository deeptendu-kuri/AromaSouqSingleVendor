'use client';

import { useState } from 'react';
import { useVendorReply } from '@/hooks/useReviews';
import { Button } from '@/components/ui/button';
import { MessageSquare, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface ReviewReplyFormProps {
  reviewId: string;
  existingReply?: string;
}

export function ReviewReplyForm({
  reviewId,
  existingReply,
}: ReviewReplyFormProps) {
  const [reply, setReply] = useState(existingReply || '');
  const [isEditing, setIsEditing] = useState(!existingReply);

  const vendorReply = useVendorReply();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!reply.trim()) {
      toast.error('Reply cannot be empty');
      return;
    }

    try {
      await vendorReply.mutateAsync({ reviewId, reply: reply.trim() });
      toast.success('Reply posted successfully');
      setIsEditing(false);
    } catch (error: any) {
      toast.error(error?.message || 'Failed to post reply');
    }
  };

  if (!isEditing && existingReply) {
    return (
      <div className="mt-3 p-3 bg-blue-50 rounded border-l-4 border-blue-500">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-semibold text-blue-900">
            <MessageSquare className="w-4 h-4 inline mr-1" />
            Your Reply
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsEditing(true)}
          >
            Edit
          </Button>
        </div>
        <p className="text-sm text-blue-900">{existingReply}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mt-3 space-y-3">
      <textarea
        value={reply}
        onChange={(e) => setReply(e.target.value)}
        placeholder="Write your response to this review..."
        rows={3}
        maxLength={500}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm"
      />
      <div className="flex items-center justify-between">
        <span className="text-xs text-gray-500">{reply.length}/500</span>
        <div className="flex gap-2">
          {existingReply && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => {
                setReply(existingReply);
                setIsEditing(false);
              }}
            >
              Cancel
            </Button>
          )}
          <Button
            type="submit"
            size="sm"
            disabled={!reply.trim() || vendorReply.isPending}
          >
            {vendorReply.isPending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Posting...
              </>
            ) : (
              'Post Reply'
            )}
          </Button>
        </div>
      </div>
    </form>
  );
}
