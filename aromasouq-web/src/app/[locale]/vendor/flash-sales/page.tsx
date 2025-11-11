"use client"

import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useTranslations } from "next-intl"
import { apiClient } from "@/lib/api-client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Calendar, Flame, Percent, Clock, AlertCircle, CheckCircle2, X } from "lucide-react"
import toast from "react-hot-toast"
import Image from "next/image"
import { Link } from "@/i18n/navigation"

interface Product {
  id: string
  name: string
  images: string[]
  price: number
  salePrice?: number
  discountPercent?: number
  saleEndDate?: string
  stock: number
  isOnSale: boolean
}

interface FlashSaleResponse {
  active: Product[]
  expired: Product[]
  total: number
}

export default function FlashSalesPage() {
  const t = useTranslations('vendor.flashSales')
  const queryClient = useQueryClient()
  const [selectedProducts, setSelectedProducts] = useState<string[]>([])
  const [discountPercent, setDiscountPercent] = useState<number>(30)
  const [saleEndDate, setSaleEndDate] = useState<string>("")
  const [showAddModal, setShowAddModal] = useState(false)

  // Fetch all products for vendor
  const { data: allProducts, isLoading: loadingAllProducts } = useQuery<Product[]>({
    queryKey: ['vendor-products'],
    queryFn: () => apiClient.get<any>('/products?isActive=true').then(res => res.products || []),
  })

  // Fetch flash sale products
  const { data: flashSaleData, isLoading: loadingFlashSale } = useQuery<FlashSaleResponse>({
    queryKey: ['flash-sale-products'],
    queryFn: () => apiClient.get('/products/flash-sale/active'),
  })

  // Bulk add flash sale mutation
  const addFlashSaleMutation = useMutation({
    mutationFn: (data: { productIds: string[]; discountPercent: number; saleEndDate?: string }) =>
      apiClient.post('/products/flash-sale/set-discount', {
        productIds: data.productIds,
        discountPercent: data.discountPercent,
        saleEndDate: data.saleEndDate ? new Date(data.saleEndDate) : undefined,
      }),
    onSuccess: () => {
      toast.success(t('flashSaleAdded'))
      queryClient.invalidateQueries({ queryKey: ['flash-sale-products'] })
      queryClient.invalidateQueries({ queryKey: ['vendor-products'] })
      setSelectedProducts([])
      setShowAddModal(false)
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || t('failedToAdd'))
    },
  })

  // Bulk remove flash sale mutation
  const removeFlashSaleMutation = useMutation({
    mutationFn: (productIds: string[]) =>
      apiClient.post('/products/flash-sale/bulk-remove', { productIds }),
    onSuccess: () => {
      toast.success(t('flashSaleRemoved'))
      queryClient.invalidateQueries({ queryKey: ['flash-sale-products'] })
      queryClient.invalidateQueries({ queryKey: ['vendor-products'] })
      setSelectedProducts([])
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || t('failedToRemove'))
    },
  })

  const handleSelectProduct = (productId: string) => {
    setSelectedProducts(prev =>
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    )
  }

  const handleSelectAll = (products: Product[]) => {
    const productIds = products.map(p => p.id)
    const allSelected = productIds.every(id => selectedProducts.includes(id))

    if (allSelected) {
      setSelectedProducts(prev => prev.filter(id => !productIds.includes(id)))
    } else {
      setSelectedProducts(prev => [...new Set([...prev, ...productIds])])
    }
  }

  const handleAddFlashSale = () => {
    if (selectedProducts.length === 0) {
      toast.error(t('selectAtLeastOne'))
      return
    }

    addFlashSaleMutation.mutate({
      productIds: selectedProducts,
      discountPercent,
      saleEndDate: saleEndDate || undefined,
    })
  }

  const handleRemoveFlashSale = () => {
    if (selectedProducts.length === 0) {
      toast.error(t('selectAtLeastOne'))
      return
    }

    if (confirm(t('removeConfirm', { count: selectedProducts.length }))) {
      removeFlashSaleMutation.mutate(selectedProducts)
    }
  }

  const availableProducts = allProducts?.filter(p => !p.isOnSale) || []
  const activeFlashSales = flashSaleData?.active || []
  const expiredFlashSales = flashSaleData?.expired || []

  // Set default sale end date to 24 hours from now
  const defaultEndDate = new Date()
  defaultEndDate.setHours(defaultEndDate.getHours() + 24)
  const defaultEndDateString = defaultEndDate.toISOString().slice(0, 16)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Flame className="h-8 w-8 text-red-500" />
            {t('title')}
          </h1>
          <p className="text-muted-foreground mt-1">
            {t('subtitle')}
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('activeFlashSales')}</CardTitle>
            <Flame className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeFlashSales.length}</div>
            <p className="text-xs text-muted-foreground">{t('activeFlashSalesCount')}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('availableProducts')}</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{availableProducts.length}</div>
            <p className="text-xs text-muted-foreground">{t('availableProductsCount')}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('selectedProducts')}</CardTitle>
            <Percent className="h-4 w-4 text-oud-gold" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{selectedProducts.length}</div>
            <p className="text-xs text-muted-foreground">{t('selectedProductsCount')}</p>
          </CardContent>
        </Card>
      </div>

      {/* Bulk Actions */}
      {selectedProducts.length > 0 && (
        <Card className="border-oud-gold">
          <CardHeader>
            <CardTitle className="text-lg">{t('bulkActions', { count: selectedProducts.length })}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="discount">{t('discountPercentage')}</Label>
                <div className="flex items-center gap-2 mt-1.5">
                  <Input
                    id="discount"
                    type="number"
                    min="1"
                    max="90"
                    value={discountPercent}
                    onChange={(e) => setDiscountPercent(parseInt(e.target.value) || 30)}
                    className="flex-1"
                  />
                  <Percent className="h-4 w-4 text-muted-foreground" />
                </div>
              </div>

              <div>
                <Label htmlFor="endDate">{t('saleEndDate')}</Label>
                <div className="flex items-center gap-2 mt-1.5">
                  <Input
                    id="endDate"
                    type="datetime-local"
                    value={saleEndDate}
                    onChange={(e) => setSaleEndDate(e.target.value)}
                    placeholder={defaultEndDateString}
                    className="flex-1"
                  />
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </div>
              </div>

              <div className="flex items-end gap-2">
                <Button
                  onClick={handleAddFlashSale}
                  disabled={addFlashSaleMutation.isPending}
                  className="flex-1"
                  variant="default"
                >
                  {addFlashSaleMutation.isPending ? t('adding') : t('addToFlashSale')}
                </Button>
                <Button
                  onClick={handleRemoveFlashSale}
                  disabled={removeFlashSaleMutation.isPending}
                  variant="destructive"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Active Flash Sales */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>{t('activeFlashSalesTitle')}</CardTitle>
              <CardDescription>{t('activeFlashSalesDesc')}</CardDescription>
            </div>
            {activeFlashSales.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleSelectAll(activeFlashSales)}
              >
                {activeFlashSales.every(p => selectedProducts.includes(p.id))
                  ? t('deselectAll')
                  : t('selectAll')}
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {loadingFlashSale ? (
            <div className="text-center py-8 text-muted-foreground">{t('loading')}</div>
          ) : activeFlashSales.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <AlertCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>{t('noActiveFlashSales')}</p>
              <p className="text-sm mt-1">{t('noActiveFlashSalesDesc')}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {activeFlashSales.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  isSelected={selectedProducts.includes(product.id)}
                  onSelect={handleSelectProduct}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Available Products */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>{t('availableProductsTitle')}</CardTitle>
              <CardDescription>{t('availableProductsDesc')}</CardDescription>
            </div>
            {availableProducts.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleSelectAll(availableProducts)}
              >
                {availableProducts.every(p => selectedProducts.includes(p.id))
                  ? t('deselectAll')
                  : t('selectAll')}
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {loadingAllProducts ? (
            <div className="text-center py-8 text-muted-foreground">{t('loading')}</div>
          ) : availableProducts.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <AlertCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>{t('noAvailableProducts')}</p>
              <p className="text-sm mt-1">{t('noAvailableProductsDesc')}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {availableProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  isSelected={selectedProducts.includes(product.id)}
                  onSelect={handleSelectProduct}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Expired Flash Sales */}
      {expiredFlashSales.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>{t('expiredFlashSales')}</CardTitle>
            <CardDescription>{t('expiredFlashSalesDesc')}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {expiredFlashSales.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  isSelected={false}
                  onSelect={() => {}}
                  isExpired
                />
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

interface ProductCardProps {
  product: Product
  isSelected: boolean
  onSelect: (id: string) => void
  isExpired?: boolean
}

function ProductCard({ product, isSelected, onSelect, isExpired = false }: ProductCardProps) {
  const t = useTranslations('vendor.flashSales')
  const imageUrl = Array.isArray(product.images) && product.images.length > 0
    ? product.images[0]
    : '/placeholder-product.png'

  const endDate = product.saleEndDate ? new Date(product.saleEndDate) : null
  const isEnding = endDate && endDate.getTime() - Date.now() < 24 * 60 * 60 * 1000

  return (
    <div className={`relative border rounded-lg p-4 transition-all ${
      isSelected ? 'border-oud-gold ring-2 ring-oud-gold/20' : 'border-gray-200'
    } ${isExpired ? 'opacity-60' : ''}`}>
      <div className="flex items-start gap-3">
        {!isExpired && (
          <Checkbox
            checked={isSelected}
            onCheckedChange={() => onSelect(product.id)}
            className="mt-1"
          />
        )}

        <div className="relative w-16 h-16 flex-shrink-0 rounded-md overflow-hidden bg-gray-100">
          <Image
            src={imageUrl}
            alt={product.name}
            fill
            className="object-cover"
          />
        </div>

        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-sm truncate">{product.name}</h4>

          <div className="flex items-center gap-2 mt-1">
            {product.isOnSale && product.salePrice ? (
              <>
                <span className="text-sm font-bold text-red-600">
                  AED {product.salePrice}
                </span>
                <span className="text-xs line-through text-muted-foreground">
                  AED {product.price}
                </span>
                {product.discountPercent && (
                  <Badge variant="destructive" className="text-xs">
                    -{product.discountPercent}%
                  </Badge>
                )}
              </>
            ) : (
              <span className="text-sm font-medium">AED {product.price}</span>
            )}
          </div>

          {product.isOnSale && endDate && (
            <div className={`flex items-center gap-1 mt-2 text-xs ${
              isExpired ? 'text-muted-foreground' : isEnding ? 'text-red-600' : 'text-muted-foreground'
            }`}>
              <Clock className="h-3 w-3" />
              {isExpired ? t('expired') : t('ends', { date: endDate.toLocaleDateString() })}
            </div>
          )}

          <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
            <span>{t('stock', { count: product.stock })}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
