import { Box } from '@mui/material'
import CrateBg from 'assets/images/cratedao_bg.png'
import { ReactComponent as Web3Title } from 'assets/svg/web3title.svg'

export default function index() {
  return (
    <Box sx={{ height: '100%', width: '100%' }}>
      <Box>
        <img src={CrateBg} alt="" />
        <Web3Title />
      </Box>
    </Box>
  )
}
