'use client'

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from '@/i18n/navigation'
import { useTranslations } from 'next-intl'
import { CheckCircle, Package, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { apiClient } from '@/lib/api-client'
import { formatCurrency, formatDate } from '@/lib/utils'

export default function OrderSuccessPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const t = useTranslations('orderSuccessPage')
  const orderId = searchParams.get('orderId')
  const [order, setOrder] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!orderId) {
      router.push('/')
      return
    }

    const fetchOrder = async () => {
      try {
        const data = await apiClient.get(`/orders/${orderId}`)
        setOrder(data)
      } catch (error) {
        console.error('Failed to fetch order:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchOrder()
  }, [orderId, router])

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-gray-600">{t('loadingOrder')}</p>
        </div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-gray-600">{t('orderNotFound')}</p>
          <Button asChild className="mt-4">
            <Link href="/">{t('goHome')}</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-2xl mx-auto">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('title')}</h1>
          <p className="text-gray-600">
            {t('subtitle')}
          </p>
        </div>

        {/* Order Details Card */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>{t('orderDetails')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center pb-4 border-b">
              <div>
                <p className="text-sm text-gray-600">{t('orderNumber')}</p>
                <p className="font-semibold">{order.orderNumber}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">{t('orderDate')}</p>
                <p className="font-semibold">{formatDate(order.createdAt)}</p>
              </div>
            </div>

            <div className="flex justify-between items-center pb-4 border-b">
              <div>
                <p className="text-sm text-gray-600">{t('totalAmount')}</p>
                <p className="text-2xl font-bold text-oud-gold">{formatCurrency(order.total)}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">{t('paymentStatus')}</p>
                <p className="font-semibold text-green-600 capitalize">{order.paymentStatus}</p>
              </div>
            </div>

            <div>
              <p className="text-sm text-gray-600 mb-2">{t('deliveryAddress')}</p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="font-medium">{order.address?.name}</p>
                <p className="text-sm text-gray-600">{order.address?.street}</p>
                <p className="text-sm text-gray-600">
                  {order.address?.city}, {order.address?.state} {order.address?.zipCode}
                </p>
                <p className="text-sm text-gray-600">{order.address?.country}</p>
                <p className="text-sm text-gray-600 mt-2">Phone: {order.address?.phone}</p>
              </div>
            </div>

            {/* Order Items */}
            <div>
              <p className="text-sm text-gray-600 mb-2">{t('itemsOrdered')} ({order.items?.length || 0})</p>
              <div className="space-y-2">
                {order.items?.map((item: any) => (
                  <div key={item.id} className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg">
                    <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center">
                      <Package className="w-6 h-6 text-gray-400" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{item.product?.name}</p>
                      <p className="text-sm text-gray-600">{t('quantity')}: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{formatCurrency(item.price * item.quantity)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* What's Next */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>{t('whatsNext')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex gap-3">
              <div className="w-6 h-6 rounded-full bg-oud-gold text-white flex items-center justify-center text-sm font-semibold flex-shrink-0">
                1
              </div>
              <div>
                <p className="font-medium">{t('confirmation')}</p>
                <p className="text-sm text-gray-600">
                  {t('confirmationDesc').replace('{email}', order.user?.email || 'your email')}
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="w-6 h-6 rounded-full bg-oud-gold text-white flex items-center justify-center text-sm font-semibold flex-shrink-0">
                2
              </div>
              <div>
                <p className="font-medium">{t('processing')}</p>
                <p className="text-sm text-gray-600">
                  {t('processingDesc')}
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="w-6 h-6 rounded-full bg-gray-300 text-white flex items-center justify-center text-sm font-semibold flex-shrink-0">
                3
              </div>
              <div>
                <p className="font-medium">{t('delivery')}</p>
                <p className="text-sm text-gray-600">
                  {t('deliveryDesc')}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Button asChild className="flex-1">
            <Link href={`/account/orders/${order.id}`}>
              {t('viewOrderDetails')}
              <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </Button>
          <Button asChild variant="outline" className="flex-1">
            <Link href="/products">{t('continueShopping')}</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
