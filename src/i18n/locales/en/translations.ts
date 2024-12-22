export default {
  auth: {
    signIn: "Sign In",
    signInTitle: "Sign into your account",
    signUpTitle: "Create a new account",
    signOut: "Sign Out",
    email: "Email",
    password: "Password",
    welcome: "Welcome to MEMOrable!",
    forgotPassword: "Forgot Password?",
    createAccount: "Create Account",
  },

  
  common: {
    cancel: "Cancel",
    create: "Create",
    save: "Save",
    delete: "Delete",
    edit: "Edit",
    loading: "Loading...",
    search: "Search...",
    welcome: "Welcome back to your memories",
    close: "Close",

    error: "An error occurred",
    saveChanges: 'Save Changes'
  },
  notes: {
    title: "My Notes",
    create: "Create Note",
    placeholder: "Write your note here...",
    noNotes: "No notes yet",
    edit: "Edit Note",
    titleLabel: "Title",
    contentLabel: "Content",
    recent: "Recent Notes",
    older: "Older Notes",
    search: "Search notes...",
    imageUpload: "Upload Image",
    pdfPreview: "PDF Preview",
    downloadPdf: "Download PDF",
    generating: "Generating PDF...",
    created: "Created",
    imagePreview: 'Image Preview',
    dragDropImage: 'Drag and drop an image here, or click to select',
    svgError: 'SVG files are not allowed.',
    currentImage: 'Current Image',
     svgNotAllowed: 'Upload an image (JPG, PNG, ...). SVG files are not supported',
    imageUploadInfo: 'Upload an image (JPG, PNG)'
  },

  theme: {
    light: "Light",
    dark: "Dark",
  },
  
    "statistics": {
      "title": "Note Statistics",
      "totalNotes": "Total Notes",
      "notesWithImages": "Notes with Images",
      "totalWords": "Total Words",
      "averageNoteLength": "Average Note Length",
      "mostUsedWords": "Most Used Words",
      "characters": "characters",
      "errorLoading": "Error loading statistics"
    }
  
} as const;
