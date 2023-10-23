import React, { FC, useCallback } from 'react';

import classNames from 'classnames';
import { useLocation } from 'react-router-dom';

import { Menu, applyDataAttr } from '@sovryn/ui';

import { MenuItemWithRouter } from '../../../../2_molecules/MenuItemWithRouter/MenuItemWithRouter';
import { NavLink } from '../../../../2_molecules/NavLink/NavLink';
import { useIsMobile } from '../../../../../hooks/useIsMobile';
import { MenuItem } from '../../Header.constants';
import { NavDropdown } from './NavDropdown';

export type NavItemProps = {
  item: MenuItem;
  onClick?: () => void;
};

export const NavItem: FC<NavItemProps> = ({ item, onClick }) => {
  const { isMobile } = useIsMobile();
  const { pathname } = useLocation();

  const isPathActive = useCallback(
    (path: string) => pathname.startsWith(path),
    [pathname],
  );

  return item.submenu ? (
    <NavDropdown
      text={item.text}
      className={classNames(
        'rounded-b-none text-gray-30 font-normal text-sm hover:bg-gray-70 hover:text-gray-10 min-w-auto w-full lg:w-auto lg:rounded',
        {
          'bg-transparent border-none': !isPathActive(item.url),
          'bg-gray-70 border-gray-70': isMobile,
        },
      )}
      active={isPathActive(item.url)}
      closeOnClick
    >
      <Menu className="rounded-t-none rounded-b px-2 py-3 lg:rounded lg:p-1">
        {item.submenu.map(({ text, label, url }) => (
          <MenuItemWithRouter
            key={text}
            text={text}
            label={!isMobile && label}
            link={url}
            dataAttribute={`dapp-menu-${text.toLowerCase().replace(' ', '-')}`}
            isActive={isPathActive(url)}
            className="no-underline"
            onClick={onClick}
          />
        ))}
      </Menu>
    </NavDropdown>
  ) : (
    <NavLink
      key={item.text}
      to={item.url}
      end
      onClick={onClick}
      {...applyDataAttr(`dapp-menu-${item.text.toLowerCase()}`)}
    >
      {item.text}
    </NavLink>
  );
};
