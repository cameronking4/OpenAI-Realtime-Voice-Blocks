import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useState } from "react";

interface ConfigPopoverProps {
  config: any;
  setConfig: (config: any) => void;
}

const ConfigPopover: React.FC<ConfigPopoverProps> = ({ config, setConfig }) => {
  const [tempConfig, setTempConfig] = useState(config);

  const handleChange = (id: string, value: any) => {
    setTempConfig({ ...tempConfig, [id]: value });
  };

  const handleSave = (section: string) => {
    setConfig(tempConfig);
    console.log(`Saved ${section} settings:`, tempConfig);
  };

  const renderPopoverContent = (title: string, content: JSX.Element, section: string) => (
    <PopoverContent className="w-80">
      <div className="grid gap-4">
        <div className="space-y-2">
          <h4 className="font-medium leading-none">{title}</h4>
        </div>
        {content}
        <Button type="button" onClick={() => handleSave(section)}>
          Save changes
        </Button>
      </div>
    </PopoverContent>
  );

  return (
    <div className="flex gap-4">
      {/* Camera Settings */}
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline">Camera</Button>
        </PopoverTrigger>
        {renderPopoverContent(
          "Camera",
          <>
            <div className="grid gap-2">
              <div className="grid grid-cols-3 items-center gap-4">
                <Label htmlFor="cameraZoom">Zoom</Label>
                <Input
                  id="cameraZoom"
                  type="number"
                  value={tempConfig.cameraZoom}
                  onChange={(e) => handleChange('cameraZoom', parseFloat(e.target.value))}
                  className="col-span-2 h-8"
                />
              </div>
              <div className="grid grid-cols-3 items-center gap-4">
                <Label htmlFor="cameraSpeedY">Speed Y</Label>
                <Input
                  id="cameraSpeedY"
                  type="number"
                  value={tempConfig.cameraSpeedY}
                  onChange={(e) => handleChange('cameraSpeedY', parseFloat(e.target.value))}
                  className="col-span-2 h-8"
                />
              </div>
              <div className="grid grid-cols-3 items-center gap-4">
                <Label htmlFor="cameraSpeedX">Speed X</Label>
                <Input
                  id="cameraSpeedX"
                  type="number"
                  value={tempConfig.cameraSpeedX}
                  onChange={(e) => handleChange('cameraSpeedX', parseFloat(e.target.value))}
                  className="col-span-2 h-8"
                />
              </div>
              <div className="grid grid-cols-3 items-center gap-4">
                <Label htmlFor="cameraGuide">Guide</Label>
                <Checkbox
                  id="cameraGuide"
                  checked={tempConfig.cameraGuide}
                  onCheckedChange={(checked) => handleChange('cameraGuide', checked)}
                  className="col-span-2"
                />
              </div>
            </div>
          </>,
          "Camera"
        )}
      </Popover>

      {/* Setup Settings */}
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline">Setup</Button>
        </PopoverTrigger>
        {renderPopoverContent(
          "Setup",
          <>
            <div className="grid gap-2">
              <div className="grid grid-cols-3 items-center gap-4">
                <Label htmlFor="perlinTime">Speed</Label>
                <Input
                  id="perlinTime"
                  type="number"
                  value={tempConfig.perlinTime}
                  onChange={(e) => handleChange('perlinTime', parseFloat(e.target.value))}
                  className="col-span-2 h-8"
                />
              </div>
              <div className="grid grid-cols-3 items-center gap-4">
                <Label htmlFor="perlinMorph">Morph</Label>
                <Input
                  id="perlinMorph"
                  type="number"
                  value={tempConfig.perlinMorph}
                  onChange={(e) => handleChange('perlinMorph', parseFloat(e.target.value))}
                  className="col-span-2 h-8"
                />
              </div>
              <div className="grid grid-cols-3 items-center gap-4">
                <Label htmlFor="perlinDNoise">DNoise</Label>
                <Input
                  id="perlinDNoise"
                  type="number"
                  value={tempConfig.perlinDNoise}
                  onChange={(e) => handleChange('perlinDNoise', parseFloat(e.target.value))}
                  className="col-span-2 h-8"
                />
              </div>
            </div>
          </>,
          "Setup"
        )}
      </Popover>

      {/* RGB Settings */}
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline">RGB</Button>
        </PopoverTrigger>
        {renderPopoverContent(
          "RGB",
          <>
            <div className="grid gap-2">
              <div className="grid grid-cols-3 items-center gap-4">
                <Label htmlFor="chromaRGBr">Red</Label>
                <Input
                  id="chromaRGBr"
                  type="number"
                  value={tempConfig.chromaRGBr}
                  onChange={(e) => handleChange('chromaRGBr', parseFloat(e.target.value))}
                  className="col-span-2 h-8"
                />
              </div>
              <div className="grid grid-cols-3 items-center gap-4">
                <Label htmlFor="chromaRGBg">Green</Label>
                <Input
                  id="chromaRGBg"
                  type="number"
                  value={tempConfig.chromaRGBg}
                  onChange={(e) => handleChange('chromaRGBg', parseFloat(e.target.value))}
                  className="col-span-2 h-8"
                />
              </div>
              <div className="grid grid-cols-3 items-center gap-4">
                <Label htmlFor="chromaRGBb">Blue</Label>
                <Input
                  id="chromaRGBb"
                  type="number"
                  value={tempConfig.chromaRGBb}
                  onChange={(e) => handleChange('chromaRGBb', parseFloat(e.target.value))}
                  className="col-span-2 h-8"
                />
              </div>
              <div className="grid grid-cols-3 items-center gap-4">
                <Label htmlFor="chromaRGBn">Black</Label>
                <Input
                  id="chromaRGBn"
                  type="number"
                  value={tempConfig.chromaRGBn}
                  onChange={(e) => handleChange('chromaRGBn', parseFloat(e.target.value))}
                  className="col-span-2 h-8"
                />
              </div>
              <div className="grid grid-cols-3 items-center gap-4">
                <Label htmlFor="chromaRGBm">Chroma</Label>
                <Input
                  id="chromaRGBm"
                  type="number"
                  value={tempConfig.chromaRGBm}
                  onChange={(e) => handleChange('chromaRGBm', parseFloat(e.target.value))}
                  className="col-span-2 h-8"
                />
              </div>
            </div>
          </>,
          "RGB"
        )}
      </Popover>

      {/* Sphere Settings */}
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline">Sphere</Button>
        </PopoverTrigger>
        {renderPopoverContent(
          "Sphere",
          <>
            <div className="grid gap-2">
              <div className="grid grid-cols-3 items-center gap-4">
                <Label htmlFor="sphereWireframe">Wireframe</Label>
                <Checkbox
                  id="sphereWireframe"
                  checked={tempConfig.sphereWireframe}
                  onCheckedChange={(checked) => handleChange('sphereWireframe', checked)}
                  className="col-span-2"
                />
              </div>
              <div className="grid grid-cols-3 items-center gap-4">
                <Label htmlFor="spherePoints">Points</Label>
                <Checkbox
                  id="spherePoints"
                  checked={tempConfig.spherePoints}
                  onCheckedChange={(checked) => handleChange('spherePoints', checked)}
                  className="col-span-2"
                />
              </div>
              <div className="grid grid-cols-3 items-center gap-4">
                <Label htmlFor="spherePsize">Point Size</Label>
                <Input
                  id="spherePsize"
                  type="number"
                  value={tempConfig.spherePsize}
                  onChange={(e) => handleChange('spherePsize', parseFloat(e.target.value))}
                  className="col-span-2 h-8"
                />
              </div>
            </div>
          </>,
          "Sphere"
        )}
      </Popover>
    </div>
  );
};

export default ConfigPopover;
