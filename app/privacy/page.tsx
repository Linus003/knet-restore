import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Shield } from "lucide-react"

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container max-w-4xl">
        <div className="text-center space-y-4 mb-12">
          <Badge className="bg-green-100 text-green-700 px-4 py-2">
            <Shield className="h-4 w-4 mr-2" />
            Privacy Policy
          </Badge>
          <h1 className="text-4xl font-bold text-gray-900">Privacy Policy</h1>
          <p className="text-xl text-gray-600">How we collect, use, and protect your information</p>
          <p className="text-sm text-gray-500">Last updated: January 2025</p>
        </div>

        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Information We Collect</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Personal Information</h3>
                <p className="text-gray-600 mb-2">When you make a purchase or create an account, we collect:</p>
                <ul className="text-gray-600 space-y-1 ml-4">
                  <li>• Name and contact information</li>
                  <li>• Delivery address</li>
                  <li>• Phone number and email address</li>
                  <li>• Payment information (processed securely)</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Usage Information</h3>
                <p className="text-gray-600">
                  We automatically collect information about how you use our website, including pages visited, time
                  spent, and interactions with our content.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>How We Use Your Information</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="text-gray-600 space-y-2">
                <li>• Process and fulfill your orders</li>
                <li>• Provide customer support and service</li>
                <li>• Send order confirmations and delivery updates</li>
                <li>• Improve our website and services</li>
                <li>• Send promotional offers (with your consent)</li>
                <li>• Comply with legal obligations</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Information Sharing</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600">
                We do not sell, trade, or rent your personal information to third parties. We may share your information
                only in these circumstances:
              </p>
              <ul className="text-gray-600 space-y-2 ml-4">
                <li>• With delivery partners to fulfill your orders</li>
                <li>• With payment processors to handle transactions</li>
                <li>• When required by law or legal process</li>
                <li>• To protect our rights and prevent fraud</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Data Security</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                We implement appropriate security measures to protect your personal information against unauthorized
                access, alteration, disclosure, or destruction. This includes encryption of sensitive data and secure
                server infrastructure.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Your Rights</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">You have the right to:</p>
              <ul className="text-gray-600 space-y-2 ml-4">
                <li>• Access your personal information</li>
                <li>• Correct inaccurate information</li>
                <li>• Request deletion of your data</li>
                <li>• Opt-out of marketing communications</li>
                <li>• Request data portability</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Contact Us</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                If you have questions about this Privacy Policy or how we handle your information, please contact us at:
              </p>
              <div className="mt-4 space-y-2 text-gray-600">
                <p>Email: privacy@knetappliances.co.ke</p>
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
