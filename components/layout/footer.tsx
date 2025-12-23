"use client"

function navigateTo(url: string) {
  window.location.href = url
}

export function Footer() {
  return (
    <footer className="border-t bg-gray-50">
      <div className="container py-8 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <button onClick={() => navigateTo("/")} className="flex items-center space-x-2 cursor-pointer">
              <div className="h-8 w-8 bg-blue-600 rounded-md flex items-center justify-center">
                <span className="text-white font-bold text-sm">K</span>
              </div>
              <span className="font-bold text-xl">Knet Appliances</span>
            </button>
            <p className="text-sm text-gray-600">Your trusted partner for quality household appliances in Kenya.</p>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-semibold">Shop</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button
                  onClick={() => navigateTo("/products")}
                  className="text-gray-600 hover:text-gray-900 transition-colors cursor-pointer text-left"
                >
                  All Products
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo("/products?category=kitchen-appliances")}
                  className="text-gray-600 hover:text-gray-900 transition-colors cursor-pointer text-left"
                >
                  Kitchen Appliances
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo("/products?category=laundry-appliances")}
                  className="text-gray-600 hover:text-gray-900 transition-colors cursor-pointer text-left"
                >
                  Laundry Appliances
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo("/products?category=cooling-heating")}
                  className="text-gray-600 hover:text-gray-900 transition-colors cursor-pointer text-left"
                >
                  Cooling & Heating
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo("/products?category=small-appliances")}
                  className="text-gray-600 hover:text-gray-900 transition-colors cursor-pointer text-left"
                >
                  Small Appliances
                </button>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-semibold">Support</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button
                  onClick={() => navigateTo("/contact")}
                  className="text-gray-600 hover:text-gray-900 transition-colors cursor-pointer text-left"
                >
                  Contact Us
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo("/shipping")}
                  className="text-gray-600 hover:text-gray-900 transition-colors cursor-pointer text-left"
                >
                  Shipping Info
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo("/returns")}
                  className="text-gray-600 hover:text-gray-900 transition-colors cursor-pointer text-left"
                >
                  Returns
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo("/faq")}
                  className="text-gray-600 hover:text-gray-900 transition-colors cursor-pointer text-left"
                >
                  FAQ
                </button>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-semibold">Company</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button
                  onClick={() => navigateTo("/about")}
                  className="text-gray-600 hover:text-gray-900 transition-colors cursor-pointer text-left"
                >
                  About Us
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo("/privacy")}
                  className="text-gray-600 hover:text-gray-900 transition-colors cursor-pointer text-left"
                >
                  Privacy Policy
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo("/terms")}
                  className="text-gray-600 hover:text-gray-900 transition-colors cursor-pointer text-left"
                >
                  Terms of Service
                </button>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t text-center text-sm text-gray-600">
          <p>&copy; 2025 Knet Appliances.Built by Halitechnology All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
