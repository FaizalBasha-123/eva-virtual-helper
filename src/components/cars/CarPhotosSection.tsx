
import React, { useState } from 'react';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Image as ImageIcon, Camera, Layout, Car } from 'lucide-react';

interface CarPhotosSectionProps {
  images: string[];
  carTitle: string;
}

type PhotoCategory = 'all' | 'exterior' | 'interior' | 'tyres';

const categories = [
  { id: 'all', label: 'All Photos', icon: ImageIcon },
  { id: 'exterior', label: 'Exterior', icon: Car },
  { id: 'interior', label: 'Interior', icon: Layout },
  { id: 'tyres', label: 'Tyres', icon: Camera },
] as const;

const CarPhotosSection = ({ images, carTitle }: CarPhotosSectionProps) => {
  const [activeCategory, setActiveCategory] = useState<PhotoCategory>('all');
  
  // In a real app, we'd filter based on image metadata
  // For now, we'll just show all images for any category
  const filteredImages = images;
  
  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
      <h2 className="text-lg font-semibold mb-4">Photos</h2>
      <Separator className="mb-6" />
      
      {/* Category buttons */}
      <div className="flex gap-3 overflow-x-auto pb-4 mb-6 scrollbar-none">
        {categories.map(({ id, label, icon: Icon }) => (
          <Button
            key={id}
            variant={activeCategory === id ? "default" : "outline"}
            size="sm"
            className="flex items-center gap-2 whitespace-nowrap"
            onClick={() => setActiveCategory(id as PhotoCategory)}
          >
            <Icon className="h-4 w-4" />
            {label}
          </Button>
        ))}
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {filteredImages.map((img, idx) => (
          <div 
            key={idx} 
            className="aspect-[4/3] rounded-lg overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
          >
            <img 
              src={img} 
              alt={`${carTitle} view ${idx + 1}`} 
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default CarPhotosSection;
