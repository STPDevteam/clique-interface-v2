import { useActiveWeb3React } from 'hooks'
import { useWalletModalToggle } from 'state/application/hooks'
// import CreateSelectModal from './CreateSelectModal'
// import useModal from 'hooks/useModal'
import { Box, styled, Typography, useTheme } from '@mui/material'
import addDaoIcon from 'assets/images/add-dao-icon.png'
import createTokenIcon from 'assets/images/create-token-ball.png'
import Image from 'components/Image'
import Collapse from 'components/Collapse'
import { useHistory } from 'react-router-dom'
import { routes } from 'constants/routes'
import useBreakpoint from 'hooks/useBreakpoint'

const Wrapper = styled('main')(({ theme }) => ({
  paddingBottom: 40,
  ['& .item-create']: {
    width: 344,
    height: 327,
    cursor: 'pointer',
    background: theme.bgColor.bg5,
    borderRadius: theme.borderRadius.default,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    transition: 'all 0.4s',
    '&:hover': {
      border: `2px solid ${theme.palette.primary.main}`
    }
  },
  [theme.breakpoints.down('sm')]: {
    padding: '0 16px 20px',
    ['& .item-create']: {
      width: 159,
      height: 159
    }
  }
}))

export default function Index() {
  const { account } = useActiveWeb3React()
  const toggleWalletModal = useWalletModalToggle()
  const theme = useTheme()
  const history = useHistory()
  const isSmDown = useBreakpoint('sm')
  return (
    <Wrapper>
      <Box
        maxWidth={'808px'}
        sx={{
          pt: { sm: 100, xs: 20 }
        }}
        width="100%"
        margin={'auto'}
        display="flex"
        justifyContent={'space-between'}
      >
        <Box>
          <Box
            className="item-create"
            onClick={() => {
              if (!account) {
                toggleWalletModal()
                return
              }
              history.push(routes.CreateDao)
            }}
          >
            <Image src={addDaoIcon} width={isSmDown ? 82 : 182}></Image>
          </Box>
          <Typography
            mt={20}
            fontWeight={600}
            fontSize={isSmDown ? 14 : 20}
            textAlign="center"
            color={theme.palette.text.primary}
          >
            Add a DAO
          </Typography>
        </Box>
        <Box>
          <Box
            className="item-create"
            onClick={() => {
              if (!account) {
                toggleWalletModal()
                return
              }
              history.push(routes.CreatorToken)
            }}
          >
            <Image src={createTokenIcon} width={isSmDown ? 82 : 182}></Image>
          </Box>
          <Typography
            mt={20}
            fontWeight={600}
            fontSize={isSmDown ? 14 : 20}
            textAlign="center"
            color={theme.palette.text.primary}
          >
            Create a Token
          </Typography>
        </Box>
      </Box>

      <Box maxWidth={'100%'} pt={50} width="808px" margin={'auto'}>
        <Typography fontWeight={600} fontSize={20} style={{ textAlign: 'left' }}>
          FAQ
        </Typography>
        <Box mt={5}>
          <Collapse title={`What does 'Add a DAO' mean?`}>
            It means you are setting up the governance framework for your project here on Clique using a token that
            already exists.
          </Collapse>
          <Collapse title={`What does 'Create a token' mean?`}>
            It means you are creating a new governance token for your DAO right here on Clique. You will be able to
            reserve and distribute the token for your DAO members and community, which will facilitate governance of
            your DAO.
          </Collapse>
          <Collapse title={'What token can be used as governance token?'}>
            Currently we allow any publicly listed token on Ethereum to be used as governance token. We will continue to
            explore more token on most mainstream EVM compatible chains.
          </Collapse>
        </Box>
      </Box>
    </Wrapper>
  )
}
