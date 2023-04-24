import AddButton from 'components/Button/Button'
import { Box, Container, Tooltip, Typography } from '@mui/material'
import { ChainId } from 'constants/chain'
import {
  ITaskItem,
  useGetTaskList,
  useRemoveTask,
  useSpacesInfo,
  useTaskProposalList,
  useUpdateTask
} from 'hooks/useBackedTaskServer'
import useModal from 'hooks/useModal'
import SidePanel from 'pages/Task/Children/SidePanel'
import DeleteIcon from '@mui/icons-material/Delete'
// import MoreVertIcon from '@mui/icons-material/MoreVert'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { DragDropContext, Droppable, Draggable, DropResult, DraggableLocation } from 'react-beautiful-dnd'
import { useParams } from 'react-router-dom'

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
  padding: grid,
  borderRadius: '8px'
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
  { title: 'No Type', color: '#97B7EF' }
]

export default function DragTaskPanel() {
  const [rand, setRand] = useState(Math.random())
  const { showModal, hideModal } = useModal()
  const type = useMemo(() => ['A_notStarted', 'B_inProgress', 'C_done', 'D_notStatus'], [])
  const { address: daoAddress, chainId: daoChainId } = useParams<{ address: string; chainId: string }>()
  const curDaoChainId = Number(daoChainId) as ChainId
  const update = useUpdateTask()
  const remove = useRemoveTask()
  const { result } = useTaskProposalList(curDaoChainId, daoAddress)
  const { result: TeamSpacesInfo } = useSpacesInfo(Number(daoChainId), daoAddress)
  const { result: taskTypeListRes } = useGetTaskList(TeamSpacesInfo?.teamSpacesId, '', '', rand)

  const showSidePanel = useCallback(
    editData => {
      showModal(
        <SidePanel
          open={true}
          onDismiss={() => {
            setRand(Math.random())
            hideModal()
          }}
          proposalBaseList={result}
          TeamSpacesInfo={TeamSpacesInfo}
          editData={editData}
        />
      )
    },
    [TeamSpacesInfo, hideModal, result, showModal]
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

  const [taskList, setTaskList] = useState<ITaskQuote[][]>([])
  useEffect(() => {
    setTaskList(taskAllTypeList)
  }, [taskAllTypeList])
  console.log(taskList, 'taskList')

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
          } else taskList[sInd][source.index].weight = taskList[dInd][0].weight / 2
        } else {
          taskList[sInd][source.index].weight =
            taskList[dInd][destination.index].weight + taskList[dInd][destination.index].weight / 2
        }
        update(
          taskList[sInd][source.index].assignAccount,
          '',
          taskList[sInd][source.index].deadline,
          taskList[sInd][source.index].priority,
          taskList[sInd][source.index].proposalId,
          taskList[sInd][source.index].reward,
          taskList[sInd][source.index].spacesId,
          type[Number(destination.droppableId)],
          taskList[sInd][source.index].taskId,
          taskList[sInd][source.index].taskName,
          taskList[sInd][source.index].weight
        )
          .then(res => console.log(res))
          .catch(err => console.log(err))
        setTaskList(newState)
      } else {
        const result = move(taskList[sInd], taskList[dInd], source, destination)
        const newState = [...taskList]
        newState[sInd] = result[sInd]
        newState[dInd] = result[dInd]

        if (destination.index === 0) {
          if (taskList[dInd].length !== 0)
            taskList[sInd][source.index].weight = taskList[dInd][destination.index].weight / 2
        } else if (destination.index === taskList[dInd].length) {
          taskList[sInd][source.index].weight =
            taskList[dInd][taskList[dInd].length - 1].weight + taskList[dInd][taskList[dInd].length - 1].weight / 2
        } else {
          taskList[sInd][source.index].weight =
            (taskList[dInd][destination.index - 1].weight + taskList[dInd][destination.index].weight) / 2
        }
        console.log(taskList[sInd][source.index].weight)

        update(
          taskList[sInd][source.index].assignAccount,
          '',
          taskList[sInd][source.index].deadline,
          taskList[sInd][source.index].priority,
          taskList[sInd][source.index].proposalId,
          taskList[sInd][source.index].reward,
          taskList[sInd][source.index].spacesId,
          type[Number(destination.droppableId)],
          taskList[sInd][source.index].taskId,
          taskList[sInd][source.index].taskName,
          taskList[sInd][source.index].weight
        )
          .then(res => console.log(res))
          .catch(err => console.log(err))
        setTaskList(newState)
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

  return (
    <Container
      sx={{
        width: 942
      }}
    >
      <Box mb={30} mt={20}>
        <AddButton width={'80px'} height={'36px'} onClick={() => showSidePanel(undefined)}>
          + New
        </AddButton>
      </Box>
      <Box display={'grid'} gridTemplateColumns={'1fr 1fr 1fr 1fr'} gap={grid}>
        <DragDropContext onDragEnd={onDragEnd}>
          {taskList.map((el, ind) => (
            <Droppable key={ind} droppableId={`${ind}`}>
              {(provided, snapshot) => (
                <div ref={provided.innerRef} style={getListStyle(snapshot.isDraggingOver)} {...provided.droppableProps}>
                  <TaskTypeBtn number={curTaskTypeList[ind].number} bgColor={curTaskTypeList[ind].color}>
                    {curTaskTypeList[ind].title}
                  </TaskTypeBtn>
                  {el.map((item, index) => (
                    <Draggable key={item.taskId} draggableId={item.taskId.toString()} index={index}>
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
                          onClick={() => showSidePanel(item)}
                          className={item.priority}
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          style={getItemStyle(snapshot.isDragging, provided.draggableProps.style)}
                        >
                          <Box
                            style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center'
                            }}
                          >
                            <Typography fontSize={14} color={'#3F5170'} textAlign={'left'}>
                              {item.taskName}
                            </Typography>
                            <Tooltip title="Delete" sx={{ cursor: 'pointer' }}>
                              {/* <MoreVertIcon /> */}
                              <DeleteIcon
                                onClick={e => {
                                  const newState = [...taskList]
                                  const del = newState[ind].splice(index, 1)
                                  remove(del[0].spacesId, [del[0].taskId])
                                  setTaskList(newState)
                                  e.stopPropagation()
                                }}
                              />
                            </Tooltip>
                          </Box>
                        </Box>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          ))}
        </DragDropContext>
      </Box>
    </Container>
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
