"use client"

import { useState, useRef, useEffect } from "react"
import { useChat } from '@ai-sdk/react';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Bot, Send, Sparkles, Copy, Check, Loader2, X, Minimize2, Maximize2 } from "lucide-react"

interface ProductAssistantProps {
  onDescriptionGenerated?: (description: string) => void
  onPriceEstimated?: (price: number) => void
  productContext?: string
}

export function ProductAssistant({ onDescriptionGenerated, onPriceEstimated, productContext }: ProductAssistantProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

  const { messages, input, handleInputChange, handleSubmit, isLoading, setInput } = useChat({
    api: "/api/ai/product-assistant",
    body: { productContext },
    initialMessages: [
      {
        id: "welcome",
        role: "assistant",
        content: `Hello! I'm your AI Product Assistant. I can help you with:

**Generate Descriptions** - Just tell me a product name and I'll create a compelling description.

**Estimate Prices** - Ask me about pricing for any appliance in the Kenya market.

**Suggest Categories** - I'll help categorize your products correctly.

**Create Products** - I can add products directly to your store.

Try asking: "Generate a description for Silver Crest Blender" or "What's the price range for air fryers in Kenya?"`,
      },
    ],
  })

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  const copyToClipboard = async (text: string, id: string) => {
    await navigator.clipboard.writeText(text)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const quickActions = [
    { label: "Generate Description", prompt: "Generate a product description for " },
    { label: "Estimate Price", prompt: "What is the price range for " },
    { label: "Suggest Category", prompt: "What category should I use for " },
    { label: "Create Product", prompt: "Create a product called " },
  ]

  const extractToolResults = (content: string) => {
    // Check if content contains tool results
    if (content.includes("description") || content.includes("price") || content.includes("category")) {
      return true
    }
    return false
  }

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg z-50 bg-green-600 hover:bg-green-700"
      >
        <Bot className="h-6 w-6" />
      </Button>
    )
  }

  return (
    <Card
      className={`fixed bottom-6 right-6 z-50 shadow-2xl transition-all duration-300 ${isMinimized ? "w-80 h-14" : "w-96 h-[500px]"}`}
    >
      <CardHeader className="p-3 border-b flex flex-row items-center justify-between bg-green-600 text-white rounded-t-lg">
        <div className="flex items-center gap-2">
          <Bot className="h-5 w-5" />
          <CardTitle className="text-sm font-medium">AI Product Assistant</CardTitle>
          <Badge variant="secondary" className="text-xs bg-green-500 text-white">
            Free
          </Badge>
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 text-white hover:bg-green-700"
            onClick={() => setIsMinimized(!isMinimized)}
          >
            {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 text-white hover:bg-green-700"
            onClick={() => setIsOpen(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>

      {!isMinimized && (
        <CardContent className="p-0 flex flex-col h-[calc(500px-56px)]">
          {/* Quick Actions */}
          <div className="p-2 border-b flex gap-1 flex-wrap">
            {quickActions.map((action) => (
              <Button
                key={action.label}
                variant="outline"
                size="sm"
                className="text-xs h-7 bg-transparent"
                onClick={() => setInput(action.prompt)}
              >
                <Sparkles className="h-3 w-3 mr-1" />
                {action.label}
              </Button>
            ))}
          </div>

          {/* Messages */}
          <ScrollArea className="flex-1 p-3" ref={scrollRef}>
            <div className="space-y-4">
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[85%] rounded-lg p-3 text-sm ${
                      message.role === "user" ? "bg-green-600 text-white" : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    <div className="whitespace-pre-wrap">{message.content}</div>

                    {/* Tool Results */}
                    {message.toolInvocations?.map((tool: any, index: number) => (
                      <div key={index} className="mt-2 p-2 bg-white rounded border">
                        {tool.state === "result" && (
                          <div className="text-xs">
                            {tool.toolName === "generateDescription" && tool.result && (
                              <div>
                                <p className="font-semibold text-green-700 mb-1">Generated Description:</p>
                                <p className="text-gray-700">{tool.result.description}</p>
                                <div className="flex gap-2 mt-2">
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="h-6 text-xs bg-transparent"
                                    onClick={() => {
                                      copyToClipboard(tool.result.description, `desc-${index}`)
                                      onDescriptionGenerated?.(tool.result.description)
                                    }}
                                  >
                                    {copiedId === `desc-${index}` ? (
                                      <Check className="h-3 w-3 mr-1" />
                                    ) : (
                                      <Copy className="h-3 w-3 mr-1" />
                                    )}
                                    Copy
                                  </Button>
                                </div>
                              </div>
                            )}

                            {tool.toolName === "estimatePrice" && tool.result && (
                              <div>
                                <p className="font-semibold text-green-700 mb-1">Price Estimate:</p>
                                <div className="space-y-1">
                                  <p>
                                    Min:{" "}
                                    <span className="font-medium">KES {tool.result.minPrice?.toLocaleString()}</span>
                                  </p>
                                  <p>
                                    Max:{" "}
                                    <span className="font-medium">KES {tool.result.maxPrice?.toLocaleString()}</span>
                                  </p>
                                  <p className="text-green-600 font-semibold">
                                    Suggested: KES {tool.result.suggestedPrice?.toLocaleString()}
                                  </p>
                                  <p className="text-gray-500 text-xs mt-1">
                                    Confidence: {tool.result.confidence} | {tool.result.note}
                                  </p>
                                </div>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="h-6 text-xs mt-2 bg-transparent"
                                  onClick={() => onPriceEstimated?.(tool.result.suggestedPrice)}
                                >
                                  Use This Price
                                </Button>
                              </div>
                            )}

                            {tool.toolName === "suggestCategory" && tool.result && (
                              <div>
                                <p className="font-semibold text-green-700 mb-1">Suggested Category:</p>
                                <p>
                                  Category: <span className="font-medium">{tool.result.category}</span>
                                </p>
                                <p>
                                  Subcategory: <span className="font-medium">{tool.result.subcategory}</span>
                                </p>
                                {tool.result.note && <p className="text-gray-500 text-xs mt-1">{tool.result.note}</p>}
                              </div>
                            )}

                            {tool.toolName === "createProduct" && tool.result && (
                              <div>
                                <p
                                  className={`font-semibold mb-1 ${tool.result.success ? "text-green-700" : "text-red-600"}`}
                                >
                                  {tool.result.success ? "Product Created!" : "Error"}
                                </p>
                                <p>{tool.result.message}</p>
                              </div>
                            )}
                          </div>
                        )}
                        {tool.state === "call" && (
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <Loader2 className="h-3 w-3 animate-spin" />
                            Processing {tool.toolName}...
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 rounded-lg p-3 flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span className="text-sm text-gray-600">Thinking...</span>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Input */}
          <form onSubmit={handleSubmit} className="p-3 border-t flex gap-2">
            <Input
              value={input}
              onChange={handleInputChange}
              placeholder="Ask about products, prices, descriptions..."
              className="flex-1 text-sm"
              disabled={isLoading}
            />
            <Button
              type="submit"
              size="icon"
              disabled={isLoading || !input.trim()}
              className="bg-green-600 hover:bg-green-700"
            >
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </CardContent>
      )}
    </Card>
  )
}
