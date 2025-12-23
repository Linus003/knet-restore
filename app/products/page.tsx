import { Suspense } from "react"
import { ProductGrid } from "@/components/products/product-grid"
import { ProductFilters } from "@/components/products/product-filters"
import { createServerClient } from "@/lib/supabase"
import type { Product, Category } from "@/types"

interface SearchParams {
  category?: string
  search?: string
  sort?: string
  featured?: string
}

async function getProducts(searchParams: SearchParams): Promise<Product[]> {
  const supabase = createServerClient()

  let query = supabase.from("products").select(`
      *,
      category:categories(*)
    `)

  // Apply filters
  if (searchParams.category) {
    const { data: categoryData } = await supabase
      .from("categories")
      .select("id")
      .eq("slug", searchParams.category)
      .single()

    if (categoryData) {
      query = query.eq("category_id", categoryData.id)
    }
  }

  if (searchParams.search) {
    query = query.ilike("name", `%${searchParams.search}%`)
  }

  if (searchParams.featured === "true") {
    query = query.eq("featured", true)
  }

  // Apply sorting
  switch (searchParams.sort) {
    case "price-asc":
      query = query.order("price", { ascending: true })
      break
    case "price-desc":
      query = query.order("price", { ascending: false })
      break
    case "name":
      query = query.order("name", { ascending: true })
      break
    default:
      query = query.order("created_at", { ascending: false })
  }

  // Limit results for better performance
  query = query.limit(50)

  const { data, error } = await query

  if (error) {
    console.error("Error fetching products:", error)
    return []
  }

  return data || []
}

async function getCategories(): Promise<Category[]> {
  const supabase = createServerClient()

  const { data, error } = await supabase.from("categories").select("*").order("name")

  if (error) {
    console.error("Error fetching categories:", error)
    return []
  }

  return data || []
}

function ProductGridSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="animate-pulse">
          <div className="bg-gray-200 h-48 rounded-t-lg"></div>
          <div className="p-4 space-y-3">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            <div className="h-6 bg-gray-200 rounded w-1/4"></div>
          </div>
        </div>
      ))}
    </div>
  )
}

function FilterSkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="h-6 bg-gray-200 rounded w-1/3"></div>
      <div className="space-y-2">
        {[...Array(5)].map((_, i) => (
           <div key={i} className="h-4 bg-gray-200 rounded w-full"></div>
        ))}
      </div>
    </div>
  )
}

export default async function ProductsPage(props: {
  searchParams: Promise<SearchParams>
}) {
  // Await the searchParams (Required for Next.js 15+)
  const params = await props.searchParams;
  
  const [products, categories] = await Promise.all([getProducts(params), getCategories()])

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Products</h1>
        <p className="text-muted-foreground">
          {params.search && `Search results for "${params.search}"`}
          {params.category && `Category: ${params.category}`}
          {!params.search && !params.category && "Browse our complete product catalog"}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1">
          <Suspense fallback={<FilterSkeleton />}>
             <ProductFilters categories={categories} />
          </Suspense>
        </div>
        <div className="lg:col-span-3">
          <Suspense fallback={<ProductGridSkeleton />}>
            <ProductGrid products={products} />
          </Suspense>
        </div>
      </div>
    </div>
  )
}
