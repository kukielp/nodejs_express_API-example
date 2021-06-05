const express = require('express')
const app = express()
const router = express.Router()
const port = 3000
const { v4: uuid_v4 } = require('uuid');
const LoremIpsum = require("lorem-ipsum").loremIpsum

router.use(express.json()) 
router.use(express.urlencoded({ extended: true }))

let devCop = []

// Make a sample board with 3 sample notes
router.get('/', function(req, res) {
    let board = {
        boardId : uuid_v4(),
        notes: [
            { 
                "text" : LoremIpsum(),
                "location" : uuid_v4(),
                "createdAt" : new Date(),
                "noteId" : uuid_v4(),
            },
            { 
                "text" : LoremIpsum(),
                "location" : uuid_v4(),
                "createdAt" : new Date(),
                "noteId" : uuid_v4(),
            },
            { 
                "text" : LoremIpsum(),
                "location" : uuid_v4(),
                "createdAt" : new Date(),
                "noteId" : uuid_v4(),
            },
            { 
                "text" : LoremIpsum(),
                "location" : uuid_v4(),
                "createdAt" : new Date(),
                "noteId" : uuid_v4(),
            }
        ]
    }
    devCop.push(board)
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(devCop));
})

// List all teh boards
router.get('/board', async (req, res) => {
    res.send(JSON.stringify(devCop))
})

//Create a new board
router.post('/board', async (req, res) => {
    const boardId = uuid_v4()
    let board = {
        boardId : boardId,
        notes: [
        ]
    }
    devCop.push(board)
    res.send(JSON.stringify(board))
})

// Get a board from "in memoery database"
router.get('/board/:boardId', async (req, res) => {
    let boardId = req.params.boardId
    for(board in devCop){
        if( devCop[board].board_id === boardId ){
            res.send(JSON.stringify(devCop[board]))
        }
    }

    res.status(500).send(JSON.stringify(
        { "message" : `No board with id: ${boardId} in the database` }
    ))
})

//Delete a board
router.delete('/board/:boardId', async (req, res) => {
    const boardId = req.params.boardId
    for(board in devCop){
        if( devCop[board].boardId === boardId ){
            devCop.splice(board, 1)
            res.send(JSON.stringify(devCop))
            return
        }
    }

    res.status(500).send(JSON.stringify(
        { "message" : `No board with id: ${boardId} in the database` }
    ))
})

//Add a note to a board
router.post('/board/:boardId/note', async (req, res) => {
    const boardId = req.params.boardId
    const noteText = req.body.note

    const note = { 
        "text" : noteText,
        "location" : uuid_v4(),
        "createdAt" : new Date(),
        "noteId" : uuid_v4(),
    }

    // fin the board index to add the note to
    for(board in devCop){
        if( devCop[board].boardId === boardId ){
            devCop[board].notes.push(note)
            res.send(JSON.stringify(devCop[board]))
            return
        }
    }

    res.status(500).send(JSON.stringify(
        { "message" : `No board with id: ${boardId} in the database` }
    ))
})

//Update a note on a board
router.patch('/board/:boardId/note/:noteId', async (req, res) => {
    const boardId = req.params.boardId
    const noteId = req.params.noteId
    const noteText = req.body.note
    
    for(board in devCop){
        //Find the right board
        if( devCop[board].boardId === boardId ){
            console.log(devCop[board].notes)
            for(note in devCop[board].notes){
                //Find the right note
                if( devCop[board].notes[note].noteId === noteId ){
                    devCop[board].notes[note].text = noteText
                    res.send(JSON.stringify(devCop[board]))
                    return
                } 
            }
        }
    }

    res.status(500).send(JSON.stringify(
        { "message" : `No board with id: ${boardId} or no note with id ${noteId} in the database` }
    ))
})

//Delete a note
router.delete('/board/:boardId/note/:noteId', async (req, res) => {
    const boardId = req.params.boardId
    const noteId = req.params.noteId
    
    for(board in devCop){
        //Find the right board
        if( devCop[board].boardId === boardId ){
            console.log(devCop[board].notes)
            for(note in devCop[board].notes){
                //Find the right note
                if( devCop[board].notes[note].noteId === noteId ){
                    devCop[board].notes.splice(note, 1)
                    res.send(JSON.stringify(devCop[board]))
                    return
                } 
            }
        }
    }

    res.status(500).send(JSON.stringify(
        { "message" : `No board with id: ${boardId} or no note with id ${noteId} in the database` }
    ))
})

app.use('/', router)

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})