// import AddButton from 'components/Button/Button'
import { Box, Tooltip, Typography } from '@mui/material'
import { ITaskItem, useGetTaskList, useRemoveTask, useUpdateTask } from 'hooks/useBackedTaskServer'
import useModal from 'hooks/useModal'
import { timeStampToFormat } from 'utils/dao'
import Image from 'components/Image'
// import MoreVertIcon from '@mui/icons-material/MoreVert'
import { ReactComponent as AddIcon } from 'assets/svg/newIcon.svg'
import { ReactComponent as DelIcon } from 'assets/svg/del.svg'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { DragDropContext, Droppable, Draggable, DropResult, DraggableLocation } from 'react-beautiful-dnd'
import { useParams } from 'react-router-dom'
// import PopperCard from 'components/PopperCard'
import TaskDetail from 'pages/Task/Children/TaskDetail'
import { toast } from 'react-toastify'
import { useProposalBaseList } from 'hooks/useBackedProposalServer'
import { useUpdateDaoDataCallback } from 'state/buildingGovDao/hooks'

function ContextMenu({
  children,
  isJoined,
  taskList,
  ind,
  index,
  remove,
  isShow
}: {
  children?: React.ReactNode
  isJoined: string | undefined
  ind: number
  index: number
  remove: (arg0: number, arg1: number[]) => void
  taskList: ITaskQuote[][]
  isShow: boolean
}) {
  const [hideMenu, setHideMenu] = useState(false)
  return (
    <Box sx={{ position: 'relative' }}>
      <Box>{children}</Box>
      {isShow && !hideMenu && isJoined !== 'C_member' && (
        <Box
          sx={{
            position: 'absolute',
            zIndex: 9999,
            top: 0,
            left: 150,
            width: 150,
            padding: 10,
            backgroundColor: '#fff',
            border: '1px solid #D4D7E2',
            borderRadius: '8px'
          }}
        >
          <Box
            sx={{
              height: 44,
              display: 'flex',
              gap: 8,
              alignItems: 'center',
              flexDirection: 'row',
              '&:hover': {
                cursor: 'pointer',
                backgroundColor: '#005BC60F'
              }
            }}
            onClick={() => {
              if (isJoined === 'C_member') return
              const newState = [...taskList]
              const del = newState[ind].splice(index, 1)
              remove(del[0].spacesId, [del[0].taskId])
              setHideMenu(true)
            }}
          >
            <DelIcon />
            <Typography color={'#3F5170'} fontSize={14} fontWeight={500}>
              Delete
            </Typography>
          </Box>
        </Box>
      )}
    </Box>
  )
}

const reorder = (list: ITaskQuote[], startIndex: number, endIndex: number) => {
  const result = Array.from(list)
  const [removed] = result.splice(startIndex, 1)
  result.splice(endIndex, 0, removed)
  return result
}

/**
 * Moves an item from one list to another list.
 */
const move = (
  source: ITaskQuote[],
  destination: ITaskQuote[],
  droppableSource: DraggableLocation,
  droppableDestination: DraggableLocation
) => {
  const sourceClone = Array.from(source)
  const destClone = Array.from(destination)
  const [removed] = sourceClone.splice(droppableSource.index, 1)

  destClone.splice(droppableDestination.index, 0, removed)

  const result: { [key: string]: ITaskQuote[] } = {}
  result[droppableSource.droppableId] = sourceClone
  result[droppableDestination.droppableId] = destClone

  return result
}
const grid = 10

const getItemStyle = (isDragging: boolean, draggableStyle: any) => ({
  // some basic styles to make the items look a bit nicer
  userSelect: 'none',
  padding: grid,
  margin: `0 0 ${grid}px 0`,
  minHeight: 100,
  // change background colour if dragging
  background: isDragging ? '#e8e8e8' : '#fff',
  border: '1px solid #D4D7E2',
  borderRadius: '8px',
  // styles we need to apply on draggables
  ...draggableStyle
})
const getListStyle = (isDraggingOver: boolean) => ({
  background: isDraggingOver ? '#d4d6d9' : '#F8FBFF',
  padding: '8px 13px 20px 13px',
  borderRadius: '8px',
  minHeight: 526,
  height: '100%'
})

export interface ITaskQuote {
  assignAccount: string
  assignAvatar: string
  assignNickname: string
  deadline: number
  priority: string
  proposalId: number
  reward: string
  spacesId: number
  status: string
  taskId: number
  taskName: string
  weight: number
}

const taskTypeList = [
  { title: 'Not started', color: '#80829F' },
  { title: 'In progress', color: '#2C9EF0' },
  { title: 'Done', color: '#21C331' },
  { title: 'No status', color: '#97B7EF' }
]

export default function DragTaskPanel() {
  const { spacesId: spacesId } = useParams<{ spacesId: string }>()
  const [rand, setRand] = useState(Math.random())
  const { showModal, hideModal } = useModal()
  const type = useMemo(() => ['A_notStarted', 'B_inProgress', 'C_done', 'D_notStatus'], [])
  const { daoId: curDaoId } = useParams<{ daoId: string }>()
  const daoId = Number(curDaoId)
  const update = useUpdateTask()
  const remove = useRemoveTask()
  const { myJoinDaoData: isJoined } = useUpdateDaoDataCallback()
  const { result } = useProposalBaseList(daoId)
  const { result: taskTypeListRes } = useGetTaskList(Number(spacesId), '', '', rand)

  const showSidePanel = useCallback(
    (editData, initStatus) => {
      showModal(
        <TaskDetail
          open={true}
          onDismiss={() => {
            setRand(Math.random())
            hideModal()
          }}
          initStatus={initStatus}
          proposalBaseList={result}
          daoId={daoId}
          spacesId={Number(spacesId)}
          editData={editData}
          identity={isJoined?.job || ''}
        />
      )
    },
    [daoId, hideModal, isJoined?.job, result, showModal, spacesId]
  )

  const taskAllTypeList = useMemo(() => {
    const _arr: ITaskItem[][] = []
    type.map((item, index) => {
      _arr[index] = taskTypeListRes.filter(task => {
        return task.status === item
      })
    })
    return _arr
  }, [taskTypeListRes, type])

  const [showMenuId, setShowMenuId] = useState<number>()
  const [taskList, setTaskList] = useState<ITaskQuote[][]>([])
  const [showMenu, setShowMenu] = useState(
    taskTypeListRes.map(item => ({
      [item.taskId]: false
    }))
  )

  console.log('show', showMenu)

  useEffect(() => {
    setShowMenu(
      taskTypeListRes.map(item => ({
        [item.taskId]: false
      }))
    )
  }, [taskTypeListRes])

  useEffect(() => {
    setTaskList(taskAllTypeList)
  }, [taskAllTypeList])

  const onDragEnd = useCallback(
    (result: DropResult) => {
      const { source, destination } = result

      if (!destination) {
        return
      }
      const sInd = +source.droppableId
      const dInd = +destination.droppableId

      if (sInd === dInd) {
        const items = reorder(taskList[sInd], source.index, destination.index)
        const newState = [...taskList]
        newState[sInd] = items

        if (destination.index === 0) {
          if (source.index === 0) {
          } else {
            taskList[sInd][source.index].weight = taskList[dInd][0].weight / 2
          }
        } else {
          taskList[sInd][source.index].weight =
            taskList[dInd][destination.index].weight + taskList[dInd][destination.index].weight / 2
        }
        setTaskList(newState)
        update(
          taskList[sInd][source.index].assignAccount,
          '',
          taskList[sInd][source.index].deadline,
          true,
          taskList[sInd][source.index].priority,
          taskList[sInd][source.index].proposalId,
          taskList[sInd][source.index].reward,
          taskList[sInd][source.index].spacesId,
          type[Number(destination.droppableId)],
          taskList[sInd][source.index].taskId,
          taskList[sInd][source.index].taskName,
          taskList[sInd][source.index].weight
        )
          .then((res: any) => {
            if (res.code !== 200) {
              toast.error(res.msg || 'network error')
              return
            }
            toast.success('update success')
            setRand(Math.random())
            console.log(res)
          })
          .catch(err => console.log(err))
      } else {
        const result = move(taskList[sInd], taskList[dInd], source, destination)
        const newState = [...taskList]
        newState[sInd] = result[sInd]
        newState[dInd] = result[dInd]

        if (destination.index === 0) {
          if (taskList[dInd].length !== 0) {
            taskList[sInd][source.index].weight = taskList[dInd][destination.index].weight / 2
            taskList[sInd][source.index].status = taskList[dInd][destination.index].status
          }
        } else if (destination.index === taskList[dInd].length) {
          taskList[sInd][source.index].weight =
            taskList[dInd][taskList[dInd].length - 1].weight + taskList[dInd][taskList[dInd].length - 1].weight / 2
          taskList[sInd][source.index].status = taskList[dInd][taskList[dInd].length - 1].status
        } else {
          taskList[sInd][source.index].weight =
            (taskList[dInd][destination.index - 1].weight + taskList[dInd][destination.index].weight) / 2
          taskList[sInd][source.index].status = taskList[dInd][destination.index - 1].status
        }
        setTaskList(newState)
        update(
          taskList[sInd][source.index].assignAccount,
          '',
          taskList[sInd][source.index].deadline,
          true,
          taskList[sInd][source.index].priority,
          taskList[sInd][source.index].proposalId,
          taskList[sInd][source.index].reward,
          taskList[sInd][source.index].spacesId,
          type[Number(destination.droppableId)],
          taskList[sInd][source.index].taskId,
          taskList[sInd][source.index].taskName,
          taskList[sInd][source.index].weight
        )
          .then((res: any) => {
            if (res.code !== 200) {
              toast.error(res.msg || 'network error')
              return
            }
            toast.success('update success')
            setRand(Math.random())
            console.log(res)
          })
          .catch(err => console.log(err))
      }
    },
    [taskList, type, update]
  )

  useCallback(
    (index?: number) => {
      const curIndex = index === undefined ? taskList.length - 1 : index
      if (!taskList.length) {
        setTaskList([])
        return
      }
      const newList = taskList.map((item, idx) => {
        if (idx !== curIndex) {
          return item
        }
        return [...taskList[idx]]
      })
      setTaskList(newList)
    },
    [taskList]
  )

  const curTaskTypeList = useMemo(
    () =>
      taskTypeList.map((item, idx) => ({
        ...item,
        number: taskList[idx]?.length || 0
      })),
    [taskList]
  )

  const handleContextMenu = useCallback(
    (e, el, index) => {
      e.preventDefault()
      const _arr: any = []
      taskTypeListRes.map(item => {
        _arr.push(Object.assign({}, {}, { [item.taskId]: item.taskId === el[index].taskId }))
      })
      setShowMenu(_arr)
      setShowMenuId(el[index].taskId)
    },
    [taskTypeListRes]
  )

  useEffect(() => {
    const hideMenu = () => {
      setShowMenu(
        taskTypeListRes.map(item => ({
          [item.taskId]: false
        }))
      )
      setShowMenuId(undefined)
    }
    document.addEventListener('click', hideMenu)

    return () => {
      document.removeEventListener('click', hideMenu)
    }
  }, [taskTypeListRes])

  return (
    <Box
      sx={{
        minWidth: 800,
        overflowX: 'auto',
        width: '100%'
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          right: 0,
          top: '145px'
        }}
      >
        {isJoined?.job === 'visitor' || isJoined?.job === 'noRole' ? (
          <Tooltip title="Only administrators are allowed to create tasks" arrow>
            <Box
              sx={{
                width: 84,
                height: 36,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#B5B7CF',
                gap: 8,
                cursor: 'pointer',
                '& svg circle': {
                  fill: '#B5B7CF'
                }
              }}
            >
              <AddIcon />
              <Typography fontWeight={400}>Add New</Typography>
            </Box>
          </Tooltip>
        ) : (
          <Box
            width={'84px'}
            height={'36px'}
            sx={{
              color: '#97B7EF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              cursor: 'pointer'
            }}
            onClick={() => {
              showSidePanel(undefined, undefined)
            }}
          >
            <AddIcon />
            <Typography fontWeight={400} width={'fit-content'}>
              Add New
            </Typography>
          </Box>
        )}
      </Box>
      <Box display={'grid'} gridTemplateColumns={'1fr 1fr 1fr 1fr'} gap={grid} mt={4}>
        <DragDropContext onDragEnd={onDragEnd}>
          {taskList.map((el, ind) => (
            <Droppable key={ind} droppableId={`${ind}`}>
              {(provided, snapshot) => (
                <div ref={provided.innerRef} style={getListStyle(snapshot.isDraggingOver)} {...provided.droppableProps}>
                  <TaskTypeBtn number={curTaskTypeList[ind].number} bgColor={curTaskTypeList[ind].color}>
                    {curTaskTypeList[ind].title}
                  </TaskTypeBtn>
                  {el.map((item, index) => (
                    <Box key={item.taskId} onContextMenu={e => handleContextMenu(e, el, index)}>
                      <ContextMenu
                        ind={ind}
                        index={index}
                        remove={remove}
                        isJoined={isJoined?.job}
                        taskList={taskList}
                        isShow={item.taskId === showMenuId}
                      >
                        <Draggable
                          draggableId={item.taskId.toString()}
                          index={index}
                          isDragDisabled={isJoined?.job === 'visitor' || isJoined?.job === 'noRole'}
                        >
                          {(provided, snapshot) => (
                            <Box
                              sx={{
                                '&.B_Medium': {
                                  borderTop: '5px solid #EFCC97!important'
                                },
                                '&.A_High': {
                                  borderTop: '5px solid #E46767!important'
                                },
                                '&.C_Low': {
                                  borderTop: '5px solid #CAE7ED!important'
                                }
                              }}
                              onClick={() => {
                                showSidePanel(item, undefined)
                              }}
                              onTouchEnd={() => {
                                showSidePanel(item, undefined)
                              }}
                              className={item.priority}
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              style={getItemStyle(snapshot.isDragging, provided.draggableProps.style)}
                            >
                              <Box
                                sx={{
                                  display: 'flex',
                                  justifyContent: 'space-between',
                                  alignItems: 'center',
                                  '& p': {
                                    width: 140,
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis'
                                  }
                                }}
                              >
                                <Typography fontSize={12} noWrap color={'#3F5170'} fontWeight={500} textAlign={'left'}>
                                  {item.taskName}
                                </Typography>
                                {/* {isJoined === 'C_member' ? (
                                ''
                              ) : (
                                <PopperCard
                                  width={'fit-content'}
                                  sx={{
                                    marginTop: 13
                                  }}
                                  targetElement={
                                    <Box
                                      sx={{
                                        width: 20,
                                        height: 20,
                                        cursor: 'pointer'
                                      }}
                                    >
                                      <MoreVertIcon />
                                    </Box>
                                  }
                                >
                                  <>
                                    <Box
                                      sx={{
                                        width: 150,
                                        display: 'flex',
                                        gap: 8,
                                        padding: '10px',
                                        alignItems: 'center',
                                        flexDirection: 'row',
                                        '&:hover': {
                                          cursor: 'pointer',
                                          backgroundColor: '#005BC60F'
                                        }
                                      }}
                                      onClick={e => {
                                        if (isJoined === 'C_member') return
                                        const newState = [...taskList]
                                        const del = newState[ind].splice(index, 1)
                                        remove(del[0].spacesId, [del[0].taskId])
                                        setTaskList(newState)
                                        e.stopPropagation()
                                      }}
                                    >
                                      <DelIcon />
                                      <Typography color={'#3F5170'} fontSize={14} fontWeight={500}>
                                        Delete
                                      </Typography>
                                    </Box>
                                  </>
                                </PopperCard>
                              )} */}
                              </Box>
                              <Typography fontSize={12} color={'#80829F'} textAlign={'left'}>
                                {timeStampToFormat(item.deadline)}
                              </Typography>
                              <Box
                                sx={{
                                  display: 'flex',
                                  justifyContent: 'flex-start',
                                  alignItems: 'center',
                                  gap: 10,
                                  '& img': {
                                    width: 18,
                                    height: 18,
                                    border: '1px solid #D4DCE2',
                                    borderRadius: '50%'
                                  },
                                  '& p': {
                                    width: 140,
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis'
                                  }
                                }}
                              >
                                {item.assignAvatar && <Image src={item.assignAvatar}></Image>}
                                <Typography fontSize={12} noWrap color={'#3F5170'} fontWeight={500} textAlign={'left'}>
                                  {item.assignNickname}
                                </Typography>
                              </Box>
                            </Box>
                          )}
                        </Draggable>
                      </ContextMenu>
                    </Box>
                  ))}
                  {provided.placeholder}
                  {isJoined?.job === 'visitor' || isJoined?.job === 'noRole' ? (
                    <Tooltip title="Only administrators are allowed to create tasks" arrow>
                      <Box
                        sx={{
                          width: 84,
                          height: 36,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#B5B7CF',
                          gap: 8,
                          margin: '0 auto',
                          cursor: 'pointer',
                          '& svg circle': {
                            fill: '#B5B7CF'
                          }
                        }}
                      >
                        <AddIcon />
                        <Typography fontWeight={400}>Add New</Typography>
                      </Box>
                    </Tooltip>
                  ) : (
                    <Box
                      width={'100%'}
                      height={'44px'}
                      sx={{
                        color: '#97B7EF',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 8,
                        borderRadius: '8px',
                        backgroundColor: '#F1F7FF',
                        margin: '0 auto',
                        cursor: 'pointer'
                      }}
                      onClick={() => {
                        showSidePanel(undefined, curTaskTypeList[ind].title)
                      }}
                    >
                      <AddIcon />
                      <Typography fontWeight={400} width={'fit-content'}>
                        Add New
                      </Typography>
                    </Box>
                  )}
                </div>
              )}
            </Droppable>
          ))}
        </DragDropContext>
      </Box>
    </Box>
  )
}
function TaskTypeBtn({ children, bgColor, number }: { children: string; bgColor: string; number: number }) {
  return (
    <Box
      sx={{
        background: bgColor,
        borderRadius: '40px',
        mb: 10
      }}
    >
      <Typography fontSize={12} color={'#fff'} textAlign={'center'}>
        {children} ({number || 0})
      </Typography>
    </Box>
  )
}
