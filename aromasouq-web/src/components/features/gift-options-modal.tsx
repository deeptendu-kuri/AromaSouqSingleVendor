'use client'

import { useState } from 'react'
import { Gift } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Switch } from '@/components/ui/switch'
import { Card } from '@/components/ui/card'

interface GiftOptionsModalProps {
  open: boolean
  onClose: () => void
  onSave: (options: any) => void
  initialOptions?: any
}

export function GiftOptionsModal({ open, onClose, onSave, initialOptions }: GiftOptionsModalProps) {
  const [isGift, setIsGift] = useState(initialOptions?.isGift || false)
  const [giftMessage, setGiftMessage] = useState(initialOptions?.giftMessage || '')
  const [giftWrapping, setGiftWrapping] = useState(initialOptions?.giftWrapping || '')

  const handleSave = () => {
    onSave({
      isGift,
      giftMessage: isGift ? giftMessage : undefined,
      giftWrapping: isGift ? giftWrapping : undefined,
    })
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Gift className="h-5 w-5 text-oud-gold" />
            Gift Options
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Is Gift Toggle */}
          <div className="flex items-center justify-between">
            <Label htmlFor="is-gift">This is a gift</Label>
            <Switch id="is-gift" checked={isGift} onCheckedChange={setIsGift} />
          </div>

          {isGift && (
            <>
              {/* Gift Message */}
              <div className="space-y-2">
                <Label htmlFor="gift-message">Gift Message (Optional)</Label>
                <Textarea
                  id="gift-message"
                  placeholder="Write a personal message for the recipient..."
                  value={giftMessage}
                  onChange={(e) => setGiftMessage(e.target.value)}
                  rows={3}
                  maxLength={200}
                />
                <p className="text-xs text-muted-foreground">{giftMessage.length}/200 characters</p>
              </div>

              {/* Gift Wrapping */}
              <div className="space-y-3">
                <Label>Gift Wrapping</Label>
                <RadioGroup value={giftWrapping} onValueChange={setGiftWrapping}>
                  <Card className="p-4 cursor-pointer hover:border-oud-gold transition-colors">
                    <div className="flex items-start space-x-3">
                      <RadioGroupItem value="BASIC" id="basic" />
                      <Label htmlFor="basic" className="flex-1 cursor-pointer">
                        <div className="flex items-center justify-between mb-1">
                          <p className="font-medium">Basic</p>
                          <p className="text-sm text-muted-foreground">+ AED 10.00</p>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Elegant wrapping paper with ribbon
                        </p>
                      </Label>
                    </div>
                  </Card>

                  <Card className="p-4 cursor-pointer hover:border-oud-gold transition-colors">
                    <div className="flex items-start space-x-3">
                      <RadioGroupItem value="PREMIUM" id="premium" />
                      <Label htmlFor="premium" className="flex-1 cursor-pointer">
                        <div className="flex items-center justify-between mb-1">
                          <p className="font-medium">Premium</p>
                          <p className="text-sm text-muted-foreground">+ AED 20.00</p>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Luxury paper, satin ribbon, gift card
                        </p>
                      </Label>
                    </div>
                  </Card>

                  <Card className="p-4 cursor-pointer hover:border-oud-gold transition-colors">
                    <div className="flex items-start space-x-3">
                      <RadioGroupItem value="LUXURY" id="luxury" />
                      <Label htmlFor="luxury" className="flex-1 cursor-pointer">
                        <div className="flex items-center justify-between mb-1">
                          <p className="font-medium">Luxury</p>
                          <p className="text-sm text-muted-foreground">+ AED 35.00</p>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Premium gift box, gold ribbon, personalized card
                        </p>
                      </Label>
                    </div>
                  </Card>
                </RadioGroup>
              </div>
            </>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Save Gift Options
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
