const express = require ('express');
const router = express.Router();
const Producto = require('../models/productos');
const multer = require('multer');
const { route } = require('express/lib/application');
const fs = require('fs');
const { userInfo } = require('os');

//image upload
var storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, './uploads');
    },
    filename: function(req, file, cb){
        cb(null, file.fieldname + "_" + Date.now() + "_" + file.originalname);
    },
});

var upload = multer({
    storage: storage,
}).single('image');

router.post("/add", upload, (req, res) => {
    const producto = new Producto({
        producto: req.body.producto,
        marca: req.body.marca,
        tipo: req.body.tipo,
        stock: req.body.stock,
        precio: req.body.precio,
        image: req.file.filename,
    });
    producto.save((err)=>{
        if(err){
            res.json({message: err.message, type: 'danger'});
        }else{
            req.session.message = {
                type: 'success',
                message: 'Producto Agregado Correctamente!'
            };
            res.redirect('/');
        }
    })
});

router.get("/", (req, res) => {
    Producto.find().exec((err, productos) => {
        if(err){
            res.json({ message: err.message });
        } else {
            res.render('index', {
                title: 'Inicio de Pagina',
                productos: productos,
            });
        }
    });
});


router.get("/add", (req, res) => {
    res.render('add_productos',{ title: 'Agregar Producto' });
});

router.get("/edit/:id", (req, res) => {
    let id = req.params.id;
    Producto.findById(id, (err, producto) =>{
        if(err){
            res.redirect('/')
        } else {
            if(producto == null){
                res.redirect('/');
            }else{
                res.render('edit_productos', {
                    title: 'Editar Producto',
                    producto: producto,
                })
            }
        }
    })
});

router.post('/update/:id', upload, (req,res) => {
    let id = req.params.id;
    let new_image = '';

    if(req.file){
        new_image = req.file.filename;
        try{
            fs.unlinkSync('./uploads/' + req.body.old_image); 
        } catch(err){
            console.log(err);
        }
    }else {
        new_image = req.body.old_image;
    }

    Producto.findByIdAndUpdate(id, {
        producto: req.body.producto,
        marca: req.body.marca,
        tipo: req.body.tipo,
        stock: req.body.stock,
        precio: req.body.precio,
        image: new_image,
    }, (err, result) =>{
        if(err){
            res.json({ message: err.message, type: 'danger'});
        } else {
            req.session.message = {
                type: 'success',
                message: 'Producto Actualiado Correctamente!',
            };
            res.redirect('/');
        }
    })
});

router.get('/delete/:id', (req, res) =>{
    let id = req.params.id;
    Producto.findByIdAndRemove(id, (err,result) => {
        if(result.image != ''){
            try{
                fs.unlinkSync('./uploads/'+result.image);
            } catch(err){
                console.log(err);
            }
        }
        if(err){
            res.json({ message: err.message});
        } else {
            req.session.message = {
                type: 'info',
                message: 'Producto Eliminado Correctamente!',
            };
            res.redirect('/');
        }
    })
})

module.exports = router;