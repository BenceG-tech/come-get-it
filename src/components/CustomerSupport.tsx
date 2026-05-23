import React, { useEffect, useState } from 'react';
import {
  MessageCircle,
  X,
  Send,
  Search,
  Home,
  HelpCircle,
  ArrowLeft,
  Check,
  ChevronDown,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/ui/Logo';
import { useI18n } from '@/hooks/useI18n';
import { cn } from '@/lib/utils';

type MainTab = 'home' | 'messages' | 'help';
type DetailView = 'ingyen-italok' | 'jutalmak' | 'regisztracio' | 'ajanlas' | null;

const FREE_DRINKS_SECTIONS = [
  'miert_adunk',
  'hogyan_juthatsz',
  'miert_nem_latok',
  'miert_zarolva',
  'van_limit',
  'adhatok_visszajelzest',
  'maradt_kerdes',
];

const POINTS_REWARDS_SECTIONS = [
  'mi_az_a_rewards',
  'hogyan_szerezhetek_pontokat',
  'mire_kolthetem',
  'hogyan_osszekotom',
  'biztonsag',
  'kartya_frissitese',
  'minden_tranzakcio',
  'lejarnak_pontok',
  'online_fizetes',
  'miert_nem_kaptam_pontot',
];

export const CustomerSupport: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentTab, setCurrentTab] = useState<MainTab>('home');
  const [detailView, setDetailView] = useState<DetailView>(null);
  const [message, setMessage] = useState('');
  const [selectedSection, setSelectedSection] = useState<string>('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [feedback, setFeedback] = useState<'yes' | 'no' | null>(null);
  const { t } = useI18n();

  useEffect(() => {
    const open = () => setIsOpen(true);
    window.addEventListener('open-support', open);
    window.addEventListener('open_support', open);
    window.addEventListener('openSupport', open);
    return () => {
      window.removeEventListener('open-support', open);
      window.removeEventListener('open_support', open);
      window.removeEventListener('openSupport', open);
    };
  }, []);

  const toggleSupport = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setCurrentTab('home');
      setDetailView(null);
    }
  };

  const handleSendMessage = () => {
    if (message.trim()) {
      console.log('Üzenet elküldve:', message);
      setMessage('');
    }
  };

  const openDetailView = (view: DetailView) => {
    setSelectedSection('');
    setFeedback(null);
    setDetailView(view);
  };

  const closeDetailView = () => setDetailView(null);

  const goTab = (tab: MainTab) => {
    setCurrentTab(tab);
    setDetailView(null);
  };

  // ───────── Shared chrome ─────────

  const renderHeader = (title: string, withBack = false) => (
    <div className="flex items-center justify-between px-4 py-3 bg-nf-surface border-b border-nf-border">
      <div className="flex items-center gap-3 min-w-0">
        {withBack && (
          <Button
            variant="ghost"
            size="icon"
            onClick={closeDetailView}
            className="text-white hover:bg-white/10 h-8 w-8 rounded-full shrink-0"
            aria-label="Vissza"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
        )}
        <Logo className="h-6 md:h-6 w-auto shrink-0" />
        <span className="text-sm font-medium text-white/80 truncate">{title}</span>
      </div>
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleSupport}
        className="text-white hover:bg-white/10 h-8 w-8 rounded-full shrink-0"
        aria-label="Bezárás"
      >
        <X className="w-4 h-4" />
      </Button>
    </div>
  );

  const renderFooterNav = (active: MainTab) => {
    const tabs: { key: MainTab; icon: typeof Home; label: string }[] = [
      { key: 'home', icon: Home, label: t('support.tabs.home') },
      { key: 'messages', icon: MessageCircle, label: t('support.tabs.messages') },
      { key: 'help', icon: HelpCircle, label: t('support.tabs.help') },
    ];
    return (
      <div className="bg-nf-surface border-t border-nf-border">
        <div className="flex">
          {tabs.map(({ key, icon: Icon, label }) => {
            const isActive = active === key && !detailView;
            return (
              <button
                key={key}
                onClick={() => goTab(key)}
                className={cn(
                  'flex-1 flex flex-col items-center py-3 px-2 transition-all duration-200',
                  isActive
                    ? 'text-nf-primary bg-nf-primary/10'
                    : 'text-white/50 hover:text-white hover:bg-white/5',
                )}
              >
                <Icon className="w-5 h-5 mb-1" strokeWidth={1.75} />
                <span className="text-[11px] font-medium">{label}</span>
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  const renderFeedbackSection = () => (
    <div className="mt-8 p-5 bg-nf-surface-alt rounded-2xl border border-nf-border">
      <p className="text-white text-center mb-4 text-sm">{t('support.feedback.question')}</p>
      <div className="flex justify-center gap-3">
        {(['yes', 'no'] as const).map((v) => {
          const isActive = feedback === v;
          return (
            <button
              key={v}
              onClick={() => setFeedback(v)}
              className={cn(
                'flex items-center gap-2 px-5 py-2 rounded-full border text-sm transition-all',
                isActive
                  ? 'bg-nf-primary text-black border-nf-primary shadow-[0_0_18px_rgba(0,188,212,0.45)]'
                  : 'bg-white/5 text-white/80 border-nf-border hover:border-nf-primary/50 hover:text-white',
              )}
            >
              {v === 'yes' ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
              <span>{v === 'yes' ? t('support.feedback.yes') : t('support.feedback.no')}</span>
            </button>
          );
        })}
      </div>
    </div>
  );

  // ───────── FAQ detail ─────────

  type Section = { id: string; title: string; content: string };
  type QA = { question: string; answer: string };

  const getDetailData = (
    view: Exclude<DetailView, null>,
  ): { title: string; sections?: Section[]; qa?: QA[] } => {
    if (view === 'ingyen-italok') {
      const base = 'support.faq.free_drinks';
      return {
        title: t(`${base}.title`),
        sections: FREE_DRINKS_SECTIONS.map((id) => ({
          id,
          title: t(`${base}.sections.${id}.title`),
          content: t(`${base}.sections.${id}.content`),
        })),
      };
    }
    if (view === 'jutalmak') {
      const base = 'support.faq.points_rewards';
      return {
        title: t(`${base}.title`),
        sections: POINTS_REWARDS_SECTIONS.map((id) => ({
          id,
          title: t(`${base}.sections.${id}.title`),
          content: t(`${base}.sections.${id}.content`),
        })),
      };
    }
    if (view === 'regisztracio') {
      const base = 'support.faq.account';
      return {
        title: t(`${base}.title`),
        qa: [1, 2].map((i) => ({
          question: t(`${base}.items.${i}.q`),
          answer: t(`${base}.items.${i}.a`),
        })),
      };
    }
    const base = 'support.faq.referrals';
    return {
      title: t(`${base}.title`),
      qa: [1, 2].map((i) => ({
        question: t(`${base}.items.${i}.q`),
        answer: t(`${base}.items.${i}.a`),
      })),
    };
  };

  const renderFAQDetail = (view: Exclude<DetailView, null>) => {
    const data = getDetailData(view);

    const scrollToSection = (id: string) => {
      setSelectedSection(id);
      setIsDropdownOpen(false);
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    return (
      <div className="flex flex-col h-full bg-nf-background">
        {renderHeader(data.title, true)}

        <div className="flex-1 overflow-y-auto px-4 pt-4 pb-6">
          <div className="mb-4">
            <h3 className="text-xl font-bold text-white mb-1">{data.title}</h3>
            <p className="text-white/50 text-xs">{t('support.faq_label')}</p>
          </div>

          {data.sections && (
            <>
              <div className="relative mb-6">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="w-full bg-nf-surface-alt border border-nf-border rounded-full px-4 py-3 text-left text-white flex items-center justify-between hover:border-nf-primary/50 transition-colors"
                >
                  <span className="text-sm font-medium truncate pr-2">
                    {selectedSection
                      ? data.sections.find((s) => s.id === selectedSection)?.title
                      : t('support.toc')}
                  </span>
                  <ChevronDown
                    className={cn(
                      'w-4 h-4 transition-transform shrink-0',
                      isDropdownOpen && 'rotate-180',
                    )}
                  />
                </button>

                {isDropdownOpen && (
                  <div className="absolute top-full left-0 right-0 z-10 mt-2 bg-nf-surface-alt border border-nf-border rounded-2xl shadow-xl max-h-64 overflow-y-auto">
                    {data.sections.map((section) => (
                      <button
                        key={section.id}
                        onClick={() => scrollToSection(section.id)}
                        className="w-full text-left px-4 py-3 text-sm text-white/70 hover:bg-white/5 hover:text-white transition-colors border-b border-nf-border last:border-b-0"
                      >
                        {section.title}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-4">
                {data.sections.map((section) => (
                  <div
                    key={section.id}
                    id={section.id}
                    className="bg-nf-surface-alt border border-nf-border rounded-2xl p-4 scroll-mt-4"
                  >
                    <h4 className="font-semibold text-white mb-3 text-base leading-snug">
                      {section.title}
                    </h4>
                    <div className="text-white/75 leading-relaxed text-sm space-y-3">
                      {section.content.split('\n').filter((p) => p.trim()).map((p, i) => (
                        <p key={i}>{p}</p>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {data.qa && (
            <div className="space-y-3">
              {data.qa.map((item, i) => (
                <div key={i} className="bg-nf-surface-alt border border-nf-border rounded-2xl p-4">
                  <h4 className="font-semibold text-white mb-2 text-base leading-snug">
                    {item.question}
                  </h4>
                  <p className="text-white/75 leading-relaxed text-sm">{item.answer}</p>
                </div>
              ))}
            </div>
          )}

          {renderFeedbackSection()}

          <div className="mt-6">
            <Button
              variant="neon"
              onClick={() => goTab('messages')}
              className="w-full py-3"
            >
              {t('support.contact_button')}
            </Button>
          </div>
        </div>

        {renderFooterNav('help')}
      </div>
    );
  };

  // ───────── Home / Messages / Help ─────────

  const categories: { id: Exclude<DetailView, null>; labelKey: string; descKey: string; countKey: string }[] = [
    { id: 'ingyen-italok', labelKey: 'support.categories.free_drinks', descKey: 'support.help.free_drinks_desc', countKey: 'support.help.free_drinks_count' },
    { id: 'jutalmak', labelKey: 'support.categories.points_rewards', descKey: 'support.help.points_rewards_desc', countKey: 'support.help.points_rewards_count' },
    { id: 'regisztracio', labelKey: 'support.categories.account_registration', descKey: 'support.help.account_registration_desc', countKey: 'support.help.account_registration_count' },
    { id: 'ajanlas', labelKey: 'support.categories.referrals_sharing', descKey: 'support.help.referrals_desc', countKey: 'support.help.referrals_count' },
  ];

  const renderHomeView = () => (
    <div className="flex flex-col h-full bg-nf-background">
      {renderHeader('Come Get It')}

      <div className="flex-1 overflow-y-auto p-4">
        <div className="mb-6">
          <h3 className="text-2xl font-bold text-white mb-1">
            {t('support.home.greeting_title')}
          </h3>
          <p className="text-sm text-white/60">{t('support.home.greeting_subtitle')}</p>
        </div>

        <div className="space-y-2.5 mb-6">
          <Button
            variant="neon"
            onClick={() => goTab('messages')}
            className="w-full h-12 justify-between text-base"
          >
            <span>{t('support.home.write_message')}</span>
            <Send className="w-4 h-4" />
          </Button>

          <button
            onClick={() => goTab('help')}
            className="w-full h-12 px-5 rounded-full bg-white/5 hover:bg-white/10 border border-nf-border hover:border-nf-primary/50 text-white font-medium text-base flex items-center justify-between transition-all"
          >
            <span>{t('support.home.search_help')}</span>
            <Search className="w-4 h-4 text-nf-primary" />
          </button>
        </div>

        <p className="text-[11px] uppercase tracking-wider text-white/40 font-semibold mb-2 px-1">
          Gyakori témák
        </p>
        <div className="flex flex-wrap gap-2">
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => openDetailView(c.id)}
              className="px-4 py-2 rounded-full bg-nf-surface-alt border border-nf-border text-white/85 text-xs font-medium hover:border-nf-primary hover:text-nf-primary transition-all"
            >
              {t(c.labelKey)}
            </button>
          ))}
        </div>
      </div>

      {renderFooterNav('home')}
    </div>
  );

  const renderMessagesView = () => (
    <div className="flex flex-col h-full bg-nf-background">
      {renderHeader(t('support.tabs.messages'))}

      <div className="flex-1 flex flex-col items-center justify-center p-6">
        <div className="bg-nf-primary/10 border border-nf-primary/30 rounded-full p-5 mb-4 shadow-[0_0_30px_rgba(0,188,212,0.25)]">
          <MessageCircle className="w-8 h-8 text-nf-primary" strokeWidth={1.5} />
        </div>
        <h3 className="text-lg font-bold text-white mb-2">{t('support.messages.empty_title')}</h3>
        <p className="text-white/60 text-center text-sm max-w-sm">
          {t('support.messages.empty_desc')}
        </p>
      </div>

      <div className="p-3 bg-nf-surface/95 backdrop-blur-sm border-t border-nf-border">
        <div className="flex gap-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={t('support.messages.input_placeholder')}
            className="flex-1 bg-nf-surface-alt border border-nf-border rounded-full px-4 py-2.5 text-white placeholder-white/40 focus:outline-none focus:border-nf-primary focus:ring-2 focus:ring-nf-primary/30 text-sm"
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          />
          <Button
            variant="neon"
            size="icon"
            onClick={handleSendMessage}
            className="rounded-full h-10 w-10 shrink-0"
            aria-label="Küldés"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {renderFooterNav('messages')}
    </div>
  );

  const renderHelpView = () => (
    <div className="flex flex-col h-full bg-nf-background">
      {renderHeader(t('support.tabs.help'))}

      <div className="flex-1 overflow-y-auto p-4">
        <div className="relative mb-5">
          <input
            type="text"
            placeholder={t('support.help.search_placeholder')}
            className="w-full bg-nf-surface-alt border border-nf-border rounded-full px-4 py-2.5 pr-10 text-white placeholder-white/40 focus:outline-none focus:border-nf-primary focus:ring-2 focus:ring-nf-primary/30 text-sm"
          />
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50" />
        </div>

        <p className="text-[11px] uppercase tracking-wider text-white/40 font-semibold mb-3 px-1">
          {t('support.help.collections_count')} · Válassz témát
        </p>

        <div className="space-y-2.5">
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => openDetailView(c.id)}
              className="w-full bg-nf-surface-alt border border-nf-border rounded-2xl p-4 hover:border-nf-primary/60 hover:bg-nf-surface transition-all text-left group"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-white text-sm mb-1 group-hover:text-nf-primary transition-colors">
                    {t(c.labelKey)}
                  </h3>
                  <p className="text-xs text-white/60 mb-1.5 leading-snug">{t(c.descKey)}</p>
                  <span className="text-[10px] text-nf-primary font-medium">{t(c.countKey)}</span>
                </div>
                <span className="text-nf-primary text-lg leading-none">›</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {renderFooterNav('help')}
    </div>
  );

  const renderCurrentView = () => {
    if (detailView) return renderFAQDetail(detailView);
    if (currentTab === 'messages') return renderMessagesView();
    if (currentTab === 'help') return renderHelpView();
    return renderHomeView();
  };

  return (
    <>
      {!isOpen && (
        <button
          onClick={toggleSupport}
          aria-label="Súgó megnyitása"
          className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-nf-primary hover:bg-nf-primary-hover rounded-full shadow-[0_0_30px_rgba(0,188,212,0.55)] hover:shadow-[0_0_40px_rgba(0,188,212,0.75)] flex items-center justify-center transition-all duration-300 hover:scale-105"
        >
          <MessageCircle className="w-6 h-6 text-black" strokeWidth={2} />
        </button>
      )}

      {isOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40"
            onClick={toggleSupport}
          />
          <div className="fixed inset-0 z-50 md:flex md:items-end md:justify-end md:p-6">
            <div className="w-full h-full md:w-[420px] md:h-[640px] lg:h-[680px] bg-nf-background md:rounded-2xl shadow-2xl border border-nf-border overflow-hidden relative">
              {renderCurrentView()}
            </div>
          </div>
        </>
      )}
    </>
  );
};
