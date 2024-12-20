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
  Switch
} from "@nextui-org/react";
import { Sun, Moon, Languages, LogOut, Plus } from "lucide-react";

interface NavbarProps {
  onCreateNote: () => void;
}

export default function Navbar({ onCreateNote }: NavbarProps) {
  const { t, i18n } = useTranslation();
  const { theme, setTheme } = useTheme();
  const { signOut } = useAuthenticator();

  const languages = [
    { code: 'en', label: 'English' },
    { code: 'it', label: 'Italiano' }
  ];

  return (
    <NextUINavbar
      maxWidth="full"
      position="sticky"
      className="border-b border-default-200"
    >
      <NavbarContent className="basis-1/5 sm:basis-full" justify="start">
        <h1 className="text-xl font-bold">{t('notes.title')}</h1>
      </NavbarContent>

      <NavbarContent className="flex gap-4" justify="end">
        <NavbarItem>
          <Button
            color="primary"
            variant="flat"
            startContent={<Plus size={20} />}
            onPress={onCreateNote}
          >
            {t('notes.create')}
          </Button>
        </NavbarItem>

        <NavbarItem>
          <Dropdown>
            <DropdownTrigger>
              <Button isIconOnly variant="light">
                <Languages size={20} />
              </Button>
            </DropdownTrigger>
            <DropdownMenu 
              aria-label="Language selection"
              onAction={(key) => i18n.changeLanguage(key as string)}
            >
              {languages.map((lang) => (
                <DropdownItem key={lang.code}>
                  {lang.label}
                </DropdownItem>
              ))}
            </DropdownMenu>
          </Dropdown>
        </NavbarItem>

        <NavbarItem>
          <Switch
            defaultSelected={theme === 'dark'}
            size="lg"
            color="secondary"
            thumbIcon={({ isSelected }) =>
              isSelected ? <Moon size={16} /> : <Sun size={16} />
            }
            onChange={(e) => setTheme(e.target.checked ? 'dark' : 'light')}
          />
        </NavbarItem>

        <NavbarItem>
          <Button
            isIconOnly
            color="danger"
            variant="light"
            onPress={signOut}
          >
            <LogOut size={20} />
          </Button>
        </NavbarItem>
      </NavbarContent>
    </NextUINavbar>
  );
}