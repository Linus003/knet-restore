"use client"

import type React from "react"
import { createContext, useContext, useReducer, useEffect, useState } from "react"
import type { Product, CartItem } from "@/types"

interface CartState {
  items: CartItem[]
  total: number
}

type CartAction =
  | { type: "ADD_ITEM"; payload: Product }
  | { type: "REMOVE_ITEM"; payload: string }
  | { type: "UPDATE_QUANTITY"; payload: { id: string; quantity: number } }
  | { type: "CLEAR_CART" }
  | { type: "LOAD_CART"; payload: CartItem[] }

const defaultState: CartState = { items: [], total: 0 }

const CartContext = createContext<{
  state: CartState
  dispatch: React.Dispatch<CartAction>
  isLoaded: boolean
}>({
  state: defaultState,
  dispatch: () => {},
  isLoaded: false,
})

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "ADD_ITEM": {
      const existingItem = state.items.find((item) => item.product.id === action.payload.id)

      if (existingItem) {
        const updatedItems = state.items.map((item) =>
          item.product.id === action.payload.id ? { ...item, quantity: item.quantity + 1 } : item,
        )
        return {
          items: updatedItems,
          total: updatedItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0),
        }
      } else {
        const newItems = [...state.items, { product: action.payload, quantity: 1 }]
        return {
          items: newItems,
          total: newItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0),
        }
      }
    }

    case "REMOVE_ITEM": {
      const newItems = state.items.filter((item) => item.product.id !== action.payload)
      return {
        items: newItems,
        total: newItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0),
      }
    }

    case "UPDATE_QUANTITY": {
      const updatedItems = state.items
        .map((item) => (item.product.id === action.payload.id ? { ...item, quantity: action.payload.quantity } : item))
        .filter((item) => item.quantity > 0)

      return {
        items: updatedItems,
        total: updatedItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0),
      }
    }

    case "CLEAR_CART":
      return { items: [], total: 0 }

    case "LOAD_CART":
      return {
        items: action.payload,
        total: action.payload.reduce((sum, item) => sum + item.product.price * item.quantity, 0),
      }

    default:
      return state
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, defaultState)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    try {
      const savedCart = localStorage.getItem("cart")
      if (savedCart) {
        const cartItems = JSON.parse(savedCart)
        if (Array.isArray(cartItems)) {
          dispatch({ type: "LOAD_CART", payload: cartItems })
        }
      }
    } catch (error) {
      console.error("Error loading cart:", error)
    }
    setIsLoaded(true)
  }, [])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("cart", JSON.stringify(state.items))
    }
  }, [state.items, isLoaded])

  return <CartContext.Provider value={{ state, dispatch, isLoaded }}>{children}</CartContext.Provider>
}

export function useCart() {
  const context = useContext(CartContext)

  const addItem = (product: Product) => {
    context.dispatch({ type: "ADD_ITEM", payload: product })
  }

  const removeItem = (productId: string) => {
    context.dispatch({ type: "REMOVE_ITEM", payload: productId })
  }

  const updateQuantity = (productId: string, quantity: number) => {
    context.dispatch({ type: "UPDATE_QUANTITY", payload: { id: productId, quantity } })
  }

  const clearCart = () => {
    context.dispatch({ type: "CLEAR_CART" })
  }

  const items = context.state.items.map((item) => ({
    id: item.product.id,
    name: item.product.name,
    price: item.product.price,
    quantity: item.quantity,
    product: item.product,
  }))

  return {
    state: context.state,
    dispatch: context.dispatch,
    isLoaded: context.isLoaded,
    items,
    total: context.state.total,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
  }
}
