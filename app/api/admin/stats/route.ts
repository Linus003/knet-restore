import { NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase"

export async function GET() {
  try {
    const supabase = createServerClient()

    // Get total orders
    const { count: totalOrders } = await supabase.from("orders").select("*", { count: "exact", head: true })

    // Get new orders (last 7 days)
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

    const { count: newOrders } = await supabase
      .from("orders")
      .select("*", { count: "exact", head: true })
      .gte("created_at", sevenDaysAgo.toISOString())

    // Get total products
    const { count: totalProducts } = await supabase.from("products").select("*", { count: "exact", head: true })

    // Get total revenue
    const { data: orders } = await supabase.from("orders").select("total_amount")

    const totalRevenue = orders?.reduce((sum, order) => sum + Number(order.total_amount), 0) || 0

    return NextResponse.json({
      totalOrders: totalOrders || 0,
      newOrders: newOrders || 0,
      totalProducts: totalProducts || 0,
      totalRevenue,
    })
  } catch (error) {
    console.error("Error fetching stats:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
