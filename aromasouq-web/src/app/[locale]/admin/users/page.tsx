'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { Search, MoreVertical, UserCheck, UserX, Trash2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { useUsers } from '@/hooks/admin/use-users'
import { User } from '@/types'
import { formatDate } from '@/lib/utils'

export default function UsersPage() {
  const t = useTranslations()
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState<string>('ALL')
  const [statusFilter, setStatusFilter] = useState<string>('ALL')
  const [userToDelete, setUserToDelete] = useState<User | null>(null)

  const { users, isLoading, updateStatus, deleteUser, isUpdating, isDeleting } = useUsers({
    search: search || undefined,
    role: roleFilter === 'ALL' ? undefined : roleFilter as any,
    status: statusFilter === 'ALL' ? undefined : statusFilter as any,
  })

  const handleStatusToggle = (user: User) => {
    const newStatus = user.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE'
    updateStatus({ userId: user.id, status: newStatus as any })
  }

  const handleDeleteConfirm = () => {
    if (userToDelete) {
      deleteUser(userToDelete.id)
      setUserToDelete(null)
    }
  }

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'VENDOR':
        return 'bg-purple-100 text-purple-800 border-purple-200'
      case 'CUSTOMER':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'SUSPENDED':
        return 'bg-red-100 text-red-800 border-red-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getUserName = (user: User) => {
    return user.firstName && user.lastName
      ? `${user.firstName} ${user.lastName}`
      : user.email
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-heading font-bold text-deep-navy">{t('admin.users.title')}</h1>
        <p className="text-gray-600 mt-1">{t('admin.users.subtitle')}</p>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder={t('admin.users.searchPlaceholder')}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder={t('admin.users.filterByRole')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">{t('admin.users.allRoles')}</SelectItem>
                <SelectItem value="CUSTOMER">{t('admin.users.customer')}</SelectItem>
                <SelectItem value="VENDOR">{t('admin.users.vendor')}</SelectItem>
                <SelectItem value="ADMIN">{t('admin.users.admin')}</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder={t('admin.users.filterByStatus')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">{t('admin.users.allStatus')}</SelectItem>
                <SelectItem value="ACTIVE">{t('admin.users.active')}</SelectItem>
                <SelectItem value="SUSPENDED">{t('admin.users.suspended')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>{t('admin.users.users')} ({users.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">{t('admin.users.loading')}</div>
          ) : users.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <p className="text-muted-foreground">{t('admin.users.noUsersFound')}</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t('admin.users.user')}</TableHead>
                    <TableHead>{t('admin.users.email')}</TableHead>
                    <TableHead>{t('admin.users.role')}</TableHead>
                    <TableHead>{t('admin.users.status')}</TableHead>
                    <TableHead>{t('admin.users.joined')}</TableHead>
                    <TableHead className="text-right">{t('admin.users.actions')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-oud-gold/20 flex items-center justify-center text-oud-gold font-medium">
                            {getUserName(user).charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-medium">{getUserName(user)}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={getRoleBadgeColor(user.role)}>
                          {user.role}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={getStatusBadgeColor(user.status)}>
                          {user.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {formatDate(user.createdAt)}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" disabled={isUpdating || isDeleting}>
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleStatusToggle(user)}>
                              {user.status === 'ACTIVE' ? (
                                <>
                                  <UserX className="mr-2 h-4 w-4" />
                                  {t('admin.users.suspendUser')}
                                </>
                              ) : (
                                <>
                                  <UserCheck className="mr-2 h-4 w-4" />
                                  {t('admin.users.activateUser')}
                                </>
                              )}
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => setUserToDelete(user)}
                              className="text-red-600"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              {t('admin.users.deleteUser')}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!userToDelete} onOpenChange={() => setUserToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('admin.users.deleteUser')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('admin.users.deleteConfirm')} <strong>{userToDelete && getUserName(userToDelete)}</strong>? {t('admin.users.deleteWarning')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('admin.users.cancel')}</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm} className="bg-red-600 hover:bg-red-700">
              {t('admin.users.delete')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
