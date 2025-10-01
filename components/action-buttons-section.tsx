"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Download, Mail, Calendar, Phone, Send } from "lucide-react"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"

export function ActionButtonsSection() {
  const { toast } = useToast()
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false)
  const [isContactModalOpen, setIsContactModalOpen] = useState(false)
  const [isBookCallModalOpen, setIsBookCallModalOpen] = useState(false)
  
  const [downloadFormData, setDownloadFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    company: ""
  })
  
  const [contactFormData, setContactFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    company: "",
    message: ""
  })
  
  const [bookCallFormData, setBookCallFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    company: "",
    preferredDate: "",
    preferredTime: ""
  })

  // Touched state for inline validation messages
  const [downloadTouched, setDownloadTouched] = useState<Record<string, boolean>>({})
  const [contactTouched, setContactTouched] = useState<Record<string, boolean>>({})
  const [bookCallTouched, setBookCallTouched] = useState<Record<string, boolean>>({})

  // Validation functions
  const isDownloadFormValid = () => {
    return downloadFormData.firstName.trim() !== "" &&
           downloadFormData.lastName.trim() !== "" &&
           downloadFormData.email.trim() !== "" &&
           downloadFormData.phone.trim() !== "" &&
           downloadFormData.company.trim() !== "" &&
           /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(downloadFormData.email)
  }

  const isContactFormValid = () => {
    return contactFormData.firstName.trim() !== "" &&
           contactFormData.lastName.trim() !== "" &&
           contactFormData.email.trim() !== "" &&
           contactFormData.phone.trim() !== "" &&
           contactFormData.company.trim() !== "" &&
           contactFormData.message.trim() !== "" &&
           /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactFormData.email)
  }

  const isBookCallFormValid = () => {
    return bookCallFormData.firstName.trim() !== "" &&
           bookCallFormData.lastName.trim() !== "" &&
           bookCallFormData.email.trim() !== "" &&
           bookCallFormData.phone.trim() !== "" &&
           bookCallFormData.company.trim() !== "" &&
           bookCallFormData.preferredDate.trim() !== "" &&
           bookCallFormData.preferredTime.trim() !== "" &&
           /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(bookCallFormData.email)
  }

  const handleDownload = () => {
    if (!isDownloadFormValid()) return
    
    // Create a temporary link element to trigger download
    const link = document.createElement('a')
    link.href = '/guide.pdf'
    link.download = 'Z3-Exhibition-Guide.pdf'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    setIsDownloadModalOpen(false)
    
    toast({
      title: "Download Started",
      description: "Your Z3 Exhibition Guide is being downloaded.",
    })
    
    // Reset form
    setDownloadFormData({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      company: ""
    })
  }

  const handleContactSubmit = () => {
    if (!isContactFormValid()) return
    
    setIsContactModalOpen(false)
    toast({
      title: "Message Sent",
      description: "Thank you for contacting us! We'll respond within 24 hours.",
    })
    
    // Reset form
    setContactFormData({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      company: "",
      message: ""
    })
  }

  const handleBookCallSubmit = () => {
    if (!isBookCallFormValid()) return
    
    setIsBookCallModalOpen(false)
    toast({
      title: "Call Scheduled",
      description: "Your strategy call has been scheduled. We'll contact you soon to confirm the details.",
    })
    
    // Reset form
    setBookCallFormData({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      company: "",
      preferredDate: "",
      preferredTime: ""
    })
  }

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
    formType: 'download' | 'contact' | 'bookCall',
  ) => {
    const { name, value } = e.target
    
    if (formType === 'download') {
      setDownloadFormData(prev => ({ ...prev, [name]: value }))
    } else if (formType === 'contact') {
      setContactFormData(prev => ({ ...prev, [name]: value }))
    } else if (formType === 'bookCall') {
      setBookCallFormData(prev => ({ ...prev, [name]: value }))
    }
  }

  return (
    <>
      <section className="bg-muted/40 border-t">
        <div className="mx-auto max-w-7xl px-4 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-semibold text-balance mb-4">
              Maximize Your Exhibition Success
            </h2>
            <p className="text-muted-foreground text-lg">
              Get expert guidance and resources to boost your exhibition ROI
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Free Exhibition Guide Card */}
            <Card className="relative hover:shadow-lg transition-shadow">
              <CardHeader className="text-center">
                <div className="mx-auto w-12 h-12 bg-primary rounded-full flex items-center justify-center mb-4">
                  <Download className="w-6 h-6 text-primary-foreground" />
                </div>
                <CardTitle className="text-xl">Free Exhibition Guide</CardTitle>
                <CardDescription className="text-sm">
                  Download our comprehensive Z3 Exhibition Guide with insider tips, strategies, and industry insights to maximize your exhibition ROI.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  onClick={() => setIsDownloadModalOpen(true)}
                  className="w-full bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90 cursor-pointer"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download Guide
                </Button>
              </CardContent>
            </Card>

            {/* Get In Touch Card */}
            <Card className="relative hover:shadow-lg transition-shadow">
              <CardHeader className="text-center">
                <div className="mx-auto w-12 h-12 bg-primary rounded-full flex items-center justify-center mb-4">
                  <Mail className="w-6 h-6 text-primary-foreground" />
                </div>
                <CardTitle className="text-xl">Get In Touch</CardTitle>
                <CardDescription className="text-sm">
                  Have questions about exhibitions or need personalized advice? Contact our experts for tailored solutions and strategic guidance.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  onClick={() => setIsContactModalOpen(true)}
                  className="w-full bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90 cursor-pointer"
                >
                  <Send className="w-4 h-4 mr-2" />
                  Contact Us
                </Button>
              </CardContent>
            </Card>

            {/* Book Strategy Call Card */}
            <Card className="relative hover:shadow-lg transition-shadow border-green-200 dark:border-green-800">
              <Badge className="absolute -top-2 -right-2 bg-green-500 text-white px-3 py-1 text-xs font-medium">
                POPULAR
              </Badge>
              <CardHeader className="text-center">
                <div className="mx-auto w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mb-4">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-xl">Book Strategy Call</CardTitle>
                <CardDescription className="text-sm">
                  Schedule a free 30-minute strategy session with our Z3 exhibition experts to discuss your goals and create a winning plan.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  onClick={() => setIsBookCallModalOpen(true)}
                  className="w-full bg-green-500 hover:bg-green-600 text-white cursor-pointer"
                >
                  <Phone className="w-4 h-4 mr-2" />
                  Book Free Call
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Download Modal */}
      {isDownloadModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md bg-background">
            <CardHeader className="bg-gradient-to-r from-primary via-blue-600 to-purple-600 text-white rounded-t-lg relative overflow-hidden p-6">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-blue-600/20 to-purple-600/20"></div>
              <div className="relative flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/20 rounded-full backdrop-blur-sm">
                    <Download className="w-5 h-5 text-white" />
                  </div>
                  <CardTitle className="text-white font-bold text-lg">Download Z3 Exhibition Guide</CardTitle>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsDownloadModalOpen(false)}
                  className="text-white hover:bg-white/20 rounded-full w-8 h-8 p-0"
                >
                  ×
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-6 pt-4">
              <p className="text-muted-foreground mb-6">
                Get instant access to our comprehensive exhibition guide with proven strategies and insider tips.
              </p>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">First Name *</label>
                    <input
                      type="text"
                      name="firstName"
                      value={downloadFormData.firstName}
                      onChange={(e) => handleInputChange(e, 'download')}
                      onBlur={(e) => setDownloadTouched((s) => ({ ...s, [e.target.name]: true }))}
                      className="w-full mt-1 px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                      required
                    />
                    {downloadTouched.firstName && !downloadFormData.firstName.trim() && (
                      <p className="mt-1 text-xs text-red-600">This field is required</p>
                    )}
                  </div>
                  <div>
                    <label className="text-sm font-medium">Last Name *</label>
                    <input
                      type="text"
                      name="lastName"
                      value={downloadFormData.lastName}
                      onChange={(e) => handleInputChange(e, 'download')}
                      onBlur={(e) => setDownloadTouched((s) => ({ ...s, [e.target.name]: true }))}
                      className="w-full mt-1 px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                      required
                    />
                    {downloadTouched.lastName && !downloadFormData.lastName.trim() && (
                      <p className="mt-1 text-xs text-red-600">This field is required</p>
                    )}
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium">Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    value={downloadFormData.email}
                    onChange={(e) => handleInputChange(e, 'download')}
                    onBlur={(e) => setDownloadTouched((s) => ({ ...s, [e.target.name]: true }))}
                    className="w-full mt-1 px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                    required
                  />
                  {downloadTouched.email && !downloadFormData.email.trim() && (
                    <p className="mt-1 text-xs text-red-600">This field is required</p>
                  )}
                  {downloadTouched.email && downloadFormData.email.trim() !== '' && !/^([^\s@]+)@([^\s@]+)\.[^\s@]+$/.test(downloadFormData.email) && (
                    <p className="mt-1 text-xs text-red-600">Please enter a valid email address</p>
                  )}
                </div>
                
                <div>
                  <label className="text-sm font-medium">Phone Number *</label>
                  <input
                    type="tel"
                    name="phone"
                    value={downloadFormData.phone}
                    onChange={(e) => handleInputChange(e, 'download')}
                    onBlur={(e) => setDownloadTouched((s) => ({ ...s, [e.target.name]: true }))}
                    className="w-full mt-1 px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                    required
                  />
                  {downloadTouched.phone && !downloadFormData.phone.trim() && (
                    <p className="mt-1 text-xs text-red-600">This field is required</p>
                  )}
                </div>
                
                <div>
                  <label className="text-sm font-medium">Company Name *</label>
                  <input
                    type="text"
                    name="company"
                    value={downloadFormData.company}
                    onChange={(e) => handleInputChange(e, 'download')}
                    onBlur={(e) => setDownloadTouched((s) => ({ ...s, [e.target.name]: true }))}
                    className="w-full mt-1 px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                    required
                  />
                  {downloadTouched.company && !downloadFormData.company.trim() && (
                    <p className="mt-1 text-xs text-red-600">This field is required</p>
                  )}
                </div>
              </div>
              
              <div className="flex gap-3 mt-6">
                <Button
                  variant="outline"
                  onClick={() => setIsDownloadModalOpen(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleDownload}
                  disabled={!isDownloadFormValid()}
                  className="flex-1 bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download Guide
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Contact Us Modal */}
      {isContactModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md bg-background">
            <CardHeader className="bg-gradient-to-r from-primary via-blue-600 to-purple-600 text-white rounded-t-lg relative overflow-hidden p-6">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-blue-600/20 to-purple-600/20"></div>
              <div className="relative flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/20 rounded-full backdrop-blur-sm">
                    <Mail className="w-5 h-5 text-white" />
                  </div>
                  <CardTitle className="text-white font-bold text-lg">Contact Our Experts</CardTitle>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsContactModalOpen(false)}
                  className="text-white hover:bg-white/20 rounded-full w-8 h-8 p-0"
                >
                  ×
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-6 pt-4">
              <p className="text-muted-foreground mb-6">
                Get personalized advice from our exhibition experts. We'll respond within 24 hours.
              </p>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">First Name *</label>
                    <input
                      type="text"
                      name="firstName"
                      value={contactFormData.firstName}
                      onChange={(e) => handleInputChange(e, 'contact')}
                      onBlur={(e) => setContactTouched((s) => ({ ...s, [e.target.name]: true }))}
                      className="w-full mt-1 px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                      required
                    />
                    {contactTouched.firstName && !contactFormData.firstName.trim() && (
                      <p className="mt-1 text-xs text-red-600">This field is required</p>
                    )}
                  </div>
                  <div>
                    <label className="text-sm font-medium">Last Name *</label>
                    <input
                      type="text"
                      name="lastName"
                      value={contactFormData.lastName}
                      onChange={(e) => handleInputChange(e, 'contact')}
                      onBlur={(e) => setContactTouched((s) => ({ ...s, [e.target.name]: true }))}
                      className="w-full mt-1 px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                      required
                    />
                    {contactTouched.lastName && !contactFormData.lastName.trim() && (
                      <p className="mt-1 text-xs text-red-600">This field is required</p>
                    )}
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium">Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    value={contactFormData.email}
                    onChange={(e) => handleInputChange(e, 'contact')}
                    onBlur={(e) => setContactTouched((s) => ({ ...s, [e.target.name]: true }))}
                    className="w-full mt-1 px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                    required
                  />
                  {contactTouched.email && !contactFormData.email.trim() && (
                    <p className="mt-1 text-xs text-red-600">This field is required</p>
                  )}
                  {contactTouched.email && contactFormData.email.trim() !== '' && !/^([^\s@]+)@([^\s@]+)\.[^\s@]+$/.test(contactFormData.email) && (
                    <p className="mt-1 text-xs text-red-600">Please enter a valid email address</p>
                  )}
                </div>
                
                <div>
                  <label className="text-sm font-medium">Phone Number *</label>
                  <input
                    type="tel"
                    name="phone"
                    value={contactFormData.phone}
                    onChange={(e) => handleInputChange(e, 'contact')}
                    onBlur={(e) => setContactTouched((s) => ({ ...s, [e.target.name]: true }))}
                    className="w-full mt-1 px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                    required
                  />
                  {contactTouched.phone && !contactFormData.phone.trim() && (
                    <p className="mt-1 text-xs text-red-600">This field is required</p>
                  )}
                </div>
                
                <div>
                  <label className="text-sm font-medium">Company Name *</label>
                  <input
                    type="text"
                    name="company"
                    value={contactFormData.company}
                    onChange={(e) => handleInputChange(e, 'contact')}
                    onBlur={(e) => setContactTouched((s) => ({ ...s, [e.target.name]: true }))}
                    className="w-full mt-1 px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                    required
                  />
                  {contactTouched.company && !contactFormData.company.trim() && (
                    <p className="mt-1 text-xs text-red-600">This field is required</p>
                  )}
                </div>

                <div>
                  <label className="text-sm font-medium">Message *</label>
                  <textarea
                    name="message"
                    value={contactFormData.message}
                    onChange={(e) => handleInputChange(e, 'contact')}
                    onBlur={(e) => setContactTouched((s) => ({ ...s, [e.target.name]: true }))}
                    rows={3}
                    className="w-full mt-1 px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                    placeholder="Tell us about your exhibition needs..."
                    required
                  />
                  {contactTouched.message && !contactFormData.message.trim() && (
                    <p className="mt-1 text-xs text-red-600">This field is required</p>
                  )}
                </div>
              </div>
              
              <div className="flex gap-3 mt-6">
                <Button
                  variant="outline"
                  onClick={() => setIsContactModalOpen(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleContactSubmit}
                  disabled={!isContactFormValid()}
                  className="flex-1 bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-4 h-4 mr-2" />
                  Send Message
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Book Strategy Call Modal */}
      {isBookCallModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md bg-background">
            <CardHeader className="bg-gradient-to-r from-primary via-blue-600 to-purple-600 text-white rounded-t-lg relative overflow-hidden p-6">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-blue-600/20 to-purple-600/20"></div>
              <div className="relative flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/20 rounded-full backdrop-blur-sm">
                    <Calendar className="w-5 h-5 text-white" />
                  </div>
                  <CardTitle className="text-white font-bold text-lg">Book Free Strategy Call</CardTitle>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsBookCallModalOpen(false)}
                  className="text-white hover:bg-white/20 rounded-full w-8 h-8 p-0"
                >
                  ×
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-6 pt-4">
              <p className="text-muted-foreground mb-6">
                Schedule a free 30-minute strategy session with our Z3 exhibition experts to discuss your goals and create a winning plan.
              </p>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">First Name *</label>
                    <input
                      type="text"
                      name="firstName"
                      value={bookCallFormData.firstName}
                      onChange={(e) => handleInputChange(e, 'bookCall')}
                      onBlur={(e) => setBookCallTouched((s) => ({ ...s, [e.target.name]: true }))}
                      className="w-full mt-1 px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                      required
                    />
                    {bookCallTouched.firstName && !bookCallFormData.firstName.trim() && (
                      <p className="mt-1 text-xs text-red-600">This field is required</p>
                    )}
                  </div>
                  <div>
                    <label className="text-sm font-medium">Last Name *</label>
                    <input
                      type="text"
                      name="lastName"
                      value={bookCallFormData.lastName}
                      onChange={(e) => handleInputChange(e, 'bookCall')}
                      onBlur={(e) => setBookCallTouched((s) => ({ ...s, [e.target.name]: true }))}
                      className="w-full mt-1 px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                      required
                    />
                    {bookCallTouched.lastName && !bookCallFormData.lastName.trim() && (
                      <p className="mt-1 text-xs text-red-600">This field is required</p>
                    )}
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium">Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    value={bookCallFormData.email}
                    onChange={(e) => handleInputChange(e, 'bookCall')}
                    onBlur={(e) => setBookCallTouched((s) => ({ ...s, [e.target.name]: true }))}
                    className="w-full mt-1 px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                    required
                  />
                  {bookCallTouched.email && !bookCallFormData.email.trim() && (
                    <p className="mt-1 text-xs text-red-600">This field is required</p>
                  )}
                  {bookCallTouched.email && bookCallFormData.email.trim() !== '' && !/^([^\s@]+)@([^\s@]+)\.[^\s@]+$/.test(bookCallFormData.email) && (
                    <p className="mt-1 text-xs text-red-600">Please enter a valid email address</p>
                  )}
                </div>
                
                <div>
                  <label className="text-sm font-medium">Phone Number *</label>
                  <input
                    type="tel"
                    name="phone"
                    value={bookCallFormData.phone}
                    onChange={(e) => handleInputChange(e, 'bookCall')}
                    onBlur={(e) => setBookCallTouched((s) => ({ ...s, [e.target.name]: true }))}
                    className="w-full mt-1 px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                    required
                  />
                  {bookCallTouched.phone && !bookCallFormData.phone.trim() && (
                    <p className="mt-1 text-xs text-red-600">This field is required</p>
                  )}
                </div>
                
                <div>
                  <label className="text-sm font-medium">Company Name *</label>
                  <input
                    type="text"
                    name="company"
                    value={bookCallFormData.company}
                    onChange={(e) => handleInputChange(e, 'bookCall')}
                    onBlur={(e) => setBookCallTouched((s) => ({ ...s, [e.target.name]: true }))}
                    className="w-full mt-1 px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                    required
                  />
                  {bookCallTouched.company && !bookCallFormData.company.trim() && (
                    <p className="mt-1 text-xs text-red-600">This field is required</p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Preferred Date *</label>
                    <input
                      type="date"
                      name="preferredDate"
                      value={bookCallFormData.preferredDate}
                      onChange={(e) => handleInputChange(e, 'bookCall')}
                      onBlur={(e) => setBookCallTouched((s) => ({ ...s, [e.target.name]: true }))}
                      className="w-full mt-1 px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                      required
                    />
                    {bookCallTouched.preferredDate && !bookCallFormData.preferredDate.trim() && (
                      <p className="mt-1 text-xs text-red-600">This field is required</p>
                    )}
                  </div>
                  <div>
                    <label className="text-sm font-medium">Preferred Time *</label>
                    <select
                      name="preferredTime"
                      value={bookCallFormData.preferredTime}
                      onChange={(e) => handleInputChange(e, 'bookCall')}
                      onBlur={(e) => setBookCallTouched((s) => ({ ...s, [e.target.name]: true }))}
                      className="w-full mt-1 px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                      required
                    >
                      <option value="">Select time</option>
                      <option value="09:00">9:00 AM</option>
                      <option value="10:00">10:00 AM</option>
                      <option value="11:00">11:00 AM</option>
                      <option value="14:00">2:00 PM</option>
                      <option value="15:00">3:00 PM</option>
                      <option value="16:00">4:00 PM</option>
                    </select>
                    {bookCallTouched.preferredTime && !bookCallFormData.preferredTime.trim() && (
                      <p className="mt-1 text-xs text-red-600">This field is required</p>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="flex gap-3 mt-6">
                <Button
                  variant="outline"
                  onClick={() => setIsBookCallModalOpen(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleBookCallSubmit}
                  disabled={!isBookCallFormValid()}
                  className="flex-1 bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  Book Strategy Call
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  )
}
