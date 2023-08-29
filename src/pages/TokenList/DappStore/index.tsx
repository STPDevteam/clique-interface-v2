import { Box, Typography, Grid } from '@mui/material'
import Image from 'components/Image'
import banner from 'assets/images/store_banner.png'
// import nftIcon from 'assets/images/nftIcon.png'
// import swapIcon from 'assets/images/swapIcon.png'
import rewardsIcon from 'assets/images/rewardsIcon.png'
import sbtIcon from 'assets/images/soulboundIcon.png'
import createDaoIcon from 'assets/images/createDaoIcon.png'
import createTokenIcon from 'assets/images/createTokenIcon.png'
// import nftCardIcon from 'assets/images/nftcard_icon.png'
import sdkIcon from 'assets/images/sdkIcon.png'
import accountIcon from 'assets/images/accountCard_icon.png'
import assetPortalIcon from 'assets/images/assetPortalCard_icon.png'
import { routes } from 'constants/routes'
import { useNavigate } from 'react-router-dom'
import chainLogo0 from 'assets/images/chainLogo0.png'
import chainLogo1 from 'assets/images/chainLogo1.png'
import chainLogo2 from 'assets/images/chainLogo2.png'
import chainLogo3 from 'assets/images/chainLogo3.png'
import chainLogo4 from 'assets/images/chainLogo4.png'
import chainLogo5 from 'assets/images/chainLogo5.png'
import { useActiveWeb3React } from 'hooks'
import { useWalletModalToggle } from 'state/application/hooks'
import { useLoginSignature, useUserInfo } from 'state/userInfo/hooks'
import CreateNftModal from 'pages/Nft/CreateNftModal'
import useModal from 'hooks/useModal'

export enum ToolsCardsTitle {
  DAORewards = 'Clique Rewards',
  CreateDAO = 'Create DAO',
  CreateToken = 'Create Token',
  SDK = 'SDK',
  CreateSBT = 'Create Soulbound Token of DAO',
  Nft = 'Create an account as NFT',
  AccountGenerator = 'Account Generator',
  AssetPortal = 'Asset Portal'
}

const cardsData = [
  // {
  //   title: 'Clique NFT Pass',
  //   icon: nftIcon,
  //   des: 'Clique NFT Pass is a NFT collection for Clique and STP users. Holders have the chance to participate ...',
  //   supportChainsIcon: [chainLogo0],
  //   bgColor: 'linear-gradient(269.62deg, #EAF7FF 0.25%, #FEFFFF 99.64%)',
  //   link: ''
  // },
  // {
  //   title: 'SWAP',
  //   icon: swapIcon,
  //   des: 'Flash exchange with limited time, low price and low gas fee.',
  //   supportChainsIcon: 'all',
  //   bgColor: 'linear-gradient(270.34deg, #FFF6DF 0.3%, #FFFDF9 99.74%)',
  //   route: ''
  // },
  {
    title: ToolsCardsTitle.DAORewards,
    icon: rewardsIcon,
    des: 'DAO airdrop event list page, where you can create events and receive rewards.',
    supportChainsIcon: 'all',
    bgColor: 'linear-gradient(270.19deg, #EEFFEE 27.66%, #FBFFF9 99.85%)',
    route: routes.Activity
  },
  {
    title: ToolsCardsTitle.CreateDAO,
    icon: createDaoIcon,
    des: 'Add a DAO on Clique',
    supportChainsIcon: [chainLogo0, chainLogo1, chainLogo2, chainLogo3, chainLogo4, chainLogo5],
    bgColor: 'linear-gradient(270.19deg, #F5F1FF 27.66%, #FEFEFF 99.85%)',
    route: routes.CreateDao
  },
  {
    title: ToolsCardsTitle.CreateToken,
    icon: createTokenIcon,
    des: 'You can use this function to create special tokens.',
    supportChainsIcon: [chainLogo0, chainLogo1, chainLogo2, chainLogo3, chainLogo4, chainLogo5],
    bgColor: 'linear-gradient(270.19deg, #FFFEEC 27.66%, #FFFFF9 99.85%)',
    route: routes.CreatorToken
  },
  {
    title: ToolsCardsTitle.SDK,
    icon: sdkIcon,
    des: 'Provides easy access to the high level interactions to be governance with an Clique DAO.',
    supportChainsIcon: '',
    bgColor: 'linear-gradient(270deg, #EEFCFB 0%, #F9FFFF 100%)',
    link: 'https://www.npmjs.com/package/@myclique/governance-sdk'
  },
  {
    title: ToolsCardsTitle.CreateSBT,
    icon: sbtIcon,
    des: 'Create Soulbound Token for your DAOs.',
    supportChainsIcon: 'all',
    bgColor: 'linear-gradient(270deg, #EEFCFB 0%, #F9FFFF 100%)',
    route: routes.CreateSoulToken
  },
  // {
  //   title: ToolsCardsTitle.Nft,
  //   icon: nftCardIcon,
  //   des: 'ERC-6551 turns every NFT into a smart wallet that can own tokens and interact with dApps across the Ethereum ecosystem.',
  //   supportChainsIcon: [chainLogo0],
  //   bgColor: 'linear-gradient(270deg, #EEF4FC 0%, #F9FCFF 100%)',
  //   route: routes.NftAccount
  // },
  {
    title: ToolsCardsTitle.AccountGenerator,
    icon: accountIcon,
    des: 'One-click on-chainactivity using accountabstraction.',
    supportChainsIcon: [chainLogo0],
    bgColor: 'linear-gradient(270deg, #EEFCFB 0%, #F9FFFF 100%)',
    route: routes.NftAccount
  },
  {
    title: ToolsCardsTitle.AssetPortal,
    icon: assetPortalIcon,
    des: 'Buy, sell and hold any onchain asset throughcustom marketplace.',
    supportChainsIcon: 'soon',
    bgColor: 'linear-gradient(270deg, #F8EEFC 0%, #F9FFFF 100%)'
  }
]

function CardItem({ title, icon, des, supportChainsIcon, bgColor, link, route }: any) {
  const navigate = useNavigate()
  const toggleWalletModal = useWalletModalToggle()
  const loginSignature = useLoginSignature()
  const { account } = useActiveWeb3React()
  const userSignature = useUserInfo()
  const { showModal } = useModal()
  return (
    <Box
      sx={{
        height: 264,
        border: '1px solid #d4d7e2',
        borderRadius: '10px',
        cursor: !link && !route ? 'no-drop' : 'pointer',
        '&:hover': {
          border: '2px solid',
          borderColor: '#97B7EF'
        },
        '&:hover .headerCon': {
          borderColor: '#97B7EF'
        },
        '& .headerCon': {
          width: '100%',
          borderRadius: '8px 8px 0 0',
          height: 94,
          display: 'flex',
          padding: '24px 27px',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexDirection: 'row',
          background: bgColor,
          '& img': {
            width: 48
          }
        }
      }}
      onClick={() => {
        if (!route && !link) return
        if (
          title === ToolsCardsTitle.CreateSBT ||
          title === ToolsCardsTitle.CreateDAO ||
          title === ToolsCardsTitle.CreateToken ||
          title === ToolsCardsTitle.AccountGenerator
        ) {
          if (!account) return toggleWalletModal()
          if (!userSignature) return loginSignature()
        }
        if (title === ToolsCardsTitle.AccountGenerator) {
          showModal(<CreateNftModal />)
        } else {
          route ? navigate(route) : window.open(link, '_blank')
        }
      }}
    >
      <Box className="headerCon">
        <Typography fontSize={18} lineHeight={'20px'} color={'#3F5170'} fontWeight={700}>
          {title}
        </Typography>
        <Image src={icon} />
      </Box>
      <Box padding={'13px 20px'} height={92} minHeight={'fit-content'}>
        <Typography fontSize={14} lineHeight={'20px'} color={'#3f5170'} textAlign={'left'} width={'100%'}>
          {des}
        </Typography>
      </Box>
      <Box padding={'10px 20px'}>
        <Typography fontSize={14} lineHeight={'20px'} color={'#8D8EA5'} textAlign={'left'} width={'100%'}>
          Support Chains
        </Typography>
        {supportChainsIcon === 'all' ? (
          <Typography
            mt={10}
            fontWeight={400}
            fontSize={14}
            lineHeight={'20px'}
            color={'#3F5170'}
            textAlign={'left'}
            width={'100%'}
          >
            All Chain
          </Typography>
        ) : supportChainsIcon === '' ? (
          <Typography mt={10} fontSize={14} lineHeight={'20px'} color={'#3F5170'} textAlign={'left'} width={'100%'}>
            -
          </Typography>
        ) : supportChainsIcon === 'soon' ? (
          <Typography mt={10} fontSize={14} lineHeight={'20px'} color={'#3F5170'} textAlign={'left'} width={'100%'}>
            Coming soon...
          </Typography>
        ) : (
          <Box
            mt={8}
            sx={{
              gap: 8,
              display: 'flex',
              justifyContent: 'flex-start',
              flexDirection: 'row'
            }}
          >
            {supportChainsIcon.map((item: string, index: number) => (
              <Image src={item} width={24} key={index} />
            ))}
          </Box>
        )}
      </Box>
    </Box>
  )
}

export default function Index() {
  return (
    <Box
      sx={{
        maxWidth: 1440,
        margin: 'auto',
        padding: '44px 120px',
        '& .top_banner': {
          width: 'calc(100% - 18px)',
          height: '100%',
          objectFit: 'cover'
        }
      }}
    >
      <Box sx={{ position: 'relative', height: 197, marginLeft: 18 }}>
        <Image className="top_banner" src={banner} style={{ position: 'absolute', zIndex: 0, borderRadius: '8px' }} />
        <Typography
          sx={{
            color: '#fff',
            fontSize: '50px',
            fontWeight: 700,
            lineHeight: '77px',
            position: 'absolute',
            top: 34,
            left: 70
          }}
        >
          Tools
        </Typography>
        <Typography
          sx={{
            color: '#fff',
            fontSize: '16px',
            fontWeight: 500,
            lineHeight: '20px',
            position: 'absolute',
            top: 120,
            left: 72
          }}
        >
          The most powerful set of web3 development tools to build
        </Typography>
      </Box>
      <Grid mt={12} container>
        {cardsData.map((item, index) => (
          <Grid padding={'18px 0 0 18px'} key={index} item lg={3} md={4} sm={6} xs={12}>
            <CardItem {...item} />
          </Grid>
        ))}
      </Grid>
    </Box>
  )
}
