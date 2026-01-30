import type React from 'react';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import homeIcon from '../../assets/icon_home.svg';
import Icon from '../atoms/Icon';
import Logo from '../atoms/Logo';
import LanguageSelector from '../molecules/LanguageSelector';
import NavigationDropdown from '../molecules/NavigationDropdown';
import SystemSelector from '../molecules/SystemSelector';
import UserMenu from '../molecules/UserMenu';

const Header: React.FC = () => {
  const { t } = useTranslation('common');
  const [headerMenus, setHeaderMenus] = useState({
    calculation: false,
    costRegistration: false,
    quantity: false,
    master: false,
    language: false,
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
            language: false,
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
        language: false,
        user: false,
      };

      // クリックしたメニューの状態を反転
      newMenus[menu] = !prev[menu];

      return newMenus;
    });
  };

  const calculationItems = [
    { label: t('navigation.items.calculation.manufacturingPlantDesign'), href: '#' },
    { label: t('navigation.items.calculation.salesPlantDesign'), href: '#' },
  ];

  const costRegistrationItems = [
    { label: t('navigation.items.costRegistration.materialCost'), href: '#' },
    { label: t('navigation.items.costRegistration.manHours'), href: '#' },
    { label: t('navigation.items.costRegistration.manufacturingCost'), href: '#' },
    { label: t('navigation.items.costRegistration.processingRate'), href: '#' },
    { label: t('navigation.items.costRegistration.planPL'), href: '#' },
    { label: t('navigation.items.costRegistration.businessWeight'), href: '#' },
    { label: t('navigation.items.costRegistration.salesCost'), href: '#' },
    { label: t('navigation.items.costRegistration.salesCostRate'), href: '#' },
  ];

  const quantityItems = [{ label: t('navigation.items.quantity.quantityMaster'), href: '#' }];

  const masterItems = [
    { label: t('navigation.items.master.modelMaster'), href: '#' },
    { label: t('navigation.items.master.manufacturingDestinationMaster'), href: '#' },
    { label: t('navigation.items.master.manufacturingDestinationMasterAutoImport'), href: '#' },
    { label: t('navigation.items.master.manufacturingDestinationConversionMaster'), href: '#' },
    { label: t('navigation.items.master.salesDestinationMaster'), href: '#' },
    { label: t('navigation.items.master.salesDestinationMasterAutoImport'), href: '#' },
    { label: t('navigation.items.master.exchangeRateMaster'), href: '#' },
    { label: t('navigation.items.master.salesCompanyCodeMaster'), href: '#' },
    { label: t('navigation.items.master.manufacturingConsolidationTargetModelMaster'), href: '#' },
    { label: t('navigation.items.master.manufacturingConsolidationMappingMaster'), href: '#' },
    { label: t('navigation.items.master.listPriceMaster'), href: '#' },
    { label: t('navigation.items.master.quantityLinkageModelNumberConversionMaster'), href: '#' },
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
            <LanguageSelector isOpen={headerMenus.language} onToggle={() => toggleHeaderMenu('language')} />
            <UserMenu isOpen={headerMenus.user} onToggle={() => toggleHeaderMenu('user')} />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
