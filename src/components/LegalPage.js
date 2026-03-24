'use client';

import Link from 'next/link';
import { MessageSquare, ArrowLeft } from 'lucide-react';

function ClauseBlock({ number }) {
  return (
    <p className="text-gray-700 leading-relaxed mb-4">
      <span className="font-semibold text-gray-900">Madde {number}:</span> İşbu madde kapsamında tarafların hak ve yükümlülükleri detaylı olarak düzenlenmiş olup, taraflar ilgili hükümlere eksiksiz şekilde uymayı kabul eder. İşbu madde kapsamında tarafların hak ve yükümlülükleri detaylı olarak düzenlenmiş olup, taraflar ilgili hükümlere eksiksiz şekilde uymayı kabul eder. İşbu madde kapsamında tarafların hak ve yükümlülükleri detaylı olarak düzenlenmiş olup, taraflar ilgili hükümlere eksiksiz şekilde uymayı kabul eder.
    </p>
  );
}

function Section({ title, clauseCount = 60 }) {
  return (
    <div className="mb-12">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-3 border-b border-gray-200">{title}</h2>
      {Array.from({ length: clauseCount }, (_, i) => (
        <ClauseBlock key={i} number={i + 1} />
      ))}
    </div>
  );
}

export default function LegalPage({ title, sections }) {
  return (
    <div className="min-h-screen bg-white">
      <nav className="border-b border-gray-200 sticky top-0 bg-white z-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center gap-2">
              <MessageSquare className="w-6 h-6 text-blue-600" />
              <span className="text-lg font-semibold text-gray-900">MsgLoom</span>
            </Link>
            <Link href="/" className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-blue-600 transition">
              <ArrowLeft className="w-4 h-4" /> Ana Sayfa
            </Link>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">{title}</h1>
          <p className="text-gray-500 text-sm">Msgloom, Export Box Bilişim ve Dış Ticaret Anonim Şirketi markasıdır ve tüm hizmetler bu şirket tarafından sunulmaktadır.</p>
          <p className="text-gray-400 text-xs mt-2">Son güncelleme: 2026</p>
        </div>

        {sections.map((s, i) => (
          <Section key={i} title={s.title} clauseCount={s.clauseCount || 60} />
        ))}
      </main>

      <footer className="border-t border-gray-200 py-8 text-center text-gray-400 text-sm">
        <p>© 2026 MsgLoom — Export Box Bilişim ve Dış Ticaret A.Ş.</p>
      </footer>
    </div>
  );
}
