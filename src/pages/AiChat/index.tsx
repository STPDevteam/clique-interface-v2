import { Close } from '@mui/icons-material'
import { Box, Button, Drawer, Fab, Paper, Stack, Typography, styled } from '@mui/material'
import Input from 'components/Input'
import { useActiveWeb3React } from 'hooks'
import { useCallback, useState } from 'react'
import { useWalletModalToggle } from 'state/application/hooks'
import { useLoginSignature, useUserInfo } from 'state/userInfo/hooks'
import { useAddChatOne, useChatContextList, useChatHistoryList } from 'state/chatHistory/hooks'
import { sendAiChat } from 'utils/fetch/server'
import ReactMarkdown from 'react-markdown'

const MsgItem = styled(Paper)({
  fontSize: 12,
  padding: '2px 15px',
  maxWidth: '80%',
  overflowX: 'auto'
})

export default function AiChat() {
  const [open, setOpen] = useState(false)
  const [inputText, setInputText] = useState('')

  const toggleDrawer = useCallback(() => {
    setOpen(!open)
  }, [open])

  const { account } = useActiveWeb3React()
  const userInfo = useUserInfo()
  const toggleWalletModal = useWalletModalToggle()
  const loginSignature = useLoginSignature()
  const [waiting, setWaiting] = useState(false)
  const addChatOne = useAddChatOne()
  const chatHistoryList = useChatHistoryList()
  const chatContextList = useChatContextList()

  const sendChatMsg = useCallback(
    async (text: string) => {
      text = text.replace(/(\n)+$/, '')
      if (!text) return
      try {
        setWaiting(true)
        const res: any = await sendAiChat([text, ...chatContextList].reverse())
        const resContent = res?.data?.data?.choices?.[0].message?.content
        setWaiting(false)
        if (!resContent) return
        addChatOne(text, resContent)
        setInputText('')
      } catch (error) {
        setWaiting(false)
        console.error(error)
      }
    },
    [addChatOne, chatContextList]
  )

  return (
    <div>
      <Fab
        onClick={toggleDrawer}
        sx={{
          position: 'fixed',
          zIndex: 999999,
          right: 30,
          bottom: 30
        }}
        color="primary"
        aria-label="add"
      >
        AI
      </Fab>

      <Drawer anchor={'right'} open={open} onClose={toggleDrawer}>
        {account && userInfo?.loggedToken ? (
          <Box
            sx={{
              width: { sm: 450, xs: '100vw' },
              height: '100vh',
              display: 'grid',
              padding: '10px',
              gridTemplateRows: '40px 1fr 150px'
            }}
          >
            <Box
              sx={{
                borderBottom: '1px solid #ccc'
              }}
            >
              <Typography textAlign={'center'}>Clique GPT</Typography>
              <Close
                sx={{
                  position: 'absolute',
                  right: 20,
                  top: 15,
                  cursor: 'pointer'
                }}
                onClick={toggleDrawer}
              />
            </Box>
            <Stack
              spacing={10}
              sx={{
                borderBottom: '1px solid #ddd',
                padding: '10px 0',
                overflowY: 'auto'
                // maxHeight: theme => `calc(100vh - ${theme.height.header} - 150px)`
              }}
            >
              {chatHistoryList.map((item, index) => (
                <Box
                  key={index}
                  display={'flex'}
                  width={'100%'}
                  justifyContent={item.role === 'user' ? 'flex-end' : 'flex-start'}
                >
                  {item.role === 'user' ? (
                    <MsgItem elevation={1}>{item.content}</MsgItem>
                  ) : (
                    <MsgItem
                      sx={{
                        backgroundColor: theme => theme.palette.primary.main,
                        color: '#fff'
                      }}
                      elevation={1}
                    >
                      <ReactMarkdown>{item.content}</ReactMarkdown>
                    </MsgItem>
                  )}
                </Box>
              ))}
            </Stack>
            <Box
              sx={{
                padding: '10px 0'
              }}
            >
              <Box
                sx={{
                  position: 'relative'
                }}
              >
                <Button
                  variant="outlined"
                  sx={{
                    position: 'absolute',
                    zIndex: 1,
                    right: 10,
                    bottom: 10
                  }}
                  onClick={() => sendChatMsg(inputText)}
                  disabled={!inputText.trim() || waiting}
                >
                  {waiting ? 'waiting...' : 'Send'}
                </Button>
                <Input
                  disabled={waiting}
                  multiline
                  rows={5}
                  value={inputText}
                  onChange={e => setInputText(e.target.value)}
                />
              </Box>
            </Box>
          </Box>
        ) : (
          <Box
            sx={{
              width: { sm: 450, xs: '100vw' },
              height: '100vh',
              display: 'flex',
              padding: '10px',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Button
              variant="contained"
              onClick={() => {
                if (!account) {
                  toggleWalletModal()
                  return
                }
                loginSignature()
              }}
            >
              Login
            </Button>
          </Box>
        )}
      </Drawer>
    </div>
  )
}
