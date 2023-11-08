import { MenuItemProps } from "@szhsin/react-menu"
import { memo } from "react"
import { useAppKeybinds, useKeybindAction, useKeybindShortcut } from "."
import { MenuItemWithAnnotation } from "../../components/Menu/MenuItemWithAnnotation"


type Props = MenuItemProps & {
  keybind: keyof ReturnType<typeof useAppKeybinds>
}


export const MenuItemWithKeybind = memo((
  {
    children, keybind, ...rests
  }: Props
) => {
  const action = useKeybindAction(keybind)
  const shortcut = useKeybindShortcut(keybind)
  return (
    <MenuItemWithAnnotation
      annotation={shortcut}
      onClick={action}
      {...rests}
    >
      {children}
    </MenuItemWithAnnotation>
  )
})
