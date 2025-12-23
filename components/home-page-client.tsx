"use client"

import Image from "next/image"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Star, ArrowRight, CheckCircle, Users, Award, Heart, Mail, Gift, Sparkles, PartyPopper } from "lucide-react"
import type { Product } from "@/types"
import { formatKESSimple } from "@/lib/currency"

interface HomePageClientProps {
  featuredProducts: Product[]
  heroSettings: {
    headline: string
    subtext: string
    cta_text: string
    image_url: string
  }
}

function navigateTo(url: string) {
  window.location.href = url
}

export function HomePageClient({ featuredProducts, heroSettings }: HomePageClientProps) {
  return (
    <div className="min-h-screen">
      {/* Holiday Banner */}
      <section className="relative overflow-hidden bg-gradient-to-r from-red-600 via-red-500 to-green-600">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-10 text-white/10 text-6xl">❄</div>
          <div className="absolute top-2 right-20 text-white/10 text-4xl">✦</div>
          <div className="absolute bottom-0 left-1/4 text-white/10 text-5xl">❄</div>
          <div className="absolute top-1 right-1/3 text-white/10 text-3xl">✦</div>
        </div>
        <div className="container relative py-4">
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 text-white text-center">
            <div className="flex items-center gap-2">
              <Gift className="h-6 w-6 animate-bounce" />
              <Sparkles className="h-5 w-5 text-yellow-300" />
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4">
              <span className="text-lg md:text-xl font-bold tracking-wide">🎄 FESTIVE SEASON SALE! 🎄</span>
              <span className="bg-white/20 backdrop-blur-sm px-4 py-1 rounded-full text-sm md:text-base font-semibold border border-white/30">
                UP TO 30% OFF
              </span>
              <span className="text-sm md:text-base">on selected appliances</span>
            </div>
            <div className="flex items-center gap-2">
              <PartyPopper className="h-5 w-5 text-yellow-300" />
              <button
                onClick={() => navigateTo("/products")}
                className="inline-flex items-center justify-center gap-1 bg-white text-red-600 hover:bg-yellow-100 font-bold shadow-lg hover:shadow-xl transition-all px-4 py-2 rounded-md text-sm cursor-pointer"
              >
                Shop Now
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-emerald-50 via-white to-green-50">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="container relative py-20 md:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8 text-center lg:text-left">
              <div className="space-y-4">
                <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 px-4 py-2 text-sm font-medium">
                  ✨ Kenya&apos;s #1 Appliance Store
                </Badge>
                <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight bg-gradient-to-r from-gray-900 via-emerald-800 to-emerald-600 bg-clip-text text-transparent">
                  {heroSettings.headline}
                </h1>
                <p className="text-xl md:text-2xl text-gray-600 leading-relaxed max-w-2xl">{heroSettings.subtext}</p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <button
                  onClick={() => navigateTo("/products")}
                  className="inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 rounded-md group cursor-pointer"
                >
                  {heroSettings.cta_text}
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </button>
                <button
                  onClick={() => navigateTo("/about")}
                  className="inline-flex items-center justify-center border-2 border-emerald-600 text-emerald-600 hover:bg-emerald-50 px-8 py-4 text-lg font-semibold bg-transparent rounded-md transition-all duration-300 cursor-pointer"
                >
                  Learn More
                </button>
              </div>

              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-8 pt-8">
                <div className="flex items-center gap-2 text-gray-600">
                  <CheckCircle className="h-5 w-5 text-emerald-600" />
                  <span className="font-medium">5000+ Happy Customers</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Star className="h-5 w-5 text-yellow-500 fill-current" />
                  <span className="font-medium">4.9/5 Rating</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Award className="h-5 w-5 text-emerald-600" />
                  <span className="font-medium">Trusted Since 2020</span>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-emerald-400 to-green-400 rounded-3xl blur-2xl opacity-20"></div>
              <div className="relative bg-white rounded-3xl shadow-2xl p-8">
                <Image
                  src={heroSettings.image_url || "/placeholder.svg"}
                  alt="Hero Image"
                  width={600}
                  height={500}
                  className="rounded-2xl object-cover w-full h-auto"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-emerald-50">
        <div className="container">
          <div className="text-center space-y-4 mb-16">
            <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 px-4 py-2 text-sm font-medium">
              ⭐ Customer Favorites
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Featured Products</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover our most popular and highly-rated appliances, trusted by thousands of customers
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProducts.length === 0 ? (
              <div className="col-span-full text-center py-16">
                <div className="max-w-md mx-auto space-y-4">
                  <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto">
                    <Star className="h-10 w-10 text-emerald-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">Featured Products Coming Soon</h3>
                  <p className="text-gray-600">
                    We&apos;re updating our featured collection. Browse all our products to find great deals!
                  </p>
                  <button
                    onClick={() => navigateTo("/products")}
                    className="inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white mt-4 px-6 py-3 rounded-md font-medium transition-colors cursor-pointer"
                  >
                    Browse All Products
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ) : (
              featuredProducts.map((product) => (
                <Card
                  key={product.id}
                  className="group hover:shadow-2xl transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm hover:bg-white"
                >
                  <CardHeader className="p-0">
                    <div className="relative overflow-hidden rounded-t-xl">
                      <Image
                        src={product.image_url || "/placeholder.svg?height=300&width=400&query=home appliance"}
                        alt={product.name}
                        width={400}
                        height={300}
                        className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <Badge className="absolute top-4 left-4 bg-emerald-600 text-white shadow-lg">Featured</Badge>
                      <button
                        type="button"
                        className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/90 hover:bg-white p-2 rounded-md"
                      >
                        <Heart className="h-4 w-4" />
                      </button>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6 space-y-4">
                    <div className="space-y-2">
                      <CardTitle className="text-xl font-bold text-gray-900 group-hover:text-emerald-600 transition-colors">
                        {product.name}
                      </CardTitle>
                      <p className="text-gray-600 text-sm line-clamp-2 leading-relaxed">{product.description}</p>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <span className="text-2xl font-bold text-emerald-600">{formatKESSimple(product.price)}</span>
                        <div className="flex items-center space-x-1">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          ))}
                          <span className="text-sm text-gray-500 ml-2">(4.9)</span>
                        </div>
                      </div>
                      <Badge variant="secondary" className="bg-emerald-100 text-emerald-700">
                        In Stock
                      </Badge>
                    </div>
                  </CardContent>
                  <CardFooter className="p-6 pt-0">
                    <button
                      onClick={() => navigateTo(`/products/${product.slug}`)}
                      className="w-full inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 rounded-md group transition-colors cursor-pointer"
                    >
                      View Details
                      <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </CardFooter>
                </Card>
              ))
            )}
          </div>

          <div className="text-center mt-16">
            <button
              onClick={() => navigateTo("/products")}
              className="inline-flex items-center justify-center gap-2 border-2 border-emerald-600 text-emerald-600 hover:bg-emerald-600 hover:text-white px-8 py-4 text-lg font-semibold transition-all duration-300 bg-transparent rounded-md cursor-pointer"
            >
              View All Products
              <ArrowRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white">
        <div className="container">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">What Our Customers Say</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Don&apos;t just take our word for it - hear from our satisfied customers
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg bg-gradient-to-br from-emerald-50 to-white">
              <CardContent className="p-8 space-y-4">
                <div className="flex items-center space-x-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-700 italic leading-relaxed">
                  &quot;Excellent service and quality products. My washing machine was delivered on time and installed
                  professionally. Highly recommended!&quot;
                </p>
                <div className="flex items-center space-x-3 pt-4">
                  <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                    <Users className="h-6 w-6 text-emerald-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Sarah Mwangi</p>
                    <p className="text-sm text-gray-600">Nairobi</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-white">
              <CardContent className="p-8 space-y-4">
                <div className="flex items-center space-x-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-700 italic leading-relaxed">
                  &quot;Great prices and fantastic customer support. The team helped me choose the perfect refrigerator
                  for my family. Very satisfied!&quot;
                </p>
                <div className="flex items-center space-x-3 pt-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <Users className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">John Kamau</p>
                    <p className="text-sm text-gray-600">Kiambu</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-white">
              <CardContent className="p-8 space-y-4">
                <div className="flex items-center space-x-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-700 italic leading-relaxed">
                  &quot;Fast delivery and professional installation. The microwave works perfectly and the price was
                  very competitive. Will shop here again!&quot;
                </p>
                <div className="flex items-center space-x-3 pt-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                    <Users className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Grace Wanjiku</p>
                    <p className="text-sm text-gray-600">Thika</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-20 bg-gradient-to-r from-emerald-600 to-green-600">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <div className="space-y-4">
              <h2 className="text-3xl md:text-4xl font-bold text-white">Stay Updated with Latest Deals</h2>
              <p className="text-xl text-emerald-100 max-w-2xl mx-auto">
                Subscribe to our newsletter and be the first to know about new products, exclusive offers, and special
                discounts
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <Input
                type="email"
                placeholder="Enter your email address"
                className="bg-white/10 border-white/20 text-white placeholder:text-emerald-100 focus:bg-white/20"
              />
              <button
                type="button"
                className="inline-flex items-center justify-center gap-2 bg-white text-emerald-600 hover:bg-emerald-50 font-semibold px-8 py-2 rounded-md transition-colors cursor-pointer"
              >
                <Mail className="h-4 w-4" />
                Subscribe
              </button>
            </div>

            <p className="text-sm text-emerald-100">Join 10,000+ subscribers. No spam, unsubscribe anytime.</p>
          </div>
        </div>
      </section>
    </div>
  )
}
