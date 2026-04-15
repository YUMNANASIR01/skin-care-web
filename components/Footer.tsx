"use client";

import { Leaf } from "lucide-react";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="bg-card text-muted-foreground border-t border-border pt-12 pb-4">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Footer */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          
          {/* Brand */}
          <div className="space-y-4 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <Leaf className="h-7 w-7 text-primary" />
              <Link href="/">
                <span className="font-heading text-2xl font-bold text-foreground tracking-tight">
                  SkinHeal
                </span>
              </Link>
            </div>

            <p className="text-sm leading-6 text-foreground/70 max-w-xs mx-auto sm:mx-0">
              Revolutionizing skin care through the gentle power of
              Homeopathy and AI. Curated by Dr. Yumna Nasir.
            </p>
          </div>

          {/* Quick Links */}
          <div className="text-center sm:text-left">
            <h4 className="text-sm font-bold uppercase tracking-widest text-foreground mb-4">
              Quick Links
            </h4>
            <nav className="space-y-2">
              <Link href="/" className="block text-sm hover:text-primary transition-colors">Home</Link>
              <Link href="/about" className="block text-sm hover:text-primary transition-colors">About Dr. Yumna</Link>
              <Link href="/chat" className="block text-sm hover:text-primary transition-colors">AI Skin Consultant</Link>
              <Link href="/appointment" className="block text-sm hover:text-primary transition-colors">Book Appointment</Link>
            </nav>
          </div>

          {/* Conditions */}
          <div className="text-center sm:text-left">
            <h4 className="text-sm font-bold uppercase tracking-widest text-foreground mb-4">
              Skin Conditions
            </h4>
            <nav className="space-y-2">
              <Link href="/condition/acne" className="block text-sm hover:text-primary transition-colors">Acne Treatment</Link>
              <Link href="/condition/eczema" className="block text-sm hover:text-primary transition-colors">Eczema Relief</Link>
              <Link href="/condition/psoriasis" className="block text-sm hover:text-primary transition-colors">Psoriasis Care</Link>
              <Link href="/condition/vitiligo" className="block text-sm hover:text-primary transition-colors">Vitiligo Guide</Link>
            </nav>
          </div>

          {/* Contact */}
          <div className="text-center sm:text-left">
            <h4 className="text-sm font-bold uppercase tracking-widest text-foreground mb-4">
              Contact Us
            </h4>
            <div className="space-y-2 text-sm">
              <p>📍 Karachi, Pakistan</p>
              <p>📞 0312-3359106</p>
              <p className="break-all">✉️ yumna719@gmail.com</p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-border mt-8 pt-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
            <p className="text-xs text-foreground/80">
              © 2026 SkinHeal Medical. All rights reserved.
            </p>

            <div className="flex flex-wrap justify-center gap-4 text-xs">
              <span className="hover:text-primary cursor-pointer transition-colors">
                Privacy Policy
              </span>
              <span className="hover:text-primary cursor-pointer transition-colors">
                Terms of Service
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;














//  "use client";                                                                                         
                                                                                                         
//    import { Leaf } from "lucide-react";                                                                  
//    import Link from "next/link";                                                                         
                                                                                                         
//    const Footer = () => {                                                                                
//      return (                                                                                            
//        <footer className="bg-card text-muted-foreground border-t border-border pt-10 pb-3">              
//          <div className="container mx-auto px-4">                                                        
//            {/* Main Footer Content */}                                                                   
//            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-8">                  
//              {/* Column 1: Brand & Slogan */}                                                            
//              <div className="flex flex-col items-center md:items-start space-y-4">                       
//                <div className="flex items-center gap-2">                                                 
//                  <Leaf className="h-7 w-7 text-primary" />    
//                     <Link href="/" >
//                     <span className="font-heading text-2xl font-bold text-foreground                        
//               tracking-tight">SkinHeal</span>    
//                     </Link>                                              
                                                                            
//                </div>                                                                                    
//                <p className="text-sm font-medium leading-relaxed text-foreground/60 text-center          
//    md:text-left">                                                                                        
//                  Revolutionizing skin care through the gentle power of Homeopathy and the intelligence   
//    of AI. Curated by Dr. Yumna Nasir.                                                                    
//                </p>                                                                                      
//              </div>                                                                                      
                                                                                                         
//              {/* Column 2: Quick Links */}                                                               
//              <div className="flex flex-col items-center md:items-start">                                 
//                <h4 className="font-heading text-sm font-bold uppercase tracking-widest text-foreground   
//    mb-6">Quick Links</h4>                                                                                
//                <nav className="flex flex-col items-center md:items-start space-y-3">                     
//                  <Link href="/" className="text-sm font-medium hover:text-primary                        
//    transition-colors">Home</Link>                                                                        
//                  <Link href="/about" className="text-sm font-medium hover:text-primary                   
//    transition-colors">About Dr. Yumna</Link>                                                             
//                  <Link href="/chat" className="text-sm font-medium hover:text-primary                    
//    transition-colors">AI Skin Consultant</Link>                                                          
//                  <Link href="/appointment" className="text-sm font-medium hover:text-primary             
//    transition-colors">Book Appointment</Link>                                                            
//                </nav>                                                                                    
//              </div>                                                                                      
                                                                                                         
//              {/* Column 3: Top Conditions */}                                                            
//              <div className="flex flex-col items-center md:items-start">                                 
//                <h4 className="font-heading text-sm font-bold uppercase tracking-widest text-foreground   
//    mb-6">Skin Conditions</h4>                                                                            
//                <nav className="flex flex-col items-center md:items-start space-y-3">                     
//                  <Link href="/condition/acne" className="text-sm font-medium hover:text-primary          
//    transition-colors">Acne Treatment</Link>                                                              
//                  <Link href="/condition/eczema" className="text-sm font-medium hover:text-primary        
//    transition-colors">Eczema Relief</Link>                                                               
//                  <Link href="/condition/psoriasis" className="text-sm font-medium hover:text-primary     
//    transition-colors">Psoriasis Care</Link>                                                              
//                  <Link href="/condition/vitiligo" className="text-sm font-medium hover:text-primary      
//    transition-colors">Vitiligo Guide</Link>                                                              
//                </nav>                                                                                    
//              </div>                                                                                      
                                                                                                         
//              {/* Column 4: Contact/Location */}                                                          
//              <div className="flex flex-col items-center md:items-start">                                 
//                <h4 className="font-heading text-sm font-bold uppercase tracking-widest text-foreground   
//    mb-6">Contact Us</h4>                                                                                 
//                <div className="flex flex-col items-center md:items-start space-y-3 text-sm font-medium"> 
//                  <p className="flex items-center gap-2">                                                 
//                    <span className="text-primary font-bold">📍</span> Karachi, Pakistan                  
//                  </p>                                                                                    
//                  <p className="flex items-center gap-2">                                                 
//                    <span className="text-primary font-bold">📞</span> 0312-3359106                       
//                  </p>                                                                                    
//                  <p className="flex items-center gap-2">                                                 
//                    <span className="text-primary font-bold">✉️</span> yumna719@gmail.com                 
//                  </p>                                                                                    
//                </div>                                                                                    
//              </div>                                                                                      
//            </div>                                                                                        
                                                                                                         
//            {/* Bottom Bar */}                                                                            
//            <div className="border-t border-border pt-8 mt-8">                                            
//              <div className="flex flex-col md:flex-row justify-between items-center gap-4">              
//                <p className="text-xs font-medium text-foreground/90">                                    
//                  © 2026 SkinHeal Medical. All rights reserved. Professional Homeopathic Care.            
//                </p>                                                                                      
//                <div className="flex gap-6 text-xs font-medium text-foreground/90">                       
//                  <span className="hover:text-primary cursor-pointer transition-colors">Privacy           
//    Policy</span>                                                                                         
//                  <span className="hover:text-primary cursor-pointer transition-colors">Terms of          
//    Service</span>                                                                                        
//                </div>                                                                                    
//              </div>                                                                                      
//            </div>                                                                                        
//          </div>                                                                                          
//        </footer>                                                                                         
//      );                                                                                                  
//    };                                                                                                    
                                                                                                         
//    export default Footer; 