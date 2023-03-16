import { Box, Card, Link, Stack, styled, Typography } from '@mui/material'
import Back from 'components/Back'
import theme from 'theme'
import Input from 'components/Input'
import { BlackButton } from 'components/Button/Button'
import { useCallback, useState } from 'react'
import Pagination from 'components/Pagination'
import { useActivityList } from 'hooks/useBackedActivityServer'
import icon from 'assets/images/placeholder.png'

enum Tabs {
  ABOUT,
  TRASACTION
}

const tabs = [
  { name: 'About', value: Tabs.ABOUT },
  { name: 'Transaction', value: Tabs.TRASACTION }
]

const imgDataList = [icon, icon, icon, icon]

const transactionDataList = [
  {
    id: 0,
    title: 'Swap 1,000 STPT to 21,000 RAI',
    link: '',
    date: '2021-12-26 16:05:50'
  },
  {
    id: 1,
    title: 'Swap 1,000 STPT to 21,000 RAI',
    link: '',
    date: '2021-12-26 16:05:50'
  },
  {
    id: 2,
    title: 'Swap 1,000 STPT to 21,000 RAI',
    link: '',
    date: '2021-12-26 16:05:50'
  }
]

export default function Details() {
  const RowSentence = styled('p')(({}) => ({
    display: 'flex',
    justifyContent: 'space-between',
    flexDirection: 'row'
  }))

  const TransactionWrapper = styled(Stack)(() => ({
    display: 'flex',
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center'
  }))

  const CardWrapper = styled(Card)(({ theme }) => ({
    border: '1px solid',
    borderRadius: 10,
    padding: 10,
    borderColor: theme.bgColor.bg2,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    '& img': {
      width: 80
    },
    '& div': {
      textAlign: 'left',
      display: 'flex',
      justifyContent: 'flex-start',
      flexDirection: 'column'
    },
    '& .iconList': {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'flex-start'
    },
    '& .iconList img': {
      width: 30
    }
  }))

  const ColSentence = styled('div')(() => ({
    display: 'flex',
    justifyContent: 'flex-start',
    flexDirection: 'column',
    '& p': {
      fontSize: 16,
      color: '#000'
    },
    '& p:first-of-type': {
      fontSize: 12,
      color: '#808191'
    }
  }))

  const { page } = useActivityList()
  const handlePay = useCallback(() => {}, [])
  const handleSale = useCallback(() => {}, [])
  const [curTab, setCurTab] = useState(Tabs.ABOUT)

  return (
    <Box
      sx={{
        maxWidth: 1140,
        width: '100%',
        margin: '30px auto 20px',
        textAlign: 'left',
        padding: { xs: '0 16px', sm: undefined }
      }}
    >
      <Back />
      <Stack display={'grid'} gridTemplateColumns="4fr 2fr" gap={10}>
        <Stack className="left_content">
          <Stack
            mb={20}
            mt={20}
            display={'grid'}
            gridTemplateColumns="250px 100px 250px"
            alignItems={'center'}
            textAlign={'center'}
            justifyContent={'flex-start'}
            gap={10}
          >
            <CardWrapper>
              <img src={icon} alt="" />
              <div>
                <p>STPT</p>
                <div className="iconList">
                  {imgDataList.map((item, inx) => {
                    return <img key={inx} src={item} alt="" />
                  })}
                </div>
              </div>
            </CardWrapper>
            <p>&gt;&gt;</p>
            <CardWrapper>
              <img src={icon} alt="" />
              <div>
                <p>RAI</p>
                <div className="iconList">
                  {imgDataList.map((item, inx) => {
                    return <img key={inx} src={item} alt="" />
                  })}
                </div>
              </div>
            </CardWrapper>
          </Stack>
          <Stack display={'grid'} gridTemplateColumns="1fr 1fr">
            <ColSentence>
              <p>Original price (create at xxx)</p>
              <p>1 STPT = 10,000 RAI</p>
            </ColSentence>
            <ColSentence>
              <p>Current price</p>
              <p>1 STPT = 13,000 RAI</p>
            </ColSentence>
          </Stack>
          <Stack display={'grid'} gridTemplateColumns="1fr 1fr">
            <ColSentence>
              <p>Funding target</p>
              <p>10,000,000 RAI</p>
            </ColSentence>
            <ColSentence>
              <p>Sale progress</p>
              <p>40%</p>
            </ColSentence>
          </Stack>
          <Stack display={'grid'} gridTemplateColumns="1fr 1fr">
            <ColSentence>
              <p>Status</p>
              <p>Active</p>
            </ColSentence>
            <ColSentence>
              <p>Close at</p>
              <p>in 2 days</p>
            </ColSentence>
          </Stack>
          <Stack display={'flex'} flexDirection={'row'}>
            {tabs.map(({ value, name }) => (
              <Box
                sx={{
                  width: 'fit-content',
                  paddingBottom: 8,
                  marginRight: 180,
                  cursor: 'pointer'
                }}
                key={value}
                className={`tab-item border-tab-item ${curTab === value ? 'active' : ''}`}
                onClick={() => setCurTab(value)}
              >
                {name}
              </Box>
            ))}
          </Stack>
          {curTab === Tabs.ABOUT ? (
            <Stack spacing={10}>
              about texttext text there is a text there is a text there is a text there sis a text there is a text
              <p>there si a etxt text there is a text</p>
            </Stack>
          ) : (
            <Stack>
              {transactionDataList.map(({ id, title, date }) => {
                return (
                  <TransactionWrapper key={id}>
                    <Link>{title}</Link>
                    <p>{date}</p>
                  </TransactionWrapper>
                )
              })}
              <Box mt={20} display={'flex'} justifyContent="center">
                <Pagination
                  count={page.totalPage}
                  page={page.currentPage}
                  onChange={(_, value) => page.setCurrentPage(value)}
                />
              </Box>
            </Stack>
          )}
        </Stack>
        <Stack className="right_content">
          <Stack
            mb={50}
            sx={{
              padding: 16,
              fontSize: 12,
              border: `1px solid ${theme.bgColor.bg2}`,
              boxShadow: `inset 0px -1px 0px ${theme.bgColor.bg2}`
            }}
          >
            <RowSentence>
              <span>Sale type</span>
              <span>Purchase limit</span>
            </RowSentence>
            <RowSentence>
              <span>Price</span>
              <span>1 STPT = 13，000 RAI</span>
            </RowSentence>
            <RowSentence>
              <span>Est.discount</span>
              <span>-20%</span>
            </RowSentence>
            <Input
              readOnly
              value={'10,000'}
              errSet={() => {}}
              onChange={() => {}}
              placeholder=""
              label="Swap"
              rightLabel=""
              type="swap"
            />
            <Input
              readOnly
              value={'10,000'}
              errSet={() => {}}
              onChange={() => {}}
              placeholder=""
              label="Pay"
              rightLabel="Balance: 20,000 STPT"
              type="pay"
            />
            <RowSentence>
              <span>Claimable balance</span>
              <span>10,000 RAI</span>
            </RowSentence>
            <Typography color={theme.palette.text.secondary} fontWeight={500} lineHeight={1.5} variant="inherit">
              *You should do your own research and understand the risks before committing your funds.
            </Typography>
            <Stack
              display="grid"
              gridTemplateRows="1fr 1fr"
              alignItems={'center'}
              justifyContent={'center'}
              spacing={10}
            >
              <BlackButton width="252px" onClick={handlePay}>
                Pay
              </BlackButton>
              <BlackButton width="252px" onClick={handleSale}>
                Sale ended
              </BlackButton>
            </Stack>
          </Stack>
          <Stack
            mb={50}
            sx={{
              fontSize: 12,
              padding: 16,
              border: `1px solid ${theme.bgColor.bg2}`,
              boxShadow: `inset 0px -1px 0px ${theme.bgColor.bg2}`
            }}
          >
            <RowSentence>
              <span>Sale type</span>
              <span>One-time urchase</span>
            </RowSentence>
            <RowSentence>
              <span>Price</span>
              <span>1 STPT = 13,000 RAI</span>
            </RowSentence>
            <RowSentence>
              <span>Discount</span>
              <span>-20%</span>
            </RowSentence>
            <RowSentence>
              <span>Saled</span>
              <span>10,000 RAI</span>
            </RowSentence>
            <RowSentence>
              <span>Pay</span>
              <span>300 STPT</span>
            </RowSentence>
            <BlackButton style={{ width: '252px', margin: '0 auto' }} onClick={handlePay}>
              Pay
            </BlackButton>
            <RowSentence>
              <span>Claimable balance:</span>
              <span>10,000 RAI</span>
            </RowSentence>
          </Stack>
          <Stack
            sx={{
              fontSize: 12,
              padding: 16,
              border: `1px solid ${theme.bgColor.bg2}`,
              boxShadow: `inset 0px -1px 0px ${theme.bgColor.bg2}`
            }}
          >
            <RowSentence>
              <span>Available balance</span>
              <span>1,000 RAI</span>
            </RowSentence>
            <RowSentence>
              <span>Available funds</span>
              <span>30,000 STPT</span>
            </RowSentence>
            <Stack
              display="grid"
              gridTemplateRows="1fr 1fr"
              alignItems={'center'}
              justifyContent={'center'}
              spacing={10}
            >
              <BlackButton width="252px" onClick={handlePay}>
                Claim all
              </BlackButton>
              <BlackButton width="252px" onClick={handleSale}>
                Cancel event
              </BlackButton>
            </Stack>
          </Stack>
        </Stack>
      </Stack>
    </Box>
  )
}
