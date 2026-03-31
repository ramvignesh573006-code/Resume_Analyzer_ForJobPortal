# Design Quick Reference - Resume Analyzer

## 🎨 Color Palette

| Color | Role | CSS Value | Usage |
|-------|------|-----------|-------|
| **Primary Blue** | Main Actions | `oklch(0.52 0.29 264)` | Buttons, links, highlights |
| **Secondary Cyan** | Accents | `oklch(0.72 0.2 172)` | Secondary buttons, badges |
| **Accent Orange** | Highlights | `oklch(0.68 0.25 42)` | CTAs, special emphasis |
| **Dark Navy** | Sidebar | `oklch(0.15 0.02 280)` | Sidebar background |
| **Off-White** | Background | `oklch(0.99 0.001 280)` | Page background |
| **Charcoal** | Foreground | `oklch(0.15 0.02 280)` | Text color |

## 📝 Typography

| Element | Font | Size | Weight | Usage |
|---------|------|------|--------|-------|
| Hero Title | Geist | 6xl (48px) | 700 | Landing page hero |
| Section Title | Geist | 4xl (36px) | 700 | Major sections |
| Card Title | Geist | lg (18px) | 600 | Card headers |
| Body Text | Geist | base (16px) | 400 | Paragraph text |
| Small Text | Geist | sm (14px) | 400 | Secondary info |
| Label Text | Geist | xs (12px) | 500 | Form labels |

## 🎯 Component Quick Reference

### Button Styles

**Primary Button** (Gradient)
```jsx
<Button className="bg-gradient-to-r from-primary to-secondary hover:opacity-90">
  Button Text
</Button>
```

**Secondary Button** (Outline)
```jsx
<Button variant="outline" className="border-border text-foreground">
  Button Text
</Button>
```

**Destructive Button** (Red)
```jsx
<Button variant="destructive" className="bg-destructive hover:bg-destructive/90">
  Delete
</Button>
```

### Card with Icon

```jsx
<Card className="border border-border bg-card hover:shadow-xl transition-all">
  <div className="p-6">
    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center mb-4">
      <Icon className="text-white" size={24} />
    </div>
    <h3 className="text-lg font-bold text-foreground mb-2">Title</h3>
    <p className="text-muted-foreground text-sm">Description</p>
  </div>
</Card>
```

### Stats Card

```jsx
<Card className="border border-border bg-card/50 backdrop-blur">
  <div className="p-6 text-center">
    <div className="text-4xl font-bold text-primary mb-2">42</div>
    <p className="text-muted-foreground">Label</p>
  </div>
</Card>
```

### Table Row

```jsx
<tr className="hover:bg-muted/30 transition-colors">
  <td className="px-6 py-4 text-sm font-medium text-foreground">
    Data
  </td>
</tr>
```

### Progress Bar

```jsx
<div className="w-full bg-muted rounded-full h-2">
  <div
    className="h-2 rounded-full bg-green-500"
    style={{ width: `${percentage}%` }}
  />
</div>
```

## 🎪 Sidebar Navigation

```jsx
<Link href="/dashboard">
  <span className={`
    flex items-center gap-3 px-4 py-3 rounded-lg transition-all
    ${active
      ? 'bg-sidebar-primary text-sidebar-primary-foreground shadow-lg'
      : 'text-sidebar-foreground hover:bg-sidebar-accent'
    }
  `}>
    <Icon size={20} />
    <span className="font-medium">Label</span>
  </span>
</Link>
```

## 📊 Grid Layouts

### 3-Column Grid (Stats)
```jsx
<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
  {/* Cards */}
</div>
```

### 2-Column Grid (Features)
```jsx
<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
  {/* Cards */}
</div>
```

### 3-Column Grid (Features on Desktop)
```jsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {/* Cards */}
</div>
```

## 🎨 Gradient Backgrounds

**Primary to Secondary**
```jsx
className="bg-gradient-to-r from-primary to-secondary"
```

**Circular Gradient (Background)**
```jsx
<div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-primary/20 to-transparent rounded-full blur-3xl"></div>
```

**Glass Morphism (Navigation)**
```jsx
className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
```

## 📱 Responsive Utilities

| Breakpoint | Size | Sidebar | Layout |
|------------|------|---------|--------|
| Mobile | < 768px | Hidden (hamburger) | Single column, full-width |
| Tablet | 768px-1024px | Visible | 2-column grid |
| Desktop | > 1024px | Visible (256px) | 3-column grid |

## 🎯 Spacing Scale

| Class | Pixels | Usage |
|-------|--------|-------|
| `p-2` | 8px | Tight spacing |
| `p-4` | 16px | Standard padding |
| `p-6` | 24px | Card padding |
| `p-8` | 32px | Large sections |
| `gap-4` | 16px | Grid gaps |
| `gap-6` | 24px | Large grid gaps |

## 🎪 Icon Usage

```jsx
import { FileText, BarChart3, Zap, CheckCircle2, TrendingUp, Shield } from 'lucide-react';

// Usage in components
<Icon size={20} className="text-primary" />
<Icon size={24} className="text-white" />
```

### Common Icon Sizes
- **16px**: Small inline icons
- **20px**: Navigation icons
- **24px**: Card icons
- **32px**: Large headings

## 🎨 Color Coding Rules

| Purpose | Color | CSS Class |
|---------|-------|-----------|
| Main Action | Primary Blue | `text-primary`, `bg-gradient-to-r from-primary to-secondary` |
| Secondary | Cyan | `text-secondary`, `bg-secondary/10` |
| Success/Good | Green | `text-green-600`, `bg-green-500` |
| Warning | Yellow | `text-amber-600`, `bg-amber-500` |
| Error/Bad | Red | `text-destructive`, `bg-destructive` |
| Neutral/Muted | Gray | `text-muted-foreground`, `bg-muted` |

## 📊 Score Color Coding

```javascript
const getScoreColor = (score) => {
  if (score >= 80) return 'text-green-600';      // 🟢 Green
  if (score >= 60) return 'text-amber-600';      // 🟡 Yellow
  return 'text-red-600';                         // 🔴 Red
};
```

## 🎭 Hover Effects

**Card Hover**
```jsx
className="hover:shadow-xl transition-shadow"
```

**Icon Hover (Scale)**
```jsx
className="group-hover:scale-110 transition-transform"
```

**Text Hover (Underline)**
```jsx
className="hover:underline transition-all"
```

**Background Hover**
```jsx
className="hover:bg-muted transition-colors"
```

## 📐 Layout Patterns

### Main Content with Sidebar
```jsx
<div className="min-h-screen bg-background">
  <Sidebar />
  <main className="md:ml-64 p-4 md:p-8">
    {/* Content */}
  </main>
</div>
```

### Centered Content
```jsx
<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
  {/* Content */}
</div>
```

### Section with Title
```jsx
<section className="py-20 md:py-32 border-t border-border">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <h2 className="text-4xl font-bold text-foreground mb-4">Title</h2>
    <p className="text-lg text-muted-foreground mb-8">Subtitle</p>
    {/* Content */}
  </div>
</section>
```

## ✨ Transition Utilities

```css
transition-all         /* All properties */
transition-shadow      /* Shadow only */
transition-colors      /* Color only */
transition-transform   /* Transform only */
duration-200           /* 200ms */
duration-300           /* 300ms */
ease-out              /* Easing function */
```

## 🎯 Focus States

```jsx
className="focus:ring-2 focus:ring-primary focus:outline-none"
```

## 📱 Mobile-First Classes

```jsx
/* Mobile by default */
<div className="w-full">
  {/* Full width on mobile */}
</div>

/* Adjust for tablet+ */
<div className="md:w-1/2">
  {/* Half width on tablet and up */}
</div>

/* Adjust for desktop+ */
<div className="lg:w-1/3">
  {/* One-third width on desktop and up */}
</div>
```

## 🎪 Common Patterns

### Hero Section
```jsx
<section className="relative py-20 md:py-32 overflow-hidden">
  <div className="absolute inset-0 -z-10">
    {/* Background gradients */}
  </div>
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <h1 className="text-6xl font-bold text-foreground">Title</h1>
    <p className="text-xl text-muted-foreground">Subtitle</p>
  </div>
</section>
```

### Empty State
```jsx
<div className="p-12 text-center">
  <Icon size={32} className="mx-auto mb-4 text-muted-foreground" />
  <p className="text-lg font-semibold text-foreground mb-2">Title</p>
  <p className="text-muted-foreground mb-6">Description</p>
  <Button>Action</Button>
</div>
```

### Loading State
```jsx
<div className="min-h-screen flex items-center justify-center">
  <div className="text-center">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
    <p className="text-muted-foreground">Loading...</p>
  </div>
</div>
```

## 🔧 CSS Variables Reference

```css
/* Colors */
--primary: oklch(0.52 0.29 264);
--secondary: oklch(0.72 0.2 172);
--accent: oklch(0.68 0.25 42);
--background: oklch(0.99 0.001 280);
--foreground: oklch(0.15 0.02 280);
--card: oklch(1 0 0);
--muted: oklch(0.92 0.01 280);
--muted-foreground: oklch(0.4 0.02 280);
--border: oklch(0.88 0.01 280);

/* Sizing */
--radius: 0.75rem;

/* Dark Mode Overrides */
.dark {
  --primary: oklch(0.63 0.25 264);
  --background: oklch(0.12 0.02 280);
  /* ... etc */
}
```

## 🚀 Quick Copy-Paste Components

### Icon + Text Card
```jsx
<Card className="border border-border bg-card hover:shadow-xl transition-all">
  <div className="p-6">
    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center mb-4">
      <FileText className="text-white" size={24} />
    </div>
    <h3 className="text-lg font-bold text-foreground mb-2">Title</h3>
    <p className="text-muted-foreground text-sm">Description</p>
  </div>
</Card>
```

### Gradient Button
```jsx
<Button className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-primary-foreground gap-2">
  <Icon size={20} />
  Button Text
</Button>
```

### Table Header
```jsx
<thead className="border-b border-border bg-muted/50">
  <tr>
    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
      Column Header
    </th>
  </tr>
</thead>
```

---

**Pro Tip**: All these utilities are pre-configured in your Tailwind CSS setup. Just use the class names directly in your JSX!
