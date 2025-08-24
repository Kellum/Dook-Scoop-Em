import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

interface EditableContentProps {
  elementId: string;
  pageSlug: string;
  defaultContent: string;
  contentType?: "text" | "html";
  className?: string;
  tag?: keyof JSX.IntrinsicElements;
  children?: React.ReactNode;
  dangerouslySetInnerHTML?: { __html: string };
}

interface ContentData {
  page: any;
  content: Record<string, {
    id: string;
    content: string;
    contentType: string;
    metadata: any;
  }>;
}

export function EditableContent({ 
  elementId, 
  pageSlug, 
  defaultContent, 
  contentType = "text",
  className = "",
  tag: Tag = "div",
  children,
  ...props 
}: EditableContentProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(defaultContent);
  const queryClient = useQueryClient();

  // Check if visual editor is enabled for this specific page
  const isVisualEditorEnabled = localStorage.getItem("visual-editor-enabled") === "true" &&
    (localStorage.getItem("visual-editor-page") === pageSlug || 
     (pageSlug === "home" && localStorage.getItem("visual-editor-page") === "/"));

  // Load page content
  const { data: contentData } = useQuery<ContentData>({
    queryKey: [`/api/cms/content/${pageSlug}`],
    enabled: isVisualEditorEnabled,
  });

  // Get the actual content from CMS or use default
  const actualContent = contentData?.content[elementId]?.content || defaultContent;

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: async (content: string) => {
      const token = localStorage.getItem("admin-token");
      if (!token) throw new Error("Not authenticated");

      // If content exists, update it
      if (contentData?.content[elementId]?.id) {
        const response = await fetch(`/api/cms/content/element/${contentData.page.id}/${elementId}`, {
          method: "PUT",
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({ content }),
        });
        if (!response.ok) throw new Error('Failed to update content');
        return response.json();
      } else {
        // Create new content
        const response = await fetch(`/api/cms/content`, {
          method: "POST", 
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({
            pageId: contentData?.page?.id,
            elementId,
            content,
            contentType,
          }),
        });
        if (!response.ok) throw new Error('Failed to create content');
        return response.json();
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/cms/content/${pageSlug}`] });
      setIsEditing(false);
    },
  });

  const handleClick = () => {
    if (isVisualEditorEnabled) {
      setIsEditing(true);
      setEditValue(actualContent);
    }
  };

  const handleSave = () => {
    updateMutation.mutate(editValue);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditValue(actualContent);
  };

  if (!isVisualEditorEnabled) {
    // Normal mode - just render content
    if (contentType === "html") {
      return <Tag className={className} dangerouslySetInnerHTML={{ __html: actualContent }} {...props} />;
    }
    return <Tag className={className} {...props}>{actualContent}</Tag>;
  }

  // Visual editor mode
  const editableClassName = `${className} ${isEditing ? 'ring-2 ring-blue-500' : 'hover:ring-2 hover:ring-blue-300 cursor-pointer'} transition-all relative`;

  if (isEditing) {
    return (
      <div className="relative">
        <textarea
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          className="w-full p-2 border rounded resize-none min-h-[100px]"
          autoFocus
          onKeyDown={(e) => {
            if (e.key === 'Escape') handleCancel();
            if (e.key === 'Enter' && e.ctrlKey) handleSave();
          }}
        />
        <div className="flex gap-2 mt-2">
          <button
            onClick={handleSave}
            disabled={updateMutation.isPending}
            className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
          >
            {updateMutation.isPending ? "Saving..." : "Save"}
          </button>
          <button
            onClick={handleCancel}
            className="px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  // Render in visual editor mode with edit indicator
  return (
    <div className="relative group">
      <Tag 
        className={editableClassName} 
        onClick={handleClick}
        {...(contentType === "html" ? { dangerouslySetInnerHTML: { __html: actualContent } } : {})}
        {...props}
      >
        {contentType === "text" && actualContent}
      </Tag>
      <div className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
        Click to edit
      </div>
    </div>
  );
}