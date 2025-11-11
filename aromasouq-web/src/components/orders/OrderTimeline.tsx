'use client';

import { Check, Package, Truck, MapPin, Clock } from 'lucide-react';
import { OrderStatus } from '@/lib/constants';
import { format } from 'date-fns';

interface TimelineStep {
  status: OrderStatus;
  label: string;
  icon: React.ElementType;
  description: string;
}

interface OrderTimelineProps {
  currentStatus: OrderStatus;
  trackingNumber?: string;
  createdAt: string;
  updatedAt: string;
}

const TIMELINE_STEPS: TimelineStep[] = [
  {
    status: OrderStatus.PENDING,
    label: 'Order Placed',
    icon: Clock,
    description: 'Your order has been received',
  },
  {
    status: OrderStatus.CONFIRMED,
    label: 'Confirmed',
    icon: Check,
    description: 'Order confirmed by vendor',
  },
  {
    status: OrderStatus.PROCESSING,
    label: 'Processing',
    icon: Package,
    description: 'Your order is being prepared',
  },
  {
    status: OrderStatus.SHIPPED,
    label: 'Shipped',
    icon: Truck,
    description: 'Order is on the way',
  },
  {
    status: OrderStatus.DELIVERED,
    label: 'Delivered',
    icon: MapPin,
    description: 'Order has been delivered',
  },
];

export function OrderTimeline({
  currentStatus,
  trackingNumber,
  createdAt,
  updatedAt,
}: OrderTimelineProps) {
  // Map status to step index
  const statusIndex: Record<OrderStatus, number> = {
    [OrderStatus.PENDING]: 0,
    [OrderStatus.CONFIRMED]: 1,
    [OrderStatus.PROCESSING]: 2,
    [OrderStatus.SHIPPED]: 3,
    [OrderStatus.DELIVERED]: 4,
    [OrderStatus.CANCELLED]: -1, // Special case
  };

  const currentIndex = statusIndex[currentStatus];
  const isCancelled = currentStatus === OrderStatus.CANCELLED;

  // If cancelled, show cancelled state
  if (isCancelled) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
            <span className="text-red-600 text-xl">✕</span>
          </div>
          <div>
            <h3 className="font-semibold text-red-900">Order Cancelled</h3>
            <p className="text-sm text-red-700">
              This order was cancelled on {format(new Date(updatedAt), 'MMM dd, yyyy')}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Timeline */}
      <div className="relative">
        {TIMELINE_STEPS.map((step, index) => {
          const isCompleted = index <= currentIndex;
          const isCurrent = index === currentIndex;
          const Icon = step.icon;

          return (
            <div key={step.status} className="relative pb-8 last:pb-0">
              {/* Connecting Line */}
              {index < TIMELINE_STEPS.length - 1 && (
                <div
                  className={`absolute left-5 top-10 w-0.5 h-full -ml-px ${
                    isCompleted ? 'bg-green-500' : 'bg-gray-300'
                  }`}
                />
              )}

              {/* Step Content */}
              <div className="flex items-start gap-4">
                {/* Icon Circle */}
                <div
                  className={`relative z-10 flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                    isCompleted
                      ? 'bg-green-500 border-green-500'
                      : isCurrent
                      ? 'bg-white border-green-500'
                      : 'bg-white border-gray-300'
                  }`}
                >
                  <Icon
                    className={`w-5 h-5 ${
                      isCompleted
                        ? 'text-white'
                        : isCurrent
                        ? 'text-green-500'
                        : 'text-gray-400'
                    }`}
                  />
                </div>

                {/* Step Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4
                      className={`font-semibold ${
                        isCompleted || isCurrent
                          ? 'text-gray-900'
                          : 'text-gray-500'
                      }`}
                    >
                      {step.label}
                    </h4>
                    {isCurrent && (
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">
                        Current Status
                      </span>
                    )}
                  </div>
                  <p
                    className={`text-sm mt-1 ${
                      isCompleted || isCurrent
                        ? 'text-gray-600'
                        : 'text-gray-400'
                    }`}
                  >
                    {step.description}
                  </p>

                  {/* Tracking Number for Shipped Status */}
                  {step.status === OrderStatus.SHIPPED && trackingNumber && isCompleted && (
                    <div className="mt-2 p-3 bg-blue-50 rounded-lg">
                      <p className="text-xs text-blue-700 mb-1">
                        Tracking Number
                      </p>
                      <p className="font-mono font-semibold text-blue-900">
                        {trackingNumber}
                      </p>
                    </div>
                  )}

                  {/* Timestamps */}
                  {isCompleted && (
                    <p className="text-xs text-gray-500 mt-1">
                      {index === 0
                        ? format(new Date(createdAt), 'MMM dd, yyyy HH:mm')
                        : format(new Date(updatedAt), 'MMM dd, yyyy HH:mm')}
                    </p>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Estimated Delivery (if shipped but not delivered) */}
      {currentStatus === OrderStatus.SHIPPED && (
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center gap-2">
            <Truck className="w-5 h-5 text-blue-600" />
            <div>
              <h4 className="font-semibold text-blue-900">On the Way</h4>
              <p className="text-sm text-blue-700">
                Estimated delivery: 2-3 business days
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
