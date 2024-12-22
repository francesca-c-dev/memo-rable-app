import { useTheme } from 'next-themes';
import { useTranslation } from 'react-i18next';
import { useAuthenticator } from '@aws-amplify/ui-react';
import { 
  Navbar as NextUINavbar, 
  NavbarContent, 
  NavbarItem, 
  Button, 
  DropdownItem, 
  DropdownTrigger, 
  Dropdown, 
  DropdownMenu,
  Switch,
  NavbarMenuToggle,
  NavbarMenu,
  NavbarMenuItem
} from "@nextui-org/react";
import { Sun, Moon, Languages, LogOut, Plus, Check } from "lucide-react";
import { useState } from 'react';

interface NavbarProps {
  onCreateNote: () => void;
}

export default function Navbar({ onCreateNote }: NavbarProps) {
  const { t, i18n } = useTranslation();
  const { theme, setTheme } = useTheme();
  const { signOut } = useAuthenticator();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const languages = [
    { code: 'en', label: 'English' },
    { code: 'it', label: 'Italiano' }
  ];

  return (
    <NextUINavbar
      maxWidth="full"
      position="sticky"
      className="bg-primary-600 dark:bg-primary-800"
      isMenuOpen={isMenuOpen}
      onMenuOpenChange={setIsMenuOpen}
    >
      {/* Always visible content */}
      <NavbarContent className="sm:hidden" justify="start">
      <NavbarContent className="basis-1/5 sm:basis-full" justify="start">
        <img src="/logo.svg" alt="Logo" className="h-8 w-auto mr-3" />
        <p className="text-white font-bold font-logo text-3xl">{"MEMOrable"}</p>
      </NavbarContent>
      </NavbarContent>

      <NavbarContent className="hidden sm:flex" justify="start">
      <NavbarContent className="basis-1/5 sm:basis-full" justify="start">
        <img src="/logo.svg" alt="Logo" className="h-8 w-auto mr-3" />
        <p className="text-white font-bold font-logo text-3xl">{"MEMOrable"}</p>
      </NavbarContent>
      </NavbarContent>


      {/* Desktop Menu */}
      <NavbarContent  justify="end">
      <NavbarItem>
          <Button
            color="primary"
            variant="flat"
            startContent={<Plus size={20} />}
            onPress={onCreateNote}
            className="bg-white text-primary-600"
          >
            {t('notes.create')}
          </Button>
        </NavbarItem>

        <NavbarItem className="hidden sm:flex" >
        <Dropdown>
            <DropdownTrigger>
              <Button
                isIconOnly
                variant="light"
                className="text-white dark:text-primary-300"
              >
                <Languages size={20} />
              </Button>
            </DropdownTrigger>
            <DropdownMenu
              aria-label="Language selection"
              onAction={(key) => i18n.changeLanguage(key as string)}
              selectedKeys={new Set([i18n.language])}
            >
              {languages.map((lang) => (
                <DropdownItem
                  key={lang.code}
                  endContent={
                    i18n.language === lang.code ? (
                      <Check className="text-primary-500" />
                    ) : null
                  }
                  className={
                    i18n.language === lang.code
                      ? "font-bold text-primary-500"
                      : ""
                  }
                >
                  {lang.label}
                </DropdownItem>
              ))}
            </DropdownMenu>
          </Dropdown>
        </NavbarItem>

        <NavbarItem className="hidden sm:flex" >
          <Switch
            defaultSelected={theme === 'dark'}
            size="lg"
            color="default"
            startContent={<Sun className="text-white" />}
            endContent={<Moon className="text-white" />}
            onChange={(e) => setTheme(e.target.checked ? 'dark' : 'light')}
          />
        </NavbarItem>

        <NavbarItem className="hidden sm:flex" >
        <Button
            isIconOnly
            className="!text-[#d61c0f] bg-white "
            variant="light"
            onPress={signOut}
          >
            <LogOut size={20} />
          </Button>
        </NavbarItem>
             {/* Mobile Menu Toggle */}
      <NavbarItem className="sm:hidden" >
        <NavbarMenuToggle className="!bg-transparent text-white" />
      </NavbarItem>

      </NavbarContent>

 
      {/* Mobile Menu */}
      <NavbarMenu className="bg-primary-600 dark:bg-primary-800 pt-6">
        <NavbarMenuItem>
          <div className="flex items-center gap-2 py-2">
            <Languages size={20} className="text-white" />
            <div className="flex gap-4">
              {languages.map((lang) => (
                <Button
                  key={lang.code}
                  variant="light"
                  className={`text-white ${i18n.language === lang.code ? 'font-bold' : ''}`}
                  onPress={() => i18n.changeLanguage(lang.code)}
                >
                  {lang.label}
                </Button>
              ))}
            </div>
          </div>
        </NavbarMenuItem>

        <NavbarMenuItem>
          <div className="flex items-center gap-2 py-2">
            {theme === 'dark' ? 
              <Moon size={20} className="text-white" /> : 
              <Sun size={20} className="text-white" />
            }
            <Switch
              defaultSelected={theme === 'dark'}
              size="lg"
              color="default"
              onChange={(e) => setTheme(e.target.checked ? 'dark' : 'light')}
            />
          </div>
        </NavbarMenuItem>

        <NavbarMenuItem>
        <Button
            isIconOnly
            variant="light"
            onPress={signOut}
            startContent={<div className="flex gap-2 p-2"><LogOut size={20} /> <p>{t('auth.signOut')}</p> </div>}
            className="!text-[#d61c0f] bg-white min-w-[25%] justify-start"
        
          >
            
          </Button>
        </NavbarMenuItem>
      </NavbarMenu>
    </NextUINavbar>
  );
}