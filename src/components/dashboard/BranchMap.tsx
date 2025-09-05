"use client";

import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { Icon } from "leaflet";
import { Branch } from "@/lib/crud/branches";
import { MapPin, Building2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import "leaflet/dist/leaflet.css";

delete (Icon.Default.prototype as Record<string, unknown>)._getIconUrl;
Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

interface BranchMapProps {
  branches: Branch[];
  height?: string;
  className?: string;
}

function MapBounds({ branches }: { branches: Branch[] }) {
  const map = useMap();

  if (branches.length > 0) {
    const bounds = branches.map(branch => [
      branch.location.coordinates[1], 
      branch.location.coordinates[0]  
    ] as [number, number]);
    
    map.fitBounds(bounds, { padding: [20, 20] });
  }

  return null;
}

const createCustomIcon = (color: string) => new Icon({
  iconUrl: `data:image/svg+xml;base64,${btoa(`
    <svg width="25" height="41" viewBox="0 0 25 41" xmlns="http://www.w3.org/2000/svg">
      <path fill="${color}" stroke="#fff" stroke-width="2" d="M12.5 0C5.6 0 0 5.6 0 12.5c0 12.5 12.5 28.5 12.5 28.5s12.5-16 12.5-28.5C25 5.6 19.4 0 12.5 0z"/>
      <circle fill="#fff" cx="12.5" cy="12.5" r="6"/>
    </svg>
  `)}`,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [0, -41],
});

const getCountryColor = (country: string) => {
  const colors: { [key: string]: string } = {
    "USA": "#3B82F6",
    "UK": "#EF4444", 
    "Japan": "#10B981",
    "UAE": "#F59E0B",
    "Egypt": "#F97316",
    "Canada": "#8B5CF6",
    "France": "#EC4899",
    "Germany": "#6B7280",
    "Australia": "#6366F1",
    "Brazil": "#059669",
  };
  return colors[country] || "#6B7280";
};

export default function BranchMap({ branches, height = "500px", className = "" }: BranchMapProps) {
  if (branches.length === 0) {
    return (
      <Card className={className}>
        <CardContent className="flex items-center justify-center" style={{ height }}>
          <div className="text-center">
            <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No branches to display</h3>
            <p className="text-gray-500">Add some branches to see them on the map</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const centerLat = branches.reduce((sum, branch) => sum + branch.location.coordinates[1], 0) / branches.length;
  const centerLng = branches.reduce((sum, branch) => sum + branch.location.coordinates[0], 0) / branches.length;

  return (
    <Card className={className}>
      <CardContent className="p-0">
        <div style={{ height }} className="relative">
          <MapContainer
            center={[centerLat, centerLng]}
            zoom={2}
            style={{ height: "100%", width: "100%" }}
            className="rounded-lg"
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            
            {branches.map((branch) => (
              <Marker
                key={branch._id}
                position={[branch.location.coordinates[1], branch.location.coordinates[0]]}
                icon={createCustomIcon(getCountryColor(branch.country))}
              >
                <Popup className="custom-popup">
                  <div className="p-2 min-w-[250px]">
                    <div className="flex items-center gap-2 mb-2">
                      <Building2 className="w-4 h-4 text-[#FF9E0C]" />
                      <h3 className="font-semibold text-lg">{branch.name}</h3>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <MapPin className="w-4 h-4" />
                        <span>{branch.address}, {branch.city}</span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Badge className={`text-xs ${getCountryColor(branch.country) === "#6B7280" ? "bg-gray-100 text-gray-800" : "text-white"}`} style={{ backgroundColor: getCountryColor(branch.country) }}>
                          {branch.country}
                        </Badge>
                      </div>
                      
                      <div className="text-xs text-gray-500 pt-1 border-t">
                        Coordinates: {branch.location.coordinates[0]}, {branch.location.coordinates[1]}
                      </div>
                    </div>
                  </div>
                </Popup>
              </Marker>
            ))}
            
            <MapBounds branches={branches} />
          </MapContainer>
        </div>
      </CardContent>
    </Card>
  );
}
