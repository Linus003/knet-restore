import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { RotateCcw, Shield, Clock, CheckCircle } from "lucide-react"

export default function ReturnsPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container max-w-4xl">
        <div className="text-center space-y-4 mb-12">
          <Badge className="bg-blue-100 text-blue-700 px-4 py-2">
            <RotateCcw className="h-4 w-4 mr-2" />
            Returns Policy
          </Badge>
          <h1 className="text-4xl font-bold text-gray-900">Returns & Refunds</h1>
          <p className="text-xl text-gray-600">30-day hassle-free returns</p>
        </div>

        <div className="grid gap-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-blue-600" />
                Return Policy
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600">
                We offer a 30-day return policy for all products. Items must be in original condition with all packaging
                and accessories.
              </p>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Eligible for Return</h3>
                  <ul className="text-gray-600 space-y-1">
                    <li>• Defective or damaged products</li>
                    <li>• Wrong item delivered</li>
                    <li>• Product doesn't match description</li>
                    <li>• Change of mind (within 7 days)</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Not Eligible</h3>
                  <ul className="text-gray-600 space-y-1">
                    <li>• Used or damaged by customer</li>
                    <li>• Missing original packaging</li>
                    <li>• Products over 30 days old</li>
                    <li>• Custom or personalized items</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-blue-600" />
                Return Process
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-2 text-sm font-bold">
                    1
                  </div>
                  <h3 className="font-semibold text-blue-700 mb-1">Contact Us</h3>
                  <p className="text-xs text-gray-600">Call or email within 30 days</p>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-2 text-sm font-bold">
                    2
                  </div>
                  <h3 className="font-semibold text-blue-700 mb-1">Get Approval</h3>
                  <p className="text-xs text-gray-600">Receive return authorization</p>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-2 text-sm font-bold">
                    3
                  </div>
                  <h3 className="font-semibold text-blue-700 mb-1">Ship Back</h3>
                  <p className="text-xs text-gray-600">Package and send item</p>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-2 text-sm font-bold">
                    4
                  </div>
                  <h3 className="font-semibold text-blue-700 mb-1">Get Refund</h3>
                  <p className="text-xs text-gray-600">Receive refund in 5-7 days</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-blue-600" />
                Refund Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Refund Timeline</h3>
                  <ul className="text-gray-600 space-y-1">
                    <li>• M-Pesa: 1-2 business days</li>
                    <li>• Bank transfer: 3-5 business days</li>
                    <li>• Credit card: 5-7 business days</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Return Shipping</h3>
                  <ul className="text-gray-600 space-y-1">
                    <li>• Free return shipping for defects</li>
                    <li>• Customer pays for change of mind</li>
                    <li>• We arrange pickup for large items</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
