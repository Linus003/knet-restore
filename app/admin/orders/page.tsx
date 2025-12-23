"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ArrowLeft, Eye, Phone, Mail, MapPin, Package } from "lucide-react"
import { formatKESSimple } from "@/lib/currency"

interface OrderItem {
  id: string
  product_id: string
  quantity: number
  price: number
  product?: {
    name: string
  }
}

interface Order {
  id: string
  customer_name: string
  customer_email: string
  customer_phone: string
  shipping_address: string
  total_amount: number
  status: string
  created_at: string
  order_items: OrderItem[]
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [showDetails, setShowDetails] = useState(false)

  useEffect(() => {
    const checkAuth = () => {
      try {
        const token = localStorage.getItem("adminToken")
        if (!token) {
          window.location.href = "/admin/login"
          return false
        }
        const decoded = JSON.parse(Buffer.from(token, "base64").toString())
        if (decoded.expires <= Date.now()) {
          localStorage.removeItem("adminToken")
          window.location.href = "/admin/login"
          return false
        }
        return true
      } catch {
        window.location.href = "/admin/login"
        return false
      }
    }

    if (checkAuth()) {
      fetchOrders()
    }
  }, [])

  const fetchOrders = async () => {
    try {
      const response = await fetch("/api/admin/orders?limit=50")
      const data = await response.json()
      setOrders(data.orders || [])
    } catch (error) {
      console.error("Error fetching orders:", error)
    } finally {
      setLoading(false)
    }
  }

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/admin/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      })

      if (response.ok) {
        fetchOrders()
      }
    } catch (error) {
      console.error("Error updating order status:", error)
    }
  }

  const viewOrderDetails = (order: Order) => {
    setSelectedOrder(order)
    setShowDetails(true)
  }

  const contactCustomer = (phone: string, orderId: string) => {
    const cleanPhone = phone.replace(/\D/g, "")
    const message = encodeURIComponent(
      `Hello! This is regarding your order #${orderId.slice(0, 8)} from Knet Appliances.`,
    )
    window.open(`https://wa.me/${cleanPhone}?text=${message}`, "_blank")
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading orders...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <a href="/admin/dashboard">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </a>
            <h1 className="text-2xl font-bold">Order Management</h1>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle>All Orders ({orders.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {orders.length === 0 ? (
              <p className="text-center text-gray-500 py-8">No orders yet</p>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <div key={order.id} className="border rounded-lg p-4 bg-white">
                    <div className="grid grid-cols-1 md:grid-cols-7 gap-4 items-center">
                      <div>
                        <p className="font-medium">#{order.id.slice(0, 8)}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(order.created_at).toLocaleDateString()}
                        </p>
                      </div>

                      <div>
                        <p className="font-medium">{order.customer_name}</p>
                        <p className="text-sm text-muted-foreground">{order.customer_email}</p>
                      </div>

                      <div>
                        <p className="font-medium flex items-center gap-1">
                          <Phone className="h-3 w-3" />
                          {order.customer_phone || "N/A"}
                        </p>
                        <button
                          onClick={() => order.customer_phone && contactCustomer(order.customer_phone, order.id)}
                          className="text-sm text-green-600 hover:underline"
                          disabled={!order.customer_phone}
                        >
                          WhatsApp
                        </button>
                      </div>

                      <div>
                        <p className="font-medium">{formatKESSimple(order.total_amount)}</p>
                        <p className="text-sm text-muted-foreground">{order.order_items?.length || 0} items</p>
                      </div>

                      <div>
                        <Badge
                          variant={
                            order.status === "new"
                              ? "default"
                              : order.status === "processing"
                                ? "secondary"
                                : order.status === "shipped"
                                  ? "outline"
                                  : order.status === "delivered"
                                    ? "default"
                                    : "default"
                          }
                          className={
                            order.status === "delivered"
                              ? "bg-green-100 text-green-800"
                              : order.status === "new"
                                ? "bg-blue-100 text-blue-800"
                                : ""
                          }
                        >
                          {order.status}
                        </Badge>
                      </div>

                      <div>
                        <Select value={order.status} onValueChange={(value) => updateOrderStatus(order.id, value)}>
                          <SelectTrigger className="w-full">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="new">New</SelectItem>
                            <SelectItem value="processing">Processing</SelectItem>
                            <SelectItem value="shipped">Shipped</SelectItem>
                            <SelectItem value="delivered">Delivered</SelectItem>
                            <SelectItem value="cancelled">Cancelled</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Button variant="outline" size="sm" onClick={() => viewOrderDetails(order)}>
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Order Details #{selectedOrder?.id.slice(0, 8)}</DialogTitle>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-6">
              {/* Customer Information */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Package className="h-4 w-4" />
                  Customer Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Name</p>
                    <p className="font-medium">{selectedOrder.customer_name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium flex items-center gap-1">
                      <Mail className="h-3 w-3" />
                      {selectedOrder.customer_email}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <p className="font-medium flex items-center gap-1">
                      <Phone className="h-3 w-3" />
                      {selectedOrder.customer_phone || "Not provided"}
                    </p>
                    {selectedOrder.customer_phone && (
                      <button
                        onClick={() => contactCustomer(selectedOrder.customer_phone, selectedOrder.id)}
                        className="text-sm text-green-600 hover:underline mt-1"
                      >
                        Contact via WhatsApp
                      </button>
                    )}
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Delivery Address</p>
                    <p className="font-medium flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {selectedOrder.shipping_address}
                    </p>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div>
                <h3 className="font-semibold mb-3">Order Items</h3>
                <div className="border rounded-lg divide-y">
                  {selectedOrder.order_items?.map((item, index) => (
                    <div key={item.id || index} className="p-3 flex justify-between items-center">
                      <div>
                        <p className="font-medium">
                          {item.product?.name || `Product #${item.product_id?.slice(0, 8)}`}
                        </p>
                        <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                      </div>
                      <p className="font-medium">{formatKESSimple(item.price * item.quantity)}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Summary */}
              <div className="border-t pt-4">
                <div className="flex justify-between items-center">
                  <span className="font-semibold">Total Amount</span>
                  <span className="text-xl font-bold">{formatKESSimple(selectedOrder.total_amount)}</span>
                </div>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-sm text-gray-500">Order Date</span>
                  <span className="text-sm">{new Date(selectedOrder.created_at).toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-sm text-gray-500">Status</span>
                  <Badge>{selectedOrder.status}</Badge>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 pt-4 border-t">
                {selectedOrder.customer_phone && (
                  <Button
                    onClick={() => contactCustomer(selectedOrder.customer_phone, selectedOrder.id)}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <Phone className="h-4 w-4 mr-2" />
                    Contact on WhatsApp
                  </Button>
                )}
                <Button variant="outline" onClick={() => setShowDetails(false)}>
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
