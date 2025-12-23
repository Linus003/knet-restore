import { streamText, tool } from "ai"
import { z } from "zod"
import { createClient } from "@/lib/supabase"

export const maxDuration = 30

// Kenya market price database for common appliances
const kenyaPriceDatabase: Record<string, { minPrice: number; maxPrice: number; avgPrice: number }> = {
  // Blenders
  blender: { minPrice: 2500, maxPrice: 15000, avgPrice: 6000 },
  "heavy duty blender": { minPrice: 8000, maxPrice: 25000, avgPrice: 15000 },
  "commercial blender": { minPrice: 15000, maxPrice: 45000, avgPrice: 28000 },
  "silver crest blender": { minPrice: 5000, maxPrice: 12000, avgPrice: 8000 },
  nutribullet: { minPrice: 8000, maxPrice: 18000, avgPrice: 12000 },

  // Kettles
  kettle: { minPrice: 1500, maxPrice: 8000, avgPrice: 3500 },
  "electric kettle": { minPrice: 1800, maxPrice: 10000, avgPrice: 4000 },
  "cordless kettle": { minPrice: 2000, maxPrice: 8000, avgPrice: 4500 },
  "glass kettle": { minPrice: 2500, maxPrice: 7000, avgPrice: 4000 },

  // Microwaves
  microwave: { minPrice: 8000, maxPrice: 35000, avgPrice: 15000 },
  "microwave oven": { minPrice: 10000, maxPrice: 45000, avgPrice: 22000 },
  "grill microwave": { minPrice: 15000, maxPrice: 40000, avgPrice: 25000 },

  // Refrigerators
  fridge: { minPrice: 25000, maxPrice: 150000, avgPrice: 55000 },
  refrigerator: { minPrice: 25000, maxPrice: 150000, avgPrice: 55000 },
  "mini fridge": { minPrice: 12000, maxPrice: 35000, avgPrice: 22000 },
  "double door fridge": { minPrice: 45000, maxPrice: 120000, avgPrice: 75000 },
  "side by side fridge": { minPrice: 80000, maxPrice: 200000, avgPrice: 120000 },

  // Washing Machines
  "washing machine": { minPrice: 25000, maxPrice: 80000, avgPrice: 45000 },
  "front load washer": { minPrice: 35000, maxPrice: 100000, avgPrice: 55000 },
  "top load washer": { minPrice: 20000, maxPrice: 60000, avgPrice: 35000 },
  "twin tub": { minPrice: 15000, maxPrice: 35000, avgPrice: 22000 },

  // Cookers & Stoves
  cooker: { minPrice: 15000, maxPrice: 80000, avgPrice: 35000 },
  "gas cooker": { minPrice: 18000, maxPrice: 90000, avgPrice: 40000 },
  "electric cooker": { minPrice: 20000, maxPrice: 70000, avgPrice: 38000 },
  "induction cooker": { minPrice: 5000, maxPrice: 25000, avgPrice: 12000 },
  "hot plate": { minPrice: 2000, maxPrice: 8000, avgPrice: 4000 },

  // Air Fryers
  "air fryer": { minPrice: 6000, maxPrice: 25000, avgPrice: 12000 },
  "digital air fryer": { minPrice: 8000, maxPrice: 30000, avgPrice: 15000 },

  // Toasters
  toaster: { minPrice: 2000, maxPrice: 8000, avgPrice: 4000 },
  "sandwich maker": { minPrice: 1500, maxPrice: 5000, avgPrice: 2800 },

  // Irons
  iron: { minPrice: 1200, maxPrice: 6000, avgPrice: 2500 },
  "steam iron": { minPrice: 2000, maxPrice: 8000, avgPrice: 4000 },
  "dry iron": { minPrice: 1000, maxPrice: 3500, avgPrice: 2000 },

  // Fans
  fan: { minPrice: 2000, maxPrice: 15000, avgPrice: 5000 },
  "standing fan": { minPrice: 3500, maxPrice: 12000, avgPrice: 6000 },
  "ceiling fan": { minPrice: 4000, maxPrice: 15000, avgPrice: 8000 },
  "table fan": { minPrice: 1500, maxPrice: 5000, avgPrice: 3000 },

  // Water Dispensers
  "water dispenser": { minPrice: 8000, maxPrice: 35000, avgPrice: 18000 },
  "hot and cold dispenser": { minPrice: 12000, maxPrice: 40000, avgPrice: 22000 },

  // Vacuum Cleaners
  "vacuum cleaner": { minPrice: 5000, maxPrice: 35000, avgPrice: 15000 },
  "wet dry vacuum": { minPrice: 8000, maxPrice: 25000, avgPrice: 15000 },

  // Juicers
  juicer: { minPrice: 3000, maxPrice: 15000, avgPrice: 7000 },
  "citrus juicer": { minPrice: 2000, maxPrice: 8000, avgPrice: 4000 },

  // Food Processors
  "food processor": { minPrice: 5000, maxPrice: 25000, avgPrice: 12000 },
  "mixer grinder": { minPrice: 4000, maxPrice: 15000, avgPrice: 8000 },

  // Rice Cookers
  "rice cooker": { minPrice: 2500, maxPrice: 12000, avgPrice: 5500 },

  // Pressure Cookers
  "pressure cooker": { minPrice: 3000, maxPrice: 15000, avgPrice: 7000 },
  "electric pressure cooker": { minPrice: 6000, maxPrice: 20000, avgPrice: 12000 },

  // Coffee Makers
  "coffee maker": { minPrice: 3000, maxPrice: 25000, avgPrice: 10000 },
  "espresso machine": { minPrice: 15000, maxPrice: 80000, avgPrice: 35000 },

  // TVs
  tv: { minPrice: 15000, maxPrice: 150000, avgPrice: 45000 },
  "smart tv": { minPrice: 20000, maxPrice: 200000, avgPrice: 55000 },
  "led tv": { minPrice: 15000, maxPrice: 120000, avgPrice: 40000 },

  // Heaters
  heater: { minPrice: 3000, maxPrice: 15000, avgPrice: 7000 },
  "room heater": { minPrice: 3500, maxPrice: 12000, avgPrice: 6500 },
  "water heater": { minPrice: 8000, maxPrice: 35000, avgPrice: 18000 },

  // Default for unknown products
  default: { minPrice: 2000, maxPrice: 50000, avgPrice: 15000 },
}

function estimatePrice(productName: string): {
  minPrice: number
  maxPrice: number
  avgPrice: number
  confidence: string
} {
  const nameLower = productName.toLowerCase()

  // Try to find exact or partial match
  for (const [key, value] of Object.entries(kenyaPriceDatabase)) {
    if (nameLower.includes(key) || key.includes(nameLower)) {
      return { ...value, confidence: "high" }
    }
  }

  // Check individual words
  const words = nameLower.split(/[\s\-_]+/)
  for (const word of words) {
    if (word.length > 3) {
      for (const [key, value] of Object.entries(kenyaPriceDatabase)) {
        if (key.includes(word)) {
          return { ...value, confidence: "medium" }
        }
      }
    }
  }

  return { ...kenyaPriceDatabase["default"], confidence: "low" }
}

function generateSmartDescription(productName: string, brand?: string): string {
  const nameLower = productName.toLowerCase()

  const descriptions: Record<string, string[]> = {
    blender: [
      "Powerful motor for smooth blending of fruits, vegetables, and ice.",
      "Durable stainless steel blades for efficient crushing and mixing.",
      "Multiple speed settings for versatile food preparation.",
      "Easy-clean design with dishwasher-safe components.",
      "Perfect for smoothies, soups, sauces, and baby food.",
    ],
    kettle: [
      "Fast-boiling technology for quick hot water preparation.",
      "Auto shut-off feature for safety and energy efficiency.",
      "Cordless design for easy pouring and serving.",
      "Boil-dry protection to prevent damage.",
      "Ideal for tea, coffee, and instant meals.",
    ],
    microwave: [
      "Even heating technology for consistent cooking results.",
      "Multiple power levels for different food types.",
      "Easy-to-use digital controls with preset programs.",
      "Spacious interior for family-sized portions.",
      "Quick defrost function for frozen foods.",
    ],
    fridge: [
      "Energy-efficient cooling technology to save on electricity bills.",
      "Spacious compartments for organized food storage.",
      "Adjustable temperature controls for optimal freshness.",
      "Frost-free operation for hassle-free maintenance.",
      "Durable construction for long-lasting performance.",
    ],
    "washing machine": [
      "Multiple wash programs for different fabric types.",
      "Water and energy efficient operation.",
      "Gentle on clothes while tough on stains.",
      "Quick wash option for lightly soiled items.",
      "Quiet operation for peaceful home environment.",
    ],
    "air fryer": [
      "Healthy cooking with up to 80% less oil than traditional frying.",
      "Rapid air circulation for crispy, golden results.",
      "Easy-to-use digital controls with preset cooking programs.",
      "Non-stick basket for easy cleaning.",
      "Perfect for fries, chicken, fish, and vegetables.",
    ],
    iron: [
      "Powerful steam output for easy wrinkle removal.",
      "Non-stick soleplate for smooth gliding.",
      "Variable temperature settings for different fabrics.",
      "Anti-drip system to prevent water spots.",
      "Ergonomic design for comfortable ironing.",
    ],
    fan: [
      "Powerful airflow for effective cooling.",
      "Multiple speed settings for personalized comfort.",
      "Quiet operation for undisturbed rest.",
      "Oscillation feature for wide area coverage.",
      "Energy-efficient motor for low power consumption.",
    ],
    cooker: [
      "Even heat distribution for perfect cooking results.",
      "Multiple burners for simultaneous cooking.",
      "Durable construction for years of reliable use.",
      "Easy-clean surfaces for hassle-free maintenance.",
      "Safety features including flame failure protection.",
    ],
    vacuum: [
      "Powerful suction for deep cleaning.",
      "Versatile attachments for different surfaces.",
      "Easy-empty dust container.",
      "Lightweight design for effortless cleaning.",
      "HEPA filtration for cleaner air.",
    ],
  }

  let matchedDescriptions: string[] = []

  for (const [key, descs] of Object.entries(descriptions)) {
    if (nameLower.includes(key)) {
      matchedDescriptions = descs
      break
    }
  }

  if (matchedDescriptions.length === 0) {
    matchedDescriptions = [
      "High-quality home appliance designed for modern households.",
      "Durable construction ensures long-lasting performance.",
      "Easy to use and maintain for everyday convenience.",
      "Energy-efficient operation to save on electricity costs.",
      "Backed by manufacturer warranty for peace of mind.",
    ]
  }

  // Pick 3 random descriptions
  const shuffled = matchedDescriptions.sort(() => 0.5 - Math.random())
  const selected = shuffled.slice(0, 3)

  let description = selected.join(" ")

  if (brand) {
    description = `${brand} quality you can trust. ${description}`
  }

  return description
}

export async function POST(req: Request) {
  const { messages, productContext } = await req.json()

  const systemMessage = `You are a smart product assistant for Knet Appliances, an online home appliances store in Kenya. Your job is to:

1. Help generate compelling product descriptions that highlight features, benefits, and use cases
2. Estimate appropriate prices in Kenyan Shillings (KES) based on market rates
3. Suggest product categories and tags
4. Answer questions about appliances and their features

When generating descriptions:
- Be specific about features and benefits
- Mention energy efficiency when relevant
- Include warranty information if known
- Keep descriptions between 2-4 sentences
- Make them SEO-friendly with relevant keywords

When estimating prices:
- Always give prices in KES (Kenyan Shillings)
- Provide a price range (min-max) and a suggested retail price
- Consider brand reputation and features
- Be realistic based on Kenya market rates

Current product context: ${productContext || "No specific product selected"}

Be helpful, concise, and professional. Always respond in English.`

  const result = streamText({
    model: "openai/gpt-4o-mini",
    system: systemMessage,
    messages,
    tools: {
      generateDescription: tool({
        description: "Generate a smart product description based on the product name and optional brand",
        parameters: z.object({
          productName: z.string().describe("The name of the product"),
          brand: z.string().optional().describe("The brand name if known"),
          features: z.array(z.string()).optional().describe("List of known features"),
        }),
        execute: async ({ productName, brand, features }) => {
          let description = generateSmartDescription(productName, brand)

          if (features && features.length > 0) {
            description += ` Key features include: ${features.join(", ")}.`
          }

          return {
            description,
            productName,
            brand: brand || "Generic",
          }
        },
      }),
      estimatePrice: tool({
        description: "Estimate the price range for a product in Kenyan Shillings",
        parameters: z.object({
          productName: z.string().describe("The name of the product"),
          condition: z.enum(["new", "refurbished", "used"]).optional().describe("Product condition"),
        }),
        execute: async ({ productName, condition = "new" }) => {
          const priceData = estimatePrice(productName)

          // Adjust for condition
          let multiplier = 1
          if (condition === "refurbished") multiplier = 0.7
          if (condition === "used") multiplier = 0.5

          return {
            productName,
            condition,
            minPrice: Math.round(priceData.minPrice * multiplier),
            maxPrice: Math.round(priceData.maxPrice * multiplier),
            suggestedPrice: Math.round(priceData.avgPrice * multiplier),
            currency: "KES",
            confidence: priceData.confidence,
            note:
              priceData.confidence === "low"
                ? "Price estimate based on general appliance pricing. Please verify with market research."
                : priceData.confidence === "medium"
                  ? "Price estimate based on similar product category."
                  : "Price estimate based on current Kenya market rates.",
          }
        },
      }),
      suggestCategory: tool({
        description: "Suggest the best category for a product",
        parameters: z.object({
          productName: z.string().describe("The name of the product"),
        }),
        execute: async ({ productName }) => {
          const nameLower = productName.toLowerCase()

          const categoryMap: Record<string, { category: string; subcategory: string }> = {
            blender: { category: "Kitchen Appliances", subcategory: "Blenders & Mixers" },
            mixer: { category: "Kitchen Appliances", subcategory: "Blenders & Mixers" },
            kettle: { category: "Kitchen Appliances", subcategory: "Kettles" },
            microwave: { category: "Kitchen Appliances", subcategory: "Microwaves" },
            oven: { category: "Kitchen Appliances", subcategory: "Ovens" },
            toaster: { category: "Kitchen Appliances", subcategory: "Toasters" },
            "air fryer": { category: "Kitchen Appliances", subcategory: "Air Fryers" },
            cooker: { category: "Kitchen Appliances", subcategory: "Cookers & Stoves" },
            fridge: { category: "Cooling", subcategory: "Refrigerators" },
            refrigerator: { category: "Cooling", subcategory: "Refrigerators" },
            freezer: { category: "Cooling", subcategory: "Freezers" },
            washing: { category: "Laundry", subcategory: "Washing Machines" },
            dryer: { category: "Laundry", subcategory: "Dryers" },
            iron: { category: "Laundry", subcategory: "Irons" },
            fan: { category: "Cooling", subcategory: "Fans" },
            heater: { category: "Heating", subcategory: "Room Heaters" },
            vacuum: { category: "Cleaning", subcategory: "Vacuum Cleaners" },
            dispenser: { category: "Kitchen Appliances", subcategory: "Water Dispensers" },
            tv: { category: "Electronics", subcategory: "Televisions" },
            juicer: { category: "Kitchen Appliances", subcategory: "Juicers" },
            coffee: { category: "Kitchen Appliances", subcategory: "Coffee Makers" },
            "rice cooker": { category: "Kitchen Appliances", subcategory: "Rice Cookers" },
            "pressure cooker": { category: "Kitchen Appliances", subcategory: "Pressure Cookers" },
          }

          for (const [key, value] of Object.entries(categoryMap)) {
            if (nameLower.includes(key)) {
              return { productName, ...value }
            }
          }

          return {
            productName,
            category: "Home Appliances",
            subcategory: "General",
            note: "Could not determine specific category. Please select manually.",
          }
        },
      }),
      createProduct: tool({
        description: "Create a new product in the database with the given details",
        parameters: z.object({
          name: z.string().describe("Product name"),
          description: z.string().describe("Product description"),
          price: z.number().describe("Product price in KES"),
          category: z.string().describe("Product category"),
          imageUrl: z.string().optional().describe("Product image URL"),
          stock: z.number().optional().describe("Stock quantity"),
        }),
        execute: async ({ name, description, price, category, imageUrl, stock = 10 }) => {
          try {
            const supabase = createClient()

            const slug = name
              .toLowerCase()
              .replace(/[^a-z0-9]+/g, "-")
              .replace(/(^-|-$)/g, "")

            const { data, error } = await supabase
              .from("products")
              .insert({
                name,
                slug: `${slug}-${Date.now()}`,
                description,
                price,
                category,
                image_url: imageUrl || "/placeholder.svg?height=300&width=300&query=" + encodeURIComponent(name),
                stock_quantity: stock,
                is_featured: false,
                created_at: new Date().toISOString(),
              })
              .select()
              .single()

            if (error) throw error

            return {
              success: true,
              message: `Product "${name}" created successfully!`,
              product: data,
            }
          } catch (error: any) {
            return {
              success: false,
              message: `Failed to create product: ${error.message}`,
            }
          }
        },
      }),
    },
    maxSteps: 5,
  })

  return result.toUIMessageStreamResponse()
}
