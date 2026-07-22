import Link from "next/link";

import { BUSINESS_INFO } from "@/lib/constants";
import type { LegalBlock, LegalDocument, LegalListItem } from "@/lib/legal";

function LegalList({
  items,
  ordered,
  nested = false,
}: {
  items: LegalListItem[];
  ordered: boolean;
  nested?: boolean;
}) {
  const List = ordered ? "ol" : "ul";

  return (
    <List
      className={
        ordered
          ? `${nested ? "list-[lower-alpha]" : "list-decimal"} space-y-3 pl-6 marker:font-mono marker:font-bold marker:text-[#FF6B35]`
          : "list-disc space-y-3 pl-6 marker:text-[#FF6B35]"
      }
    >
      {items.map((item, index) => (
        <li key={`${index}-${item.text.slice(0, 24)}`} className="pl-1">
          <span>{item.text}</span>
          {item.children && (
            <div className="mt-3">
              <LegalList items={item.children} ordered={ordered} nested />
            </div>
          )}
        </li>
      ))}
    </List>
  );
}

function LegalTableBlock({ block }: { block: Extract<LegalBlock, { type: "table" }> }) {
  return (
    <div className="my-7 overflow-x-auto border-3 border-black bg-white shadow-[4px_4px_0_#000]">
      <table className="w-full min-w-[720px] border-collapse text-left text-sm">
        <caption className="sr-only">{block.caption}</caption>
        <thead className="bg-black text-white">
          <tr>
            {block.headers.map((header) => (
              <th
                key={header}
                scope="col"
                className="border-r border-gray-700 px-4 py-3 font-mono text-xs font-bold tracking-wide last:border-r-0"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {block.rows.map((row, rowIndex) => (
            <tr key={`${block.caption}-${rowIndex}`} className="border-t-2 border-black align-top even:bg-gray-50">
              {row.map((cell, cellIndex) => (
                <td
                  key={`${rowIndex}-${cellIndex}`}
                  className={`whitespace-pre-line border-r border-gray-300 px-4 py-3 leading-6 last:border-r-0 ${
                    cellIndex === 0 ? "font-semibold" : "text-gray-700"
                  }`}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function LegalContentBlock({ block }: { block: LegalBlock }) {
  switch (block.type) {
    case "paragraph":
      return <p className="leading-8 text-gray-700">{block.text}</p>;
    case "ordered-list":
      return <LegalList items={block.items} ordered />;
    case "unordered-list":
      return <LegalList items={block.items} ordered={false} />;
    case "table":
      return <LegalTableBlock block={block} />;
  }
}

export function LegalDocumentPage({ document }: { document: LegalDocument }) {
  const alternate =
    document.slug === "terms"
      ? { href: "/privacy", label: "개인정보처리방침" }
      : { href: "/terms", label: "이용약관" };

  return (
    <div className="min-h-screen bg-[#F4F4F4] text-black">
      <header className="border-b-3 border-black bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 md:px-8">
          <Link
            href="/"
            className="font-mono text-sm font-bold tracking-tight transition-colors hover:text-[#FF6B35] focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-[#FF6B35]"
          >
            OCTOBER ACADEMY
          </Link>
          <nav aria-label="법적 고지" className="flex items-center gap-1 border-2 border-black p-1 text-xs font-bold sm:text-sm">
            <Link
              href="/terms"
              aria-current={document.slug === "terms" ? "page" : undefined}
              className={`px-3 py-2 transition-colors focus-visible:outline-3 focus-visible:outline-[#FF6B35] ${
                document.slug === "terms" ? "bg-black text-white" : "hover:bg-gray-100"
              }`}
            >
              이용약관
            </Link>
            <Link
              href="/privacy"
              aria-current={document.slug === "privacy" ? "page" : undefined}
              className={`px-3 py-2 transition-colors focus-visible:outline-3 focus-visible:outline-[#FF6B35] ${
                document.slug === "privacy" ? "bg-black text-white" : "hover:bg-gray-100"
              }`}
            >
              개인정보처리방침
            </Link>
          </nav>
        </div>
      </header>

      <main>
        <section className="section-dark border-b-3 border-black">
          <div className="relative mx-auto max-w-7xl px-5 py-16 md:px-8 md:py-24">
            <div className="mb-6 inline-flex border-2 border-white bg-[#FF6B35] px-3 py-1 font-mono text-xs font-bold tracking-[0.14em] text-white">
              {document.label}
            </div>
            <h1 className="max-w-4xl text-4xl font-black tracking-[-0.04em] sm:text-5xl md:text-7xl">
              {document.title}
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-7 text-gray-300 md:text-lg">
              {document.description}
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-3 font-mono text-xs">
              <span className="border-2 border-white px-3 py-2 text-white">
                총 {document.sections.length}개 항목
              </span>
              {document.effectiveDate && (
                <span className="border-2 border-[#FF6B35] bg-white px-3 py-2 font-bold text-black">
                  시행일 {document.effectiveDate}
                </span>
              )}
            </div>
          </div>
        </section>

        <div className="mx-auto grid max-w-7xl gap-8 px-5 py-10 md:px-8 md:py-16 lg:grid-cols-[250px_minmax(0,1fr)] lg:gap-12">
          <aside className="hidden self-start lg:sticky lg:top-6 lg:block">
            <div className="border-3 border-black bg-white p-5 shadow-[4px_4px_0_#000]">
              <p className="mb-4 border-b-2 border-black pb-3 font-mono text-xs font-bold tracking-[0.14em]">
                CONTENTS
              </p>
              <nav aria-label={`${document.title} 목차`}>
                <ol className="max-h-[calc(100vh-10rem)] space-y-1 overflow-y-auto pr-2 text-sm">
                  {document.sections.map((section, index) => (
                    <li key={section.id}>
                      <a
                        href={`#${section.id}`}
                        className="group flex gap-3 py-2 leading-5 text-gray-600 transition-colors hover:text-black focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-[#FF6B35]"
                      >
                        <span className="font-mono text-xs font-bold text-[#FF6B35]">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        <span>{section.title}</span>
                      </a>
                    </li>
                  ))}
                </ol>
              </nav>
            </div>
          </aside>

          <article className="min-w-0 border-3 border-black bg-white shadow-[6px_6px_0_#FF6B35]">
            {document.sections.map((section, index) => (
              <section
                key={section.id}
                id={section.id}
                className="scroll-mt-6 border-b-3 border-black px-5 py-9 last:border-b-0 sm:px-8 md:px-12 md:py-12"
              >
                <div className="mb-7 flex items-start gap-4">
                  <span className="mt-1 shrink-0 bg-black px-2 py-1 font-mono text-xs font-bold text-white">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <h2 className="text-xl font-black leading-tight tracking-[-0.02em] md:text-2xl">
                    {section.title}
                  </h2>
                </div>
                <div className="space-y-6 text-[15px] leading-8 md:text-base">
                  {section.blocks.map((block, blockIndex) => (
                    <LegalContentBlock key={`${section.id}-${blockIndex}`} block={block} />
                  ))}
                </div>
              </section>
            ))}
          </article>
        </div>

        <section className="border-y-3 border-black bg-[#FF6B35]">
          <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-5 px-5 py-8 md:flex-row md:items-center md:px-8">
            <div>
              <p className="font-mono text-xs font-bold tracking-[0.12em]">ANOTHER DOCUMENT</p>
              <p className="mt-1 text-xl font-black">{alternate.label}도 확인해 주세요.</p>
            </div>
            <Link
              href={alternate.href}
              className="border-3 border-black bg-white px-5 py-3 font-bold shadow-[4px_4px_0_#000] transition-transform hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0_#000] focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-white"
            >
              {alternate.label} →
            </Link>
          </div>
        </section>
      </main>

      <footer className="bg-black text-white">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-4 px-5 py-8 text-sm md:flex-row md:items-center md:px-8">
          <div>
            <p className="font-bold">{BUSINESS_INFO.companyName}</p>
            <p className="mt-1 text-xs text-gray-400">{BUSINESS_INFO.copyright}</p>
          </div>
          <div className="flex flex-wrap gap-x-5 gap-y-2 text-xs text-gray-300">
            <Link href="/" className="hover:text-white hover:underline">홈</Link>
            <Link href="/terms" className="hover:text-white hover:underline">이용약관</Link>
            <Link href="/privacy" className="hover:text-white hover:underline">개인정보처리방침</Link>
            <a href={`mailto:${BUSINESS_INFO.email}`} className="hover:text-white hover:underline">
              {BUSINESS_INFO.email}
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
