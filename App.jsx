import React from "react"
import Sidebar from "./components/Sidebar"
import Editor from "./components/Editor"
import Split from "react-split"
import { db, notesCollection } from './firebase';
import { addDoc, deleteDoc, doc, onSnapshot, setDoc } from 'firebase/firestore'

export default function App() {
    const [notes, setNotes] = React.useState([])
    const [currentNoteId, setCurrentNoteId] = React.useState("")
    const [tempNoteText, setTempNoteText] = React.useState("")

    const sortedArray = notes.sort((a, b) => b.updatedAt - a.updatedAt)

    const currentNote = 
        notes.find(note => note.id === currentNoteId) 
        || notes[0]

    React.useEffect(() => {
        const unsubscribe = onSnapshot(notesCollection, function(snapshot){
            const notesArray = snapshot.docs.map(doc =>({
                ...doc.data(),
                id: doc.id
            }))
            setNotes(notesArray)
        })
        return unsubscribe
    }, [])
    React.useEffect(() => {
        if(!currentNoteId){
            setCurrentNoteId(notes[0]?.id)
        }
    }, [notes])
    React.useEffect(() => {
        if(currentNote){
            setTempNoteText(currentNote.body)
        }
    }, [currentNote])

    React.useEffect(() => {
        const timeOutId = setTimeout(() => {
        if(tempNoteText !== currentNote.body){
            updateNote(tempNoteText)
        }
        }, 500)
        return () => clearTimeout(timeOutId)
    }, [tempNoteText])
    async function createNewNote() {
        const newNote = {
            createdAt: Date.now(),
            updatedAt: Date.now(),
            body: "Type your markdown note's title here"
        }
        const newNoteRef = await addDoc(notesCollection, newNote)
        setCurrentNoteId(newNoteRef.id)
    }

    async function updateNote(text) {
        const docRef = doc(db, "notes", currentNoteId)
        await setDoc(docRef, {body: text, updatedAt: Date.now()}, {merge: true})
    }
    
    async function deleteNote(noteId) {
        const docRef = doc(db, "notes", noteId)
        await deleteDoc(docRef)
    }

    return (
        <main>
            {
                notes.length > 0
                    ?
                    <Split
                        sizes={[10, 90]}
                        direction="horizontal"
                        className="split"
                    >
                        <Sidebar
                            notes={sortedArray}
                            currentNote={currentNote}
                            setCurrentNoteId={setCurrentNoteId}
                            newNote={createNewNote}
                            deleteNote={deleteNote}
                        />
                        <Editor
                            tempNoteText={tempNoteText}
                            setTempNoteText={setTempNoteText}
                        />
                    </Split>
                    :
                    <div className="no-notes">
                        <h1>You have no notes</h1>
                        <button
                            className="first-note"
                            onClick={createNewNote}
                        >
                            Create one now
                        </button>
                    </div>

            }
        </main>
    )
}
