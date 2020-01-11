const express = require('express');
const router = express.Router();

const Office = require('../models/office');
const Grade = require('../models/grade');


// Get all Offices Route
router.get('/', async (req, res) => {
  let searchOptions = {};
  if (req.query.name != null && req.query.name !== '') {
    searchOptions.name = new RegExp(req.query.name, 'i');// i means not case sensitive 
  }
  try {
    const offices = await Office.find(searchOptions);
    res.render('offices/index', {
      title : 'الرئيسية | مكاتب التعليم',
      offices: offices,
      searchOptions: req.query
    });
  } catch {
    res.redirect('/');
  }
});

// POST - Create new office function Router
router.post('/', async (req, res) => {
  const office = new Office({
    name: req.body.name
  });
  try {
    const newOffice = await office.save();
    res.redirect(`offices/${newOffice.id}`);
  } catch {
    res.render('offices/new', {
      office: office,
      errorMessage: 'خطأ اثناء انشاء مكتب جديد'
    })
  }
});

// Display Create new Authors Form Route
router.get('/new', (req, res) => {
  res.render('offices/new', { office: new Office(), title: 'انشاء مكتب تعليم جديد' });
});


// Show Office
router.get('/:id', async (req, res) => {
  try {
    const office = await Office.findById(req.params.id);
    const grades = await Grade.find({ office: office.id });
    res.render('offices/show', {
      title : `${office.name}`,
      office: office,
      grades: grades
    });

  } catch(err){
    console.log(err);
    res.redirect('/offices');
  }
});


// Edit Office
router.get('/:id/edit', async (req, res) => {
  try {
    const office = await Office.findById(req.params.id);
    res.render('offices/edit', { office: office, title: 'تعديل مكتب' });
  } catch{
    res.redirect('/offices');
  }
});

// Update Office
router.put('/:id', async (req, res) => {
  let office;
  try {
    office = await Office.findById(req.params.id);
    office.name = req.body.name;
    await office.save();
    res.redirect(`/offices/${office.id}`);
  } catch {
    if (office == null) {
      res.redirect('/offices');
    } else {
      res.render('offices/edit', {
        title: `${office.name}`,
        office: office,
        errorMessage: 'خطأ اثناء تحديث بيانات المكتب'
      })
    }
  }
});

// Delete Office
router.delete('/:id', async (req, res) => {
  let office;
  try {
    office = await Office.findById(req.params.id);
    await office.remove();
    res.redirect('/offices');
  } catch {
    if (office == null) {
      res.redirect('/offices');
    } else {
      res.redirect(`/offices/${office.id}`);
    }
  }
});


module.exports = router;