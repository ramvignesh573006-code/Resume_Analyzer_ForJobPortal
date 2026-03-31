# Visual Guide - Resume Analyzer UI/UX

## Application Structure

```
Resume Analyzer
├── 🏠 Home Page (Landing)
│   ├── Navigation Bar (Sticky)
│   ├── Hero Section (with gradient background)
│   ├── Stats Cards (3 columns)
│   ├── Features Grid (6 cards)
│   ├── How It Works (3 steps)
│   ├── CTA Section
│   └── Footer
│
├── 🔐 Authentication
│   ├── Login Page
│   └── Signup Page
│
└── 📊 Dashboard (Sidebar + Main Content)
    ├── 📈 Main Dashboard
    │   ├── Sidebar Navigation
    │   ├── Stats Cards (3 cards)
    │   ├── Analysis History Table
    │   │   ├── File Name (with icon)
    │   │   ├── Target Role (badge)
    │   │   ├── Score (progress bar)
    │   │   ├── Upload Date
    │   │   └── Actions (View/Delete)
    │   └── Empty State
    │
    ├── 📤 Analyze Page
    │   ├── Sidebar Navigation
    │   ├── File Upload Form
    │   ├── Role Selection
    │   └── Submit Button
    │
    ├── 📊 Results Page
    │   ├── Sidebar Navigation
    │   ├── Overall Score (large display)
    │   ├── Analysis Cards (5 dimensions)
    │   ├── Pie Chart
    │   ├── Detailed Breakdown
    │   ├── Suggestions Section
    │   └── Action Buttons
    │
    ├── 🔄 Compare Page
    │   ├── Sidebar Navigation
    │   ├── Resume Selection
    │   ├── Side-by-Side Comparison
    │   ├── Difference Highlights
    │   └── Comparison Metrics
    │
    └── ⚙️ Settings Page
        ├── Sidebar Navigation
        ├── Profile Section
        ├── Security Settings
        ├── Notifications
        └── Danger Zone
```

## Color Scheme

### Light Mode (Default)
```
Primary:        Deep Blue      oklch(0.52 0.29 264)    🔵
Secondary:      Cyan/Turquoise oklch(0.72 0.2 172)     🔷
Accent:         Warm Orange    oklch(0.68 0.25 42)     🟠
Background:     Off-White      oklch(0.99 0.001 280)   ⚪
Foreground:     Dark Charcoal  oklch(0.15 0.02 280)    ⚫
```

### Dark Mode
```
Primary:        Light Blue     oklch(0.63 0.25 264)    🔵
Secondary:      Light Cyan     oklch(0.85 0.15 172)    🔷
Accent:         Light Orange   oklch(0.75 0.22 42)     🟠
Background:     Dark Navy      oklch(0.12 0.02 280)    🟫
Foreground:     Light Gray     oklch(0.95 0.01 280)    ⚪
```

## Component Examples

### Stats Card
```
┌─────────────────────────────────┐
│ ╭─────╮                         │
│ │ 📊  │  Total Resumes         │
│ ╰─────╯                         │
│                                 │
│         42 Resumes Uploaded     │
│         Overall performance     │
└─────────────────────────────────┘
```

### Data Table Row
```
┌────────────────────────────────────────────────────────────────┐
│ 📄 resume_v3.pdf │ Software Engineer │ 85/100 ████████░ │ Mar 24 │ [View] [Delete] │
└────────────────────────────────────────────────────────────────┘
```

### Feature Card
```
┌──────────────────────────────────┐
│        ╭──────╮                  │
│        │ 📊   │ (Gradient Icon)  │
│        ╰──────╯                  │
│                                  │
│    Smart Resume Analysis         │
│                                  │
│    Upload your resume in PDF     │
│    or DOC format and get         │
│    comprehensive analysis...     │
└──────────────────────────────────┘
```

### Score Progress Bar
```
Keyword Matching:     ████████░░  80%  🟢
Format & Structure:   ██████░░░░  60%  🟡
Skills Detection:     ████░░░░░░  40%  🔴
```

## Navigation Flow

### First-Time User Journey
```
Home Page
    ↓
    [Get Started Button]
    ↓
Signup Page
    ↓
    [Create Account]
    ↓
Dashboard
    ↓
    [New Analysis Button]
    ↓
Analyze Page
    ↓
    [Upload Resume + Select Role]
    ↓
    [Analyze Button]
    ↓
Results Page
    ↓
    [View Suggestions]
    ↓
Back to Dashboard
```

### Returning User Journey
```
Home Page or Direct Login
    ↓
    [Login Button]
    ↓
Login Page
    ↓
    [Enter Credentials]
    ↓
Dashboard
    ↓
    [View Analysis History]
    ↓
    [Analyze New Resume or View Results]
```

## Typography Hierarchy

### Heading Sizes
```
Hero Title (6xl):       "Land Your Dream Job with AI-Powered Resume Analysis"
Section Title (4xl):    "Powerful Features"
Card Title (lg):        "Smart Resume Analysis"
Body Text:              Regular sized paragraphs
Small Text (xs):        "Upload Date: Mar 24, 2024"
```

## Responsive Design Breakpoints

### Mobile (< 768px)
```
┌─────────────────────────┐
│ ☰ Resume Analyzer       │
├─────────────────────────┤
│                         │
│  Full-width content     │
│  Single column layout   │
│  Hamburger sidebar      │
│                         │
│ [Full-width buttons]    │
│                         │
└─────────────────────────┘
```

### Tablet (768px - 1024px)
```
┌────────────┬───────────────────────┐
│ Sidebar    │                       │
│ Visible    │  Main Content         │
│            │  2-column layout      │
│            │                       │
│ • Dashboard│  Stats (2 cards)      │
│ • Analyze  │                       │
│ • Compare  │  Table (scrollable)   │
│ • Settings │                       │
│            │                       │
│ [Logout]   │                       │
└────────────┴───────────────────────┘
```

### Desktop (> 1024px)
```
┌────────────┬──────────────────────────────────────┐
│ Sidebar    │                                      │
│ 256px      │  Main Content (Max-width 80rem)     │
│            │                                      │
│ • Dashboard│  Stats Grid (3 columns)             │
│ • Analyze  │  ┌──────┬──────┬──────┐            │
│ • Compare  │  │      │      │      │            │
│ • Settings │  └──────┴──────┴──────┘            │
│            │                                      │
│            │  Data Table (Full-width)            │
│            │                                      │
│ [Logout]   │                                      │
└────────────┴──────────────────────────────────────┘
```

## Interactive States

### Button States
```
Default:    [Button Text]           (gradient bg)
Hover:      [Button Text]           (opacity: 0.9)
Active:     [Button Text]           (transform: scale)
Disabled:   [Button Text]           (opacity: 0.5)
```

### Card States
```
Default:    ┌─────────────┐
            │  Card       │
            └─────────────┘

Hover:      ┌─────────────┐
            │  Card       │  (shadow: xl)
            └─────────────┘

Active:     ┌─────────────┐
            │  Card       │  (border: primary)
            └─────────────┘
```

### Input States
```
Empty:      ┌─────────────┐
            │             │  (border: gray)
            └─────────────┘

Focused:    ┌─────────────┐
            │ Cursor here │  (border: primary)
            └─────────────┘

Error:      ┌─────────────┐
            │ Error text  │  (border: red)
            └─────────────┘
```

## Sidebar Navigation

```
┌──────────────────────┐
│ RA                   │  (Logo)
│ Resume Analyzer      │  (Brand)
├──────────────────────┤
│                      │
│ 📊 Dashboard         │  (Active)
│ 📄 Analyze Resume    │
│ ⚡ Compare Resumes   │
│ ⚙️ Settings          │
│                      │
├──────────────────────┤
│ [🚪 Logout]          │
└──────────────────────┘
```

## Data Visualization

### Pie Chart (5 Dimensions)
```
        Keyword: 25%
    ╱─────────────────╲
   │   Keywords: 25%  │
   │  Format: 15%     │
   │  Structure: 20%  │  → Each segment
   │  Skills: 20%     │     color-coded
   │  ATS: 20%        │
    ╲─────────────────╱
```

### Score Gauge
```
Overall Score: 85/100

     🟢 Excellent
     ┌─────────┐
  90-│█████████│ 100
  80-│████████░│ Green
  70-│████░░░░│ Yellow
  60-│░░░░░░░░│ Red
     └─────────┘
```

## Empty States

### No Resumes
```
┌───────────────────────────────┐
│                               │
│          🎯 (Large Icon)      │
│                               │
│      No resumes yet           │
│                               │
│   Upload your first resume    │
│   to get comprehensive        │
│   analysis including...       │
│                               │
│   [Upload & Analyze]          │
│                               │
└───────────────────────────────┘
```

## Loading States

```
Spinner:         ⟳ Loading analysis...
              (Animated rotation)

Progress Bar:    ████████░░ 80% Complete
              (Animated fill)

Skeleton:        ████████ ████████ 
                 ████████ ████████
```

## Success/Error Messages

### Success
```
✅ Resume analyzed successfully!
   Redirecting to results...
```

### Error
```
❌ Failed to upload file
   Please ensure file is PDF or DOC format
   [Try Again]
```

### Warning
```
⚠️  Resume quality could be improved
   Consider updating formatting
```

## Mobile Navigation

### Hamburger Menu
```
Before:        After:
☰              ╭──────────╮
               │ • Home   │
               │ • About  │
               │ • Login  │
               ╰──────────╯
```

### Bottom Sheet
```
┌─────────────────────┐
│ ═════════════════   │  (Drag handle)
│                     │
│ ⚙️ Settings        │
│ 🚪 Logout          │
│                     │
└─────────────────────┘
```

## Accessibility Features

- ✅ High contrast ratios (WCAG AA compliance)
- ✅ Keyboard navigation support
- ✅ Screen reader friendly
- ✅ Focus indicators visible
- ✅ Proper heading hierarchy
- ✅ ARIA labels on icons
- ✅ Alternative text for images
- ✅ Touch-friendly targets (48px min)

## Animation & Transitions

- All transitions: 200-300ms ease-out
- Hover effects: Smooth opacity/transform
- Page transitions: Fade-in effect
- Loading spinners: Smooth rotation
- Button clicks: Subtle scale effect
- Sidebar open: Slide-in animation
