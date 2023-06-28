import { Box, Typography, Grid } from '@mui/material'
import Image from 'components/Image'
import banner from 'assets/images/store_banner.png'
// import nftIcon from 'assets/images/nftIcon.png'
// import swapIcon from 'assets/images/swapIcon.png'
import rewardsIcon from 'assets/images/rewardsIcon.png'
// import soulboundIcon from 'assets/images/soulboundIcon.png'
import createDaoIcon from 'assets/images/createDaoIcon.png'
import createTokenIcon from 'assets/images/createTokenIcon.png'
import sdkIcon from 'assets/images/sdkIcon.png'
import { routes } from 'constants/routes'
import { useHistory } from 'react-router-dom'
import chainLogo0 from 'assets/images/chainLogo0.png'
import chainLogo1 from 'assets/images/chainLogo1.png'
import chainLogo2 from 'assets/images/chainLogo2.png'
import chainLogo3 from 'assets/images/chainLogo3.png'
import chainLogo4 from 'assets/images/chainLogo4.png'
import chainLogo5 from 'assets/images/chainLogo5.png'

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
    title: 'DAO Rewards',
    icon: rewardsIcon,
    des: 'DAO airdrop event list page, where you can create events and receive rewards.',
    supportChainsIcon: 'all',
    bgColor: 'linear-gradient(270.19deg, #EEFFEE 27.66%, #FBFFF9 99.85%)',
    route: routes.Activity
  },
  {
    title: 'Create DAO',
    icon: createDaoIcon,
    des: 'Add a DAO on Clique',
    supportChainsIcon: [chainLogo0, chainLogo1, chainLogo2, chainLogo3, chainLogo4, chainLogo5],
    bgColor: 'linear-gradient(270.19deg, #F5F1FF 27.66%, #FEFEFF 99.85%)',
    route: routes.CreateDao
  },
  {
    title: 'Create Token',
    icon: createTokenIcon,
    des: 'You can use this function to create special tokens.',
    supportChainsIcon: [chainLogo0, chainLogo1, chainLogo2, chainLogo3, chainLogo4, chainLogo5],
    bgColor: 'linear-gradient(270.19deg, #FFFEEC 27.66%, #FFFFF9 99.85%)',
    route: routes.CreatorToken
  },
  {
    title: 'SDK',
    icon: sdkIcon,
    des: 'provides easy access to the high level interactions to be governance with an Clique DAO.',
    supportChainsIcon: '',
    bgColor: 'linear-gradient(270deg, #EEFCFB 0%, #F9FFFF 100%)',
    link: 'https://www.npmjs.com/package/@myclique/governance-sdk'
  }
  // {
  //   title: 'Create Soulbound Token of DAO',
  //   icon: soulboundIcon,
  //   des: 'provides easy access to the high level interactions to be governance with an Clique DAO.',
  //   supportChainsIcon: 'all',
  //   bgColor: 'linear-gradient(270deg, #EEFCFB 0%, #F9FFFF 100%)',
  //   route: routes.CreateSoulbound
  // }
]

function CardItem({ title, icon, des, supportChainsIcon, bgColor, link, route }: any) {
  const history = useHistory()

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
        route ? history.push(route) : window.open(link, '_blank')
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
        <Typography fontSize={14} lineHeight={'20px'} color={'#B5B7CF'} textAlign={'left'} width={'100%'}>
          Support Chains
        </Typography>
        {supportChainsIcon === 'all' ? (
          <Typography mt={10} fontSize={14} lineHeight={'20px'} color={'#B5B7CF'} textAlign={'left'} width={'100%'}>
            All Chain
          </Typography>
        ) : supportChainsIcon === '' ? (
          <Typography mt={10} fontSize={14} lineHeight={'20px'} color={'#B5B7CF'} textAlign={'left'} width={'100%'}>
            -
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
        padding: '44px 120px',
        '& .top_banner': {
          marginLeft: 18,
          width: 'calc(100% - 18px)'
        }
      }}
    >
      <Image className="top_banner" src={banner} />
      <Grid mt={30} container>
        {cardsData.map((item, index) => (
          <Grid padding={'18px 0 0 18px'} key={index} item lg={3} md={4} sm={6} xs={12}>
            <CardItem {...item} />
          </Grid>
        ))}
      </Grid>
    </Box>
  )
}
