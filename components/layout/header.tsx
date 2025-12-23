"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Search, ShoppingCart, Menu, X } from "lucide-react"
import { Input } from "@/components/ui/input"

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [cartCount, setCartCount] = useState(0)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const updateCartCount = () => {
      try {
        const savedCart = localStorage.getItem("cart")
        if (savedCart) {
          const cartItems = JSON.parse(savedCart)
          if (Array.isArray(cartItems)) {
            const count = cartItems.reduce((sum: number, item: any) => sum + (item.quantity || 0), 0)
            setCartCount(count)
          }
        }
      } catch (error) {
        console.error("Error reading cart:", error)
      }
    }

    updateCartCount()

    // Listen for storage changes
    window.addEventListener("storage", updateCartCount)

    // Listen for custom cart update events
    window.addEventListener("cartUpdated", updateCartCount)

    return () => {
      window.removeEventListener("storage", updateCartCount)
      window.removeEventListener("cartUpdated", updateCartCount)
    }
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      window.location.href = `/products?search=${encodeURIComponent(searchQuery)}`
    }
  }

  const navigateTo = (url: string) => {
    window.location.href = url
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault()
              navigateTo("/")
            }}
            className="flex items-center space-x-2 cursor-pointer"
          >
            <div className="h-8 w-8 bg-blue-600 rounded-md flex items-center justify-center">
              <span className="text-white font-bold text-sm">K</span>
            </div>
            <span className="font-bold text-xl">Knet Appliances</span>
          </a>

          <nav className="hidden md:flex items-center space-x-6">
            <a
              href="/products"
              onClick={(e) => {
                e.preventDefault()
                navigateTo("/products")
              }}
              className="text-sm font-medium hover:text-blue-600 transition-colors cursor-pointer"
            >
              Products
            </a>
            <a
              href="/products?category=kitchen-appliances"
              onClick={(e) => {
                e.preventDefault()
                navigateTo("/products?category=kitchen-appliances")
              }}
              className="text-sm font-medium hover:text-blue-600 transition-colors cursor-pointer"
            >
              Kitchen
            </a>
            <a
              href="/products?category=laundry-appliances"
              onClick={(e) => {
                e.preventDefault()
                navigateTo("/products?category=laundry-appliances")
              }}
              className="text-sm font-medium hover:text-blue-600 transition-colors cursor-pointer"
            >
              Laundry
            </a>
            <a
              href="/products?category=cooling-heating"
              onClick={(e) => {
                e.preventDefault()
                navigateTo("/products?category=cooling-heating")
              }}
              className="text-sm font-medium hover:text-blue-600 transition-colors cursor-pointer"
            >
              Cooling & Heating
            </a>
            <a
              href="/products?category=small-appliances"
              onClick={(e) => {
                e.preventDefault()
                navigateTo("/products?category=small-appliances")
              }}
              className="text-sm font-medium hover:text-blue-600 transition-colors cursor-pointer"
            >
              Small Appliances
            </a>
            <a
              href="/products?category=cookware"
              onClick={(e) => {
                e.preventDefault()
                navigateTo("/products?category=cookware")
              }}
              className="text-sm font-medium hover:text-blue-600 transition-colors cursor-pointer"
            >
              Cookware
            </a>
            <a
              href="/contact"
              onClick={(e) => {
                e.preventDefault()
                navigateTo("/contact")
              }}
              className="text-sm font-medium hover:text-blue-600 transition-colors cursor-pointer"
            >
              Contact
            </a>
            <a
              href="/admin/login"
              onClick={(e) => {
                e.preventDefault()
                navigateTo("/admin/login")
              }}
              className="text-sm font-medium hover:text-blue-600 transition-colors text-gray-500 cursor-pointer"
            >
              Admin
            </a>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <form onSubmit={handleSearch} className="hidden md:flex items-center space-x-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
              <Input
                type="search"
                placeholder="Search products..."
                className="pl-8 w-[200px] lg:w-[300px]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </form>

          <button
            onClick={() => navigateTo("/cart")}
            className="relative p-2 border rounded-md hover:bg-gray-100 transition-colors"
          >
            <ShoppingCart className="h-4 w-4" />
            {mounted && cartCount > 0 && (
              <span className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs bg-blue-600 text-white rounded-full">
                {cartCount}
              </span>
            )}
          </button>

          <button
            className="md:hidden p-2 border rounded-md hover:bg-gray-100 transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t bg-white">
          <div className="container py-4 space-y-4">
            <form onSubmit={handleSearch} className="flex items-center space-x-2">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
                <Input
                  type="search"
                  placeholder="Search products..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </form>

            <nav className="flex flex-col space-y-2">
              <button
                onClick={() => navigateTo("/products")}
                className="text-sm font-medium hover:text-blue-600 transition-colors py-2 text-left"
              >
                Products
              </button>
              <button
                onClick={() => navigateTo("/products?category=kitchen-appliances")}
                className="text-sm font-medium hover:text-blue-600 transition-colors py-2 text-left"
              >
                Kitchen
              </button>
              <button
                onClick={() => navigateTo("/products?category=laundry-appliances")}
                className="text-sm font-medium hover:text-blue-600 transition-colors py-2 text-left"
              >
                Laundry
              </button>
              <button
                onClick={() => navigateTo("/products?category=cooling-heating")}
                className="text-sm font-medium hover:text-blue-600 transition-colors py-2 text-left"
              >
                Cooling & Heating
              </button>
              <button
                onClick={() => navigateTo("/products?category=small-appliances")}
                className="text-sm font-medium hover:text-blue-600 transition-colors py-2 text-left"
              >
                Small Appliances
              </button>
              <button
                onClick={() => navigateTo("/products?category=cookware")}
                className="text-sm font-medium hover:text-blue-600 transition-colors py-2 text-left"
              >
                Cookware
              </button>
              <button
                onClick={() => navigateTo("/contact")}
                className="text-sm font-medium hover:text-blue-600 transition-colors py-2 text-left"
              >
                Contact
              </button>
              <button
                onClick={() => navigateTo("/admin/login")}
                className="text-sm font-medium hover:text-blue-600 transition-colors py-2 text-left text-gray-500"
              >
                Admin
              </button>
            </nav>
          </div>
        </div>
      )}
    </header>
  )
}
