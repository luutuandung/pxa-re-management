import type React from 'react';
import { useTranslation } from 'react-i18next';
import userIcon from '../../assets/icon_user.svg';
import Icon from '../atoms/Icon';

interface UserMenuProps {
  isOpen: boolean;
  onToggle: () => void;
}

const UserMenu: React.FC<UserMenuProps> = ({ isOpen, onToggle }) => {
  const { t } = useTranslation('common');

  return (
    <div className="relative">
      <button type="button" className="p-2 hover:bg-gray-100 rounded" onClick={onToggle}>
        <Icon src={userIcon} alt="User" />
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-1 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-10">
          <button
            type="button"
            onClick={() => {
              /* ユーザー設定のアクション */
            }}
            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 first:rounded-t-md last:rounded-b-md"
          >
            {t('userMenu.userSettings')}
          </button>
          <button
            type="button"
            onClick={() => {
              /* パスワード変更のアクション */
            }}
            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            {t('userMenu.passwordChange')}
          </button>
          <button
            type="button"
            onClick={() => {
              /* ログアウトのアクション */
            }}
            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 last:rounded-b-md"
          >
            {t('userMenu.logout')}
          </button>
        </div>
      )}
    </div>
  );
};

export default UserMenu;
