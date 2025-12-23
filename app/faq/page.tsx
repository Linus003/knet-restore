import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { HelpCircle } from "lucide-react"

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container max-w-4xl">
        <div className="text-center space-y-4 mb-12">
          <Badge className="bg-purple-100 text-purple-700 px-4 py-2">
            <HelpCircle className="h-4 w-4 mr-2" />
            Frequently Asked Questions
          </Badge>
          <h1 className="text-4xl font-bold text-gray-900">FAQ</h1>
          <p className="text-xl text-gray-600">Find answers to common questions</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Common Questions</CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger>What payment methods do you accept?</AccordionTrigger>
                <AccordionContent>
                  We accept M-Pesa, bank transfers, credit/debit cards, and cash on delivery for orders within Nairobi.
                  All payments are secure and processed through encrypted channels.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2">
                <AccordionTrigger>How long does delivery take?</AccordionTrigger>
                <AccordionContent>
                  Delivery times vary by location: Same day delivery in Nairobi CBD for orders before 2 PM, 1-2 days for
                  Nairobi and surrounding areas, and 3-5 days for major cities nationwide.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3">
                <AccordionTrigger>Do you provide installation services?</AccordionTrigger>
                <AccordionContent>
                  Yes, we provide professional installation for all major appliances. Installation is free for orders
                  above KES 50,000, otherwise it costs KES 2,000 - KES 5,000 depending on the appliance.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-4">
                <AccordionTrigger>What is your warranty policy?</AccordionTrigger>
                <AccordionContent>
                  All products come with manufacturer warranty ranging from 1-3 years. We also provide 1-year warranty
                  on our installation work. Extended warranty options are available for purchase.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-5">
                <AccordionTrigger>Can I return a product if I change my mind?</AccordionTrigger>
                <AccordionContent>
                  Yes, you can return products within 7 days if you change your mind, provided the item is in original
                  condition with all packaging. For defective items, we offer 30-day returns.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-6">
                <AccordionTrigger>Do you deliver outside Nairobi?</AccordionTrigger>
                <AccordionContent>
                  Yes, we deliver nationwide to all major cities including Mombasa, Kisumu, Nakuru, and Eldoret.
                  Delivery charges vary by location and are calculated at checkout.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-7">
                <AccordionTrigger>How can I track my order?</AccordionTrigger>
                <AccordionContent>
                  Once your order is dispatched, you'll receive a tracking number via SMS and email. You can also call
                  our customer service team for real-time updates on your delivery.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-8">
                <AccordionTrigger>What if my appliance arrives damaged?</AccordionTrigger>
                <AccordionContent>
                  If your appliance arrives damaged, please contact us immediately. We'll arrange for a replacement or
                  full refund at no cost to you. Take photos of the damage for faster processing.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
