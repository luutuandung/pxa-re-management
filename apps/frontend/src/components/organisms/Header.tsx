import type React from 'react';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import homeIcon from '../../assets/icon_home.svg';
import Icon from '../atoms/Icon';
import Logo from '../atoms/Logo';
import NavigationDropdown from '../molecules/NavigationDropdown';
import SystemSelector from '../molecules/SystemSelector';
import UserMenu from '../molecules/UserMenu';
import LanguageSelector from '../molecules/LanguageSelector';

const Header: React.FC = () => {
  const { t } = useTranslation('common');
  const [headerMenus, setHeaderMenus] = useState({
    calculation: false,
    costRegistration: false,
    quantity: false,
    master: false,
    user: false,
  });

  const [selectedSystem, setSelectedSystem] = useState('0');
  const headerRef = useRef<HTMLDivElement>(null);

  // 外部クリック時にメニューを閉じる
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (headerRef.current && !headerRef.current.contains(event.target as Node)) {
        // いずれかのメニューが開いている場合、すべて閉じる
        const hasOpenMenu = Object.values(headerMenus).some((isOpen) => isOpen);
        if (hasOpenMenu) {
          setHeaderMenus({
            calculation: false,
            costRegistration: false,
            quantity: false,
            master: false,
            user: false,
          });
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [headerMenus]);

  const toggleHeaderMenu = (menu: keyof typeof headerMenus) => {
    setHeaderMenus((prev) => {
      // 他のメニューが開いている場合は閉じて、クリックしたメニューのみを開く
      const newMenus = {
        calculation: false,
        costRegistration: false,
        quantity: false,
        master: false,
        user: false,
      };

      // クリックしたメニューの状態を反転
      newMenus[menu] = !prev[menu];

      return newMenus;
    });
  };

  const calculationItems = [
    { label: '製造工場設計書', href: '#' },
    { label: '販社工場設計書', href: '#' },
  ];

  const costRegistrationItems = [
    { label: '材料費登録', href: '#' },
    { label: '工数登録', href: '#' },
    { label: '製造原価登録', href: '#' },
    { label: '加工レート登録', href: '#' },
    { label: '計画PL登録', href: '#' },
    { label: '業務ウェイト登録', href: '#' },
    { label: '販社原価登録', href: '#' },
    { label: '販社原価レート登録', href: '#' },
  ];

  const quantityItems = [{ label: '台数マスタ登録', href: '#' }];

  const masterItems = [
    { label: '機種マスタ登録', href: '#' },
    { label: '製造仕向け地マスタ登録', href: '#' },
    { label: '製造仕向け地マスタ自動引き込み', href: '#' },
    { label: '製造仕向け地変換マスタ', href: '#' },
    { label: '販社仕向け地マスタ登録', href: '#' },
    { label: '販社仕向け地マスタ自動引き込み', href: '#' },
    { label: '為替レートマスタ登録', href: '#' },
    { label: '販社コードマスタ登録', href: '#' },
    { label: '製造連結対象機種マスタ登録', href: '#' },
    { label: '製造連結マッピングマスタ登録', href: '#' },
    { label: '建値マスタ登録', href: '#' },
    { label: '台数連携機種品番変換マスタ登録', href: '#' },
  ];

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-full mx-auto px-4">
        <div ref={headerRef} className="flex justify-between items-center h-16">
          {/* Logo Area */}
          <div className="flex items-center space-x-4">
            <Logo />
            <SystemSelector value={selectedSystem} onChange={setSelectedSystem} />
            <Link to="/" className="p-2 hover:bg-gray-100 rounded">
              <Icon src={homeIcon} alt="HOME" />
            </Link>
          </div>

          {/* Navigation Menu */}
          <div className="flex items-center space-x-6">
            <NavigationDropdown
              title={t('navigation.calculation')}
              items={calculationItems}
              isOpen={headerMenus.calculation}
              onToggle={() => toggleHeaderMenu('calculation')}
            />

            <NavigationDropdown
              title={t('navigation.costRegistration')}
              items={costRegistrationItems}
              isOpen={headerMenus.costRegistration}
              onToggle={() => toggleHeaderMenu('costRegistration')}
            />

            <NavigationDropdown
              title={t('navigation.quantity')}
              items={quantityItems}
              isOpen={headerMenus.quantity}
              onToggle={() => toggleHeaderMenu('quantity')}
            />

            <NavigationDropdown
              title={t('navigation.master')}
              items={masterItems}
              isOpen={headerMenus.master}
              onToggle={() => toggleHeaderMenu('master')}
              width="w-64"
            />
          </div>

          {/* Language Selector and User Menu */}
          <div className="flex items-center space-x-4">
            <LanguageSelector />  
            <UserMenu isOpen={headerMenus.user} onToggle={() => toggleHeaderMenu('user')} />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
