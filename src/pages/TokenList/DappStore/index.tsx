import { Box, Typography } from '@mui/material'
import Image from 'components/Image'
import banner from 'assets/images/store_banner.png'
import nftIcon from 'assets/images/nftIcon.png'
import swapIcon from 'assets/images/swapIcon.png'
import rewardsIcon from 'assets/images/rewardsIcon.png'
import createDaoIcon from 'assets/images/createDaoIcon.png'
import createTokenIcon from 'assets/images/createTokenIcon.png'
import sdkIcon from 'assets/images/sdkIcon.png'
import { routes } from 'constants/routes'
import { useHistory } from 'react-router-dom'

const cardsData = [
  {
    title: 'Clique NFT Pass',
    icon: nftIcon,
    des: 'Clique NFT Pass is a NFT collection for Clique and STP users. Holders have the chance to participate ...',
    supportChainsIcon: '',
    bgColor: 'linear-gradient(269.62deg, #EAF7FF 0.25%, #FEFFFF 99.64%)',
    link: ''
  },
  {
    title: 'SWAP',
    icon: swapIcon,
    des: 'Flash exchange with limited time, low price and low gas fee.',
    supportChainsIcon: 'all',
    bgColor: 'linear-gradient(270.34deg, #FFF6DF 0.3%, #FFFDF9 99.74%)',
    route: ''
  },
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
    supportChainsIcon: '',
    bgColor: 'linear-gradient(270.19deg, #F5F1FF 27.66%, #FEFEFF 99.85%)',
    route: ''
  },
  {
    title: 'Create Token',
    icon: createTokenIcon,
    des: 'You can use this function to create special tokens.',
    supportChainsIcon: '',
    bgColor: 'linear-gradient(270.19deg, #FFFEEC 27.66%, #FFFFF9 99.85%)',
    route: routes.Creator
  },
  {
    title: 'SDK',
    icon: sdkIcon,
    des: 'provides easy access to the high level interactions to be governance with an Clique DAO.',
    supportChainsIcon: '',
    bgColor: 'linear-gradient(270deg, #EEFCFB 0%, #F9FFFF 100%)',
    link: 'https://www.npmjs.com/package/@myclique/governance-sdk'
  }
]

function CardItem({ title, icon, des, supportChainsIcon, bgColor, link, route }: any) {
  const history = useHistory()

  return (
    <Box
      sx={{
        width: 281,
        height: 264,
        border: '1px solid #d4d7e2',
        borderRadius: '10px',
        cursor: 'pointer',
        '&:hover': {
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
          '&:hover': {
            borderColor: '#97B7EF'
          },
          '& img': {
            width: 48
          }
        }
      }}
      onClick={() => {
        route ? history.push(route) : window.open(link, '_blank')
      }}
    >
      <Box className="headerCon">
        <Typography fontSize={14} lineHeight={'20px'} color={'#3F5170'} fontWeight={700}>
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
          'All Chain'
        ) : supportChainsIcon === '' ? (
          '-'
        ) : (
          <Box>
            {supportChainsIcon.map((item: string, index: number) => (
              <Image src={item} key={index} />
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
        padding: '44px 130px'
      }}
    >
      <Image src={banner} width={'100%'} />
      <Box
        mt={30}
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 25,
          flexDirection: 'row'
        }}
      >
        {cardsData.map((item, index) => (
          <CardItem key={index} {...item} />
        ))}
      </Box>
    </Box>
  )
}
