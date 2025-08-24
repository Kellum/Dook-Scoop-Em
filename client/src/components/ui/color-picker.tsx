import React from "react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Palette } from "lucide-react";

interface ColorPickerProps {
  color: string;
  onChange: (color: string) => void;
}

const PRESET_COLORS = [
  "#000000", "#ffffff", "#808080", "#ff0000", "#00ff00", "#0000ff",
  "#ffff00", "#ff00ff", "#00ffff", "#ffa500", "#800080", "#008000",
  "#ffc0cb", "#a52a2a", "#87ceeb", "#dda0dd", "#98fb98", "#f0e68c",
  "#ff6347", "#40e0d0", "#ee82ee", "#90ee90", "#ffd700", "#ff69b4"
];

export function ColorPicker({ color, onChange }: ColorPickerProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-10 h-10 p-0 neu-flat">
          <div 
            className="w-6 h-6 rounded border border-border"
            style={{ backgroundColor: color }}
          />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 neu-card">
        <div className="grid grid-cols-6 gap-2 mb-4">
          {PRESET_COLORS.map((presetColor) => (
            <Button
              key={presetColor}
              variant="outline"
              className="w-10 h-10 p-0 neu-flat"
              onClick={() => onChange(presetColor)}
            >
              <div
                className="w-6 h-6 rounded border border-border"
                style={{ backgroundColor: presetColor }}
              />
            </Button>
          ))}
        </div>
        <div className="space-y-2">
          <input
            type="color"
            value={color.startsWith('#') ? color : '#000000'}
            onChange={(e) => onChange(e.target.value)}
            className="w-full h-10 rounded cursor-pointer"
          />
          <input
            type="text"
            value={color}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Enter color value"
            className="w-full px-3 py-2 text-sm border rounded neu-input"
          />
        </div>
      </PopoverContent>
    </Popover>
  );
}