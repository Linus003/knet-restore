import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { FileText } from "lucide-react"

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container max-w-4xl">
        <div className="text-center space-y-4 mb-12">
          <Badge className="bg-orange-100 text-orange-700 px-4 py-2">
            <FileText className="h-4 w-4 mr-2" />
            Terms of Service
          </Badge>
          <h1 className="text-4xl font-bold text-gray-900">Terms of Service</h1>
          <p className="text-xl text-gray-600">Terms and conditions for using our services</p>
          <p className="text-sm text-gray-500">Last updated: January 2025</p>
        </div>

        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Acceptance of Terms</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                By accessing and using the Knet Appliances website and services, you accept and agree to be bound by the
                terms and provision of this agreement. If you do not agree to abide by the above, please do not use this
                service.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Products and Services</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Product Information</h3>
                <p className="text-gray-600">
                  We strive to provide accurate product descriptions, images, and pricing. However, we do not warrant
                  that product descriptions or other content is accurate, complete, reliable, current, or error-free.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Pricing</h3>
                <p className="text-gray-600">
                  All prices are in Kenyan Shillings (KES) and are subject to change without notice. We reserve the
                  right to modify prices at any time.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Orders and Payment</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="text-gray-600 space-y-2">
                <li>• All orders are subject to acceptance and availability</li>
                <li>• We reserve the right to refuse or cancel any order</li>
                <li>• Payment must be made in full before delivery</li>
                <li>• We accept M-Pesa, bank transfers, and credit/debit cards</li>
                <li>• Delivery charges are additional and calculated at checkout</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Delivery and Installation</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Delivery</h3>
                <p className="text-gray-600">
                  Delivery times are estimates and may vary due to circumstances beyond our control. We are not liable
                  for delays in delivery.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Installation</h3>
                <p className="text-gray-600">
                  Installation services are provided by qualified technicians. Additional charges may apply for complex
                  installations or modifications.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Warranties and Returns</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Manufacturer Warranty</h3>
                <p className="text-gray-600">
                  All products come with manufacturer warranty. Warranty terms vary by product and manufacturer.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Returns</h3>
                <p className="text-gray-600">
                  Returns are accepted within 30 days of purchase for defective items, and within 7 days for change of
                  mind, subject to our returns policy.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Limitation of Liability</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Knet Appliances shall not be liable for any indirect, incidental, special, consequential, or punitive
                damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses,
                resulting from your use of our services.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">For questions about these Terms of Service, please contact us:</p>
              <div className="space-y-2 text-gray-600">
                <p>Email: legal@knetappliances.co.ke</p>
                <p>Phone: +254 700 123 456</p>
                <p>Address: Knet Appliances Center, Moi Avenue, Nairobi, Kenya</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
