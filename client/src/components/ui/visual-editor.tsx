import React, { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ColorPicker } from "./color-picker";
import { 
  Edit3, 
  Save, 
  X, 
  Type, 
  Image, 
  Palette, 
  Settings, 
  Eye,
  EyeOff 
} from "lucide-react";

interface VisualEditorProps {
  isEnabled: boolean;
  onToggleEdit: () => void;
  onSave: (elementId: string, content: string, contentType: string, metadata?: any) => void;
}

interface EditableElement {
  id: string;
  type: 'text' | 'html' | 'color' | 'image';
  content: string;
  metadata?: any;
  element: HTMLElement;
}

export function VisualEditor({ isEnabled, onToggleEdit, onSave }: VisualEditorProps) {
  const [editingElement, setEditingElement] = useState<EditableElement | null>(null);
  const [tempContent, setTempContent] = useState("");
  const [tempMetadata, setTempMetadata] = useState<any>({});
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isEnabled) {
      document.body.style.cursor = 'crosshair';
      addEditableOverlays();
    } else {
      document.body.style.cursor = '';
      removeEditableOverlays();
      setEditingElement(null);
    }

    return () => {
      document.body.style.cursor = '';
      removeEditableOverlays();
    };
  }, [isEnabled]);

  const addEditableOverlays = () => {
    const editableElements = document.querySelectorAll('[data-editable]');
    editableElements.forEach((element) => {
      const htmlElement = element as HTMLElement;
      htmlElement.style.position = 'relative';
      htmlElement.style.outline = '2px dashed #3b82f6';
      htmlElement.style.outlineOffset = '2px';
      htmlElement.style.cursor = 'pointer';
      
      const overlay = document.createElement('div');
      overlay.className = 'editable-overlay';
      overlay.style.cssText = `
        position: absolute;
        top: -8px;
        right: -8px;
        background: #3b82f6;
        color: white;
        padding: 2px 6px;
        border-radius: 4px;
        font-size: 10px;
        font-weight: bold;
        z-index: 1000;
        pointer-events: none;
      `;
      overlay.textContent = 'EDIT';
      htmlElement.appendChild(overlay);

      htmlElement.addEventListener('click', handleElementClick);
    });
  };

  const removeEditableOverlays = () => {
    const editableElements = document.querySelectorAll('[data-editable]');
    editableElements.forEach((element) => {
      const htmlElement = element as HTMLElement;
      htmlElement.style.outline = '';
      htmlElement.style.outlineOffset = '';
      htmlElement.style.cursor = '';
      
      const overlay = htmlElement.querySelector('.editable-overlay');
      if (overlay) {
        overlay.remove();
      }
      
      htmlElement.removeEventListener('click', handleElementClick);
    });
  };

  const handleElementClick = (e: Event) => {
    e.preventDefault();
    e.stopPropagation();
    
    const element = e.currentTarget as HTMLElement;
    const elementId = element.getAttribute('data-editable') || '';
    const contentType = element.getAttribute('data-content-type') || 'text';
    const metadata = element.getAttribute('data-metadata');
    
    let content = '';
    if (contentType === 'text') {
      content = element.textContent || '';
    } else if (contentType === 'html') {
      content = element.innerHTML || '';
    } else if (contentType === 'color') {
      content = window.getComputedStyle(element).backgroundColor || '';
    } else if (contentType === 'image') {
      const img = element.querySelector('img');
      content = img?.src || '';
    }

    setEditingElement({
      id: elementId,
      type: contentType as any,
      content,
      metadata: metadata ? JSON.parse(metadata) : {},
      element
    });
    setTempContent(content);
    setTempMetadata(metadata ? JSON.parse(metadata) : {});
  };

  const handleSave = () => {
    if (!editingElement) return;
    
    // Apply changes immediately to DOM for visual feedback
    if (editingElement.type === 'text') {
      editingElement.element.textContent = tempContent;
    } else if (editingElement.type === 'html') {
      editingElement.element.innerHTML = tempContent;
    } else if (editingElement.type === 'color') {
      editingElement.element.style.backgroundColor = tempContent;
    } else if (editingElement.type === 'image') {
      const img = editingElement.element.querySelector('img');
      if (img) img.src = tempContent;
    }
    
    onSave(editingElement.id, tempContent, editingElement.type, tempMetadata);
    setEditingElement(null);
  };

  const handleCancel = () => {
    setEditingElement(null);
    setTempContent("");
    setTempMetadata({});
  };

  if (!isEnabled && !editingElement) return null;

  return (
    <div className="fixed inset-0 z-50 pointer-events-none">
      {/* Edit Mode Banner */}
      {isEnabled && (
        <div className="pointer-events-auto fixed top-4 left-1/2 transform -translate-x-1/2 z-50">
          <Card className="neu-card shadow-lg border-2 border-accent/20">
            <CardContent className="flex items-center gap-4 p-4">
              <div className="flex items-center gap-2">
                <Edit3 className="h-5 w-5 text-accent" />
                <span className="font-bold text-primary">Visual Editor Active</span>
              </div>
              <div className="text-sm text-muted-foreground">
                Click any highlighted element to edit
              </div>
              <Button
                onClick={onToggleEdit}
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <EyeOff className="h-4 w-4" />
                Exit Edit Mode
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Edit Panel */}
      {editingElement && (
        <div className="pointer-events-auto fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="neu-card w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader className="border-b border-border/50">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  {editingElement.type === 'text' && <Type className="h-5 w-5" />}
                  {editingElement.type === 'html' && <Type className="h-5 w-5" />}
                  {editingElement.type === 'color' && <Palette className="h-5 w-5" />}
                  {editingElement.type === 'image' && <Image className="h-5 w-5" />}
                  Edit {editingElement.type.charAt(0).toUpperCase() + editingElement.type.slice(1)} Content
                </CardTitle>
                <Button variant="ghost" size="sm" onClick={handleCancel}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div>
                <Label htmlFor="element-id" className="text-sm font-medium">
                  Element ID
                </Label>
                <Input
                  id="element-id"
                  value={editingElement.id}
                  disabled
                  className="neu-input mt-1"
                />
              </div>

              {editingElement.type === 'text' && (
                <div>
                  <Label htmlFor="text-content" className="text-sm font-medium">
                    Text Content
                  </Label>
                  <Textarea
                    id="text-content"
                    value={tempContent}
                    onChange={(e) => setTempContent(e.target.value)}
                    className="neu-input mt-1 min-h-[100px]"
                    placeholder="Enter text content..."
                  />
                </div>
              )}

              {editingElement.type === 'html' && (
                <div>
                  <Label htmlFor="html-content" className="text-sm font-medium">
                    HTML Content
                  </Label>
                  <Textarea
                    id="html-content"
                    value={tempContent}
                    onChange={(e) => setTempContent(e.target.value)}
                    className="neu-input mt-1 min-h-[200px] font-mono text-sm"
                    placeholder="Enter HTML content..."
                  />
                </div>
              )}

              {editingElement.type === 'color' && (
                <div>
                  <Label htmlFor="color-content" className="text-sm font-medium">
                    Background Color
                  </Label>
                  <div className="flex gap-4 items-center mt-1">
                    <Input
                      id="color-content"
                      value={tempContent}
                      onChange={(e) => setTempContent(e.target.value)}
                      className="neu-input flex-1"
                      placeholder="Enter color value (hex, rgb, hsl...)"
                    />
                    <ColorPicker
                      color={tempContent}
                      onChange={setTempContent}
                    />
                  </div>
                </div>
              )}

              {editingElement.type === 'image' && (
                <div>
                  <Label htmlFor="image-content" className="text-sm font-medium">
                    Image URL
                  </Label>
                  <Input
                    id="image-content"
                    value={tempContent}
                    onChange={(e) => setTempContent(e.target.value)}
                    className="neu-input mt-1"
                    placeholder="Enter image URL..."
                  />
                  {tempContent && (
                    <div className="mt-4">
                      <img 
                        src={tempContent} 
                        alt="Preview" 
                        className="max-w-full h-32 object-cover rounded-lg neu-flat"
                        onError={(e) => {
                          const img = e.target as HTMLImageElement;
                          img.src = '/api/placeholder/300/200';
                        }}
                      />
                    </div>
                  )}
                </div>
              )}

              <div className="flex gap-4 pt-4">
                <Button onClick={handleSave} className="flex items-center gap-2 flex-1">
                  <Save className="h-4 w-4" />
                  Save Changes
                </Button>
                <Button onClick={handleCancel} variant="outline" className="flex items-center gap-2">
                  <X className="h-4 w-4" />
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}