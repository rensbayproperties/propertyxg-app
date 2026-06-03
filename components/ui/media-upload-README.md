# Media Upload Component

A Shopify-style media upload component for React applications. Supports drag-and-drop, multiple file types (images, videos, documents), progress tracking, and seamless integration with React Hook Form.

## Features

- 🎨 **Shopify-inspired Design** - Beautiful, modern UI matching your design system
- 📁 **Multiple File Types** - Support for images, videos, and documents
- 🎯 **Drag & Drop** - Intuitive file upload with drag-and-drop interface
- 📊 **Progress Tracking** - Real-time upload progress with visual feedback
- ✅ **Validation** - File type, size, and count validation
- 🔄 **Retry Failed Uploads** - Automatic retry for failed uploads
- 📱 **Responsive** - Works perfectly on mobile and desktop
- 🎨 **Two View Modes** - Grid view (default) and compact list view
- 🔗 **Form Integration** - Seamless integration with React Hook Form
- ♿ **Accessible** - Built with accessibility in mind

## Installation

The component uses the following dependencies (already in your project):
- `react-dropzone` - For drag-and-drop functionality
- `react-hook-form` - For form integration
- `lucide-react` - For icons
- `sonner` - For toast notifications

## Components

### 1. `MediaUpload` - Standalone Component

The main component that can be used independently or within forms.

### 2. `FormMediaUpload` - Form-Integrated Component

A wrapper around `MediaUpload` that integrates seamlessly with React Hook Form.

### 3. `useMediaUpload` - Custom Hook

A hook that handles all the upload logic, state management, and API calls.

## Quick Start

### Basic Usage (Standalone)

```tsx
import { MediaUpload } from "@/components/ui/media-upload";

export default function MyComponent() {
  return (
    <MediaUpload
      maxFiles={5}
      maxSizeMB={10}
      onUploadComplete={(files) => {
        console.log("Uploaded:", files);
      }}
    />
  );
}
```

### With React Hook Form

```tsx
import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import { FormMediaUpload } from "@/components/ui/form-media-upload";
import { Button } from "@/components/ui/button";

export default function MyForm() {
  const form = useForm({
    defaultValues: {
      media: [],
    },
  });

  const onSubmit = (data) => {
    console.log(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormMediaUpload
          name="media"
          label="Upload Files"
          description="Upload your media files"
          maxFiles={10}
          maxSizeMB={10}
          required
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
```

## Props

### MediaUpload Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `maxFiles` | `number` | `10` | Maximum number of files allowed |
| `maxSizeMB` | `number` | `10` | Maximum file size in MB |
| `acceptedFileTypes` | `object` | All types | Custom accepted file types |
| `showUploadButton` | `boolean` | `true` | Whether to show upload button |
| `uploadButtonText` | `string` | `"Upload Files"` | Custom upload button text |
| `onUploadComplete` | `function` | - | Callback when upload completes |
| `onUploadError` | `function` | - | Callback when upload errors |
| `autoUpload` | `boolean` | `false` | Auto upload on file drop |
| `apiEndpoint` | `string` | `"/media/upload/raphael/route"` | API endpoint for upload |
| `className` | `string` | - | Additional CSS classes |
| `disabled` | `boolean` | `false` | Disable the component |
| `compact` | `boolean` | `false` | Show compact list view |
| `label` | `string` | - | Label text |
| `helperText` | `string` | - | Helper text below label |

### FormMediaUpload Props

Same as `MediaUpload` plus:

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `name` | `string` | **Required** | Form field name |
| `description` | `string` | - | Field description |
| `required` | `boolean` | `false` | Mark field as required |

## Examples

### Images Only

```tsx
<MediaUpload
  maxFiles={5}
  maxSizeMB={5}
  acceptedFileTypes={{
    "image/*": [".png", ".jpg", ".jpeg", ".webp"],
  }}
  label="Upload Images"
/>
```

### Documents Only

```tsx
<MediaUpload
  maxFiles={3}
  maxSizeMB={15}
  acceptedFileTypes={{
    "application/pdf": [".pdf"],
    "application/msword": [".doc"],
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
  }}
  label="Upload Documents"
  compact={true}
/>
```

### Auto Upload

```tsx
<MediaUpload
  maxFiles={5}
  maxSizeMB={10}
  autoUpload={true}
  label="Auto Upload"
  helperText="Files will be uploaded automatically"
/>
```

### Compact View

```tsx
<MediaUpload
  maxFiles={10}
  maxSizeMB={10}
  compact={true}
  label="Upload Files"
/>
```

### Custom API Endpoint

```tsx
<MediaUpload
  maxFiles={10}
  maxSizeMB={20}
  apiEndpoint="/api/custom/upload"
  autoUpload={true}
/>
```

## API Integration

The component expects your API endpoint to:

1. Accept `multipart/form-data` POST requests
2. Handle files sent as `FormData` with the key `files`
3. Return a JSON response with uploaded file information

### Example API Endpoint (Next.js Route Handler)

```typescript
// app/api/media/upload/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const files = formData.getAll("files");

    // Process files (upload to cloud storage, save to database, etc.)
    const uploadedFiles = files.map((file) => ({
      id: generateId(),
      name: file.name,
      size: file.size,
      type: file.type,
      url: uploadToStorage(file),
    }));

    return NextResponse.json({
      success: true,
      files: uploadedFiles,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Upload failed" },
      { status: 500 }
    );
  }
}
```

## Customization

### Styling

The component uses your existing design system colors and styles:
- Primary color: `brand` (from your Tailwind config)
- Consistent with your form components
- Responsive and mobile-friendly

### File Type Icons

The component automatically shows appropriate icons for:
- 📷 Images - Blue icon
- 🎬 Videos - Purple icon
- 📄 Documents - Orange icon

### Status Indicators

- ⏳ Pending - Gray border
- 🔄 Uploading - Animated spinner with progress bar
- ✅ Success - Green checkmark
- ❌ Error - Red alert with retry button

## Advanced Usage

### Using the Hook Directly

```tsx
import { useMediaUpload } from "@/hooks/useMediaUpload";

export default function CustomUpload() {
  const {
    files,
    isUploading,
    getRootProps,
    getInputProps,
    isDragActive,
    uploadFiles,
    removeFile,
    clearFiles,
    retryUpload,
  } = useMediaUpload({
    maxFiles: 5,
    maxSize: 10 * 1024 * 1024,
    autoUpload: true,
  });

  // Build your custom UI using the hook's state and functions
  return (
    <div {...getRootProps()}>
      <input {...getInputProps()} />
      {/* Your custom UI */}
    </div>
  );
}
```

### Multiple Upload Fields

```tsx
<Form {...form}>
  <form onSubmit={form.handleSubmit(onSubmit)}>
    <FormMediaUpload
      name="productImages"
      label="Product Images"
      maxFiles={10}
      acceptedFileTypes={{ "image/*": [".png", ".jpg"] }}
    />
    
    <FormMediaUpload
      name="documents"
      label="Documents"
      maxFiles={5}
      acceptedFileTypes={{ "application/pdf": [".pdf"] }}
      compact={true}
    />
    
    <Button type="submit">Submit</Button>
  </form>
</Form>
```

## File Type Configuration

### Default Accepted Types

```typescript
{
  "image/*": [".png", ".jpg", ".jpeg", ".gif", ".webp", ".svg"],
  "video/*": [".mp4", ".mov", ".avi", ".webm"],
  "application/pdf": [".pdf"],
  "application/msword": [".doc"],
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
  "application/vnd.ms-excel": [".xls"],
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [".xlsx"],
  "text/*": [".txt", ".csv"],
}
```

### Custom File Types

```tsx
<MediaUpload
  acceptedFileTypes={{
    "image/png": [".png"],
    "image/jpeg": [".jpg", ".jpeg"],
  }}
/>
```

## Validation

The component automatically validates:

1. **File Count** - Ensures file count doesn't exceed `maxFiles`
2. **File Size** - Validates each file against `maxSizeMB`
3. **File Type** - Only accepts files matching `acceptedFileTypes`

Validation errors are shown as toast notifications.

## Accessibility

- Proper ARIA labels
- Keyboard navigation support
- Screen reader friendly
- Focus management

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Troubleshooting

### Files Not Uploading

1. Check that your API endpoint is correct
2. Verify the endpoint accepts `multipart/form-data`
3. Check network tab for error responses

### Preview Not Showing

1. Ensure files are valid images
2. Check browser console for errors
3. Verify file MIME types are correct

### Form Integration Issues

1. Ensure you're using `<Form>` from `@/components/ui/form`
2. Check that `name` prop matches your form schema
3. Verify React Hook Form is properly set up

## Support

For more examples, see `components/ui/media-upload-examples.tsx`

## License

Part of your CRM project.

