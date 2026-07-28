'use client';

import React, { useCallback, useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import { BubbleMenu } from '@tiptap/react/menus';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import Placeholder from '@tiptap/extension-placeholder';
import { TextStyle } from '@tiptap/extension-text-style';
import { Color } from '@tiptap/extension-color';
import Highlight from '@tiptap/extension-highlight';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import { Table } from '@tiptap/extension-table';
import { TableRow } from '@tiptap/extension-table-row';
import { TableHeader } from '@tiptap/extension-table-header';
import { TableCell } from '@tiptap/extension-table-cell';
import { common, createLowlight } from 'lowlight';

const lowlight = createLowlight(common);

interface ContentEditorProps {
  content: string;
  setContent: (val: string) => void;
  placeholder?: string;
  isBlog?: boolean;
}

export default function ContentEditor({ content, setContent, placeholder, isBlog = false }: ContentEditorProps) {

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        codeBlock: false,
        heading: { levels: [1, 2, 3, 4, 5, 6] },
      }),
      Underline,
      TextStyle,
      Color,
      Highlight.configure({ multicolor: true }),
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: { class: 'editor-link' },
      }),
      Image.configure({ inline: true }),
      Placeholder.configure({
        placeholder: placeholder || 'Start writing your content here...',
      }),
      CodeBlockLowlight.configure({ lowlight }),
      Table.configure({ resizable: false, HTMLAttributes: { class: 'editor-table' } }),
      TableRow,
      TableHeader,
      TableCell,
    ],
    content: (content || '')
      .replace(/<p[^>]*>(?:\s|&nbsp;|<br>|<br\s*\/>)*<\/p>/gi, '')
      .replace(/<div[^>]*>(?:\s|&nbsp;|<br>|<br\s*\/>)*<\/div>/gi, '')
      .replace(/<\/ul>\s*<ul[^>]*>/gi, '')
      .replace(/<\/ol>\s*<ol[^>]*>/gi, ''),
    onUpdate: ({ editor }) => {
      setContent(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'tiptap-editor-canvas',
      },
      transformPastedHTML(html) {
        if (!html || typeof DOMParser === 'undefined') return html;

        try {
          const parser = new DOMParser();
          const doc = parser.parseFromString(html, 'text/html');

          // Sticky Notes / Notepad fix: split brs (but NOT inside list items!)
          const brs = Array.from(doc.querySelectorAll('br'));
          brs.forEach(br => {
            // Skip brs inside list items — splitting them breaks bullet points
            if (br.closest('li, ul, ol')) return;
            
            const parent = br.closest('p, div');
            if (parent && parent.parentNode) {
              const newEl = doc.createElement(parent.nodeName);
              let next = br.nextSibling;
              while (next) {
                const sibling = next;
                next = sibling.nextSibling;
                newEl.appendChild(sibling);
              }
              parent.parentNode.insertBefore(newEl, parent.nextSibling);
              br.remove();
            }
          });

          // 1. Convert Word heading classes (MsoHeading1, etc.) to standard HTML headings
          const msWordHeadings = doc.querySelectorAll('p[class*="MsoHeading"], p[class*="heading"], p[class*="Heading"]');
          msWordHeadings.forEach(p => {
            const className = p.className || '';
            let level = 2; // default
            const match = className.match(/heading\s*(\d)/i) || className.match(/MsoHeading\s*(\d)/i);
            if (match) {
              level = parseInt(match[1]);
              if (level < 2) level = 2; // minimum H2 for Table of Contents
              if (level > 4) level = 4;
            }
            const heading = doc.createElement(`h${level}`);
            heading.innerHTML = p.innerHTML;
            p.replaceWith(heading);
          });

          // 0. Detect plain-text lists introducing with a colon (e.g. "helps businesses:")
          const initialParagraphs = Array.from(doc.querySelectorAll('p'));
          initialParagraphs.forEach(p => {
            if (!p.parentNode) return;
            const text = p.textContent?.trim() || '';
            if (text.endsWith(':')) {
              const listItems: HTMLElement[] = [];
              let next = p.nextElementSibling;
              while (next && next.tagName === 'P') {
                const nextText = next.textContent?.trim() || '';
                if (nextText.length > 0 && nextText.length < 65 && !/[.:?]$/.test(nextText)) {
                  listItems.push(next as HTMLElement);
                  next = next.nextElementSibling;
                } else {
                  break;
                }
              }
              if (listItems.length > 0) {
                const ul = doc.createElement('ul');
                p.parentNode.insertBefore(ul, p.nextSibling);
                listItems.forEach(item => {
                  const li = doc.createElement('li');
                  li.innerHTML = item.innerHTML;
                  li.setAttribute('data-list-type', 'bullet');
                  ul.appendChild(li);
                  item.remove();
                });
              }
            }
          });

          // 2. Identify pseudo-headings (short, bold, or large paragraphs) and convert them to H2/H3/H4
          const paragraphs = doc.querySelectorAll('p, li');
          paragraphs.forEach(el => {
            if (!el.parentNode) return;
            // Skip li elements that are already inside a proper list — don't convert them to headings!
            if (el.nodeName === 'LI' && el.closest('ul, ol')) return;
            const text = el.textContent?.trim() || '';
            
            // Function to replace element with heading and handle unwrapping if it's an li
            const replaceWithHeading = (level: number) => {
              const heading = doc.createElement(`h${level}`);
              heading.innerHTML = el.innerHTML;
              const innerStrong = heading.querySelector('strong, b');
              if (innerStrong && innerStrong.textContent?.trim() === heading.textContent?.trim()) {
                heading.innerHTML = innerStrong.innerHTML;
              }
              
              if (el.nodeName === 'LI' && el.parentNode && (el.parentNode.nodeName === 'UL' || el.parentNode.nodeName === 'OL')) {
                const listNode = el.parentNode as HTMLElement;
                listNode.parentNode?.insertBefore(heading, listNode);
                el.remove();
                if (listNode.children.length === 0) listNode.remove();
              } else {
                el.replaceWith(heading);
              }
            };

            if (text.length > 0 && text.length < 120) {
              // 2a. Check if it starts with a number point (e.g. "1. ", "a) ", "I. ") or is an LI that's bold
              const isNumberedHeading = /^\s*(?:\d+|[a-zA-Z]|[ivxlcdmIVXLCDM]+)[\.\)]\s+\w+/i.test(text);
              const isBold = el.querySelector('strong') !== null || el.querySelector('b') !== null;
              
              if ((isNumberedHeading || (el.nodeName === 'LI' && isBold)) && text.length < 100) {
                replaceWithHeading(3); // H3 for points
                return;
              }

              // 2b. Check if it looks like a plain-text heading (no period at end, capitalized, short)
              const firstChar = text.charAt(0);
              const isCapitalized = firstChar === firstChar.toUpperCase() && /[A-Z0-9]/.test(firstChar);
              const endsWithSentencePunctuation = /[.,;:]$/.test(text);
              if (isCapitalized && !endsWithSentencePunctuation && text.length > 8 && text.length < 85) {
                let level = 2; // Default to H2
                const hasH2Keywords = /\b(why|key|latest|questions?|benefits?|prefer|final|thoughts?)\b/i.test(text);
                const hasH3Keywords = /\b(do|can|are|is|better|time|scalability|improved|enhanced|faster|interactive)\b/i.test(text);
                const hasQuestionMark = text.includes('?');
                
                if (hasQuestionMark || (text.length < 40 && !hasH2Keywords) || hasH3Keywords) {
                  level = 3; // H3
                }
                
                replaceWithHeading(level);
                return;
              }

              // 2c. Existing check for bold / style bold paragraphs
              const isStrongCheck = el.querySelector('strong') !== null || el.querySelector('b') !== null;
              let isEntirelyBold = false;

              if (isStrongCheck) {
                const clone = el.cloneNode(true) as HTMLElement;
                const strongs = clone.querySelectorAll('strong, b');
                let boldTextLength = 0;
                strongs.forEach(s => {
                  boldTextLength += s.textContent?.length || 0;
                });
                if (boldTextLength >= text.length * 0.8) {
                  isEntirelyBold = true;
                }
              }

              const style = el.getAttribute('style') || '';
              const isStyleBold = /\bfont-weight\s*:\s*(bold|700|800|900)\b/i.test(style);
              
              let fontSizeVal = 0;
              const sizeMatch = style.match(/\bfont-size\s*:\s*(\d+(\.\d+)?)(px|pt|em|rem)\b/i);
              if (sizeMatch) {
                fontSizeVal = parseFloat(sizeMatch[1]);
                const unit = sizeMatch[3];
                if (unit === 'px' && fontSizeVal >= 18) {
                  isEntirelyBold = true;
                } else if (unit === 'pt' && fontSizeVal >= 14) {
                  isEntirelyBold = true;
                }
              }

              if (isEntirelyBold || isStyleBold || fontSizeVal >= 18) {
                const hasH2Keywords = /\b(why|key|latest|questions?|benefits?|prefer|final|thoughts?)\b/i.test(text);
                const hasQuestionMark = text.includes('?');
                
                if (hasQuestionMark || (text.length < 40 && !hasH2Keywords)) {
                  replaceWithHeading(3);
                  return;
                }
                if (isEntirelyBold) {
                  replaceWithHeading(3);
                  return;
                }
              }

              // 2d. Check font-size inline styles
              const spans = el.querySelectorAll('span');
              let isLargeText = false;
              spans.forEach(span => {
                const fontSize = span.style.fontSize;
                if (fontSize && (fontSize.includes('18px') || fontSize.includes('20px') || fontSize.includes('24px') || fontSize.includes('14pt') || fontSize.includes('16pt') || fontSize.includes('18pt') || fontSize.includes('x-large') || fontSize.includes('large'))) {
                  isLargeText = true;
                }
              });

              if (isLargeText) {
                replaceWithHeading(2);
                return;
              }
            }
          });

          // 3. Convert ANY block that looks like a list (from anywhere) into a real HTML list item
          const blocks = doc.querySelectorAll('p, div, li');
          blocks.forEach(p => {
            // Skip if it's already inside a list to prevent double wrapping
            if (p.nodeName !== 'LI' && p.closest('ul, ol, li')) return;
            // Skip if it contains other block elements (it's a container, not a leaf text block)
            if (p.nodeName === 'DIV' && p.querySelector('p, div, ul, ol')) return;

            const html = p.innerHTML;
            
            // For standard bullet characters, space after bullet is optional (e.g. "•Point")
            const bulletMatch1 = html.match(/^\s*(?:[•·o§■*]|&middot;)\s*([\s\S]+)$/i);
            // For dashes, space is REQUIRED to prevent negative numbers/hyphens (e.g. "-100")
            const bulletMatch2 = html.match(/^\s*-\s+([\s\S]+)$/i);
            // For spans containing bullets
            const bulletMatch3 = html.match(/^\s*<span[^>]*>(?:[•·o§■*\-]|&middot;)[.]?<\/span>\s*([\s\S]+)$/i);
            
            const bulletMatch = bulletMatch1 || bulletMatch2 || bulletMatch3;
                                
            const numberMatch1 = html.match(/^\s*(\d+|[a-z]|[A-Z])[\.)]\s+([\s\S]+)$/);
            const numberMatch2 = html.match(/^\s*<span[^>]*>(\d+|[a-z]|[A-Z])[\.)]<\/span>\s*([\s\S]+)$/);
            const numberMatch = numberMatch1 || numberMatch2;

            if (bulletMatch) {
              const li = doc.createElement('li');
              li.setAttribute('data-list-type', 'bullet');
              // Strip leading dashes/bullets from text Content
              li.innerHTML = bulletMatch[1];
              p.replaceWith(li);
            } else if (numberMatch) {
              const li = doc.createElement('li');
              li.setAttribute('data-list-type', 'ordered');
              li.innerHTML = numberMatch[2];
              p.replaceWith(li);
            }
          });

          // Group sequential <li> items into <ul> or <ol> wrapper tags
          const listItems = doc.querySelectorAll('li[data-list-type]');
          let currentListContainer: HTMLElement | null = null;
          let currentListType: string | null = null;

          listItems.forEach(li => {
            const listType = li.getAttribute('data-list-type');
            li.removeAttribute('data-list-type');

            if (currentListContainer && currentListType === listType) {
              currentListContainer.appendChild(li);
            } else {
              const listTag = listType === 'ordered' ? 'ol' : 'ul';
              const newListElement = doc.createElement(listTag);
              li.parentNode?.insertBefore(newListElement, li);
              newListElement.appendChild(li);
              currentListContainer = newListElement;
              currentListType = listType;
            }
          });

          // 4. Heuristic: Auto-detect "Implicit Lists" from PDFs where bullet points are completely lost.
          // If we see 3+ consecutive short lines without ending punctuation, we assume it's a bullet list.
          let consecutiveShorts: HTMLElement[] = [];
          
          const processConsecutiveShorts = () => {
            if (consecutiveShorts.length >= 3) {
              const ul = doc.createElement('ul');
              consecutiveShorts[0].parentNode?.insertBefore(ul, consecutiveShorts[0]);
              consecutiveShorts.forEach(p => {
                const li = doc.createElement('li');
                // Strip leading dashes/bullets to prevent double bullets
                const strippedHtml = p.innerHTML.replace(/^\s*<span[^>]*>\s*(?:[•·o§■*]|-|\d+[\.)]|[a-zA-Z][\.)])\s*<\/span>\s*/i, '')
                                                .replace(/^\s*(?:[•·o§■*]|-|\d+[\.)]|[a-zA-Z][\.)])\s*/, '');
                li.innerHTML = strippedHtml;
                ul.appendChild(li);
                p.remove();
              });
              
              // Strip all inline styles from spans inside the UL so they inherit our editor CSS
              ul.querySelectorAll('span').forEach(span => {
                span.removeAttribute('style');
                if (!span.attributes.length) {
                  span.replaceWith(...Array.from(span.childNodes));
                }
              });
            }
            consecutiveShorts = [];
          };

          const allBlocks = Array.from(doc.querySelectorAll('p, div'));
          allBlocks.forEach(p => {
            if (p.nodeName === 'DIV' && p.querySelector('p, div, ul, ol')) {
              processConsecutiveShorts();
              return;
            }
            if (p.closest('ul, ol, li')) {
              processConsecutiveShorts();
              return;
            }

            const text = p.textContent?.trim() || '';
            
            // Ignore completely empty lines, do not break the streak!
            if (text.length === 0) {
              return;
            }

            const isShort = text.length > 0 && text.length < 120;
            const hasNoEndingPunctuation = !/[.:!?;,]$/.test(text);
            
            const isEntirelyBold = (() => {
              const strongs = p.querySelectorAll('strong, b');
              let boldLength = 0;
              strongs.forEach(s => boldLength += s.textContent?.length || 0);
              return boldLength > 0 && boldLength >= text.length * 0.8;
            })();

            if (isShort && hasNoEndingPunctuation && !isEntirelyBold) {
              consecutiveShorts.push(p as HTMLElement);
            } else {
              processConsecutiveShorts();
            }
          });
          processConsecutiveShorts();

          // Clean up empty paragraphs to prevent massive gaps between pasted list items
          doc.querySelectorAll('p').forEach(p => {
            const html = p.innerHTML.trim().toLowerCase();
            if (html === '' || html === '<br>' || html === '&nbsp;' || html === '<span>&nbsp;</span>' || html === '<span><br></span>') {
              p.remove();
            }
          });

          // Final cleanup: strip inline styles globally from list items
          doc.querySelectorAll('li span').forEach(span => {
            span.removeAttribute('style');
            if (!span.attributes.length) {
              span.replaceWith(...Array.from(span.childNodes));
            }
          });

          // Fix: Unwrap <p> tags inside <li> — TipTap and Google Docs wrap li text in <p> 
          // which causes broken rendering (each <p> gets its own line break)
          doc.querySelectorAll('li > p').forEach(p => {
            const li = p.parentElement;
            if (!li) return;
            // If this is the only child, just unwrap the p
            if (li.children.length === 1) {
              li.innerHTML = p.innerHTML;
            } else {
              // Multiple p inside one li — join them with a space
              const texts = Array.from(li.querySelectorAll('p')).map(pp => pp.innerHTML);
              li.innerHTML = texts.join(' ');
            }
          });

          // Fix: Merge adjacent <ul><ul> or <ol><ol> into a single list
          // (happens when content is pasted from multiple sources)
          doc.querySelectorAll('ul + ul, ol + ol').forEach(secondList => {
            const firstList = secondList.previousElementSibling;
            if (firstList && firstList.tagName === secondList.tagName) {
              while (secondList.firstChild) {
                firstList.appendChild(secondList.firstChild);
              }
              secondList.remove();
            }
          });

          return doc.body.innerHTML;
        } catch (e) {
          console.error('Word paste transform error:', e);
          return html;
        }
      }
    },
  });

  // Sync external content prop changes back to Tiptap editor when not focused
  useEffect(() => {
    if (!editor || content === undefined) return;
    if (!editor.isFocused && editor.getHTML() !== content) {
      editor.commands.setContent(content, { emitUpdate: false });
    }
  }, [content, editor]);

  // Intercept pure plain-text pastes (like from Sticky Notes) since they bypass transformPastedHTML
  useEffect(() => {
    if (!editor) return;

    const handlePaste = (e: ClipboardEvent) => {
      const text = e.clipboardData?.getData('text/plain');
      const html = e.clipboardData?.getData('text/html');

      // Only trigger if it's pure plain text without HTML (e.g., Notepad)
      if (!html && text) {
        e.preventDefault();
        e.stopPropagation();

        // Convert plain text (including ChatGPT/Gemini markdown) into HTML
        const lines = text.split(/\r?\n/);
        let basicHtml = '';
        let inList: 'ul' | 'ol' | null = null;

        const flushList = () => {
          if (inList) { basicHtml += `</${inList}>`; inList = null; }
        };

        lines.forEach(line => {
          const trimmed = line.trim();
          if (!trimmed) { flushList(); return; }

          // ChatGPT/Gemini markdown headings: ## Heading
          const headingMatch = trimmed.match(/^(#{1,4})\s+(.+)$/);
          if (headingMatch) {
            flushList();
            const level = Math.max(2, headingMatch[1].length); // min H2
            basicHtml += `<h${level}>${headingMatch[2]}</h${level}>`;
            return;
          }

          // Bullet points: - item, * item, • item
          const bulletMatch = trimmed.match(/^[-*•]\s+(.+)$/);
          if (bulletMatch) {
            if (inList !== 'ul') { flushList(); basicHtml += '<ul>'; inList = 'ul'; }
            basicHtml += `<li>${bulletMatch[1]}</li>`;
            return;
          }

          // Numbered list: 1. item, 2) item
          const numMatch = trimmed.match(/^\d+[.)]\s+(.+)$/);
          if (numMatch) {
            if (inList !== 'ol') { flushList(); basicHtml += '<ol>'; inList = 'ol'; }
            basicHtml += `<li>${numMatch[1]}</li>`;
            return;
          }

          // Regular paragraph
          flushList();
          basicHtml += `<p>${trimmed}</p>`;
        });
        flushList();

        // Convert **bold** and *italic* markdown syntax to HTML tags
        basicHtml = basicHtml
          .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
          .replace(/\*(.+?)\*/g, '<em>$1</em>')
          .replace(/`(.+?)`/g, '<code>$1</code>');

        // Route it through our universal HTML transformer to guarantee 100% consistency
        // with rich text pastes (same line-by-line bullet detection, styling, etc.)
        const transformer = editor.options.editorProps.transformPastedHTML;
        const finalHtml = transformer ? transformer(basicHtml, editor.view) : basicHtml;
        
        setTimeout(() => editor.commands.insertContent(finalHtml), 0);
      }
    };

    const dom = editor.view.dom;
    // Use capture phase to ensure we intercept it before Prosemirror does
    dom.addEventListener('paste', handlePaste, true);

    return () => {
      dom.removeEventListener('paste', handlePaste, true);
    };
  }, [editor]);

  const setLink = useCallback(() => {
    if (!editor) return;
    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('Enter URL:', previousUrl);
    if (url === null) return;
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  }, [editor]);

  const addImage = useCallback(() => {
    if (!editor) return;
    const url = window.prompt('Enter image URL:');
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  }, [editor]);

  if (!editor) return null;

  const wrapperClass = isBlog ? 'is-blog-editor' : 'is-service-editor';

  const ToolbarButton = ({
    onClick,
    isActive = false,
    disabled = false,
    title,
    children,
  }: {
    onClick: () => void;
    isActive?: boolean;
    disabled?: boolean;
    title: string;
    children: React.ReactNode;
  }) => (
    <button
      type="button"
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`tiptap-tb-btn ${isActive ? 'active' : ''}`}
    >
      {children}
    </button>
  );

  const Divider = () => <div className="tiptap-tb-divider" />;

  // Color palette
  const colors = [
    '#000000', '#374151', '#6b7280', '#ef4444', '#f97316',
    '#eab308', '#22c55e', '#1a8b4c', '#3b82f6', '#8b5cf6',
  ];

  return (
    <div className={`tiptap-wrapper ${wrapperClass}`}>
      {/* ===== TOOLBAR ===== */}
      <div className="tiptap-toolbar">
        {/* Text style group */}
        <div className="tiptap-tb-group">
          <select
            className="tiptap-tb-select"
            value={
              editor.isActive('heading', { level: 1 }) ? '1' :
              editor.isActive('heading', { level: 2 }) ? '2' :
              editor.isActive('heading', { level: 3 }) ? '3' :
              editor.isActive('heading', { level: 4 }) ? '4' :
              editor.isActive('heading', { level: 5 }) ? '5' :
              editor.isActive('heading', { level: 6 }) ? '6' : '0'
            }
            onChange={(e) => {
              const val = e.target.value;
              if (val === '0') {
                editor.chain().focus().setParagraph().run();
              } else {
                editor.chain().focus().toggleHeading({ level: parseInt(val) as 1|2|3|4|5|6 }).run();
              }
            }}
          >
            <option value="0">Paragraph</option>
            <option value="1">Heading 1</option>
            <option value="2">Heading 2</option>
            <option value="3">Heading 3</option>
            <option value="4">Heading 4</option>
            <option value="5">Heading 5</option>
            <option value="6">Heading 6</option>
          </select>
        </div>

        <Divider />

        {/* Bold / Italic / Underline / Strike */}
        <div className="tiptap-tb-group">
          <ToolbarButton onClick={() => editor.chain().focus().toggleBold().run()} isActive={editor.isActive('bold')} title="Bold (Ctrl+B)">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"/><path d="M6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"/></svg>
          </ToolbarButton>
          <ToolbarButton onClick={() => editor.chain().focus().toggleItalic().run()} isActive={editor.isActive('italic')} title="Italic (Ctrl+I)">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="4" x2="10" y2="4"/><line x1="14" y1="20" x2="5" y2="20"/><line x1="15" y1="4" x2="9" y2="20"/></svg>
          </ToolbarButton>
          <ToolbarButton onClick={() => editor.chain().focus().toggleUnderline().run()} isActive={editor.isActive('underline')} title="Underline (Ctrl+U)">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6 3v7a6 6 0 0 0 6 6 6 6 0 0 0 6-6V3"/><line x1="4" y1="21" x2="20" y2="21"/></svg>
          </ToolbarButton>
          <ToolbarButton onClick={() => editor.chain().focus().toggleStrike().run()} isActive={editor.isActive('strike')} title="Strikethrough">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17.3 4.9c-2.3-.6-4.4-1-6.2-.9-2.7 0-5.3.7-5.3 3.6 0 1.5 1.8 3 3.7 3.5M4 12h16m-6.7 7.1c2.3.6 4.4 1 6.2.9 2.7 0 5.3-.7 5.3-3.6 0-1.5-1.8-3-3.7-3.5" transform="translate(-2 0)"/></svg>
          </ToolbarButton>
        </div>

        <Divider />

        {/* Text Color */}
        <div className="tiptap-tb-group">
          <div className="tiptap-color-wrapper">
            <input
              type="color"
              className="tiptap-color-input"
              title="Text Color"
              value={editor.getAttributes('textStyle').color || '#000000'}
              onChange={(e) => editor.chain().focus().setColor(e.target.value).run()}
            />
            <span className="tiptap-color-label">A</span>
            <span className="tiptap-color-bar" style={{ backgroundColor: editor.getAttributes('textStyle').color || '#000000' }} />
          </div>
          <ToolbarButton onClick={() => editor.chain().focus().unsetColor().run()} title="Remove Color">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M21 3L3 21M12 3v7a6 6 0 0 0 .7 2.8"/></svg>
          </ToolbarButton>
        </div>

        <Divider />

        {/* Alignment */}
        <div className="tiptap-tb-group">
          <ToolbarButton onClick={() => editor.chain().focus().setTextAlign('left').run()} isActive={editor.isActive({ textAlign: 'left' })} title="Align Left">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="17" y1="10" x2="3" y2="10"/><line x1="21" y1="6" x2="3" y2="6"/><line x1="21" y1="14" x2="3" y2="14"/><line x1="17" y1="18" x2="3" y2="18"/></svg>
          </ToolbarButton>
          <ToolbarButton onClick={() => editor.chain().focus().setTextAlign('center').run()} isActive={editor.isActive({ textAlign: 'center' })} title="Align Center">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="10" x2="6" y2="10"/><line x1="21" y1="6" x2="3" y2="6"/><line x1="21" y1="14" x2="3" y2="14"/><line x1="18" y1="18" x2="6" y2="18"/></svg>
          </ToolbarButton>
          <ToolbarButton onClick={() => editor.chain().focus().setTextAlign('right').run()} isActive={editor.isActive({ textAlign: 'right' })} title="Align Right">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="21" y1="10" x2="7" y2="10"/><line x1="21" y1="6" x2="3" y2="6"/><line x1="21" y1="14" x2="3" y2="14"/><line x1="21" y1="18" x2="7" y2="18"/></svg>
          </ToolbarButton>
        </div>

        <Divider />

        {/* Lists */}
        <div className="tiptap-tb-group">
          <ToolbarButton onClick={() => editor.chain().focus().toggleBulletList().run()} isActive={editor.isActive('bulletList')} title="Bullet List">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><circle cx="3.5" cy="6" r="1" fill="currentColor"/><circle cx="3.5" cy="12" r="1" fill="currentColor"/><circle cx="3.5" cy="18" r="1" fill="currentColor"/></svg>
          </ToolbarButton>
          <ToolbarButton onClick={() => editor.chain().focus().toggleOrderedList().run()} isActive={editor.isActive('orderedList')} title="Numbered List">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="10" y1="6" x2="21" y2="6"/><line x1="10" y1="12" x2="21" y2="12"/><line x1="10" y1="18" x2="21" y2="18"/><text x="2" y="8" fontSize="8" fill="currentColor" stroke="none" fontWeight="bold">1</text><text x="2" y="14" fontSize="8" fill="currentColor" stroke="none" fontWeight="bold">2</text><text x="2" y="20" fontSize="8" fill="currentColor" stroke="none" fontWeight="bold">3</text></svg>
          </ToolbarButton>
        </div>

        <Divider />

        {/* Blockquote / Code / Link / Image */}
        <div className="tiptap-tb-group">
          <ToolbarButton onClick={() => editor.chain().focus().toggleBlockquote().run()} isActive={editor.isActive('blockquote')} title="Blockquote">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z"/><path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z"/></svg>
          </ToolbarButton>
          <ToolbarButton onClick={() => editor.chain().focus().toggleCodeBlock().run()} isActive={editor.isActive('codeBlock')} title="Code Block">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
          </ToolbarButton>
          <ToolbarButton onClick={setLink} isActive={editor.isActive('link')} title="Insert Link">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
          </ToolbarButton>
          <ToolbarButton onClick={addImage} title="Insert Image">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
          </ToolbarButton>
        </div>

        <Divider />

        {/* Undo / Redo */}
        <div className="tiptap-tb-group">
          <ToolbarButton onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()} title="Undo (Ctrl+Z)">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/></svg>
          </ToolbarButton>
          <ToolbarButton onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()} title="Redo (Ctrl+Shift+Z)">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>
          </ToolbarButton>
        </div>

        {/* Clear formatting */}
        <div className="tiptap-tb-group" style={{ marginLeft: 'auto' }}>
          <ToolbarButton onClick={() => editor.chain().focus().clearNodes().unsetAllMarks().run()} title="Clear Formatting">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M4 7V4h16v3"/><path d="M9 20h6"/><path d="M12 4v16"/><line x1="3" y1="21" x2="21" y2="3" stroke="currentColor" strokeWidth="2"/></svg>
          </ToolbarButton>
        </div>
      </div>

      {/* ===== BUBBLE MENU ===== */}
      {editor && (
        <BubbleMenu
          editor={editor}
          tippyOptions={{
            appendTo: () => document.body,
            zIndex: 999999,
            duration: 150,
          }}
        >
          <div className="tiptap-bubble shadow-2xl border border-gray-700/50 backdrop-blur-md bg-[#1e1e2e]/95">
            <button type="button" onClick={() => editor.chain().focus().toggleBold().run()} className={editor.isActive('bold') ? 'active' : ''}>B</button>
            <button type="button" onClick={() => editor.chain().focus().toggleItalic().run()} className={editor.isActive('italic') ? 'active' : ''}>I</button>
            <button type="button" onClick={() => editor.chain().focus().toggleUnderline().run()} className={editor.isActive('underline') ? 'active' : ''}>U</button>
            <button type="button" onClick={() => editor.chain().focus().toggleStrike().run()} className={editor.isActive('strike') ? 'active' : ''}>S</button>
            <button type="button" onClick={setLink} className={editor.isActive('link') ? 'active' : ''}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
            </button>
          </div>
        </BubbleMenu>
      )}

      {/* ===== EDITOR CANVAS ===== */}
      <EditorContent editor={editor} />



      {/* ===== STYLES ===== */}
      <style dangerouslySetInnerHTML={{__html: `

        /* WRAPPER */
        .tiptap-wrapper {
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          background: #ffffff;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03);
          transition: all 0.2s ease;
          position: relative;
        }
        .tiptap-wrapper:focus-within {
          border-color: #1a8b4c;
          box-shadow: 0 0 0 4px rgba(26, 139, 76, 0.1);
        }

        /* TOOLBAR */
        .tiptap-toolbar {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 4px;
          padding: 8px 16px;
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(12px);
          border-bottom: 1px solid #e2e8f0;
          position: sticky;
          top: 64px;
          z-index: 20;
          border-top-left-radius: 11px;
          border-top-right-radius: 11px;
        }
        .tiptap-tb-group {
          display: flex;
          align-items: center;
          gap: 1px;
        }
        .tiptap-tb-divider {
          width: 1px;
          height: 20px;
          background: #e5e7eb;
          margin: 0 6px;
          flex-shrink: 0;
        }
        .tiptap-tb-btn {
          width: 30px;
          height: 30px;
          border-radius: 6px;
          border: none;
          background: transparent;
          color: #6b7280;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.12s ease;
        }
        .tiptap-tb-btn:hover {
          background: #f3f4f6;
          color: #111827;
        }
        .tiptap-tb-btn.active {
          background: #111827;
          color: #fff;
        }
        .tiptap-tb-btn:disabled {
          opacity: 0.3;
          cursor: not-allowed;
        }

        /* Heading select */
        .tiptap-tb-select {
          height: 30px;
          padding: 0 8px;
          border: 1px solid #e5e7eb;
          border-radius: 6px;
          background: #fff;
          font-size: 12px;
          font-weight: 600;
          color: #374151;
          cursor: pointer;
          outline: none;
          transition: all 0.12s;
          min-width: 100px;
        }
        .tiptap-tb-select:hover {
          border-color: #d1d5db;
          background: #f9fafb;
        }
        .tiptap-tb-select:focus {
          border-color: #111827;
        }

        /* Color picker */
        .tiptap-color-wrapper {
          position: relative;
          width: 30px;
          height: 30px;
          border-radius: 6px;
          overflow: hidden;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          background: transparent;
          transition: all 0.12s;
        }
        .tiptap-color-wrapper:hover {
          background: #f3f4f6;
        }
        .tiptap-color-input {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          opacity: 0;
          cursor: pointer;
          border: none;
          padding: 0;
        }
        .tiptap-color-label {
          font-size: 14px;
          font-weight: 800;
          color: #374151;
          pointer-events: none;
          z-index: 1;
          line-height: 1;
        }
        .tiptap-color-bar {
          position: absolute;
          bottom: 3px;
          left: 7px;
          right: 7px;
          height: 3px;
          border-radius: 2px;
          pointer-events: none;
          z-index: 1;
        }

        /* BUBBLE MENU */
        div[data-tippy-root] {
          z-index: 99999 !important;
        }
        
        .tiptap-bubble {
          display: flex;
          gap: 2px;
          background: #1e1e2e;
          border-radius: 8px;
          padding: 4px;
          box-shadow: 0 8px 24px rgba(0,0,0,0.2);
          z-index: 99999;
        }
        .tiptap-bubble button {
          width: 28px;
          height: 28px;
          border-radius: 5px;
          border: none;
          background: transparent;
          color: #a1a1aa;
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.1s;
        }
        .tiptap-bubble button:hover {
          background: #313244;
          color: #fff;
        }
        .tiptap-bubble button.active {
          background: #2CA65A;
          color: #fff;
        }

        /* ============================================
           EDITOR CANVAS — Word/Sanity-grade typography
           ============================================ */

        .tiptap-editor-canvas,
        .tiptap {
          min-height: 480px;
          padding: 24px 28px;
          font-family: var(--font-jost, 'Jost', 'Inter', system-ui, sans-serif);
          font-size: 16px;
          line-height: 1.625;
          color: #4b5563;
          outline: none;
          border-bottom-left-radius: 11px;
          border-bottom-right-radius: 11px;
        }
        .tiptap-editor-canvas:focus,
        .tiptap:focus {
          outline: none;
        }
 
        /* Placeholder */
        .tiptap-editor-canvas p.is-editor-empty:first-child::before,
        .tiptap p.is-editor-empty:first-child::before {
          content: attr(data-placeholder);
          float: left;
          color: #a1a1aa;
          font-weight: 400;
          pointer-events: none;
          height: 0;
        }
 
        /* PARAGRAPHS — exact Word/live site spacing */
        .tiptap-editor-canvas p,
        .tiptap p {
          margin-top: 0;
          margin-bottom: 16px !important;
          line-height: 1.625;
          font-weight: 400;
          font-size: 16px;
          color: #4b5563;
        }
 
        /* HEADINGS — matching live page typography */
        .tiptap-editor-canvas h1,
        .tiptap h1 {
          font-family: var(--font-poppins, 'Lexend', 'Inter', sans-serif);
          font-size: 48px;
          font-weight: 800;
          color: #111827;
          margin: 32px 0 16px 0;
          line-height: 1.25;
          letter-spacing: -0.02em;
        }
        .tiptap-editor-canvas h2,
        .tiptap h2 {
          font-family: var(--font-poppins, 'Lexend', 'Inter', sans-serif);
          font-size: 36px;
          font-weight: 700;
          color: #111827;
          margin: 32px 0 16px 0 !important;
          line-height: 1.375;
          letter-spacing: -0.01em;
        }
        .tiptap-editor-canvas h3,
        .tiptap h3 {
          font-family: var(--font-poppins, 'Lexend', 'Inter', sans-serif);
          font-size: 24px;
          font-weight: 600;
          color: #1f2937;
          margin: 28px 0 12px 0 !important;
          line-height: 1.375;
        }
        .tiptap-editor-canvas h4,
        .tiptap h4 {
          font-family: var(--font-poppins, 'Lexend', 'Inter', sans-serif);
          font-size: 20px;
          font-weight: 600;
          color: #374151;
          margin: 20px 0 10px 0;
          line-height: 1.5;
        }
        .tiptap-editor-canvas h5,
        .tiptap h5 {
          font-family: var(--font-poppins, 'Lexend', 'Inter', sans-serif);
          font-size: 16px;
          font-weight: 600;
          color: #4b5563;
          margin: 16px 0 8px 0;
          text-transform: uppercase;
          letter-spacing: 0.03em;
        }
        .tiptap-editor-canvas h6,
        .tiptap h6 {
          font-family: var(--font-poppins, 'Lexend', 'Inter', sans-serif);
          font-size: 14px;
          font-weight: 600;
          color: #6b7280;
          margin: 12px 0 6px 0;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
 
        /* Blog-only H2 & H3 green underline */
        .is-blog-editor .tiptap-editor-canvas h2:not([style*="color"]),
        .is-blog-editor .tiptap h2:not([style*="color"]) {
          color: #2CA65A;
        }
        .is-blog-editor .tiptap-editor-canvas h2,
        .is-blog-editor .tiptap h2 {
          padding-bottom: 8px;
          border-bottom: 2px solid currentColor;
        }
        .is-blog-editor .tiptap-editor-canvas h2 strong,
        .is-blog-editor .tiptap-editor-canvas h2 b,
        .is-blog-editor .tiptap h2 strong,
        .is-blog-editor .tiptap h2 b {
          color: inherit !important;
        }
 
        /* LISTS */
        .tiptap-editor-canvas ul, .tiptap ul {
          padding-left: 24px;
          margin: 8px 0 16px 0;
          list-style-type: disc;
        }
        .tiptap-editor-canvas ol, .tiptap ol {
          padding-left: 24px;
          margin: 8px 0 16px 0;
          list-style-type: decimal;
        }
        .tiptap-editor-canvas li, .tiptap li {
          margin-bottom: 8px;
          line-height: 1.625;
          font-size: 16px;
          font-weight: 400;
          color: #4b5563;
        }
        .tiptap-editor-canvas li p, .tiptap li p {
          display: inline;
          margin: 0;
        }
        
        /* Table styles inside Editor */
        .tiptap-editor-canvas table {
          border-collapse: collapse;
          table-layout: fixed;
          width: 100%;
          margin: 1.5rem 0;
          overflow: hidden;
          border-radius: 6px;
          border: 1px solid #e2e8f0;
        }
        .tiptap-editor-canvas table td,
        .tiptap-editor-canvas table th {
          min-width: 1em;
          border: 1px solid #e2e8f0;
          padding: 10px 14px;
          vertical-align: top;
          box-sizing: border-box;
          position: relative;
        }
        .tiptap-editor-canvas table th {
          font-weight: 700;
          text-align: left;
          background-color: #f8fafc;
          color: #0f172a;
        }
        .tiptap-editor-canvas table td {
          color: #475569;
        }
        .tiptap-editor-canvas table .selectedCell:after {
          z-index: 2;
          position: absolute;
          content: "";
          left: 0; right: 0; top: 0; bottom: 0;
          background: rgba(200, 200, 255, 0.4);
          pointer-events: none;
        }/* LINKS */
        .tiptap-editor-canvas a, .tiptap a,
        .tiptap-editor-canvas .editor-link, .tiptap .editor-link {
          color: #2563eb;
          font-weight: 600;
          text-decoration: underline;
          text-underline-offset: 2px;
          text-decoration-color: #93c5fd;
          cursor: pointer;
        }
        .is-blog-editor .tiptap-editor-canvas a,
        .is-blog-editor .tiptap a,
        .is-blog-editor .tiptap-editor-canvas .editor-link,
        .is-blog-editor .tiptap .editor-link {
          color: #1a8b4c;
          text-decoration-color: #86efac;
        }

        /* BLOCKQUOTE */
        .tiptap-editor-canvas blockquote, .tiptap blockquote {
          border-left: 3px solid #d1d5db;
          padding: 8px 16px;
          margin: 4px 0;
          background: #f9fafb;
          border-radius: 0 8px 8px 0;
          color: #6b7280;
          font-style: italic;
        }
        .is-blog-editor .tiptap-editor-canvas blockquote,
        .is-blog-editor .tiptap blockquote {
          border-left-color: #1a8b4c;
        }

        /* CODE BLOCK */
        .tiptap-editor-canvas pre, .tiptap pre {
          background: #1e1e2e;
          color: #cdd6f4;
          font-family: 'SF Mono', 'Fira Code', ui-monospace, monospace;
          padding: 14px 18px;
          border-radius: 10px;
          font-size: 13px;
          line-height: 1.5;
          margin: 6px 0;
          overflow-x: auto;
          border: 1px solid #313244;
        }
        .tiptap-editor-canvas pre code, .tiptap pre code {
          background: none;
          color: inherit;
          font-size: inherit;
          padding: 0;
        }

        /* INLINE CODE */
        .tiptap-editor-canvas code, .tiptap code {
          background: #f3f4f6;
          color: #e11d48;
          padding: 1px 5px;
          border-radius: 4px;
          font-size: 0.9em;
          font-family: ui-monospace, monospace;
        }

        /* IMAGES */
        .tiptap-editor-canvas img, .tiptap img {
          max-width: 100%;
          height: auto;
          border-radius: 8px;
          margin: 6px 0;
        }

        /* HR */
        .tiptap-editor-canvas hr, .tiptap hr {
          border: none;
          border-top: 2px solid #e5e7eb;
          margin: 10px 0;
        }

        /* Selection */
        .tiptap-editor-canvas ::selection, .tiptap ::selection {
          background: #c7d2fe;
        }
      `}} />
    </div>
  );
}
