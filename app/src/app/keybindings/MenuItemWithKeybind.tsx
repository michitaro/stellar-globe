import { MenuItemProps } from "@szhsin/react-menu"
import { memo, useMemo } from "react"
import { useAppKeybinds, useKeybindAction, useKeybindShortcut } from "."
import { MenuItemWithAnnotation } from "../../components/Menu/MenuItemWithAnnotation"
import { convertShortcutToSymbols } from "../../utils/keybindings"


type Props = MenuItemProps & {
  keybind?: keyof ReturnType<typeof useAppKeybinds>
}


export const MenuItemWithKeybind = memo((
  {
    children, keybind, ...rests
  }: Props
) => {
  const action = useKeybindAction(keybind)
  const shortcut = useKeybindShortcut(keybind)
  const shortcutSymbols = useMemo(() => convertShortcutToSymbols(shortcut ?? ''), [shortcut])
  return (
    <MenuItemWithAnnotation
      annotation={shortcutSymbols}
      onClick={action}
      {...rests}
    >
      {children}
    </MenuItemWithAnnotation>
  )
})
