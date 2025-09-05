import { MapPin, Mail, Phone, Clock } from "lucide-react";

const ContactInfo = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 px-4 md:px-0">
      <div className="flex items-center space-x-3">
        <div className="p-3 bg-footer-accent rounded-full bg-[#FF9E0C] flex-shrink-0">
          <MapPin className="h-6 w-6 text-white" />
        </div>
        <div className="min-w-0">
          <p className="text-xs text-footer-muted uppercase tracking-wide font-bold">
            Address
          </p>
          <p className="text-sm text-footer-foreground">
            Oxford Ave. Cary, NC 27511
          </p>
        </div>
      </div>

      <div className="flex items-center space-x-3">
        <div className="p-3 bg-footer-accent rounded-full bg-[#FF9E0C] flex-shrink-0">
          <Mail className="h-6 w-6 text-white" />
        </div>
        <div className="min-w-0">
          <p className="text-xs text-footer-muted uppercase tracking-wide font-bold">
            Email
          </p>
          <p className="text-sm text-footer-foreground">nwjiger@yahoo.com</p>
        </div>
      </div>

      <div className="flex items-center space-x-3">
        <div className="p-3 bg-footer-accent rounded-full bg-[#FF9E0C] flex-shrink-0">
          <Phone className="h-6 w-6 text-white" />
        </div>
        <div className="min-w-0">
          <p className="text-xs text-footer-muted uppercase tracking-wide font-bold">
            Phone
          </p>
          <p className="text-sm text-footer-foreground">+537 547-6401</p>
        </div>
      </div>

      <div className="flex items-center space-x-3">
        <div className="p-3 bg-footer-accent rounded-full bg-[#FF9E0C] flex-shrink-0">
          <Clock className="h-6 w-6 text-white" />
        </div>
        <div className="min-w-0">
          <p className="text-xs text-footer-muted uppercase tracking-wide font-bold">
            Opening hours
          </p>
          <p className="text-sm text-footer-foreground">Sun-Mon: 10am - 10pm</p>
        </div>
      </div>
    </div>
  );
};

export default ContactInfo;
