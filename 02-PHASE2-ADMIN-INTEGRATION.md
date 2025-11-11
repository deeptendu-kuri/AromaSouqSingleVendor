# 👨‍💼 PHASE 2: Admin Integration & Testing

## Overview
**Goal:** Enable admin to review and approve vendors, moderate products, manage users, and oversee the platform.

**Why Admin Second?** After vendors create products, admins must approve them before customers can see and purchase them.

**Timeline:** 5-7 days
**Prerequisites:** Phase 1 complete, vendor products created

---

## 📋 Phase 2 Scope

### Features to Integrate
1. ✅ Admin Dashboard with Statistics
2. ✅ Vendor Management & Approval
3. ✅ Product Moderation
4. ✅ User Management
5. ✅ Review Moderation
6. ✅ Order Overview (prepare for customer phase)

### Backend Endpoints Used
```
GET    /api/admin/dashboard/stats      - Dashboard statistics
GET    /api/admin/users                - List all users
PATCH  /api/admin/users/:id/status     - Update user status
GET    /api/admin/products             - List all products
PATCH  /api/products/:id               - Approve/edit product (reuse)
DELETE /api/products/:id               - Delete product (reuse)
GET    /api/admin/orders               - List all orders
GET    /api/admin/reviews              - List all reviews
PATCH  /api/reviews/:id/publish        - Toggle review publish status
```

### Frontend Pages
```
/admin                                  - Admin dashboard
/admin/users                            - User management
/admin/vendors                          - Vendor list
/admin/vendors/[id]/review              - Vendor review/approval
/admin/products                         - Product moderation
/admin/reviews                          - Review moderation
```

---

## 🛠️ STEP 1: Create Admin Service Layer

### 1.1 Create Admin Types

**File:** `src/types/api/admin.types.ts`

```typescript
export interface DashboardStats {
  totalUsers: number;
  totalOrders: number;
  totalProducts: number;
  totalReviews: number;
  totalRevenue: number;
  pendingVendors?: number;
  pendingReviews?: number;
}

export interface AdminUserFilters {
  role?: 'ADMIN' | 'CUSTOMER' | 'VENDOR';
  status?: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
  page?: number;
  limit?: number;
}

export interface UpdateUserStatusDto {
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
}

export interface AdminOrderFilters {
  status?: string;
  userId?: string;
  page?: number;
  limit?: number;
}

export interface AdminProductFilters {
  isActive?: boolean;
  isFeatured?: boolean;
  page?: number;
  limit?: number;
}

export interface AdminReviewFilters {
  isPublished?: boolean;
  productId?: string;
  page?: number;
  limit?: number;
}
```

### 1.2 Create Admin Service

**File:** `src/services/admin.service.ts`

```typescript
import { apiClient } from '@/lib/api-client';
import type {
  DashboardStats,
  AdminUserFilters,
  UpdateUserStatusDto,
  AdminOrderFilters,
  AdminProductFilters,
  AdminReviewFilters
} from '@/types/api/admin.types';
import type { User } from '@/types/api/auth.types';
import type { Product } from '@/types/api/product.types';
import type { PaginatedResponse } from '@/types/api/common.types';

export const adminService = {
  /**
   * Get dashboard statistics
   */
  getDashboardStats: async (): Promise<DashboardStats> => {
    const response = await apiClient.get<DashboardStats>('/admin/dashboard/stats');
    return response;
  },

  /**
   * Get all users with filters
   */
  getUsers: async (filters?: AdminUserFilters): Promise<PaginatedResponse<User>> => {
    const response = await apiClient.get<PaginatedResponse<User>>('/admin/users', filters);
    return response;
  },

  /**
   * Update user status
   */
  updateUserStatus: async (userId: string, data: UpdateUserStatusDto): Promise<User> => {
    const response = await apiClient.patch<User>(`/admin/users/${userId}/status`, data);
    return response;
  },

  /**
   * Get all orders (admin view)
   */
  getOrders: async (filters?: AdminOrderFilters): Promise<PaginatedResponse<any>> => {
    const response = await apiClient.get<PaginatedResponse<any>>('/admin/orders', filters);
    return response;
  },

  /**
   * Get all products (admin view)
   */
  getProducts: async (filters?: AdminProductFilters): Promise<PaginatedResponse<Product>> => {
    const response = await apiClient.get<PaginatedResponse<Product>>('/admin/products', filters);
    return response;
  },

  /**
   * Get all reviews (admin view)
   */
  getReviews: async (filters?: AdminReviewFilters): Promise<PaginatedResponse<any>> => {
    const response = await apiClient.get<PaginatedResponse<any>>('/admin/reviews', filters);
    return response;
  },
};
```

### 1.3 Create Reviews Service

**File:** `src/services/reviews.service.ts`

```typescript
import { apiClient } from '@/lib/api-client';

export const reviewsService = {
  /**
   * Toggle review publish status (Admin only)
   */
  togglePublish: async (reviewId: string): Promise<any> => {
    const response = await apiClient.patch(`/reviews/${reviewId}/publish`, {});
    return response;
  },
};
```

---

## 📊 STEP 2: Admin Dashboard Integration

### 2.1 Create Dashboard Hook

**File:** `src/hooks/useAdminStats.ts`

```typescript
import { useQuery } from '@tanstack/react-query';
import { adminService } from '@/services/admin.service';

export function useAdminStats() {
  return useQuery({
    queryKey: ['admin-stats'],
    queryFn: adminService.getDashboardStats,
    refetchInterval: 60000, // Refetch every minute
  });
}
```

### 2.2 Update Admin Dashboard Page

**File:** `src/app/admin/page.tsx`

```typescript
'use client';

import { useAuthStore } from '@/stores/authStore';
import { useAdminStats } from '@/hooks/useAdminStats';
import { StatsCard } from '@/components/ui/stats-card';
import { Users, ShoppingBag, Package, Star, DollarSign, AlertCircle } from 'lucide-react';
import { redirect } from 'next/navigation';

export default function AdminDashboard() {
  const { user, isAuthenticated } = useAuthStore();
  const { data: stats, isLoading } = useAdminStats();

  // Protect route
  if (!isAuthenticated || user?.role !== 'ADMIN') {
    redirect('/login');
  }

  return (
    <div className="container mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-gray-600 mt-2">
          Platform overview and management
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <StatsCard
          title="Total Users"
          value={stats?.totalUsers || 0}
          icon={<Users className="w-6 h-6" />}
          loading={isLoading}
        />
        <StatsCard
          title="Total Orders"
          value={stats?.totalOrders || 0}
          icon={<ShoppingBag className="w-6 h-6" />}
          loading={isLoading}
        />
        <StatsCard
          title="Total Products"
          value={stats?.totalProducts || 0}
          icon={<Package className="w-6 h-6" />}
          loading={isLoading}
        />
        <StatsCard
          title="Total Reviews"
          value={stats?.totalReviews || 0}
          icon={<Star className="w-6 h-6" />}
          loading={isLoading}
        />
        <StatsCard
          title="Total Revenue"
          value={`AED ${stats?.totalRevenue?.toFixed(2) || '0.00'}`}
          icon={<DollarSign className="w-6 h-6" />}
          loading={isLoading}
        />
        <StatsCard
          title="Pending Vendors"
          value={stats?.pendingVendors || 0}
          icon={<AlertCircle className="w-6 h-6" />}
          variant="warning"
          loading={isLoading}
        />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <a
          href="/admin/vendors"
          className="p-6 border rounded-lg hover:shadow-lg transition-shadow"
        >
          <h3 className="text-xl font-semibold mb-2">Manage Vendors</h3>
          <p className="text-gray-600">
            Review and approve vendor applications
          </p>
          {stats?.pendingVendors && stats.pendingVendors > 0 && (
            <div className="mt-4 inline-block px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm font-medium">
              {stats.pendingVendors} pending
            </div>
          )}
        </a>

        <a
          href="/admin/products"
          className="p-6 border rounded-lg hover:shadow-lg transition-shadow"
        >
          <h3 className="text-xl font-semibold mb-2">Moderate Products</h3>
          <p className="text-gray-600">
            Review and moderate product listings
          </p>
        </a>

        <a
          href="/admin/users"
          className="p-6 border rounded-lg hover:shadow-lg transition-shadow"
        >
          <h3 className="text-xl font-semibold mb-2">Manage Users</h3>
          <p className="text-gray-600">
            View and manage all platform users
          </p>
        </a>

        <a
          href="/admin/reviews"
          className="p-6 border rounded-lg hover:shadow-lg transition-shadow"
        >
          <h3 className="text-xl font-semibold mb-2">Moderate Reviews</h3>
          <p className="text-gray-600">
            Manage customer product reviews
          </p>
        </a>

        <a
          href="/admin/orders"
          className="p-6 border rounded-lg hover:shadow-lg transition-shadow"
        >
          <h3 className="text-xl font-semibold mb-2">View Orders</h3>
          <p className="text-gray-600">
            Monitor all platform orders
          </p>
        </a>
      </div>
    </div>
  );
}
```

---

## 👥 STEP 3: User Management Integration

### 3.1 Update Users Page

**File:** `src/app/admin/users/page.tsx`

```typescript
'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminService } from '@/services/admin.service';
import { useAuthStore } from '@/stores/authStore';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import toast from 'react-hot-toast';
import { redirect } from 'next/navigation';
import type { User } from '@/types/api/auth.types';

export default function AdminUsersPage() {
  const { user: currentUser, isAuthenticated } = useAuthStore();
  const queryClient = useQueryClient();
  const [roleFilter, setRoleFilter] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [page, setPage] = useState(1);
  const limit = 20;

  // Protect route
  if (!isAuthenticated || currentUser?.role !== 'ADMIN') {
    redirect('/login');
  }

  // Fetch users
  const { data, isLoading } = useQuery({
    queryKey: ['admin-users', roleFilter, statusFilter, page],
    queryFn: () => adminService.getUsers({
      role: roleFilter as any || undefined,
      status: statusFilter as any || undefined,
      page,
      limit,
    }),
  });

  // Update status mutation
  const statusMutation = useMutation({
    mutationFn: ({ userId, status }: { userId: string; status: any }) =>
      adminService.updateUserStatus(userId, { status }),
    onSuccess: () => {
      toast.success('User status updated');
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      queryClient.invalidateQueries({ queryKey: ['admin-stats'] });
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Failed to update user status');
    },
  });

  const handleStatusChange = (user: User, newStatus: string) => {
    if (user.id === currentUser?.id) {
      toast.error('Cannot modify your own status');
      return;
    }

    if (confirm(`Change ${user.firstName} ${user.lastName}'s status to ${newStatus}?`)) {
      statusMutation.mutate({ userId: user.id, status: newStatus });
    }
  };

  const users = data?.data || [];
  const meta = data?.meta;

  return (
    <div className="container mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">User Management</h1>
        <p className="text-gray-600 mt-2">
          Manage all platform users
        </p>
      </div>

      {/* Filters */}
      <div className="flex gap-4 mb-6">
        <div className="w-48">
          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Roles</SelectItem>
              <SelectItem value="ADMIN">Admin</SelectItem>
              <SelectItem value="VENDOR">Vendor</SelectItem>
              <SelectItem value="CUSTOMER">Customer</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="w-48">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Statuses</SelectItem>
              <SelectItem value="ACTIVE">Active</SelectItem>
              <SelectItem value="INACTIVE">Inactive</SelectItem>
              <SelectItem value="SUSPENDED">Suspended</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Users Table */}
      {isLoading ? (
        <div className="text-center py-12">Loading users...</div>
      ) : (
        <>
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Joined
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        {user.avatar && (
                          <img
                            src={user.avatar}
                            alt={user.firstName}
                            className="w-10 h-10 rounded-full mr-3"
                          />
                        )}
                        <div>
                          <div className="font-medium">
                            {user.firstName} {user.lastName}
                          </div>
                          {user.phone && (
                            <div className="text-sm text-gray-500">{user.phone}</div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm">{user.email}</td>
                    <td className="px-6 py-4">
                      <Badge variant="outline">{user.role}</Badge>
                    </td>
                    <td className="px-6 py-4">
                      <Badge
                        variant={
                          user.status === 'ACTIVE'
                            ? 'success'
                            : user.status === 'SUSPENDED'
                            ? 'destructive'
                            : 'secondary'
                        }
                      >
                        {user.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Select
                        value={user.status}
                        onValueChange={(value) => handleStatusChange(user, value)}
                        disabled={user.id === currentUser?.id || statusMutation.isPending}
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ACTIVE">Active</SelectItem>
                          <SelectItem value="INACTIVE">Inactive</SelectItem>
                          <SelectItem value="SUSPENDED">Suspended</SelectItem>
                        </SelectContent>
                      </Select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {meta && meta.totalPages > 1 && (
            <div className="flex justify-center items-center space-x-4 mt-6">
              <Button
                variant="outline"
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                Previous
              </Button>
              <span className="text-sm text-gray-600">
                Page {page} of {meta.totalPages}
              </span>
              <Button
                variant="outline"
                onClick={() => setPage(p => Math.min(meta.totalPages, p + 1))}
                disabled={page === meta.totalPages}
              >
                Next
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
```

---

## 🏪 STEP 4: Vendor Management Integration

### 4.1 Create Vendors List Page

**File:** `src/app/admin/vendors/page.tsx`

```typescript
'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { adminService } from '@/services/admin.service';
import { useAuthStore } from '@/stores/authStore';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye } from 'lucide-react';
import { redirect } from 'next/navigation';

export default function AdminVendorsPage() {
  const { user, isAuthenticated } = useAuthStore();
  const [page, setPage] = useState(1);
  const limit = 20;

  // Protect route
  if (!isAuthenticated || user?.role !== 'ADMIN') {
    redirect('/login');
  }

  // Fetch vendors (users with role=VENDOR)
  const { data, isLoading } = useQuery({
    queryKey: ['admin-vendors', page],
    queryFn: () => adminService.getUsers({
      role: 'VENDOR',
      page,
      limit,
    }),
  });

  const vendors = data?.data || [];
  const meta = data?.meta;

  return (
    <div className="container mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Vendor Management</h1>
        <p className="text-gray-600 mt-2">
          Review and manage vendor accounts
        </p>
      </div>

      {/* Vendors Table */}
      {isLoading ? (
        <div className="text-center py-12">Loading vendors...</div>
      ) : (
        <>
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Vendor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Joined
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {vendors.map((vendor) => (
                  <tr key={vendor.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-medium">
                          {vendor.firstName} {vendor.lastName}
                        </div>
                        {vendor.phone && (
                          <div className="text-sm text-gray-500">{vendor.phone}</div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm">{vendor.email}</td>
                    <td className="px-6 py-4">
                      <Badge
                        variant={
                          vendor.status === 'ACTIVE'
                            ? 'success'
                            : vendor.status === 'SUSPENDED'
                            ? 'destructive'
                            : 'secondary'
                        }
                      >
                        {vendor.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {new Date(vendor.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.location.href = `/admin/vendors/${vendor.id}/review`}
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        Review
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {meta && meta.totalPages > 1 && (
            <div className="flex justify-center items-center space-x-4 mt-6">
              <Button
                variant="outline"
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                Previous
              </Button>
              <span className="text-sm text-gray-600">
                Page {page} of {meta.totalPages}
              </span>
              <Button
                variant="outline"
                onClick={() => setPage(p => Math.min(meta.totalPages, p + 1))}
                disabled={page === meta.totalPages}
              >
                Next
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
```

### 4.2 Create Vendor Review Page

**File:** `src/app/admin/vendors/[id]/review/page.tsx`

```typescript
'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminService } from '@/services/admin.service';
import { productsService } from '@/services/products.service';
import { useAuthStore } from '@/stores/authStore';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import { redirect } from 'next/navigation';

export default function VendorReviewPage({ params }: { params: { id: string } }) {
  const { user, isAuthenticated } = useAuthStore();
  const queryClient = useQueryClient();

  // Protect route
  if (!isAuthenticated || user?.role !== 'ADMIN') {
    redirect('/login');
  }

  // Fetch vendor details
  const { data: vendorData } = useQuery({
    queryKey: ['admin-vendor', params.id],
    queryFn: async () => {
      const response = await adminService.getUsers({ page: 1, limit: 1000 });
      return response.data.find(u => u.id === params.id);
    },
  });

  // Fetch vendor products
  const { data: productsData } = useQuery({
    queryKey: ['admin-vendor-products', params.id],
    queryFn: () => productsService.getAll({ vendorId: params.id, page: 1, limit: 100 }),
  });

  // Status update mutation
  const statusMutation = useMutation({
    mutationFn: (status: 'ACTIVE' | 'SUSPENDED') =>
      adminService.updateUserStatus(params.id, { status }),
    onSuccess: () => {
      toast.success('Vendor status updated');
      queryClient.invalidateQueries({ queryKey: ['admin-vendor'] });
      queryClient.invalidateQueries({ queryKey: ['admin-vendors'] });
    },
  });

  if (!vendorData) {
    return <div className="container mx-auto p-6">Loading...</div>;
  }

  const products = productsData?.data || [];

  return (
    <div className="container mx-auto p-6">
      {/* Back Button */}
      <Button
        variant="ghost"
        onClick={() => window.history.back()}
        className="mb-4"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Vendors
      </Button>

      {/* Vendor Info */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold mb-2">
              {vendorData.firstName} {vendorData.lastName}
            </h1>
            <p className="text-gray-600">{vendorData.email}</p>
            {vendorData.phone && (
              <p className="text-gray-600">{vendorData.phone}</p>
            )}
          </div>
          <Badge
            variant={vendorData.status === 'ACTIVE' ? 'success' : 'destructive'}
          >
            {vendorData.status}
          </Badge>
        </div>

        <div className="mt-6 pt-6 border-t">
          <h3 className="font-semibold mb-4">Actions</h3>
          <div className="flex gap-4">
            {vendorData.status !== 'ACTIVE' && (
              <Button
                onClick={() => statusMutation.mutate('ACTIVE')}
                disabled={statusMutation.isPending}
              >
                Approve Vendor
              </Button>
            )}
            {vendorData.status === 'ACTIVE' && (
              <Button
                variant="destructive"
                onClick={() => statusMutation.mutate('SUSPENDED')}
                disabled={statusMutation.isPending}
              >
                Suspend Vendor
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Vendor Products */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">
          Vendor Products ({products.length})
        </h2>

        {products.length === 0 ? (
          <p className="text-gray-600">No products yet</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.map((product) => (
              <div key={product.id} className="border rounded-lg p-4">
                {product.images?.[0] && (
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-48 object-cover rounded mb-3"
                  />
                )}
                <h3 className="font-semibold">{product.name}</h3>
                <p className="text-sm text-gray-600 mb-2">
                  AED {product.price.toFixed(2)}
                </p>
                <div className="flex justify-between items-center">
                  <Badge variant={product.isActive ? 'success' : 'secondary'}>
                    {product.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                  <span className="text-sm text-gray-600">
                    Stock: {product.stock}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
```

---

## 📦 STEP 5: Product Moderation Integration

**File:** `src/app/admin/products/page.tsx`

```typescript
'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminService } from '@/services/admin.service';
import { productsService } from '@/services/products.service';
import { useAuthStore } from '@/stores/authStore';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye, Trash2, Check, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { redirect } from 'next/navigation';

export default function AdminProductsPage() {
  const { user, isAuthenticated } = useAuthStore();
  const queryClient = useQueryClient();
  const [activeFilter, setActiveFilter] = useState<boolean | undefined>(undefined);
  const [page, setPage] = useState(1);
  const limit = 20;

  // Protect route
  if (!isAuthenticated || user?.role !== 'ADMIN') {
    redirect('/login');
  }

  // Fetch products
  const { data, isLoading } = useQuery({
    queryKey: ['admin-products', activeFilter, page],
    queryFn: () => adminService.getProducts({
      isActive: activeFilter,
      page,
      limit,
    }),
  });

  // Toggle active mutation
  const toggleActiveMutation = useMutation({
    mutationFn: ({ productId, isActive }: { productId: string; isActive: boolean }) =>
      productsService.update(productId, { isActive }),
    onSuccess: () => {
      toast.success('Product status updated');
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (productId: string) => productsService.delete(productId),
    onSuccess: () => {
      toast.success('Product deleted');
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
    },
  });

  const products = data?.data || [];
  const meta = data?.meta;

  return (
    <div className="container mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Product Moderation</h1>
        <p className="text-gray-600 mt-2">
          Review and moderate all products
        </p>
      </div>

      {/* Filters */}
      <div className="flex gap-4 mb-6">
        <Button
          variant={activeFilter === undefined ? 'default' : 'outline'}
          onClick={() => setActiveFilter(undefined)}
        >
          All Products
        </Button>
        <Button
          variant={activeFilter === true ? 'default' : 'outline'}
          onClick={() => setActiveFilter(true)}
        >
          Active
        </Button>
        <Button
          variant={activeFilter === false ? 'default' : 'outline'}
          onClick={() => setActiveFilter(false)}
        >
          Inactive
        </Button>
      </div>

      {/* Products Table */}
      {isLoading ? (
        <div className="text-center py-12">Loading products...</div>
      ) : (
        <>
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Product
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Vendor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Stock
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {products.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        {product.images?.[0] && (
                          <img
                            src={product.images[0]}
                            alt={product.name}
                            className="w-12 h-12 object-cover rounded mr-4"
                          />
                        )}
                        <div>
                          <div className="font-medium">{product.name}</div>
                          <div className="text-sm text-gray-500">
                            {product.category?.name}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {product.vendor && `${(product.vendor as any).user?.firstName || 'Vendor'}`}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium">
                      AED {product.price.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-sm">{product.stock}</td>
                    <td className="px-6 py-4">
                      <Badge variant={product.isActive ? 'success' : 'secondary'}>
                        {product.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => window.open(`/products/${product.slug}`, '_blank')}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      {product.isActive ? (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            toggleActiveMutation.mutate({
                              productId: product.id,
                              isActive: false,
                            })
                          }
                        >
                          <X className="w-4 h-4 text-orange-500" />
                        </Button>
                      ) : (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            toggleActiveMutation.mutate({
                              productId: product.id,
                              isActive: true,
                            })
                          }
                        >
                          <Check className="w-4 h-4 text-green-500" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          if (confirm('Delete this product permanently?')) {
                            deleteMutation.mutate(product.id);
                          }
                        }}
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {meta && meta.totalPages > 1 && (
            <div className="flex justify-center items-center space-x-4 mt-6">
              <Button
                variant="outline"
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                Previous
              </Button>
              <span className="text-sm text-gray-600">
                Page {page} of {meta.totalPages}
              </span>
              <Button
                variant="outline"
                onClick={() => setPage(p => Math.min(meta.totalPages, p + 1))}
                disabled={page === meta.totalPages}
              >
                Next
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
```

---

## ⭐ STEP 6: Review Moderation Integration

**File:** `src/app/admin/reviews/page.tsx`

```typescript
'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminService } from '@/services/admin.service';
import { reviewsService } from '@/services/reviews.service';
import { useAuthStore } from '@/stores/authStore';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';
import { redirect } from 'next/navigation';

export default function AdminReviewsPage() {
  const { user, isAuthenticated } = useAuthStore();
  const queryClient = useQueryClient();
  const [publishedFilter, setPublishedFilter] = useState<boolean | undefined>(undefined);
  const [page, setPage] = useState(1);
  const limit = 20;

  // Protect route
  if (!isAuthenticated || user?.role !== 'ADMIN') {
    redirect('/login');
  }

  // Fetch reviews
  const { data, isLoading } = useQuery({
    queryKey: ['admin-reviews', publishedFilter, page],
    queryFn: () => adminService.getReviews({
      isPublished: publishedFilter,
      page,
      limit,
    }),
  });

  // Toggle publish mutation
  const togglePublishMutation = useMutation({
    mutationFn: (reviewId: string) => reviewsService.togglePublish(reviewId),
    onSuccess: () => {
      toast.success('Review status updated');
      queryClient.invalidateQueries({ queryKey: ['admin-reviews'] });
    },
  });

  const reviews = data?.data || [];
  const meta = data?.meta;

  return (
    <div className="container mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Review Moderation</h1>
        <p className="text-gray-600 mt-2">
          Manage customer reviews
        </p>
      </div>

      {/* Filters */}
      <div className="flex gap-4 mb-6">
        <Button
          variant={publishedFilter === undefined ? 'default' : 'outline'}
          onClick={() => setPublishedFilter(undefined)}
        >
          All Reviews
        </Button>
        <Button
          variant={publishedFilter === true ? 'default' : 'outline'}
          onClick={() => setPublishedFilter(true)}
        >
          Published
        </Button>
        <Button
          variant={publishedFilter === false ? 'default' : 'outline'}
          onClick={() => setPublishedFilter(false)}
        >
          Unpublished
        </Button>
      </div>

      {/* Reviews List */}
      {isLoading ? (
        <div className="text-center py-12">Loading reviews...</div>
      ) : (
        <>
          <div className="space-y-4">
            {reviews.map((review: any) => (
              <div key={review.id} className="bg-white rounded-lg shadow p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-semibold">
                        {review.user?.firstName} {review.user?.lastName}
                      </span>
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <span
                            key={i}
                            className={i < review.rating ? 'text-yellow-400' : 'text-gray-300'}
                          >
                            ★
                          </span>
                        ))}
                      </div>
                      {review.isVerifiedPurchase && (
                        <Badge variant="outline">Verified Purchase</Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">
                      Product: {review.product?.name}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={review.isPublished ? 'success' : 'secondary'}>
                      {review.isPublished ? 'Published' : 'Unpublished'}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => togglePublishMutation.mutate(review.id)}
                    >
                      {review.isPublished ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </div>

                {review.title && (
                  <h3 className="font-semibold mb-2">{review.title}</h3>
                )}
                {review.comment && <p className="text-gray-700 mb-4">{review.comment}</p>}

                {review.images && review.images.length > 0 && (
                  <div className="flex gap-2 mb-4">
                    {review.images.map((img: any, idx: number) => (
                      <img
                        key={idx}
                        src={img.url}
                        alt={`Review ${idx + 1}`}
                        className="w-20 h-20 object-cover rounded"
                      />
                    ))}
                  </div>
                )}

                <div className="flex justify-between items-center text-sm text-gray-500">
                  <span>
                    {review.helpfulCount} helpful · {review.notHelpfulCount} not helpful
                  </span>
                  <span>{new Date(review.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {meta && meta.totalPages > 1 && (
            <div className="flex justify-center items-center space-x-4 mt-6">
              <Button
                variant="outline"
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                Previous
              </Button>
              <span className="text-sm text-gray-600">
                Page {page} of {meta.totalPages}
              </span>
              <Button
                variant="outline"
                onClick={() => setPage(p => Math.min(meta.totalPages, p + 1))}
                disabled={page === meta.totalPages}
              >
                Next
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
```

---

## ✅ STEP 7: Phase 2 Testing Procedures

### 7.1 Admin Registration Test

**Test Case 1: Create Admin User**

Since admin creation should be done via database or seed:

```bash
# In backend directory
npx prisma studio

# Create admin user:
# Email: admin@aromasouq.com
# Password: (hashed) Admin123!@#
# Role: ADMIN
# Status: ACTIVE
```

Or create via seed script.

---

### 7.2 Admin Dashboard Test

**Test Case 2: Access Admin Dashboard**

1. Login as admin
2. Navigate to `http://localhost:3000/admin`

**Expected Results:**
```
✅ Dashboard loads
✅ Stats show correct counts:
   - Total Users
   - Total Orders
   - Total Products
   - Total Reviews
   - Total Revenue
   - Pending Vendors
✅ Network: GET /api/admin/dashboard/stats (Status 200)
✅ Quick action cards visible
```

---

### 7.3 User Management Test

**Test Case 3: Manage Users**

1. Navigate to `/admin/users`
2. View all users
3. Filter by role (VENDOR)
4. Filter by status (ACTIVE)
5. Change a user's status to SUSPENDED
6. Try to change own status (should fail)

**Expected Results:**
```
✅ Users list loads
✅ Network: GET /api/admin/users
✅ Filters work correctly
✅ Status change: PATCH /api/admin/users/{id}/status
✅ Success toast
✅ User status updated in table
✅ Cannot change own status
```

---

### 7.4 Vendor Approval Test

**Test Case 4: Approve Vendor**

1. Navigate to `/admin/vendors`
2. View vendor list
3. Click "Review" on a vendor
4. View vendor profile and products
5. Click "Approve Vendor"
6. Verify vendor status changes to ACTIVE

**Expected Results:**
```
✅ Vendors list loads
✅ Network: GET /api/admin/users?role=VENDOR
✅ Vendor detail page loads
✅ Shows vendor info and products
✅ Approve button works
✅ Network: PATCH /api/admin/users/{id}/status
✅ Vendor status updates to ACTIVE
✅ Vendor can now fully access system
```

---

### 7.5 Product Moderation Test

**Test Case 5: Moderate Products**

1. Navigate to `/admin/products`
2. View all products
3. Filter by "Inactive"
4. Activate a product
5. View product on frontend
6. Deactivate product
7. Verify removed from frontend

**Expected Results:**
```
✅ Products list loads
✅ Network: GET /api/admin/products
✅ Filters work
✅ Activate: PATCH /api/products/{id}
✅ Product becomes active
✅ Product visible on /products page
✅ Deactivate works
✅ Product hidden from customers
```

---

### 7.6 Review Moderation Test

**Test Case 6: Moderate Reviews**

1. Navigate to `/admin/reviews`
2. View all reviews
3. Unpublish a review
4. Check product page - review hidden
5. Re-publish review
6. Verify review visible again

**Expected Results:**
```
✅ Reviews list loads
✅ Network: GET /api/admin/reviews
✅ Unpublish: PATCH /api/reviews/{id}/publish
✅ Review hidden from product page
✅ Re-publish works
✅ Review visible again
```

---

## 📝 Phase 2 Completion Checklist

### Development Tasks

#### Service Layer
- [ ] Created `src/types/api/admin.types.ts`
- [ ] Created `src/services/admin.service.ts`
- [ ] Created `src/services/reviews.service.ts`
- [ ] Created `src/hooks/useAdminStats.ts`

#### Admin Dashboard
- [ ] Updated `src/app/admin/page.tsx`
- [ ] Dashboard shows statistics
- [ ] Quick actions working

#### User Management
- [ ] Created/Updated `src/app/admin/users/page.tsx`
- [ ] User list with filters
- [ ] Status update functionality
- [ ] Protection against self-modification

#### Vendor Management
- [ ] Created `src/app/admin/vendors/page.tsx`
- [ ] Created `src/app/admin/vendors/[id]/review/page.tsx`
- [ ] Vendor list
- [ ] Vendor detail/review page
- [ ] Approval workflow

#### Product Moderation
- [ ] Created/Updated `src/app/admin/products/page.tsx`
- [ ] Product list with filters
- [ ] Activate/deactivate products
- [ ] Delete products

#### Review Moderation
- [ ] Created `src/app/admin/reviews/page.tsx`
- [ ] Review list with filters
- [ ] Publish/unpublish functionality

### Testing Tasks

#### Functional Testing
- [ ] Admin can login
- [ ] Dashboard loads with stats
- [ ] Can view all users
- [ ] Can change user status
- [ ] Can approve vendors
- [ ] Can moderate products
- [ ] Can moderate reviews

#### Authorization
- [ ] Non-admin cannot access admin routes
- [ ] Admin cannot change own status
- [ ] All admin endpoints protected

#### UI/UX
- [ ] Tables responsive
- [ ] Filters work correctly
- [ ] Pagination works
- [ ] Loading states shown
- [ ] Success/error messages

### Database Verification
- [ ] User status updates persist
- [ ] Product isActive updates persist
- [ ] Review isPublished updates persist

---

## 🎯 Phase 2 Success Criteria

**Phase 2 is complete when:**

1. ✅ Admin can access dashboard with statistics
2. ✅ Admin can manage all users
3. ✅ Admin can approve/suspend vendors
4. ✅ Admin can moderate products (activate/deactivate)
5. ✅ Admin can moderate reviews (publish/unpublish)
6. ✅ All admin actions properly authorized
7. ✅ All tests pass

---

## 🚀 Next Steps

**After Phase 2 completion:**
- Proceed to **Phase 3: Customer Integration** (Product browsing, cart, checkout)
- Ensure at least 10 active products exist
- Ensure at least 1 active vendor exists
- These will be used for customer purchasing flow

**Document:** `03-PHASE3-CUSTOMER-INTEGRATION.md`

---

**Document Version:** 1.0
**Last Updated:** 2025-10-26
**Next Document:** `03-PHASE3-CUSTOMER-INTEGRATION.md`
