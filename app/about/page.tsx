import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, Award, Heart, Target } from "lucide-react"
import Image from "next/image"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container max-w-6xl">
        <div className="text-center space-y-4 mb-12">
          <Badge className="bg-emerald-100 text-emerald-700 px-4 py-2">
            <Heart className="h-4 w-4 mr-2" />
            About Us
          </Badge>
          <h1 className="text-4xl font-bold text-gray-900">About Knet Appliances</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Your trusted partner for quality household appliances in Kenya since 2020
          </p>
        </div>

        <div className="grid gap-12">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-gray-900">Our Story</h2>
              <p className="text-gray-600 leading-relaxed">
                Founded in 2020, Knet Appliances began with a simple mission: to make quality home appliances accessible
                to every Kenyan household. What started as a small family business has grown into one of Kenya's most
                trusted appliance retailers.
              </p>
              <p className="text-gray-600 leading-relaxed">
                We understand that home appliances are not just purchases – they're investments in your family's
                comfort, convenience, and quality of life. That's why we carefully curate our selection to include only
                the most reliable, efficient, and value-for-money products.
              </p>
            </div>
            <div className="relative">
              <Image
                src="/modern-appliance-showroom.png"
                alt="Knet Appliances Showroom"
                width={500}
                height={400}
                className="rounded-lg shadow-lg"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center">
              <CardHeader>
                <Target className="h-12 w-12 text-emerald-600 mx-auto mb-4" />
                <CardTitle>Our Mission</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  To provide Kenyan families with access to quality, affordable home appliances that enhance their daily
                  lives and bring comfort to their homes.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <Users className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <CardTitle>Our Vision</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  To be Kenya's leading home appliance retailer, known for exceptional customer service, competitive
                  prices, and reliable products.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <Award className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                <CardTitle>Our Values</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Quality, integrity, customer satisfaction, and community support guide everything we do. We believe in
                  building lasting relationships with our customers.
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-center">Why Choose Knet Appliances?</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="text-center space-y-2">
                  <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto">
                    <Award className="h-8 w-8 text-emerald-600" />
                  </div>
                  <h3 className="font-semibold">Quality Products</h3>
                  <p className="text-sm text-gray-600">Only the best brands and models</p>
                </div>
                <div className="text-center space-y-2">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                    <Users className="h-8 w-8 text-blue-600" />
                  </div>
                  <h3 className="font-semibold">Expert Service</h3>
                  <p className="text-sm text-gray-600">Professional installation and support</p>
                </div>
                <div className="text-center space-y-2">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto">
                    <Heart className="h-8 w-8 text-purple-600" />
                  </div>
                  <h3 className="font-semibold">Customer Care</h3>
                  <p className="text-sm text-gray-600">Dedicated support team</p>
                </div>
                <div className="text-center space-y-2">
                  <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto">
                    <Target className="h-8 w-8 text-orange-600" />
                  </div>
                  <h3 className="font-semibold">Fair Prices</h3>
                  <p className="text-sm text-gray-600">Competitive and transparent pricing</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
