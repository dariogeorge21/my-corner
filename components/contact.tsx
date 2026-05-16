import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, MessageSquare, Send } from "lucide-react";

export function Contact() {
  return (
    <section id="contact" className="w-full py-20 lg:py-32 bg-muted/20 relative overflow-hidden">
      <div className="container max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-primary">Get In Touch</h2>
          <div className="w-20 h-1 bg-secondary mx-auto rounded-full"></div>
          <p className="max-w-[600px] mx-auto text-foreground/80 text-lg">
            Have a project in mind, a question, or just want to say hello? 
            I'm currently open for new opportunities.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-accent/20">
          <div className="grid md:grid-cols-5">
            {/* Contact Info */}
            <div className="bg-primary p-8 md:p-10 text-white md:col-span-2 flex flex-col justify-between">
              <div>
                <h3 className="text-2xl font-bold mb-6 text-muted">Contact Information</h3>
                <div className="space-y-6">
                  <a href="mailto:hello@darioscorner.com" className="flex items-center gap-4 hover:text-muted transition-colors">
                    <div className="p-3 bg-white/10 rounded-full">
                      <Mail className="w-5 h-5 text-muted" />
                    </div>
                    <span>hello@darioscorner.com</span>
                  </a>
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-white/10 rounded-full">
                      <MessageSquare className="w-5 h-5 text-muted" />
                    </div>
                    <span>Available for freelance opportunities</span>
                  </div>
                </div>
              </div>
              <div className="mt-12 opacity-80 text-sm">
                <p>Based in the digital world.</p>
                <p>Working globally.</p>
              </div>
            </div>

            {/* Contact Form */}
            <div className="p-8 md:p-10 md:col-span-3">
              <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-medium text-primary">Full Name</label>
                    <Input id="name" placeholder="John Doe" className="border-accent/40 focus-visible:ring-secondary" />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium text-primary">Email Address</label>
                    <Input id="email" type="email" placeholder="john@example.com" className="border-accent/40 focus-visible:ring-secondary" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label htmlFor="subject" className="text-sm font-medium text-primary">Subject</label>
                  <Input id="subject" placeholder="How can I help you?" className="border-accent/40 focus-visible:ring-secondary" />
                </div>
                <div className="space-y-2">
                  <label htmlFor="message" className="text-sm font-medium text-primary">Message</label>
                  <Textarea 
                    id="message" 
                    placeholder="Tell me about your project..." 
                    className="min-h-[150px] border-accent/40 focus-visible:ring-secondary resize-y" 
                  />
                </div>
                <Button type="submit" className="w-full bg-secondary hover:bg-primary text-white py-6 flex items-center justify-center gap-2">
                  <Send className="w-4 h-4" /> Send Message
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
      
      {/* Decorative background shape */}
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-muted/40 rounded-full blur-3xl -z-10 translate-x-1/3 translate-y-1/3 pointer-events-none" aria-hidden="true" />
    </section>
  );
}