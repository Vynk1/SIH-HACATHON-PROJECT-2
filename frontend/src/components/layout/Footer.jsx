import { Link } from "react-router-dom";
import { Github, Linkedin, Mail, Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto grid gap-8 px-4 py-10 md:grid-cols-3">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="grid size-8 place-items-center rounded-md bg-gradient-to-br from-primary to-accent text-primary-foreground">
              <Heart className="size-4" />
            </div>
            <h3 className="text-xl font-semibold">Swasthya</h3>
          </div>
          <p className="mt-2 text-sm text-muted-foreground">
            Your Digital Health Card platform. Securely manage medical records,
            health profiles, and emergency access with ease.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-6 md:grid-cols-2 md:gap-8">
          <div>
            <p className="text-sm font-medium text-foreground">Platform</p>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li><Link to="/dashboard" className="hover:text-primary">Dashboard</Link></li>
              <li><Link to="/profile" className="hover:text-primary">Health Profile</Link></li>
              <li><Link to="/records" className="hover:text-primary">Medical Records</Link></li>
            </ul>
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">Account</p>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li><Link to="/qr" className="hover:text-primary">QR Code</Link></li>
              <li><Link to="/login" className="hover:text-primary">Sign in</Link></li>
              <li><Link to="/register" className="hover:text-primary">Register</Link></li>
            </ul>
          </div>
        </div>
        <div className="flex flex-col items-start gap-3 md:items-end">
          <div className="flex gap-3 text-muted-foreground">
            <a 
              href="https://github.com/Vynk1/SIH-HACATHON" 
              target="_blank" 
              rel="noopener noreferrer" 
              aria-label="Github" 
              className="hover:text-foreground transition-colors"
            >
              <Github className="size-5" />
            </a>
            <a 
              href="https://www.linkedin.com/in/vinayak1gupta/" 
              target="_blank" 
              rel="noopener noreferrer" 
              aria-label="LinkedIn" 
              className="hover:text-foreground transition-colors"
            >
              <Linkedin className="size-5" />
            </a>
            <a 
              href="mailto:99583253a@gmail.com" 
              aria-label="Contact" 
              className="hover:text-foreground transition-colors"
            >
              <Mail className="size-5" />
            </a>
          </div>
          <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} Swasthya Health Card. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}