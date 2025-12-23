import Link from "next/link"
import { CheckCircle, MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { createServerClient } from "@/lib/supabase"
import type { Order } from "@/types"
import { formatKESSimple } from "@/lib/currency"

async function getOrder(id: string): Promise<Order | null> {
  const supabase = createServerClient()

  const { data, error } = await supabase
    .from("orders")
    .select(`
      *,
      order_items(
        *,
        product:products(*)
      )
    `)
    .eq("id", id)
    .single()

  if (error) {
    console.error("Error fetching order:", error)
    return null
  }

  return data
}

export default async function OrderConfirmationPage({
  params,
}: {
  params: { id: string }
}) {
  const order = await getOrder(params.id)

  if (!order) {
    return (
      <div className="container py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Order not found</h1>
        <Link href="/">
          <Button>Return Home</Button>
        </Link>
      </div>
    )
  }

  const generateWhatsAppMessage = () => {
    const orderItems =
      order.order_items?.map((item) => `${item.product?.name} (Qty: ${item.quantity})`).join(", ") || "Order items"

    const message = `Hello! I just placed an order on Knet Appliances and would like to confirm my purchase:

Order #: ${order.id.slice(0, 8)}
Items: ${orderItems}
Total: ${formatKESSimple(order.total_amount)}
Customer: ${order.customer_name}

Please confirm my order and let me know the next steps for delivery. Thank you!`

    return encodeURIComponent(message)
  }

  const whatsappUrl = `https://wa.me/254746735710?text=${generateWhatsAppMessage()}`

  return (
    <div className="container py-16">
      <div className="max-w-2xl mx-auto text-center space-y-8">
        <div className="space-y-4">
          <CheckCircle className="h-16 w-16 text-green-600 mx-auto" />
          <h1 className="text-3xl font-bold text-green-600">Order Confirmed!</h1>
          <p className="text-muted-foreground">
            Thank you for your order. We've received your payment and will process your order shortly.
          </p>
        </div>

        <Card className="border-green-200 bg-green-50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <MessageCircle className="h-6 w-6 text-green-600" />
              <p className="font-medium text-green-800">Next Step: Confirm Your Order</p>
            </div>
            <p className="text-green-700 mb-4 text-sm">
              Click the button below to contact us on WhatsApp and confirm your order details for faster processing.
            </p>
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
              <Button className="bg-green-600 hover:bg-green-700 text-white w-full sm:w-auto">
                <MessageCircle className="h-4 w-4 mr-2" />
                Contact Us on WhatsApp
              </Button>
            </a>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Order Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="font-medium">Order Number</p>
                <p className="text-muted-foreground">{order.id.slice(0, 8)}</p>
              </div>
              <div>
                <p className="font-medium">Order Date</p>
                <p className="text-muted-foreground">{new Date(order.created_at).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="font-medium">Customer</p>
                <p className="text-muted-foreground">{order.customer_name}</p>
              </div>
              <div>
                <p className="font-medium">Email</p>
                <p className="text-muted-foreground">{order.customer_email}</p>
              </div>
            </div>

            <div className="border-t pt-4">
              <p className="font-medium mb-2">Shipping Address</p>
              <p className="text-muted-foreground whitespace-pre-line">{order.shipping_address}</p>
            </div>

            <div className="border-t pt-4">
              <p className="font-medium mb-4">Order Items</p>
              <div className="space-y-2">
                {order.order_items?.map((item) => (
                  <div key={item.id} className="flex justify-between">
                    <span>
                      {item.product?.name} x {item.quantity}
                    </span>
                    <span>{formatKESSimple(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t pt-4">
              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>{formatKESSimple(order.total_amount)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <p className="text-muted-foreground">
            You will receive an email confirmation shortly with tracking information.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/products">
              <Button>Continue Shopping</Button>
            </Link>
            <Link href="/">
              <Button variant="outline">Return Home</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
