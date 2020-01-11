const express = require('express');
const router = express.Router();

// Import Grade model to create new Grade
const Grade = require('../models/grade');
// Import Office model to send the Offices to the create new book page
const Office = require('../models/office');

const imageMimeTypes = ['image/jpeg', 'image/png', 'image/gif'];

// Get all Grades Route
router.get('/', async (req, res) => {
  let query = Grade.find();
  if (req.query.name != null && req.query.name != '') {
    query = query.regex('name', new RegExp(req.query.name, 'i'));
  }
  try {
    const grades = await query.exec();
    res.render('grades/index', {
      title: `جميع المراحل`,
      grades: grades,
      searchOptions: req.query
    });
  } catch{
    res.redirect('/');
  }
});

// Display Create new Authors Form Route
router.get('/new', async (req, res) => {
  renderNewPage(res, new Grade());
});



// POST - Create new Grade function Router
router.post('/', async (req, res) => {
  const grade = new Grade({
    name: req.body.name,
    office: req.body.office
  });
  try {
    const newGrade = await grade.save();
    res.redirect(`/grades/${newGrade.id}`);
  } catch (err) {
    renderNewPage(res, grade, true);
  }
});


// Route to show a grade
router.get('/:id', async (req, res) => {
  try {
    const grade = await Grade.findById(req.params.id).populate('office').exec();
    res.render('grades/show', { title: `${grade.name}`,grade: grade });
  } catch(err){
    console.log(err)
    res.redirect('/grades');
  }
})

// Route to show edit a grade
router.get('/:id/edit', async (req, res) => {
  try {
    const grade = await Grade.findById(req.params.id);
    renderEditPage(res, grade);
  } catch{
    res.redirect('/grades');
  }
})

// Update a grade route function
router.put('/:id', async (req, res) => {
  let grade;
  try {
    grade = await Grade.findById(req.params.id);
    grade.name = req.body.name;
    grade.office = req.body.office;
    await grade.save();
    res.redirect(`/grades/${grade.id}`);
  } catch (err) {
    if (grade != null) {
      renderEditPage(res, grade, true);
    } else {
      redirect('/grades');
    }
  }
});

// // Delete book Route
// router.delete('/:id', async (req, res) => {
//   let book;
//   try {
//     book = await Book.findById(req.params.id);
//     await book.remove();
//     redirect('/books');
//   } catch{
//     if (book != null) {
//       res.render('show/new', {
//         book: book,
//         errorMessage: 'Could not remove the book'
//       });
//     } else {
//       res.redirect('/books');
//     }
//   }
// })

async function renderEditPage(res, grade, hasError = false) {
  renderFormPage(res, grade, 'edit', hasError);
}
async function renderNewPage(res, grade, hasError = false) {
  renderFormPage(res, grade, 'new', hasError);
}


// function to render pages
async function renderFormPage(res, grade, form, hasError = false) {
  try {
    const offices = await Office.find({});
    let params = {
      title: 'تجربة',
      offices: offices,
      grade: grade
    }
    if (hasError) {
      if (form === 'edit') {
        params.errorMessage = 'Error Updating a grade!';
      } else {
        params.errorMessage = 'Error Creating a Grade!';
      }
    }
    res.render(`grades/${form}`, params);
  } catch {
    res.redirect('/grades');
  }
}

// function saveCover(book, coverEncoded) {
//   if (coverEncoded == null) return;
//   const cover = JSON.parse(coverEncoded);
//   if (cover != null && imageMimeTypes.includes(cover.type)) {
//     book.coverImage = new Buffer.from(cover.data, 'base64');
//     book.coverImageType = cover.type;
//   }
// }

module.exports = router;