import { useState, useEffect, useRef } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface InlineEditorProps {
  elementId: string;
  defaultContent: string;
  contentType?: "text" | "html";
  className?: string;
  tag?: keyof JSX.IntrinsicElements;
  onSave?: (content: string) => void;
}

export function InlineEditor({ 
  elementId, 
  defaultContent, 
  contentType = "text",
  className = "",
  tag: Tag = "div",
  onSave,
}: InlineEditorProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState(defaultContent);
  const [isHovered, setIsHovered] = useState(false);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);
  const queryClient = useQueryClient();

  // Check if we're in edit mode
  const isEditMode = localStorage.getItem("edit-mode") === "true";

  // Auto-save mutation
  const saveMutation = useMutation({
    mutationFn: async (newContent: string) => {
      const token = localStorage.getItem("admin-token");
      if (!token) throw new Error("Not authenticated");

      // Save to localStorage for now (can be expanded to API calls)
      localStorage.setItem(`content-${elementId}`, newContent);
      return { success: true };
    },
    onSuccess: (_, newContent) => {
      onSave?.(newContent);
    },
  });

  // Load saved content on mount
  useEffect(() => {
    const savedContent = localStorage.getItem(`content-${elementId}`);
    if (savedContent) {
      setContent(savedContent);
    }
  }, [elementId]);

  // Auto-save when content changes (debounced)
  useEffect(() => {
    if (content !== defaultContent && isEditMode) {
      const timeoutId = setTimeout(() => {
        saveMutation.mutate(content);
      }, 500);
      return () => clearTimeout(timeoutId);
    }
  }, [content, defaultContent, isEditMode, saveMutation]);

  const handleClick = () => {
    if (isEditMode) {
      setIsEditing(true);
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
          if (inputRef.current instanceof HTMLInputElement) {
            inputRef.current.select();
          }
        }
      }, 0);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      setIsEditing(false);
    }
    if (e.key === "Escape") {
      setContent(defaultContent);
      setIsEditing(false);
    }
  };

  const handleBlur = () => {
    setIsEditing(false);
  };

  if (!isEditMode) {
    // Normal mode - just render content
    if (contentType === "html") {
      return <Tag className={className} dangerouslySetInnerHTML={{ __html: content }} />;
    }
    return <Tag className={className}>{content}</Tag>;
  }

  // Edit mode
  const editableClassName = `${className} ${
    isEditing 
      ? 'ring-2 ring-blue-500 bg-blue-50' 
      : isHovered 
        ? 'ring-2 ring-blue-300 cursor-pointer' 
        : 'hover:ring-1 hover:ring-blue-200 cursor-pointer'
  } transition-all relative px-2 py-1 rounded`;

  if (isEditing) {
    const isMultiline = content.includes('\n') || content.length > 100;
    
    return isMultiline ? (
      <textarea
        ref={inputRef as React.RefObject<HTMLTextAreaElement>}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={handleBlur}
        className={`${className} w-full p-2 border-2 border-blue-500 rounded resize-none bg-white`}
        rows={Math.min(content.split('\n').length + 1, 10)}
      />
    ) : (
      <input
        ref={inputRef as React.RefObject<HTMLInputElement>}
        type="text"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={handleBlur}
        className={`${className} w-full p-2 border-2 border-blue-500 rounded bg-white`}
      />
    );
  }

  // Render in edit mode with hover effects
  return (
    <div className="relative group">
      <Tag 
        className={editableClassName}
        onClick={handleClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        {...(contentType === "html" ? { dangerouslySetInnerHTML: { __html: content } } : {})}
      >
        {contentType === "text" && content}
      </Tag>
      {isHovered && (
        <div className="absolute -top-8 left-0 bg-blue-600 text-white text-xs px-2 py-1 rounded whitespace-nowrap z-10">
          Click to edit
        </div>
      )}
      {saveMutation.isPending && (
        <div className="absolute -top-8 right-0 bg-green-600 text-white text-xs px-2 py-1 rounded">
          Saving...
        </div>
      )}
    </div>
  );
}