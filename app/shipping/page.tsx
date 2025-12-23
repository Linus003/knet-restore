import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Truck, Clock, MapPin, Phone } from "lucide-react"

export default function ShippingPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container max-w-4xl">
        <div className="text-center space-y-4 mb-12">
          <Badge className="bg-emerald-100 text-emerald-700 px-4 py-2">
            <Truck className="h-4 w-4 mr-2" />
            Shipping Information
          </Badge>
          <h1 className="text-4xl font-bold text-gray-900">Delivery & Shipping</h1>
          <p className="text-xl text-gray-600">Fast, reliable delivery across Kenya</p>
        </div>

        <div className="grid gap-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-emerald-600" />
                Delivery Areas
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Nairobi & Surrounding Areas</h3>
                  <ul className="text-gray-600 space-y-1">
                    <li>• Nairobi CBD - Free delivery</li>
                    <li>• Westlands, Karen, Kilimani - Free delivery</li>
                    <li>• Kiambu, Thika, Machakos - KES 500</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Major Cities</h3>
                  <ul className="text-gray-600 space-y-1">
                    <li>• Mombasa - KES 1,500</li>
                    <li>• Kisumu - KES 2,000</li>
                    <li>• Nakuru - KES 1,000</li>
                    <li>• Eldoret - KES 1,800</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-emerald-600" />
                Delivery Times
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-emerald-50 rounded-lg">
                  <h3 className="font-semibold text-emerald-700">Same Day</h3>
                  <p className="text-sm text-gray-600">Nairobi CBD orders before 2 PM</p>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <h3 className="font-semibold text-blue-700">1-2 Days</h3>
                  <p className="text-sm text-gray-600">Nairobi & surrounding areas</p>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <h3 className="font-semibold text-purple-700">3-5 Days</h3>
                  <p className="text-sm text-gray-600">Major cities nationwide</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Phone className="h-5 w-5 text-emerald-600" />
                Installation Services
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Professional installation available for all major appliances including washing machines, refrigerators,
                air conditioners, and more.
              </p>
              <ul className="text-gray-600 space-y-2">
                <li>• Free installation for orders above KES 50,000</li>
                <li>• Standard installation: KES 2,000 - KES 5,000</li>
                <li>• Same-day installation available in Nairobi</li>
                <li>• 1-year warranty on installation work</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
