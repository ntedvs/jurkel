import { useMutation, useQuery } from "convex/react"
import { useEffect, useState, type SubmitEvent } from "react"
import { api } from "../convex/_generated/api"
import type { Doc } from "../convex/_generated/dataModel"

function Person({ person: { _id, name, x, y } }: { person: Doc<"people"> }) {
  const [position, setPosition] = useState({ x, y })
  const [start, setStart] = useState({ x: 0, y: 0 })
  const [dragging, setDragging] = useState(false)

  const movePerson = useMutation(api.person.movePerson)

  useEffect(() => {
    if (!dragging) {
      setPosition({ x, y })
    }
  }, [x, y])

  const down = (e: React.MouseEvent) => {
    setDragging(true)

    setStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    })
  }

  useEffect(() => {
    if (!dragging) return

    const move = (e: MouseEvent) => {
      setPosition({
        x: e.clientX - start.x,
        y: e.clientY - start.y,
      })
    }

    const up = () => {
      setDragging(false)
      movePerson({ id: _id, ...position })
    }

    window.addEventListener("mousemove", move)
    window.addEventListener("mouseup", up)

    return () => {
      window.removeEventListener("mousemove", move)
      window.removeEventListener("mouseup", up)
    }
  }, [dragging, start, position, _id, movePerson])

  return (
    <div
      onMouseDown={down}
      className={`absolute select-none ${dragging ? "cursor-grabbing" : "cursor-grab"}`}
      style={{ left: position.x, top: position.y }}
      key={name}
    >
      <p>{name}</p>
    </div>
  )
}

function App() {
  const people = useQuery(api.person.getPeople)
  const createPerson = useMutation(api.person.createPerson)

  console.log(people)

  const submit = async (e: SubmitEvent) => {
    e.preventDefault()

    const fd = new FormData(e.target)
    const name = fd.get("name") as string

    await createPerson({ name })
  }

  return (
    <div className="bg-background text-foreground">
      <h1>App</h1>

      <form onSubmit={submit}>
        <label htmlFor="name">Name</label>
        <input id="name" name="name" />

        <button>Submit</button>
      </form>

      <div className="flex items-center justify-center">
        <p>Darryl Wormley</p>

        <div className="flex flex-col items-center">
          <p>Jeff Buckley</p>

          <div className="mx-auto h-80 w-200 border-2">
            {people?.map((person) => {
              return <Person person={person} />
            })}
          </div>

          <p>Jeffrey Epstein</p>
        </div>

        <p>Steve Urkel</p>
      </div>
    </div>
  )
}

export default App
