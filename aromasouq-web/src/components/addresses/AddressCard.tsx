'use client';

import { Address } from '@/hooks/useAddresses';
import { MapPin, Phone, Edit, Trash2, Star } from 'lucide-react';
import Link from 'next/link';

interface AddressCardProps {
  address: Address;
  onDelete: (id: string) => void;
  onSetDefault: (id: string) => void;
  isDeleting?: boolean;
  isSettingDefault?: boolean;
}

export function AddressCard({
  address,
  onDelete,
  onSetDefault,
  isDeleting = false,
  isSettingDefault = false,
}: AddressCardProps) {
  return (
    <div
      className={`relative bg-white rounded-lg border-2 p-6 transition-all ${
        address.isDefault
          ? 'border-purple-500 shadow-lg'
          : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
      }`}
    >
      {/* Default Badge */}
      {address.isDefault && (
        <div className="absolute top-4 right-4">
          <span className="flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-700 text-xs font-semibold rounded-full">
            <Star className="w-3 h-3 fill-current" />
            Default
          </span>
        </div>
      )}

      {/* Address Content */}
      <div className="space-y-3">
        {/* Full Name */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            {address.fullName}
          </h3>
        </div>

        {/* Phone */}
        <div className="flex items-start gap-2 text-gray-600">
          <Phone className="w-4 h-4 mt-1 flex-shrink-0" />
          <span className="text-sm">{address.phone}</span>
        </div>

        {/* Address Lines */}
        <div className="flex items-start gap-2 text-gray-600">
          <MapPin className="w-4 h-4 mt-1 flex-shrink-0" />
          <div className="text-sm space-y-1">
            <p>{address.addressLine1}</p>
            {address.addressLine2 && <p>{address.addressLine2}</p>}
            <p>
              {address.city}, {address.state} {address.zipCode}
            </p>
            <p>{address.country}</p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-6 flex flex-wrap gap-2">
        {/* Edit Button */}
        <Link
          href={`/account/addresses/${address.id}/edit`}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition"
        >
          <Edit className="w-4 h-4" />
          Edit
        </Link>

        {/* Set Default Button */}
        {!address.isDefault && (
          <button
            onClick={() => onSetDefault(address.id)}
            disabled={isSettingDefault}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-purple-700 bg-purple-50 border border-purple-200 rounded-lg hover:bg-purple-100 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Star className="w-4 h-4" />
            {isSettingDefault ? 'Setting...' : 'Set as Default'}
          </button>
        )}

        {/* Delete Button */}
        <button
          onClick={() => {
            if (
              confirm(
                'Are you sure you want to delete this address? This action cannot be undone.'
              )
            ) {
              onDelete(address.id);
            }
          }}
          disabled={isDeleting || address.isDefault}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-700 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition disabled:opacity-50 disabled:cursor-not-allowed ml-auto"
          title={address.isDefault ? 'Cannot delete default address' : 'Delete address'}
        >
          <Trash2 className="w-4 h-4" />
          {isDeleting ? 'Deleting...' : 'Delete'}
        </button>
      </div>

      {/* Default Address Note */}
      {address.isDefault && (
        <p className="mt-4 text-xs text-gray-500 italic">
          This is your default shipping address. Set another address as default before deleting this one.
        </p>
      )}
    </div>
  );
}
