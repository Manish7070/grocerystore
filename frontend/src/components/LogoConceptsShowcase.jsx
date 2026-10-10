import { useState } from 'react';
import { GSMonogramConceptA, GSMonogramConceptB, GSMonogramConceptC, GSMonogram } from './Brand';
import { CheckCircle2, Shield, Eye, Award } from 'lucide-react';

/**
 * Interactive Concept Comparison Component
 * Allows visual inspection of all 3 custom vector GS monogram concepts
 * on Light (Warm Oat / Surface) and Dark (Deep Forest Ink) backgrounds,
 * tested at both Large (64px-96px) and Navbar sizes (28px-36px).
 */
export const LogoConceptsShowcase = () => {
  const [selectedConcept, setSelectedConcept] = useState('A');
  const [bgMode, setBgMode] = useState('light');

  const concepts = [
    {
      id: 'A',
      title: 'Concept A — Architectural Heritage',
      tagline: 'Selected Master Direction',
      description: 'Chiseled serif junctions, interlocking vertical geometry inspired by classical luxury copperplate engraving. The spine of G seamlessly interweaves with the curves of S.',
      component: GSMonogramConceptA,
    },
    {
      id: 'B',
      title: 'Concept B — Sculpted Contemporary',
      tagline: 'Unified Roundel Seal',
      description: 'Continuous calligraphic stroke forming a unified luxury emblem where G and S share an architectural central axis with high thick-to-thin contrast.',
      component: GSMonogramConceptB,
    },
    {
      id: 'C',
      title: 'Concept C — Modern Artisan Diamond',
      tagline: 'Faceted Diamond Cartouche',
      description: 'Handcrafted diamond geometry with engraved finials, sharp terminals, and balanced negative space suitable for artisan provisions.',
      component: GSMonogramConceptC,
    },
  ];

  return (
    <section className="border-t border-sandstoneBorder bg-surface py-16 px-4 sm:px-6 lg:px-8 dark:bg-forest transition-colors">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10 pb-6 border-b border-sandstoneBorder">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-oat border border-sandstoneBorder text-[11px] font-bold uppercase tracking-wider text-copper mb-2 dark:bg-charcoal dark:border-white/10 dark:text-ochre">
              <Award size={13} />
              <span>Brand Identity Architecture</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl text-forest font-semibold dark:text-surface">
              Custom GS Monogram Suite
            </h2>
            <p className="text-sm text-mutedStone mt-1 max-w-xl dark:text-surface/70">
              Three custom vector monogram concepts created without generic templates or rounded-square shortcuts.
            </p>
          </div>

          {/* Background Toggle */}
          <div className="flex items-center gap-2 p-1 rounded-xl bg-oat border border-sandstoneBorder dark:bg-charcoal dark:border-white/10">
            <button
              type="button"
              onClick={() => setBgMode('light')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition ${bgMode === 'light' ? 'bg-surface text-forest shadow-sm' : 'text-mutedStone hover:text-forest dark:text-surface/70'
                }`}
            >
              Light Background
            </button>
            <button
              type="button"
              onClick={() => setBgMode('dark')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition ${bgMode === 'dark' ? 'bg-forest text-surface shadow-sm' : 'text-mutedStone hover:text-forest dark:text-surface/70'
                }`}
            >
              Dark Background
            </button>
          </div>
        </div>

        {/* 3 Concepts Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {concepts.map((concept) => {
            const Icon = concept.component;
            const isSelected = selectedConcept === concept.id;

            return (
              <div
                key={concept.id}
                onClick={() => setSelectedConcept(concept.id)}
                className={`cursor-pointer rounded-2xl border transition-all p-6 flex flex-col justify-between ${isSelected
                    ? 'border-copper ring-2 ring-copper/20 shadow-card bg-surface dark:bg-charcoal'
                    : 'border-sandstoneBorder bg-surface hover:border-copper/40 dark:bg-charcoal/50'
                  }`}
              >
                <div>
                  {/* Top Concept Tag */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-copper dark:text-ochre">
                      {concept.tagline}
                    </span>
                    {isSelected && (
                      <span className="flex items-center gap-1 text-[11px] font-bold text-successGreen">
                        <CheckCircle2 size={14} /> Active
                      </span>
                    )}
                  </div>

                  {/* Render Box at Large & Navbar Sizes */}
                  <div
                    className={`rounded-xl border border-sandstoneBorder/60 p-6 flex flex-col items-center justify-center gap-4 transition-colors ${bgMode === 'light' ? 'bg-[#FDFBF7]' : 'bg-[#192D2A]'
                      }`}
                  >
                    {/* Large Size */}
                    <div className="flex items-center justify-center">
                      <Icon
                        className="h-20 w-20"
                        color={bgMode === 'light' ? '#192D2A' : '#FFFFFF'}
                        accent={bgMode === 'light' ? '#C66B42' : '#D9A441'}
                      />
                    </div>

                    {/* Small / Navbar Size Comparison (32px) */}
                    <div className="flex items-center gap-3 pt-3 border-t border-sandstoneBorder/30 w-full justify-center">
                      <span className="text-[10px] text-mutedStone uppercase tracking-wider font-mono">28px nav:</span>
                      <Icon
                        className="h-7 w-7"
                        color={bgMode === 'light' ? '#192D2A' : '#FFFFFF'}
                        accent={bgMode === 'light' ? '#C66B42' : '#D9A441'}
                      />
                    </div>
                  </div>

                  <h3 className="font-serif text-lg font-semibold text-forest mt-5 dark:text-surface">
                    {concept.title}
                  </h3>
                  <p className="text-xs text-mutedStone mt-1 leading-relaxed dark:text-surface/70">
                    {concept.description}
                  </p>
                </div>

                <div className="mt-5 pt-4 border-t border-sandstoneBorder flex items-center justify-between text-xs">
                  <span className="font-mono text-[11px] text-mutedStone">Vector SVG &bull; Clean Paths</span>
                  <span className="font-bold text-copper dark:text-ochre">Inspect &rarr;</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Master Production Lockup Live Preview */}
        <div className="rounded-2xl border border-sandstoneBorder bg-oat/50 p-6 sm:p-8 dark:bg-charcoal dark:border-white/10">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-copper dark:text-ochre">Production Selection</span>
              <h3 className="font-serif text-2xl text-forest font-semibold mt-0.5 dark:text-surface">
                Architectural Heritage Lockup
              </h3>
              <p className="text-xs text-mutedStone mt-1 max-w-lg leading-relaxed dark:text-surface/70">
                Crafted for exceptional legibility across header utility bars, mobile screens, product packaging seals, invoice receipts, and vector browser favicons.
              </p>
            </div>

            {/* Live Master Lockup Display */}
            <div className="flex flex-wrap items-center gap-6 p-4 rounded-xl bg-surface border border-sandstoneBorder shadow-subtle dark:bg-forest">
              <div className="flex items-center gap-3">
                <GSMonogram className="h-12 w-12" />
                <div className="leading-tight">
                  <span className="block font-serif text-2xl font-semibold tracking-[-0.03em] text-forest dark:text-surface">
                    Grocery<span className="text-copper">Store</span>
                  </span>
                  <span className="block font-sans text-[9px] font-extrabold uppercase tracking-[0.24em] text-mutedStone dark:text-surface/60">
                    Fine Provisions & Fresh Market
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LogoConceptsShowcase;
