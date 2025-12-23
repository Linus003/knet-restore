export interface Product {
  id: string
  name: string
  slug: string
  description: string
  price: number
  image_url: string
  category_id: string
  stock_quantity: number
  featured: boolean
  created_at: string
  updated_at: string
  group_id?: string
  variant_type?: string
  variant_value?: string
  sort_order: number
  category?: Category
  product_group?: ProductGroup
}

export interface ProductGroup {
  id: string
  name: string
  slug: string
  description: string
  base_price: number
  category_id: string
  featured: boolean
  main_image_url: string
  created_at: string
  updated_at: string
  category?: Category
  products?: Product[]
}

export interface Category {
  id: string
  name: string
  slug: string
  description: string
  created_at: string
  updated_at: string
}

export interface Order {
  id: string
  customer_name: string
  customer_email: string
  customer_phone: string
  shipping_address: string
  status: "new" | "processing" | "shipped" | "delivered"
  total_amount: number
  created_at: string
  updated_at: string
  order_items?: OrderItem[]
}

export interface OrderItem {
  id: string
  order_id: string
  product_id: string
  quantity: number
  price: number
  created_at: string
  product?: Product
}

export interface CartItem {
  product: Product
  quantity: number
}

export interface SiteSettings {
  id: string
  key: string
  value: any
  created_at: string
  updated_at: string
}

export interface User {
  id: string
  email: string
  username: string
  role: string
  created_at: string
  updated_at: string
}
