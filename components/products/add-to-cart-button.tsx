"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ShoppingCart, Plus, Minus } from "lucide-react"
import type { Product } from "@/types"
import { useCart } from "@/contexts/cart-context"

interface AddToCartButtonProps {
  product: Product
}

export function AddToCartButton({ product }: AddToCartButtonProps) {
  const [quantity, setQuantity] = useState(1)
  const { dispatch } = useCart()

  const addToCart = () => {
    for (let i = 0; i < quantity; i++) {
      dispatch({ type: "ADD_ITEM", payload: product })
    }
    setQuantity(1)
  }

  const incrementQuantity = () => {
    if (quantity < product.stock_quantity) {
      setQuantity(quantity + 1)
    }
  }

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-4">
        <span className="text-sm font-medium">Quantity:</span>
        <div className="flex items-center border rounded-md">
          <Button variant="ghost" size="sm" onClick={decrementQuantity} disabled={quantity <= 1}>
            <Minus className="h-4 w-4" />
          </Button>
          <span className="px-4 py-2 text-sm font-medium">{quantity}</span>
          <Button variant="ghost" size="sm" onClick={incrementQuantity} disabled={quantity >= product.stock_quantity}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Button onClick={addToCart} disabled={product.stock_quantity === 0} className="w-full" size="lg">
        <ShoppingCart className="h-5 w-5 mr-2" />
        {product.stock_quantity === 0 ? "Out of Stock" : "Add to Cart"}
      </Button>
    </div>
  )
}
