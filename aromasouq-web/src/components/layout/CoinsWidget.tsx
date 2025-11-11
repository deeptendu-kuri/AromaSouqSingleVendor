'use client';

import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import Link from 'next/link';
import { Coins } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';

export function CoinsWidget() {
  const { isAuthenticated } = useAuth();

  const { data: profile, isLoading } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      return await apiClient.get('/users/profile');
    },
    enabled: isAuthenticated,
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  if (!isAuthenticated || isLoading) {
    return null;
  }

  const coinsBalance = profile?.coinsBalance || 0;

  return (
    <Button
      variant="ghost"
      size="sm"
      asChild
      className="relative hover:bg-yellow-50 transition-colors"
    >
      <Link href="/account/coins" className="flex items-center gap-2">
        <Coins className="h-5 w-5 text-yellow-600" />
        <span className="text-sm font-semibold text-yellow-700">
          {coinsBalance}
        </span>
      </Link>
    </Button>
  );
}
