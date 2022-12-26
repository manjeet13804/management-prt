const express = require("express")
const app = express()
const bodyParser = require("body-parser")
app.use(bodyParser)
const mongoose = require("mongoose")
var MongoClient = require('mongodb').MongoClient;
mongoose.connect("mongodb://localhost:27017/students")
    .then(console.log("Connected to database"))
    .catch(console.error)
const classSchema = mongoose.Schema({
    class: { type: String, required: true },
    studentsCount: Number,
    classId: Number
})
const classModel = mongoose.model("class", classSchema);
const studentsSchema = mongoose.Schema({
    name: { type: String, required: true },
    classId: { type: Number, required: true },
    studentsId: Number,
    class: { type: mongoose.Schema.Types.ObjectId, ref: "class" }
})
const studentsModel = mongoose.model("classStudents", studentsSchema)
app.get("/", (req, res) => {
    res.json({
        massage: "ok"
    })
})
app.post("/v1/myClass", (req, res) => {
    try {
        console.log(req.body)
        const totalClass = classModel.find()
        totallen = totalClass.size()
        const newClass = classModel.create({
            class: req.body.class,
            studentsCount: req.body.studentsCount,
            classId: totallen + 1
        })
        res.status(200).json({
            message: "success",
            newClass
        })
    } catch (e) {

        console.log(e.message)
        res.status(400).json({
            message: e.message

        })
    }
})
app.post("/v1/myClass/:myClassId/students", (req, res) => {
    try {
        console.log(req.body)
        const totalStudents = classModel.find({ classId: req.params.myClassId })
        totallen = totalStudents.size()
        const newStudent = studentsModel.create({
            name: req.body.name,
            classId: req.body.classId,
            studentsId: totallen + 1
        })
        res.status(200).json({
            message: "success",
            newStudent
        })
    } catch (e) {

        console.log(e.message)
        res.status(400).json({
            message: e.message

        })
    }
})
app.get("/v1/myClass", (req, res) => {
    try {
        const classes = classModel.find()
        res.status(200).json({
            message:"success",
            classes
        })
    } catch (e) {
        console.log(e.message)
        res.status(400).json({
            message: e.message
        })
    }
})
app.get("/v1/myClass/:myClassId", (req, res) => {
    try {
        const myClass = classModel.find({ classId: req.params.myClassId })
        if (!myClass) {
            return res.json({
                error: "There is no class of this Id"
            })
        }
        res.status(200).json({
            message:"success",
            myClass
        })
    } catch (e) {
        console.log(e.message)
        res.status(400).json({
            message: e.message
        })
    }
})
app.get("/v1/myClass/:myClassId/students", (req, res) => {
    try {
        const students = studentsModel.find({classId:req.params.myClassId})
        if (!students) {
            return res.json({
                error: "There is no students in this class"
            })
        }
        res.status(200).json({
            message:"success",
            students
        })
    } catch (e) {
        console.log(e.message)
        res.status(400).json({
            message: e.message
        })
    }
})
app.get("/v1/myClass/:myClassId/students/:studentId", (req, res) => {
    try {
        const student = studentsModel.find({$and:[{classId:req.params.myClassId},{studentsId:req.params.studentId}]})
        if (!student) {
            return res.json({
                error: "There is no student with the above in this class"
            })
        }
        res.status(200).json({
            message:"success",
            student
        })
    } catch (e) {
        console.log(e.message)
        res.status(400).json({
            message: e.message
        })
    }
})
app.put("/v1/myClass/:myClassId/students/:studentId", (req, res) => {
    try {
        const student = studentsModel.updateOne({$and:[{classId:req.params.myClassId},{studentsId:req.params.studentId}]},req.body)
        if (!student) {
            return res.json({
                error: "There is no student with this id in this class"
            })
        }
        res.status(200).json({
            message:"success"
        })
    } catch (e) {
        console.log(e.message)
        res.status(400).json({
            message: e.message
        })
    }
})
app.delete("/v1/myClass/:myClassId", (req, res) => {
    try {
        const classs = classModel.deleteOne({classId:req.params.myClassId})
        if (!classs) {
            return res.json({
                error: "There is no class with the above id"
            })
        }
        res.status(200).json({
            message:"suceess",
            classs
        })
    } catch (e) {
        console.log(e.message)
        res.status(400).json({
            message: e.message
        })
    }
})

app.delete("/v1/myClass/:myClassId/students/:studentsId", (req, res) => {
    try {
        const student = studentsModel.deleteOne({$and:[{classId:req.params.myClassId},{studentsId:req.params.studentId}]})
        if (!student) {
            return res.json({
                error: "There is no class with the above id"
            })
        }
        res.status(200).json({
            message:"success",
student
        })
    } catch (e) {
        console.log(e.message)
        res.status(400).json({
            message: e.message
        })
    }
})
app.listen(3000, () => console.log("server is up at 3000 port"))