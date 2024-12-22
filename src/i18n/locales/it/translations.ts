export default {
  auth: {
    signIn: "Accedi",
    signOut: "Esci",
    email: "Email",
    password: "Password",
    welcome: "Benvenuto in MEMOrable!",
    forgotPassword: "Password dimenticata?",
    createAccount: "Crea Account",
    signUpTitle: "Crea un nuovo account",
  },

  common: {
    cancel: "Annulla",
    create: "Crea",
    save: "Salva",
    delete: "Elimina",
    edit: "Modifica",
    loading: "Caricamento...",
    search: "Cerca...",
    welcome: "Bentornato tra i tuoi ricordi",
    close: "Chiudi",
    error: "Si è verificato un errore",
     saveChanges: 'Salva Modifiche'
  },
  notes: {
    title: "Le Mie Note",
    create: "Crea Nota",
    edit: "Modifica Nota",
    delete: "Elimina Nota",
    titleLabel: "Titolo",
    contentLabel: "Contenuto",
    placeholder: "Scrivi qui la tua nota...",
    noNotes: "Nessuna nota",
    recent: "Note Recenti",
    older: "Note Precedenti",
    search: "Cerca note...",
    imageUpload: "Carica Immagine",
    pdfPreview: "Anteprima PDF",
    downloadPdf: "Scarica PDF",
    generating: "Generazione PDF...",
    created: "Creato il",
    imagePreview: 'Anteprima Immagine',
    dragDropImage: 'Trascina e rilascia un\'immagine qui, o clicca per selezionare',
    svgError: 'I file SVG non sono consentiti.',
    currentImage: 'Immagine Corrente',
     svgNotAllowed: 'I file SVG non sono supportati',
    imageUploadInfo: 'Carica un\'immagine (JPG, PNG)'
  },

  theme: {
    light: "Chiaro",
    dark: "Scuro",
  },
  "statistics": {
    "title": "Statistiche delle Note",
    "totalNotes": "Note Totali",
    "notesWithImages": "Note con Immagini",
    "totalWords": "Parole Totali",
    "averageNoteLength": "Lunghezza Media della Nota",
    "mostUsedWords": "Parole Più Usate",
    "characters": "caratteri",
    "errorLoading": "Errore durante il caricamento delle statistiche"
  }
} as const;
