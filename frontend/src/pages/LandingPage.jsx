import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import {
  ShieldCheck,
  Heart,
  FileText,
  QrCode,
  Users,
  Smartphone,
  ArrowRight,
  Shield,
  Clock,
  Globe,
} from "lucide-react";

const features = [
  {
    icon: ShieldCheck,
    title: "Secure Health Records",
    desc: "Bank-level encryption protects your medical data with secure access controls.",
  },
  {
    icon: Heart,
    title: "Digital Health Profile",
    desc: "Complete health overview with vital information, allergies, and medical history.",
  },
  {
    icon: FileText,
    title: "Medical Records Management",
    desc: "Upload, organize, and share medical documents with healthcare providers.",
  },
  {
    icon: QrCode,
    title: "Emergency QR Access",
    desc: "Instant access to critical health info during emergencies via QR code.",
  },
  {
    icon: Users,
    title: "Healthcare Integration",
    desc: "Seamlessly connect with doctors, hospitals, and healthcare systems.",
  },
  {
    icon: Smartphone,
    title: "Mobile-First Design",
    desc: "Access your health data anywhere, anytime with our responsive platform.",
  },
];

const stats = [
  { label: "Registered Users", value: "50,000+", icon: Users },
  { label: "Medical Records Secured", value: "250,000+", icon: FileText },
  { label: "Emergency Accesses", value: "2,500+", icon: Heart },
];

export default function LandingPage() {
  return (
    <div className="relative">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(1200px_600px_at_50%_-200px,theme(colors.primary/.25),transparent),radial-gradient(800px_300px_at_80%_-100px,theme(colors.accent/.25),transparent)]"></div>
        <div className="container mx-auto grid gap-10 px-4 py-20 lg:grid-cols-2 lg:gap-16 lg:py-28">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs text-muted-foreground">
              <ShieldCheck className="size-3.5" /> Secure, HIPAA-compliant platform
            </div>
            <h1 className="mt-4 text-4xl font-extrabold tracking-tight sm:text-5xl">
              Your Complete Digital Health Card Solution
            </h1>
            <p className="mt-4 max-w-prose text-lg text-muted-foreground">
              Securely store, manage, and share your health information with healthcare providers.
              Emergency access, medical records, and health profiles all in one secure platform.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Button size="lg" asChild>
                <Link to="/register" className="inline-flex items-center gap-2">
                  Get Started Free <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/login">Sign In</Link>
              </Button>
            </div>
            <div className="mt-6 flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <span className="size-2 rounded-full bg-accent"></span>
                HIPAA Compliant
              </div>
              <div className="flex items-center gap-2">
                <span className="size-2 rounded-full bg-primary"></span>
                Bank-level Security
              </div>
              <div className="flex items-center gap-2">
                <span className="size-2 rounded-full bg-green-500"></span>
                24/7 Access
              </div>
            </div>
          </div>

          {/* Hero Stats Cards */}
          <div className="grid content-center gap-4">
            <Card className="p-4">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Platform Overview</CardTitle>
                <CardDescription>Trusted by thousands of users nationwide</CardDescription>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="grid grid-cols-3 gap-4 text-center">
                  {stats.map(({ label, value, icon: Icon }) => (
                    <div key={label} className="space-y-1">
                      <Icon className="size-5 mx-auto text-primary" />
                      <div className="text-lg font-semibold">{value}</div>
                      <div className="text-xs text-muted-foreground">{label}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="p-4">
              <CardContent className="flex items-center justify-between pt-4">
                <div>
                  <div className="text-sm font-medium">Emergency Ready</div>
                  <div className="text-xs text-muted-foreground">Critical health info accessible 24/7</div>
                </div>
                <div className="size-12 rounded-lg bg-red-100 flex items-center justify-center">
                  <Heart className="size-6 text-red-600" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Everything you need for digital health management
          </h2>
          <p className="mt-3 text-muted-foreground">
            From secure record storage to emergency access — built for patients, families, and healthcare providers.
          </p>
        </div>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map(({ icon: Icon, title, desc }) => (
            <Card key={title} className="group transition-shadow hover:shadow-md">
              <CardHeader>
                <div className="size-10 rounded-md bg-gradient-to-br from-primary to-accent text-primary-foreground shadow-sm flex items-center justify-center">
                  <Icon className="size-5" />
                </div>
                <CardTitle className="group-hover:text-primary">{title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{desc}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Security & Trust Section */}
      <section className="bg-muted/50">
        <div className="container mx-auto px-4 py-16">
          <div className="mx-auto max-w-4xl">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold">Built with Security & Privacy First</h2>
              <p className="mt-3 text-muted-foreground">
                Your health data is protected with enterprise-grade security measures
              </p>
            </div>
            <div className="grid gap-6 md:grid-cols-3">
              <div className="text-center space-y-3">
                <div className="size-12 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
                  <Shield className="size-6 text-primary" />
                </div>
                <h3 className="font-semibold">End-to-End Encryption</h3>
                <p className="text-sm text-muted-foreground">
                  All data encrypted in transit and at rest using AES-256 encryption
                </p>
              </div>
              <div className="text-center space-y-3">
                <div className="size-12 mx-auto rounded-full bg-accent/10 flex items-center justify-center">
                  <Clock className="size-6 text-accent" />
                </div>
                <h3 className="font-semibold">Regular Backups</h3>
                <p className="text-sm text-muted-foreground">
                  Automated daily backups ensure your data is never lost
                </p>
              </div>
              <div className="text-center space-y-3">
                <div className="size-12 mx-auto rounded-full bg-green-500/10 flex items-center justify-center">
                  <Globe className="size-6 text-green-600" />
                </div>
                <h3 className="font-semibold">HIPAA Compliant</h3>
                <p className="text-sm text-muted-foreground">
                  Fully compliant with healthcare privacy regulations
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="container mx-auto px-4 py-16">
        <Card className="max-w-4xl mx-auto">
          <CardContent className="p-8 lg:p-12">
            <div className="text-center space-y-4">
              <h2 className="text-3xl font-bold">Start Managing Your Health Data Today</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Join thousands of users who trust Swasthya for secure health record management.
                Set up your digital health card in minutes.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                <Button size="lg" asChild>
                  <Link to="/register">Create Free Account</Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link to="/login">Sign In</Link>
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Free forever. No credit card required. HIPAA compliant.
              </p>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}