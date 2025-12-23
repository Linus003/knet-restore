import { createServerClient } from "@/lib/supabase"
import type { Product } from "@/types"
import { HomePageClient } from "@/components/home-page-client"

export const dynamic = "force-dynamic"
export const revalidate = 0

async function getFeaturedProducts(): Promise<Product[]> {
  const supabase = createServerClient()

  const { data, error } = await supabase
    .from("products")
    .select(`
      *,
      category:categories(*)
    `)
    .eq("featured", true)
    .order("updated_at", { ascending: false })
    .limit(6)

  if (error) {
    console.error("Error fetching featured products:", error)
    return []
  }

  const productsWithImages = (data || []).filter(
    (product) => product.image_url && product.image_url.trim() !== "" && !product.image_url.startsWith("data:"),
  )

  return productsWithImages
}

async function getHeroSettings() {
  const supabase = createServerClient()

  const { data, error } = await supabase.from("site_settings").select("value").eq("key", "hero_section").single()

  if (error) {
    console.error("Error fetching hero settings:", error)
    return {
      headline: "Knet Appliances - Quality Home Appliances",
      subtext: "Your trusted partner for quality household appliances in Kenya",
      cta_text: "Shop Appliances",
      image_url: "https://i.postimg.cc/XNrWqXxG/Gemini-Generated-Image-wh4fi1wh4fi1wh4f.png",
    }
  }

  return (
    data?.value || {
      headline: "Knet Appliances - Quality Home Appliances",
      subtext: "Your trusted partner for quality household appliances in Kenya",
      cta_text: "Shop Appliances",
      image_url: "https://i.postimg.cc/XNrWqXxG/Gemini-Generated-Image-wh4fi1wh4fi1wh4f.png",
    }
  )
}

export default async function HomePage() {
  const [featuredProducts, heroSettings] = await Promise.all([getFeaturedProducts(), getHeroSettings()])

  return <HomePageClient featuredProducts={featuredProducts} heroSettings={heroSettings} />
}
