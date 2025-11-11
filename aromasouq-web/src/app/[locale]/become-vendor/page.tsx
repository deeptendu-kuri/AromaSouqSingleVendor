"use client"

import { useState } from "react"
import { useRouter } from "@/i18n/navigation"
import { useTranslations } from "next-intl"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form"
import { Progress } from "@/components/ui/progress"
import { vendorRegisterSchema, type VendorRegisterInput } from "@/lib/validations"
import { apiClient } from "@/lib/api-client"
import toast from "react-hot-toast"
import { Store, User, Building2, FileText, CheckCircle } from "lucide-react"
import Link from "next/link"

export default function BecomeVendorPage() {
  const router = useRouter()
  const t = useTranslations("becomeVendorPage")
  const [isLoading, setIsLoading] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)

  const form = useForm<VendorRegisterInput>({
    resolver: zodResolver(vendorRegisterSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
      businessName: "",
      businessPhone: "",
      businessAddress: "",
      tradeLicenseNumber: "",
    },
  })

  const steps = [
    { title: t("step1Title"), icon: User },
    { title: t("step2Title"), icon: Building2 },
    { title: t("step3Title"), icon: FileText },
  ]

  const onSubmit = async (data: VendorRegisterInput) => {
    setIsLoading(true)
    try {
      // Step 1: Register user with role VENDOR
      const registerResponse = await apiClient.post<{ user: any }>('/auth/register', {
        email: data.email,
        password: data.password,
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
        role: 'VENDOR',
      })

      toast.success(t("accountCreated"))

      // Step 2: Create vendor profile
      await apiClient.post('/vendor/profile', {
        businessName: data.businessName,
        businessEmail: data.email,
        businessPhone: data.businessPhone,
        description: data.businessAddress,
        tradeLicense: data.tradeLicenseNumber,
      })

      toast.success(t("vendorProfileCreated"))

      // Redirect to vendor dashboard
      router.push('/vendor?pending=true')
    } catch (error: any) {
      console.error('Registration error:', error)
      toast.error(error?.response?.data?.message || t("registrationFailed"))
    } finally {
      setIsLoading(false)
    }
  }

  const nextStep = async () => {
    const fields = getFieldsForStep(currentStep)
    const isValid = await form.trigger(fields)

    if (isValid) {
      setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1))
    }
  }

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0))
  }

  const getFieldsForStep = (step: number): Array<keyof VendorRegisterInput> => {
    switch (step) {
      case 0:
        return ['firstName', 'lastName', 'email', 'phone', 'password', 'confirmPassword']
      case 1:
        return ['businessName', 'businessPhone', 'businessAddress']
      case 2:
        return ['tradeLicenseNumber']
      default:
        return []
    }
  }

  const progress = ((currentStep + 1) / steps.length) * 100

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <Store className="h-16 w-16 mx-auto text-oud-gold mb-4" />
          <h1 className="text-4xl font-bold mb-2">{t("title")}</h1>
          <p className="text-muted-foreground">
            {t("subtitle")}
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <Progress value={progress} className="h-2" />
          <div className="flex justify-between mt-2">
            {steps.map((step, index) => {
              const Icon = step.icon
              return (
                <div
                  key={step.title}
                  className={`flex items-center gap-2 ${
                    index <= currentStep ? 'text-oud-gold' : 'text-muted-foreground'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span className="text-sm font-medium hidden sm:inline">{step.title}</span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Form Card */}
        <Card>
          <CardHeader>
            <CardTitle>Step {currentStep + 1}: {steps[currentStep].title}</CardTitle>
            <CardDescription>
              {currentStep === 0 && t("step1Description")}
              {currentStep === 1 && t("step2Description")}
              {currentStep === 2 && t("step3Description")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Step 1: Personal Info */}
                {currentStep === 0 && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="firstName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t("firstName")} *</FormLabel>
                            <FormControl>
                              <Input placeholder="John" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="lastName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t("lastName")} *</FormLabel>
                            <FormControl>
                              <Input placeholder="Doe" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("email")} *</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="you@example.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("phone")} *</FormLabel>
                          <FormControl>
                            <Input type="tel" placeholder="+971 50 123 4567" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("password")} *</FormLabel>
                          <FormControl>
                            <Input type="password" placeholder={t("passwordPlaceholder")} {...field} />
                          </FormControl>
                          <FormDescription>{t("passwordHint")}</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("confirmPassword")} *</FormLabel>
                          <FormControl>
                            <Input type="password" placeholder={t("passwordPlaceholder")} {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                )}

                {/* Step 2: Business Info */}
                {currentStep === 1 && (
                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="businessName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("businessName")} *</FormLabel>
                          <FormControl>
                            <Input placeholder={t("businessNamePlaceholder")} {...field} />
                          </FormControl>
                          <FormDescription>
                            {t("businessNameHint")}
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="businessPhone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("businessPhone")} *</FormLabel>
                          <FormControl>
                            <Input type="tel" placeholder="+971 4 123 4567" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="businessAddress"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("businessAddress")} *</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder={t("businessAddressPlaceholder")}
                              rows={3}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                )}

                {/* Step 3: Documents */}
                {currentStep === 2 && (
                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="tradeLicenseNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("tradeLicenseNumber")}</FormLabel>
                          <FormControl>
                            <Input placeholder={t("tradeLicensePlaceholder")} {...field} />
                          </FormControl>
                          <FormDescription>
                            {t("tradeLicenseHint")}
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <div className="flex gap-3">
                        <CheckCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-blue-800 mb-2">
                            {t("whatHappensNext")}
                          </p>
                          <ul className="text-sm text-blue-700 space-y-1 list-disc list-inside">
                            <li>{t("step1")}</li>
                            <li>{t("step2")}</li>
                            <li>{t("step3")}</li>
                            <li>{t("step4")}</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex justify-between pt-4 border-t">
                  {currentStep > 0 ? (
                    <Button type="button" variant="outline" onClick={prevStep}>
                      {t("previous")}
                    </Button>
                  ) : (
                    <Link href="/login" className="text-sm text-muted-foreground hover:text-foreground self-center">
                      {t("alreadyHaveAccount")} {t("login")}
                    </Link>
                  )}

                  {currentStep < steps.length - 1 ? (
                    <Button type="button" onClick={nextStep} className="ml-auto">
                      {t("next")}
                    </Button>
                  ) : (
                    <Button
                      type="submit"
                      variant="primary"
                      disabled={isLoading}
                      className="ml-auto"
                    >
                      {isLoading ? t("creating") : t("submit")}
                    </Button>
                  )}
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>

        {/* Benefits Section */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">{t("reachMoreCustomers")}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                {t("reachMoreCustomersDesc")}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">{t("easyManagement")}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                {t("easyManagementDesc")}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">{t("securePayments")}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                {t("securePaymentsDesc")}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
