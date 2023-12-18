import { MenuItem } from "@szhsin/react-menu"
import { memo } from "react"
import { Icon } from "../../../components/Icon"
import { MenuBarItem } from "../../../components/Menu/MenuBarItem"
import { setDisplayName } from "../../../utils/setDisplayName"
import { useStateHistory } from "../../store/StateHistoryProvider"
import { appStateHistoryActions, useAppDispatch } from "../../store/hooks"

export const HistoryMenu = memo(() => {
  const history = useStateHistory()
  const dispatch = useAppDispatch()

  return (
    <MenuBarItem label={<Icon type="history" />}>
      {history.records.map((r, index) => (
        <MenuItem
          type='checkbox'
          key={r.id}
          onClick={() => dispatch(appStateHistoryActions.timeTravel({ index }))}
          checked={index === history.currentIndex()}
        >
          {r.summary ?? r.type}
        </MenuItem>
      ))}
    </MenuBarItem>
  )
})

setDisplayName({ HistoryMenu })
