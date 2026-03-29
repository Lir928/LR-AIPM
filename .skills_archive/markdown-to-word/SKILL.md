---
name: markdown-to-word
description: "Convert Markdown files to Word (.docx) documents with formatting preservation. Use when the user needs to convert .md files to Word format, export markdown documentation to .docx, or batch convert multiple markdown files. Supports templates for custom styling."
---

# Markdown to Word Converter

Convert Markdown files to Word documents using pandoc for robust formatting preservation.

## Quick Start

```bash
# Convert single file
python scripts/md_to_docx.py input.md

# Convert with custom output name
python scripts/md_to_docx.py input.md output.docx

# Convert to specific directory
python scripts/md_to_docx.py input.md --output-dir ./documents
```

## Features

- **Full Markdown support**: Headers, lists, tables, code blocks, links, images
- **Template support**: Apply custom Word templates for consistent styling
- **Batch conversion**: Convert multiple files at once
- **Encoding support**: Handles UTF-8 and various character encodings

## Usage

### Single File Conversion

```bash
# Basic conversion (creates input.docx)
python scripts/md_to_docx.py report.md

# Specify output filename
python scripts/md_to_docx.py report.md final_report.docx
```

### Batch Conversion

```bash
# Convert multiple files
python scripts/md_to_docx.py chapter1.md chapter2.md chapter3.md

# Convert all files to a directory
python scripts/md_to_docx.py *.md --output-dir ./word_docs
```

### Using Templates

```bash
# Apply a Word template for styling
python scripts/md_to_docx.py report.md --template company_template.docx
```

Templates preserve custom styles, headers, footers, and document settings.

## Command Options

| Option | Description |
|--------|-------------|
| `input` | One or more Markdown files to convert |
| `output` | Output filename (single file only) |
| `--output-dir, -d` | Directory for output files |
| `--template, -t` | Word template file for styling |

## Requirements

- **pandoc**: Required for conversion
  - Windows: `choco install pandoc` or `winget install pandoc`
  - macOS: `brew install pandoc`
  - Linux: `sudo apt-get install pandoc`

## Supported Markdown Elements

The conversion preserves these Markdown elements in Word:

- Headings (H1-H6) → Word heading styles
- Paragraphs and line breaks
- Bold, italic, and strikethrough
- Ordered and unordered lists
- Nested lists
- Tables with alignment
- Code blocks and inline code
- Links and images
- Blockquotes
- Horizontal rules

## Example

Converting this Markdown:

```markdown
# Project Report

## Overview

This is the **overview** section with *emphasis*.

### Features

- Feature one
- Feature two
  - Sub-feature

| Name | Value |
|------|-------|
| A    | 100   |
| B    | 200   |

\`\`\`python
def hello():
    print("Hello, World!")
\`\`\`
```

Produces a Word document with proper heading hierarchy, formatted text, lists, tables, and code blocks.