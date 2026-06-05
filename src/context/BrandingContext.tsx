import { createContext, useContext, useState, type ReactNode } from 'react';

interface BrandingContextValue {
  logoUrl:       string | null;
  schoolName:    string;
  schoolSub:     string;
  setLogoUrl:    (url: string | null) => void;
  setSchoolName: (name: string) => void;
  setSchoolSub:  (sub: string) => void;
}

const BrandingContext = createContext<BrandingContextValue>({
  logoUrl: null, schoolName: 'Bright Stars', schoolSub: 'Primary School',
  setLogoUrl: () => {}, setSchoolName: () => {}, setSchoolSub: () => {},
});

export function BrandingProvider({ children }: { children: ReactNode }) {
  const [logoUrl, setLogoUrlState]       = useState<string | null>(() => localStorage.getItem('brand_logo'));
  const [schoolName, setSchoolNameState] = useState(() => localStorage.getItem('brand_name') ?? 'Bright Stars');
  const [schoolSub, setSchoolSubState]   = useState(() => localStorage.getItem('brand_sub')  ?? 'Primary School');

  const setLogoUrl = (url: string | null) => {
    setLogoUrlState(url);
    try {
      url ? localStorage.setItem('brand_logo', url) : localStorage.removeItem('brand_logo');
    } catch { /* quota exceeded — logo still shows in session */ }
  };

  const setSchoolName = (name: string) => {
    setSchoolNameState(name);
    localStorage.setItem('brand_name', name);
  };

  const setSchoolSub = (sub: string) => {
    setSchoolSubState(sub);
    localStorage.setItem('brand_sub', sub);
  };

  return (
    <BrandingContext.Provider value={{ logoUrl, schoolName, schoolSub, setLogoUrl, setSchoolName, setSchoolSub }}>
      {children}
    </BrandingContext.Provider>
  );
}

export const useBranding = () => useContext(BrandingContext);
