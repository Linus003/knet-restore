"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Plus, Edit, Trash2, Package } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { ProductGroupForm } from "@/components/admin/product-group-form"
import { ProductVariantManager } from "@/components/admin/product-variant-manager"
import { formatKESSimple } from "@/lib/currency"
import type { ProductGroup, Category, Product } from "@/types"

export default function AdminProductGroupsPage() {
  const [productGroups, setProductGroups] = useState<ProductGroup[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedGroup, setSelectedGroup] = useState<ProductGroup | null>(null)
  const [editingGroup, setEditingGroup] = useState<ProductGroup | null>(null)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem("adminToken")
    if (!token) {
      router.push("/admin/login")
      return
    }

    fetchData()
  }, [router])

  const fetchData = async () => {
    try {
      const [groupsRes, categoriesRes, productsRes] = await Promise.all([
        fetch("/api/admin/product-groups"),
        fetch("/api/admin/categories"),
        fetch("/api/admin/products"),
      ])

      const groupsData = await groupsRes.json()
      const categoriesData = await categoriesRes.json()
      const productsData = await productsRes.json()

      setProductGroups(groupsData.productGroups || [])
      setCategories(categoriesData.categories || [])
      setProducts(productsData.products || [])
    } catch (error) {
      console.error("Error fetching data:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateGroup = async (groupData: any) => {
    try {
      const response = await fetch("/api/admin/product-groups", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(groupData),
      })

      if (response.ok) {
        fetchData()
        setShowCreateForm(false)
        alert("Product group created successfully!")
      }
    } catch (error) {
      console.error("Error creating product group:", error)
      alert("Error creating product group")
    }
  }

  const handleUpdateGroup = async (groupData: any) => {
    if (!editingGroup) return

    try {
      const response = await fetch(`/api/admin/product-groups/${editingGroup.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(groupData),
      })

      if (response.ok) {
        fetchData()
        setEditingGroup(null)
        alert("Product group updated successfully!")
      }
    } catch (error) {
      console.error("Error updating product group:", error)
      alert("Error updating product group")
    }
  }

  const handleDeleteGroup = async (groupId: string) => {
    if (confirm("Are you sure? This will ungroup all products in this group.")) {
      try {
        const response = await fetch(`/api/admin/product-groups/${groupId}`, {
          method: "DELETE",
        })

        if (response.ok) {
          fetchData()
          setSelectedGroup(null)
          alert("Product group deleted successfully!")
        }
      } catch (error) {
        console.error("Error deleting product group:", error)
        alert("Error deleting product group")
      }
    }
  }

  const handleAddVariant = async (variantData: any) => {
    if (!selectedGroup) return

    try {
      const productData = {
        name: `${selectedGroup.name} - ${variantData.variant_value}`,
        description: selectedGroup.description,
        price: selectedGroup.base_price + variantData.price_adjustment,
        category_id: selectedGroup.category_id,
        stock_quantity: variantData.stock_quantity,
        featured: false,
        image_url: selectedGroup.main_image_url,
        group_id: selectedGroup.id,
        variant_type: variantData.variant_type,
        variant_value: variantData.variant_value,
        sort_order: 0,
      }

      const response = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(productData),
      })

      if (response.ok) {
        fetchData()
        alert("Variant added successfully!")
      }
    } catch (error) {
      console.error("Error adding variant:", error)
      alert("Error adding variant")
    }
  }

  const handleEditVariant = (product: Product) => {
    // Navigate to product edit page or open edit modal
    router.push(`/admin/products?edit=${product.id}`)
  }

  const handleDeleteVariant = async (productId: string) => {
    if (confirm("Are you sure you want to delete this variant?")) {
      try {
        const response = await fetch(`/api/admin/products/${productId}`, {
          method: "DELETE",
        })

        if (response.ok) {
          fetchData()
          alert("Variant deleted successfully!")
        }
      } catch (error) {
        console.error("Error deleting variant:", error)
        alert("Error deleting variant")
      }
    }
  }

  const getGroupProducts = (groupId: string) => {
    return products.filter((product) => product.group_id === groupId)
  }

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/admin/dashboard">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
            <h1 className="text-2xl font-bold">Product Groups</h1>
          </div>
          <Button onClick={() => setShowCreateForm(true)} className="bg-green-600 hover:bg-green-700">
            <Plus className="h-4 w-4 mr-2" />
            Create Group
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <Tabs value={selectedGroup ? "variants" : "groups"} className="space-y-6">
          <TabsList>
            <TabsTrigger value="groups">All Groups ({productGroups.length})</TabsTrigger>
            {selectedGroup && <TabsTrigger value="variants">Manage Variants</TabsTrigger>}
          </TabsList>

          <TabsContent value="groups">
            {showCreateForm && (
              <ProductGroupForm
                categories={categories}
                onSubmit={handleCreateGroup}
                onCancel={() => setShowCreateForm(false)}
              />
            )}

            {editingGroup && (
              <ProductGroupForm
                productGroup={editingGroup}
                categories={categories}
                onSubmit={handleUpdateGroup}
                onCancel={() => setEditingGroup(null)}
              />
            )}

            <Card>
              <CardHeader>
                <CardTitle>Product Groups</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {productGroups.map((group) => {
                    const groupProducts = getGroupProducts(group.id)
                    return (
                      <Card key={group.id} className="hover:shadow-lg transition-shadow">
                        <CardContent className="p-4">
                          <div className="relative w-full h-48 mb-4">
                            <Image
                              src={group.main_image_url || "/placeholder.svg"}
                              alt={group.name}
                              fill
                              className="object-cover rounded"
                            />
                            {group.featured && <Badge className="absolute top-2 left-2">Featured</Badge>}
                          </div>

                          <h3 className="font-semibold text-lg mb-2">{group.name}</h3>
                          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{group.description}</p>

                          <div className="flex items-center justify-between mb-3">
                            <span className="text-lg font-bold text-green-600">
                              From {formatKESSimple(group.base_price)}
                            </span>
                            <Badge variant="outline">
                              <Package className="h-3 w-3 mr-1" />
                              {groupProducts.length} variants
                            </Badge>
                          </div>

                          <div className="flex space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setSelectedGroup(group)}
                              className="flex-1"
                            >
                              Manage Variants
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => setEditingGroup(group)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeleteGroup(group.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>

                {productGroups.length === 0 && (
                  <div className="text-center py-12">
                    <Package className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No product groups yet</h3>
                    <p className="text-muted-foreground mb-4">
                      Create your first product group to organize similar items
                    </p>
                    <Button onClick={() => setShowCreateForm(true)} className="bg-green-600 hover:bg-green-700">
                      <Plus className="h-4 w-4 mr-2" />
                      Create First Group
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {selectedGroup && (
            <TabsContent value="variants">
              <div className="space-y-6">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="text-xl font-semibold">{selectedGroup.name}</h2>
                        <p className="text-muted-foreground">{selectedGroup.description}</p>
                      </div>
                      <Button variant="outline" onClick={() => setSelectedGroup(null)}>
                        Back to Groups
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <ProductVariantManager
                  productGroup={selectedGroup}
                  products={getGroupProducts(selectedGroup.id)}
                  onAddVariant={handleAddVariant}
                  onEditVariant={handleEditVariant}
                  onDeleteVariant={handleDeleteVariant}
                />
              </div>
            </TabsContent>
          )}
        </Tabs>
      </div>
    </div>
  )
}
