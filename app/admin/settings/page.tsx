"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Save, Palette, Layout, Type, ImageIcon, Wrench, Loader2, CheckCircle, AlertCircle } from "lucide-react"

const colorPresets = [
  { name: "Emerald (Default)", primary: "#10b981", secondary: "#059669", accent: "#f59e0b" },
  { name: "Blue Professional", primary: "#3b82f6", secondary: "#2563eb", accent: "#f97316" },
  { name: "Purple Modern", primary: "#8b5cf6", secondary: "#7c3aed", accent: "#ec4899" },
  { name: "Red Bold", primary: "#ef4444", secondary: "#dc2626", accent: "#facc15" },
  { name: "Teal Fresh", primary: "#14b8a6", secondary: "#0d9488", accent: "#f43f5e" },
]

export default function AdminSettingsPage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const router = useRouter()

  const [migrationStatus, setMigrationStatus] = useState<{
    checking: boolean
    migrating: boolean
    base64Count: number
    byTable: Record<string, number>
    result: { success: boolean; message: string; migratedCount?: number; errorCount?: number } | null
  }>({
    checking: false,
    migrating: false,
    base64Count: 0,
    byTable: {},
    result: null,
  })

  const [heroSettings, setHeroSettings] = useState({
    headline: "",
    subtext: "",
    cta_text: "",
    image_url: "",
    layout: "centered",
    background_type: "gradient",
    text_color: "white",
  })

  const [themeSettings, setThemeSettings] = useState({
    primary_color: "#10b981",
    secondary_color: "#059669",
    accent_color: "#f59e0b",
    background_color: "#ffffff",
    text_color: "#1f2937",
    font_family: "Inter",
    border_radius: "medium",
  })

  const [layoutSettings, setLayoutSettings] = useState({
    header_style: "modern",
    footer_style: "detailed",
    product_grid: "3-column",
    spacing: "comfortable",
  })

  const [companyInfo, setCompanyInfo] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
  })

  useEffect(() => {
    const token = localStorage.getItem("adminToken")
    if (!token) {
      router.push("/admin/login")
      return
    }

    fetchSettings()
    checkMigrationStatus()
  }, [router])

  const fetchSettings = async () => {
    try {
      const response = await fetch("/api/admin/settings")
      const data = await response.json()

      if (data.hero_section) {
        setHeroSettings({ ...heroSettings, ...data.hero_section })
      }
      if (data.theme_settings) {
        setThemeSettings({ ...themeSettings, ...data.theme_settings })
      }
      if (data.layout_settings) {
        setLayoutSettings({ ...layoutSettings, ...data.layout_settings })
      }
      if (data.company_info) {
        setCompanyInfo(data.company_info)
      }
    } catch (error) {
      console.error("Error fetching settings:", error)
    } finally {
      setLoading(false)
    }
  }

  const checkMigrationStatus = async () => {
    setMigrationStatus((prev) => ({ ...prev, checking: true }))
    try {
      const response = await fetch("/api/admin/migrate-images")
      const data = await response.json()
      setMigrationStatus((prev) => ({
        ...prev,
        checking: false,
        base64Count: data.totalBase64Images || 0,
        byTable: data.byTable || {},
      }))
    } catch (error) {
      console.error("Error checking migration status:", error)
      setMigrationStatus((prev) => ({ ...prev, checking: false }))
    }
  }

  const runMigration = async () => {
    setMigrationStatus((prev) => ({ ...prev, migrating: true, result: null }))
    try {
      const response = await fetch("/api/admin/migrate-images", { method: "POST" })
      const data = await response.json()
      setMigrationStatus((prev) => ({
        ...prev,
        migrating: false,
        result: data,
      }))
      // Refresh the count after migration
      checkMigrationStatus()
    } catch (error) {
      console.error("Error running migration:", error)
      setMigrationStatus((prev) => ({
        ...prev,
        migrating: false,
        result: { success: false, message: "Migration failed: " + String(error) },
      }))
    }
  }

  const handleSaveSettings = async (key: string, value: Record<string, unknown>) => {
    setSaving(true)
    try {
      const response = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key, value }),
      })
      if (response.ok) {
        alert("Settings saved successfully!")
      } else {
        alert("Failed to save settings")
      }
    } catch (error) {
      console.error("Error saving settings:", error)
      alert("Error saving settings")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Site Settings</h1>

      <Tabs defaultValue="theme" className="space-y-8">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="theme" className="flex items-center gap-2">
            <Palette className="h-4 w-4" />
            Theme
          </TabsTrigger>
          <TabsTrigger value="hero" className="flex items-center gap-2">
            <ImageIcon className="h-4 w-4" />
            Hero Section
          </TabsTrigger>
          <TabsTrigger value="layout" className="flex items-center gap-2">
            <Layout className="h-4 w-4" />
            Layout
          </TabsTrigger>
          <TabsTrigger value="company" className="flex items-center gap-2">
            <Type className="h-4 w-4" />
            Company
          </TabsTrigger>
          <TabsTrigger value="maintenance" className="flex items-center gap-2">
            <Wrench className="h-4 w-4" />
            Maintenance
          </TabsTrigger>
        </TabsList>

        {/* Theme Settings */}
        <TabsContent value="theme">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Color Scheme</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-3">
                  {colorPresets.map((preset) => (
                    <Button
                      key={preset.name}
                      variant="outline"
                      className="justify-start h-auto p-3 bg-transparent"
                      onClick={() => {
                        setThemeSettings({
                          ...themeSettings,
                          primary_color: preset.primary,
                          secondary_color: preset.secondary,
                          accent_color: preset.accent,
                        })
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex gap-1">
                          <div className="w-4 h-4 rounded" style={{ backgroundColor: preset.primary }} />
                          <div className="w-4 h-4 rounded" style={{ backgroundColor: preset.secondary }} />
                          <div className="w-4 h-4 rounded" style={{ backgroundColor: preset.accent }} />
                        </div>
                        <span>{preset.name}</span>
                      </div>
                    </Button>
                  ))}
                </div>

                <div className="space-y-3">
                  <div>
                    <Label>Primary Color</Label>
                    <div className="flex gap-2">
                      <Input
                        type="color"
                        value={themeSettings.primary_color}
                        onChange={(e) => setThemeSettings({ ...themeSettings, primary_color: e.target.value })}
                        className="w-16 h-10"
                      />
                      <Input
                        value={themeSettings.primary_color}
                        onChange={(e) => setThemeSettings({ ...themeSettings, primary_color: e.target.value })}
                        placeholder="#10b981"
                      />
                    </div>
                  </div>

                  <div>
                    <Label>Secondary Color</Label>
                    <div className="flex gap-2">
                      <Input
                        type="color"
                        value={themeSettings.secondary_color}
                        onChange={(e) => setThemeSettings({ ...themeSettings, secondary_color: e.target.value })}
                        className="w-16 h-10"
                      />
                      <Input
                        value={themeSettings.secondary_color}
                        onChange={(e) => setThemeSettings({ ...themeSettings, secondary_color: e.target.value })}
                        placeholder="#059669"
                      />
                    </div>
                  </div>

                  <div>
                    <Label>Accent Color</Label>
                    <div className="flex gap-2">
                      <Input
                        type="color"
                        value={themeSettings.accent_color}
                        onChange={(e) => setThemeSettings({ ...themeSettings, accent_color: e.target.value })}
                        className="w-16 h-10"
                      />
                      <Input
                        value={themeSettings.accent_color}
                        onChange={(e) => setThemeSettings({ ...themeSettings, accent_color: e.target.value })}
                        placeholder="#f59e0b"
                      />
                    </div>
                  </div>
                </div>

                <Button
                  onClick={() => handleSaveSettings("theme_settings", themeSettings)}
                  disabled={saving}
                  className="w-full"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save Theme
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Typography & Style</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Font Family</Label>
                  <Select
                    value={themeSettings.font_family}
                    onValueChange={(value) => setThemeSettings({ ...themeSettings, font_family: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Inter">Inter (Modern)</SelectItem>
                      <SelectItem value="Roboto">Roboto (Clean)</SelectItem>
                      <SelectItem value="Open Sans">Open Sans (Friendly)</SelectItem>
                      <SelectItem value="Poppins">Poppins (Rounded)</SelectItem>
                      <SelectItem value="Playfair Display">Playfair Display (Elegant)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Border Radius</Label>
                  <Select
                    value={themeSettings.border_radius}
                    onValueChange={(value) => setThemeSettings({ ...themeSettings, border_radius: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="small">Small (2px)</SelectItem>
                      <SelectItem value="medium">Medium (6px)</SelectItem>
                      <SelectItem value="large">Large (12px)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Background Color</Label>
                  <div className="flex gap-2">
                    <Input
                      type="color"
                      value={themeSettings.background_color}
                      onChange={(e) => setThemeSettings({ ...themeSettings, background_color: e.target.value })}
                      className="w-16 h-10"
                    />
                    <Input
                      value={themeSettings.background_color}
                      onChange={(e) => setThemeSettings({ ...themeSettings, background_color: e.target.value })}
                      placeholder="#ffffff"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Hero Section Settings */}
        <TabsContent value="hero">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Hero Content</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="headline">Headline</Label>
                  <Input
                    id="headline"
                    value={heroSettings.headline}
                    onChange={(e) => setHeroSettings({ ...heroSettings, headline: e.target.value })}
                    placeholder="Main headline for the hero section"
                  />
                </div>

                <div>
                  <Label htmlFor="subtext">Subtext</Label>
                  <Textarea
                    id="subtext"
                    value={heroSettings.subtext}
                    onChange={(e) => setHeroSettings({ ...heroSettings, subtext: e.target.value })}
                    placeholder="Supporting text below the headline"
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="cta_text">Call-to-Action Button Text</Label>
                  <Input
                    id="cta_text"
                    value={heroSettings.cta_text}
                    onChange={(e) => setHeroSettings({ ...heroSettings, cta_text: e.target.value })}
                    placeholder="Text for the main button"
                  />
                </div>

                <div>
                  <Label htmlFor="image_url">Hero Image URL</Label>
                  <Input
                    id="image_url"
                    value={heroSettings.image_url}
                    onChange={(e) => setHeroSettings({ ...heroSettings, image_url: e.target.value })}
                    placeholder="URL for the hero image"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Hero Design</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Layout Style</Label>
                  <Select
                    value={heroSettings.layout}
                    onValueChange={(value) => setHeroSettings({ ...heroSettings, layout: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="centered">Centered</SelectItem>
                      <SelectItem value="left-aligned">Left Aligned</SelectItem>
                      <SelectItem value="right-aligned">Right Aligned</SelectItem>
                      <SelectItem value="split">Split Layout</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Background Type</Label>
                  <Select
                    value={heroSettings.background_type}
                    onValueChange={(value) => setHeroSettings({ ...heroSettings, background_type: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="gradient">Gradient</SelectItem>
                      <SelectItem value="image">Image</SelectItem>
                      <SelectItem value="solid">Solid Color</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Text Color</Label>
                  <Select
                    value={heroSettings.text_color}
                    onValueChange={(value) => setHeroSettings({ ...heroSettings, text_color: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="white">White</SelectItem>
                      <SelectItem value="black">Black</SelectItem>
                      <SelectItem value="primary">Primary Color</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button
                  onClick={() => handleSaveSettings("hero_section", heroSettings)}
                  disabled={saving}
                  className="w-full"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save Hero Section
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Hero Preview */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Live Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <div
                className={`p-8 rounded-lg ${
                  heroSettings.background_type === "gradient"
                    ? "bg-gradient-to-r from-green-500 to-emerald-600"
                    : heroSettings.background_type === "solid"
                      ? "bg-gray-800"
                      : "bg-cover bg-center"
                } ${heroSettings.layout === "centered" ? "text-center" : heroSettings.layout === "right-aligned" ? "text-right" : "text-left"}`}
                style={
                  heroSettings.background_type === "image" ? { backgroundImage: `url(${heroSettings.image_url})` } : {}
                }
              >
                <h1
                  className={`text-3xl font-bold mb-4 ${heroSettings.text_color === "white" ? "text-white" : heroSettings.text_color === "black" ? "text-black" : ""}`}
                >
                  {heroSettings.headline || "Your Headline Here"}
                </h1>
                <p
                  className={`text-lg mb-6 opacity-90 ${heroSettings.text_color === "white" ? "text-white" : heroSettings.text_color === "black" ? "text-black" : ""}`}
                >
                  {heroSettings.subtext || "Your subtext here"}
                </p>
                <Button
                  className="bg-white text-gray-800 hover:bg-gray-100"
                  style={{ backgroundColor: themeSettings.primary_color, color: "white" }}
                >
                  {heroSettings.cta_text || "Your CTA"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Layout Settings */}
        <TabsContent value="layout">
          <Card>
            <CardHeader>
              <CardTitle>Site Layout Options</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label>Header Style</Label>
                  <Select
                    value={layoutSettings.header_style}
                    onValueChange={(value) => setLayoutSettings({ ...layoutSettings, header_style: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="modern">Modern (Clean & Minimal)</SelectItem>
                      <SelectItem value="classic">Classic (Traditional)</SelectItem>
                      <SelectItem value="minimal">Minimal (Ultra Clean)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Footer Style</Label>
                  <Select
                    value={layoutSettings.footer_style}
                    onValueChange={(value) => setLayoutSettings({ ...layoutSettings, footer_style: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="detailed">Detailed (Full Info)</SelectItem>
                      <SelectItem value="simple">Simple (Basic Info)</SelectItem>
                      <SelectItem value="minimal">Minimal (Copyright Only)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Product Grid</Label>
                  <Select
                    value={layoutSettings.product_grid}
                    onValueChange={(value) => setLayoutSettings({ ...layoutSettings, product_grid: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2-column">2 Columns</SelectItem>
                      <SelectItem value="3-column">3 Columns</SelectItem>
                      <SelectItem value="4-column">4 Columns</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Spacing</Label>
                  <Select
                    value={layoutSettings.spacing}
                    onValueChange={(value) => setLayoutSettings({ ...layoutSettings, spacing: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="compact">Compact</SelectItem>
                      <SelectItem value="comfortable">Comfortable</SelectItem>
                      <SelectItem value="spacious">Spacious</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button
                onClick={() => handleSaveSettings("layout_settings", layoutSettings)}
                disabled={saving}
                className="w-full"
              >
                <Save className="h-4 w-4 mr-2" />
                Save Layout Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Company Information */}
        <TabsContent value="company">
          <Card>
            <CardHeader>
              <CardTitle>Company Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="company_name">Company Name</Label>
                  <Input
                    id="company_name"
                    value={companyInfo.name}
                    onChange={(e) => setCompanyInfo({ ...companyInfo, name: e.target.value })}
                    placeholder="Knet Appliances"
                  />
                </div>

                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={companyInfo.phone}
                    onChange={(e) => setCompanyInfo({ ...companyInfo, phone: e.target.value })}
                    placeholder="+254 746735710"
                  />
                </div>

                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={companyInfo.email}
                    onChange={(e) => setCompanyInfo({ ...companyInfo, email: e.target.value })}
                    placeholder="info@knetappliances.com"
                  />
                </div>

                <div>
                  <Label htmlFor="address">Address</Label>
                  <Textarea
                    id="address"
                    value={companyInfo.address}
                    onChange={(e) => setCompanyInfo({ ...companyInfo, address: e.target.value })}
                    placeholder="Knet Appliances Center, Kamukunji Nairobi frame plaza"
                    rows={3}
                  />
                </div>
              </div>

              <Button
                onClick={() => handleSaveSettings("company_info", companyInfo)}
                disabled={saving}
                className="w-full mt-4"
              >
                <Save className="h-4 w-4 mr-2" />
                Save Company Info
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="maintenance">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Image Optimization</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  Base64 encoded images stored in the database can significantly slow down your site. This tool will
                  convert all base64 images to fast Vercel Blob URLs.
                </p>

                <div className="bg-muted p-4 rounded-lg">
                  <h3 className="font-semibold mb-2">Current Status</h3>
                  {migrationStatus.checking ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Checking...</span>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <p className="text-lg">
                        <span className="font-bold">{migrationStatus.base64Count}</span> base64 images found
                      </p>
                      {Object.entries(migrationStatus.byTable).map(([table, count]) => (
                        <p key={table} className="text-sm text-muted-foreground">
                          - {table}: {count} images
                        </p>
                      ))}
                      {migrationStatus.base64Count === 0 && (
                        <p className="text-green-600 flex items-center gap-2">
                          <CheckCircle className="h-4 w-4" />
                          All images are optimized!
                        </p>
                      )}
                    </div>
                  )}
                </div>

                {migrationStatus.base64Count > 0 && (
                  <Button onClick={runMigration} disabled={migrationStatus.migrating} className="w-full">
                    {migrationStatus.migrating ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Migrating Images...
                      </>
                    ) : (
                      <>
                        <Wrench className="h-4 w-4 mr-2" />
                        Convert to Fast URLs
                      </>
                    )}
                  </Button>
                )}

                <Button
                  variant="outline"
                  onClick={checkMigrationStatus}
                  disabled={migrationStatus.checking}
                  className="w-full bg-transparent"
                >
                  Refresh Status
                </Button>

                {migrationStatus.result && (
                  <div
                    className={`p-4 rounded-lg ${migrationStatus.result.success ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
                  >
                    <div className="flex items-center gap-2">
                      {migrationStatus.result.success ? (
                        <CheckCircle className="h-5 w-5" />
                      ) : (
                        <AlertCircle className="h-5 w-5" />
                      )}
                      <span className="font-semibold">{migrationStatus.result.message}</span>
                    </div>
                    {migrationStatus.result.migratedCount !== undefined && (
                      <p className="mt-2 text-sm">
                        Successfully migrated: {migrationStatus.result.migratedCount} images
                        {migrationStatus.result.errorCount ? `, Errors: ${migrationStatus.result.errorCount}` : ""}
                      </p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>How It Works</CardTitle>
              </CardHeader>
              <CardContent>
                <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
                  <li>Click "Convert to Fast URLs" to start the migration</li>
                  <li>Each base64 image is uploaded to Vercel Blob storage</li>
                  <li>The database is updated with the new fast URL</li>
                  <li>Your site will load significantly faster</li>
                </ol>
                <p className="mt-4 text-sm text-muted-foreground">
                  Note: New image uploads will automatically use Vercel Blob storage.
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
