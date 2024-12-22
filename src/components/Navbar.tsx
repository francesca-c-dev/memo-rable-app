import { useTheme } from "next-themes";
import { useTranslation } from "react-i18next";
import { useAuthenticator } from "@aws-amplify/ui-react";
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
} from "@nextui-org/react";
import { Sun, Moon, Languages, LogOut, Plus, Check } from "lucide-react";

interface NavbarProps {
  onCreateNote: () => void;
}

export default function Navbar({ onCreateNote }: NavbarProps) {
  const { t, i18n } = useTranslation();
  const { theme, setTheme } = useTheme();
  const { signOut } = useAuthenticator();

  const languages = [
    { code: "en", label: "English" },
    { code: "it", label: "Italiano" },
  ];

  return (
    <NextUINavbar
      maxWidth="full"
      position="sticky"
      className="bg-primary-600 dark:bg-primary-600"
    >
      <NavbarContent className="basis-1/5 sm:basis-full" justify="start">
        <img src="/logo.svg" alt="Logo" className="h-8 w-auto mr-3" />
        <p className="text-white font-bold font-logo text-3xl">{"MEMOrable"}</p>
      </NavbarContent>

      <NavbarContent className="flex gap-4" justify="end">
        <NavbarItem>
          <Button
            color="primary"
            variant="flat"
            startContent={<Plus size={20} />}
            onPress={onCreateNote}
          >
            {t("notes.create")}
          </Button>
        </NavbarItem>

        <NavbarItem>
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

        <NavbarItem>
          <Switch
            defaultSelected={theme === "dark"}
            size="lg"
            color="primary"
            startContent={<Sun className="text-primary-500" />}
            endContent={<Moon className="text-primary-300" />}
            onChange={(e) => setTheme(e.target.checked ? "dark" : "light")}
          />
        </NavbarItem>

        <NavbarItem>
          <Button
            isIconOnly
            className="!text-[#d61c0f] bg-white "
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
