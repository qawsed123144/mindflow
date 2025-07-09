export type Language = 'zh' | 'en';

export interface Translations {
  // Auth
  signIn: string;
  signUp: string;
  signOut: string;
  createAccount: string;
  signInToAccount: string;
  alreadyHaveAccount: string;
  dontHaveAccount: string;
  name: string;
  email: string;
  emailAddress: string;
  password: string;
  yourName: string;
  yourEmail: string;
  yourPassword: string;
  processing: string;
  fillDemoCredentials: string;
  nameRequired: string;
  accountCreatedSuccess: string;
  failedCreateAccount: string;
  signedInSuccess: string;
  invalidCredentials: string;
  errorOccurred: string;

  // Dashboard
  collaborativeMindMapping: string;
  createCollaborateTrack: string;
  yourMindMaps: string;
  createNewMindMap: string;
  searchMindMaps: string;
  noMindMapsFound: string;
  tryDifferentSearch: string;
  createFirstMindMap: string;
  createMindMap: string;
  node: string;
  nodes: string;
  updated: string;
  noDescription: string;

  // Mind Map Editor
  untitledMindMap: string;
  mindMapTitle: string;
  addDescription: string;
  lastSaved: string;
  export: string;
  save: string;
  addNode: string;
  importFromImage: string;
  mindMapSavedSuccess: string;

  // Task Modal
  taskTitle: string;
  details: string;
  progress: string;
  history: string;
  description: string;
  describeTask: string;
  deadline: string;
  assignedTo: string;
  assigneePlaceholder: string;
  status: string;
  notStarted: string;
  inProgress: string;
  completed: string;
  addNote: string;
  addNoteUpdate: string;
  add: string;
  noHistoryYet: string;
  createdTask: string;
  changedStatusFrom: string;
  to: string;
  updatedProgressFrom: string;
  cancel: string;
  saveChanges: string;

  // Image Upload
  uploadImage: string;
  processingImage: string;
  dropImageHere: string;
  dragDropImage: string;
  supportsPngJpg: string;
  imageProcessedSuccess: string;
  failedProcessImage: string;

  // Theme
  toggleTheme: string;
  toggleLanguage: string;

  // Common
  loading: string;
}

export const translations: Record<Language, Translations> = {
  zh: {
    // Auth
    signIn: '登入',
    signUp: '註冊',
    signOut: '登出',
    createAccount: '建立帳戶',
    signInToAccount: '登入您的帳戶',
    alreadyHaveAccount: '已經有帳戶了？',
    dontHaveAccount: '還沒有帳戶？',
    name: '姓名',
    email: '電子郵件',
    emailAddress: '電子郵件地址',
    password: '密碼',
    yourName: '您的姓名',
    yourEmail: '您的電子郵件',
    yourPassword: '您的密碼',
    processing: '處理中...',
    fillDemoCredentials: 'Demo 帳號',
    nameRequired: '姓名為必填項目',
    accountCreatedSuccess: '帳戶建立成功',
    failedCreateAccount: '建立帳戶失敗',
    signedInSuccess: '登入成功',
    invalidCredentials: '帳密錯誤',
    errorOccurred: '發生錯誤，請重試',

    // Dashboard
    collaborativeMindMapping: '協作心智圖',
    createCollaborateTrack: '建立、協作和追蹤式心智圖',
    yourMindMaps: '您的心智圖',
    createNewMindMap: '建立新心智圖',
    searchMindMaps: '搜尋心智圖...',
    noMindMapsFound: '找不到心智圖',
    tryDifferentSearch: '嘗試不同的搜尋詞',
    createFirstMindMap: '建立您的第一個心智圖',
    createMindMap: '建立心智圖',
    node: '節點',
    nodes: '節點',
    updated: '更新於',
    noDescription: '無描述',

    // Mind Map Editor
    untitledMindMap: '未命名心智圖',
    mindMapTitle: '心智圖標題',
    addDescription: '新增描述',
    lastSaved: '最後儲存：',
    export: '匯出',
    save: '儲存',
    addNode: '新增節點',
    importFromImage: '從圖片匯入',
    mindMapSavedSuccess: '心智圖儲存成功',

    // Task Modal
    taskTitle: '任務標題',
    details: '詳細資訊',
    progress: '進度',
    history: '歷史記錄',
    description: '描述',
    describeTask: '描述此任務',
    deadline: '截止日期',
    assignedTo: '指派給',
    assigneePlaceholder: '輸入指派人員的姓名或電子郵件',
    status: '狀態',
    notStarted: '未開始',
    inProgress: '進行中',
    completed: '已完成',
    addNote: '新增備註',
    addNoteUpdate: '新增備註或更新',
    add: '新增',
    noHistoryYet: '尚無歷史記錄',
    createdTask: '建立了此任務',
    changedStatusFrom: '將狀態從',
    to: '變更為',
    updatedProgressFrom: '將進度從',
    cancel: '取消',
    saveChanges: '儲存變更',

    // Image Upload
    uploadImage: '上傳圖片',
    processingImage: '處理圖片中...',
    dropImageHere: '將圖片拖放到這裡...',
    dragDropImage: '拖放圖片到這裡，或點擊選擇',
    supportsPngJpg: '支援 PNG、JPG 格式，最大 10MB',
    imageProcessedSuccess: '圖片處理成功',
    failedProcessImage: '圖片處理失敗',

    // Theme
    toggleTheme: '切換主題',
    toggleLanguage: '切換語言',

    // Common
    loading: '載入中...',
  },
  en: {
    // Auth
    signIn: 'Sign In',
    signUp: 'Sign Up',
    signOut: 'Sign Out',
    createAccount: 'Create Account',
    signInToAccount: 'Sign in to your account',
    alreadyHaveAccount: 'Already have an account?',
    dontHaveAccount: "Don't have an account?",
    name: 'Name',
    email: 'Email',
    emailAddress: 'Email address',
    password: 'Password',
    yourName: 'Your name',
    yourEmail: 'Your email',
    yourPassword: 'Your password',
    processing: 'Processing...',
    fillDemoCredentials: 'Fill with demo credentials',
    nameRequired: 'Name is required',
    accountCreatedSuccess: 'Account created successfully',
    failedCreateAccount: 'Failed to create account',
    signedInSuccess: 'Signed in successfully',
    invalidCredentials: 'Invalid credentials',
    errorOccurred: 'An error occurred. Please try again.',

    // Dashboard
    collaborativeMindMapping: 'Collaborative Mind Mapping',
    createCollaborateTrack: 'Create, collaborate, and track progress on interactive mind maps',
    yourMindMaps: 'Your Mind Maps',
    createNewMindMap: 'Create New Mind Map',
    searchMindMaps: 'Search mind maps...',
    noMindMapsFound: 'No mind maps found',
    tryDifferentSearch: 'Try a different search term',
    createFirstMindMap: 'Create your first mind map to get started',
    createMindMap: 'Create Mind Map',
    node: 'node',
    nodes: 'nodes',
    updated: 'Updated',
    noDescription: 'No description',

    // Mind Map Editor
    untitledMindMap: 'Untitled Mind Map',
    mindMapTitle: 'Mind Map Title',
    addDescription: 'Add a description',
    lastSaved: 'Last saved:',
    export: 'Export',
    save: 'Save',
    addNode: 'Add Node',
    importFromImage: 'Import from Image',
    mindMapSavedSuccess: 'Mind map saved successfully',

    // Task Modal
    taskTitle: 'Task title',
    details: 'Details',
    progress: 'Progress',
    history: 'History',
    description: 'Description',
    describeTask: 'Describe this task',
    deadline: 'Deadline',
    assignedTo: 'Assigned To',
    assigneePlaceholder: 'Enter name or email of assignee',
    status: 'Status',
    notStarted: 'Not Started',
    inProgress: 'In Progress',
    completed: 'Completed',
    addNote: 'Add Note',
    addNoteUpdate: 'Add a note or update',
    add: 'Add',
    noHistoryYet: 'No history yet',
    createdTask: 'Created this task',
    changedStatusFrom: 'Changed status from',
    to: 'to',
    updatedProgressFrom: 'Updated progress from',
    cancel: 'Cancel',
    saveChanges: 'Save Changes',

    // Image Upload
    uploadImage: 'Upload Image',
    processingImage: 'Processing image...',
    dropImageHere: 'Drop the image here...',
    dragDropImage: 'Drag & drop an image here, or click to select',
    supportsPngJpg: 'Supports PNG, JPG up to 10MB',
    imageProcessedSuccess: 'Image processed successfully',
    failedProcessImage: 'Failed to process image',

    // Theme
    toggleTheme: 'Toggle theme',
    toggleLanguage: 'Toggle language',

    // Common
    loading: 'Loading...',
  },
};

export function getTranslation(language: Language): Translations {
  return translations[language];
}