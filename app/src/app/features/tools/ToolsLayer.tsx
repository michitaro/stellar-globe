import { PanLayer$ } from '@stellar-globe/react-stellar-globe'
import { useAppSelector } from '../../store/hooks'
import { Fragment, memo } from 'react'
import { setDisplayName } from '../../../utils/setDisplayName'
import { NewLinearRegionLayer$ } from './LinearRegionLayer'


export const ToolsLayer = memo(() => {
  const tool = useAppSelector(state => state.tools.tool)

  return (
    <Fragment>
      <PanLayer$ enabled={tool === 'pan'} />
      <NewLinearRegionLayer$ enabled={tool === 'line'} />
    </Fragment>
  )
})
setDisplayName({ ToolsLayer })