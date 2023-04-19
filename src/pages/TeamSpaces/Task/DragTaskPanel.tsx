import { Box, Button, Container, Typography } from '@mui/material'
import { useCallback, useMemo, useState } from 'react'
import { DragDropContext, Droppable, Draggable, DropResult, DraggableLocation } from 'react-beautiful-dnd'

// fake data generator
const getItems = (count: number, offset = 0) =>
  Array.from({ length: count }, (v, k) => k).map(k => ({
    id: `item-${k + offset}-${new Date().getTime()}`,
    content: `item ${k + offset}`
  }))

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

interface ITaskQuote {
  id: string
  content: string
}

const taskTypeList = [
  { title: 'Not started', color: '#80829F' },
  { title: 'In progress', color: '#2C9EF0' },
  { title: 'Done', color: '#21C331' },
  { title: 'No Type', color: '#97B7EF' }
]

export default function DragTaskPanel() {
  const [taskList, setTaskList] = useState<ITaskQuote[][]>([
    getItems(10),
    getItems(5, 10),
    getItems(5, 15),
    getItems(5, 20)
  ])

  const onDragEnd = useCallback(
    (result: DropResult) => {
      const { source, destination } = result

      // dropped outside the list
      if (!destination) {
        return
      }
      const sInd = +source.droppableId
      const dInd = +destination.droppableId

      if (sInd === dInd) {
        const items = reorder(taskList[sInd], source.index, destination.index)
        const newState = [...taskList]
        newState[sInd] = items
        setTaskList(newState)
      } else {
        const result = move(taskList[sInd], taskList[dInd], source, destination)
        const newState = [...taskList]
        newState[sInd] = result[sInd]
        newState[dInd] = result[dInd]
        setTaskList(newState)
      }
    },
    [taskList]
  )

  const addNewItem = useCallback(
    (index?: number) => {
      const curIndex = index === undefined ? taskList.length - 1 : index
      if (!taskList.length) {
        setTaskList([getItems(1)])
        return
      }
      const newList = taskList.map((item, idx) => {
        if (idx !== curIndex) {
          return item
        }
        return [...taskList[idx], getItems(1)[0]]
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
        <Button variant="outlined" onClick={() => addNewItem(2)}>
          Add new
        </Button>
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
                    <Draggable key={item.id} draggableId={item.id} index={index}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          style={getItemStyle(snapshot.isDragging, provided.draggableProps.style)}
                        >
                          <div
                            style={{
                              display: 'flex',
                              justifyContent: 'space-around'
                            }}
                          >
                            {item.content}
                            <button
                              type="button"
                              onClick={() => {
                                const newState = [...taskList]
                                newState[ind].splice(index, 1)
                                setTaskList(newState)
                              }}
                            >
                              delete
                            </button>
                          </div>
                        </div>
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
